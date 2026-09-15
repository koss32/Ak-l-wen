import test from 'node:test';
import assert from 'node:assert/strict';
import {setTimeout as delay} from 'node:timers/promises';
import {createStaffMembershipVerifier} from '../server/telegram-staff.js';

const token='123456:synthetic_unit_token';
const chatId='-10099';
const userId=55;
const code='BOT_STAFF_MEMBERSHIP_UNAVAILABLE';
const member=(status='member',extra={})=>({status,user:{id:userId,is_bot:false},...extra});
const response=(result=member())=>({status:200,json:async()=>({ok:true,result})});
const verifierFor=result=>createStaffMembershipVerifier({token,fetchImpl:async()=>response(result)});
const assertUnavailable=promise=>assert.rejects(promise,error=>{
 assert.equal(error.message,code);
 assert.equal(error.cause,undefined);
 assert.deepEqual(Object.keys(error),[]);
 assert.ok(!String(error.stack).includes(token));
 assert.ok(!String(error.stack).includes('api.telegram.org'));
 return true;
});

test('current human creators, administrators and ordinary members can process bookings',async()=>{
 for(const status of ['creator','administrator','member']){
  assert.equal(await verifierFor(member(status))(chatId,userId),true);
 }
});

test('restricted members require an explicit current membership flag',async()=>{
 assert.equal(await verifierFor(member('restricted',{is_member:true}))(chatId,userId),true);
 for(const is_member of [false,undefined,null,0,1,'true',{},[]]){
  assert.equal(await verifierFor(member('restricted',{is_member}))(chatId,userId),false);
 }
});

test('departed, kicked and non-human users are denied regardless of membership flags',async()=>{
 for(const status of ['left','kicked']){
  assert.equal(await verifierFor(member(status,{is_member:true}))(chatId,userId),false);
 }
 for(const status of ['creator','administrator','member','restricted']){
  assert.equal(await verifierFor(member(status,{is_member:true,user:{id:userId,is_bot:true}}))(chatId,userId),false);
 }
});

test('the returned identity must match the requested user',async()=>{
 assert.equal(await verifierFor(member('member',{user:{id:56,is_bot:false}}))(chatId,userId),false);
 assert.equal(await verifierFor(member('member',{user:{id:userId}}))(chatId,userId),true);
});

test('each staff action checks fresh membership without caching',async()=>{
 let calls=0;
 const verify=createStaffMembershipVerifier({token,fetchImpl:async()=>response(member(++calls===1?'member':'left'))});
 assert.equal(await verify(chatId,userId),true);
 assert.equal(await verify(chatId,userId),false);
 assert.equal(calls,2);
});

test('requests use the official POST endpoint, bounded signal and prohibited redirects',async()=>{
 const calls=[];
 const verify=createStaffMembershipVerifier({token,fetchImpl:async(url,options)=>{
  calls.push({url,options});
  return response(member('member',{user:{id:JSON.parse(options.body).user_id,is_bot:false}}));
 }});
 for(const [chat,user] of [[chatId,userId],[-10099,'55'],[-1,1],['-9007199254740991','9007199254740991']]){
  assert.equal(await verify(chat,user),true);
  const {url,options}=calls.at(-1);
  assert.equal(url,`https://api.telegram.org/bot${token}/getChatMember`);
  assert.equal(new URL(url).origin,'https://api.telegram.org');
  assert.equal(options.method,'POST');
  assert.equal(options.redirect,'error');
  assert.deepEqual(options.headers,{'Content-Type':'application/json'});
  assert.deepEqual(JSON.parse(options.body),{chat_id:Number(chat),user_id:Number(user)});
  assert.ok(options.signal instanceof AbortSignal);
  assert.equal(options.signal.aborted,false);
 }
 assert.notEqual(calls[0].options.signal,calls[1].options.signal);
});

test('invalid or noncanonical IDs are denied before any network access',async()=>{
 let calls=0;
 const verify=createStaffMembershipVerifier({token,fetchImpl:async()=>{calls++;return response();}});
 const invalid=[undefined,null,true,false,{},[],1n,NaN,Infinity,-Infinity,0,-0,0.5,'',' ','1.0','1e3','0x37','055','+55',' 55','55\n','9007199254740992',Number.MAX_SAFE_INTEGER+1];
 for(const id of [...invalid,1,55,'55','@trainers','https://t.me/+synthetic','-0','-01','-1.0','-1e3',' -10099','-10099\n','-9007199254740992',-Number.MAX_SAFE_INTEGER-1]){
  assert.equal(await verify(id,userId),false);
 }
 for(const id of [...invalid,-1,'-55'])assert.equal(await verify(chatId,id),false);
 assert.equal(calls,0);
});

test('malformed member results and unknown statuses produce a symbolic retryable failure',async()=>{
 const malformed=[undefined,null,[],{},true,'member',
  {...member(),status:undefined},member(null),member('owner'),member('MEMBER'),member(1),member({}),
  {status:'member'},member('member',{user:null}),member('member',{user:[]}),
  member('member',{user:{}}),member('member',{user:{id:'55'}}),
  member('member',{user:{id:0}}),member('member',{user:{id:-55}}),
  member('member',{user:{id:55.5}}),member('member',{user:{id:Number.MAX_SAFE_INTEGER+1}}),
  member('member',{user:{id:userId,is_bot:'false'}})
 ];
 for(const result of malformed){
  const verify=createStaffMembershipVerifier({token,fetchImpl:async()=>({status:200,json:async()=>({ok:true,result})})});
  await assertUnavailable(verify(chatId,userId));
 }
});

test('HTTP failures, unexpected success codes and redirected responses fail closed',async()=>{
 for(const status of [undefined,0,201,204,301,302,307,400,401,403,429,500,'200']){
  let parsed=false;
  const verify=createStaffMembershipVerifier({token,fetchImpl:async()=>({status,json:async()=>{parsed=true;return {ok:true,result:member()};}})});
  await assertUnavailable(verify(chatId,userId));
  assert.equal(parsed,false);
 }
 const verify=createStaffMembershipVerifier({token,fetchImpl:async()=>({...response(),redirected:true})});
 await assertUnavailable(verify(chatId,userId));
});

test('malformed bodies and Telegram API failures do not expose response details',async()=>{
 for(const body of [undefined,null,[],{},true,'ok',{ok:'true',result:member()},{ok:false,error_code:403,description:`secret ${token}`}]){
  const verify=createStaffMembershipVerifier({token,fetchImpl:async()=>({status:200,json:async()=>body})});
  await assertUnavailable(verify(chatId,userId));
 }
 for(const result of [undefined,null,{status:200},{status:200,json:async()=>{throw new Error(`invalid JSON ${token}`);}}]){
  const verify=createStaffMembershipVerifier({token,fetchImpl:async()=>result});
  await assertUnavailable(verify(chatId,userId));
 }
});

test('transport exceptions redact the token, request URL and original cause',async()=>{
 const verify=createStaffMembershipVerifier({token,fetchImpl:async url=>{
  throw new Error(`fetch failed ${url}`,{cause:new Error(`private body ${token}`)});
 }});
 await assertUnavailable(verify(chatId,userId));
});

test('a bounded abort signal cancels slow membership lookups with a symbolic error',async()=>{
 let signal;
 const verify=createStaffMembershipVerifier({token,timeoutMs:5,fetchImpl:async(_url,options)=>{
  signal=options.signal;
  await delay(1000,null,{signal});
  return response();
 }});
 await assertUnavailable(verify(chatId,userId));
 assert.equal(signal.aborted,true);
 assert.equal(signal.reason.name,'TimeoutError');
});

test('invalid transport configuration fails closed without network access or leaked values',async()=>{
 let calls=0;
 const fetchImpl=async()=>{calls++;return response();};
 for(const timeoutMs of [0,-1,1.5,NaN,Infinity,'2000',10001,2**32]){
  await assertUnavailable(createStaffMembershipVerifier({token,fetchImpl,timeoutMs})(chatId,userId));
 }
 for(const invalidToken of [undefined,null,{},'',` ${token}`,`${token}\n`,`${token}/redirect`,`${token}?body=private`,`${token}#fragment`,'x'.repeat(257)]){
  await assertUnavailable(createStaffMembershipVerifier({token:invalidToken,fetchImpl})(chatId,userId));
 }
 await assertUnavailable(createStaffMembershipVerifier({token,fetchImpl:null})(chatId,userId));
 assert.equal(calls,0);
});
