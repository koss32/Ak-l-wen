import test from 'node:test';
import assert from 'node:assert/strict';
import {createMemoryBotStore} from '../server/bot-store.js';
import {createTelegramBot} from '../server/telegram-bot.js';
import {createBotRuntime} from '../server/bot-runtime.js';
import {assessBotConfig} from '../server/bot-config.js';
import {legal} from '../src/data.js';

const GROUP='-10099';
const requestConfig={deliveryReady:true,sourceLegalStatus:'published',privacyUrl:'https://example.test/privacy',privacyStatus:'published',consentVersion:legal.consentVersion,staffUserIds:[],staffChatId:GROUP,staffAuthMode:'group_members'};
const allowlistConfig={...requestConfig,staffAuthMode:undefined};
// Deterministic Telegram-update fixtures: update_id is independent from chat/user identity.
const message=(id,text,chat=GROUP,user=987,type='group',isBot=false)=>({update_id:id,message:{chat:{id:chat,type},from:{id:user,is_bot:isBot},text}});
const callback=(id,data,chat=GROUP,user=987,type='group')=>({update_id:id,callback_query:{id:`q${id}`,from:{id:user},data,message:{chat:{id:chat,type}}}});
const sent=state=>Object.values(state.outbox).filter(item=>item.method==='sendMessage');
const staffCards=state=>sent(state).filter(item=>item.kind==='staff-card');
const clientMessages=(state,recipient='10')=>sent(state).filter(item=>item.recipient===recipient);
async function action(store,type){
 const entry=Object.entries((await store.inspect()).actions).filter(([,value])=>value.type===type).at(-1);
 assert.ok(entry,`missing ${type} action`);
 return `a:${entry[0]}`;
}
async function seed(store,id='request-1'){
 await store.transactUpdate(`seed-${id}`,tx=>tx.createRequest({id,clientChatId:'10',clientUserId:'10',locale:'de',status:'pending',programId:'boxen',groupId:'box-15',scheduleId:'box-week',personType:'adult',contactName:'Adult Name',participantName:'Adult Name',age:25,guardianRole:'',comment:'',consentVersion:legal.consentVersion,consentedAt:tx.now,reminders:{enabled:false},appointment:null}));
}
const botWith=(store,verifyStaffMembership,config=requestConfig)=>createTelegramBot({store,config,verifyStaffMembership});
function runtimeEnv(){return {BOT_ENABLED:'true',BOT_WEBHOOK_ENABLED:'true',BOT_WORKER_ENABLED:'true',PUBLIC_ORIGIN:'https://example.test',TELEGRAM_WEBHOOK_SECRET:'h'.repeat(32),TELEGRAM_WORKER_SECRET:'w'.repeat(32),TELEGRAM_BOT_TOKEN:'runtime-test-token',TELEGRAM_STAFF_AUTH_MODE:'group_members',TELEGRAM_STAFF_CHAT_ID:GROUP,TELEGRAM_SEND_TIMEOUT_MS:'250',PRIVACY_PUBLICATION_STATUS:'published',PRIVACY_CONSENT_VERSION:legal.consentVersion,PRIVACY_URL:'https://example.test/telegram-privacy/'};}

 test('a previously unseen verified human can act only with explicit group-members mode',async()=>{
 const store=createMemoryBotStore();await seed(store);let lookups=0;
 const bot=botWith(store,async()=>{lookups++;return true;});
 await bot.handle(message(1,'/staff request-1',GROUP,987));
 assert.equal(staffCards(await store.inspect()).length,1);
 const cancelEntry=Object.entries((await store.inspect()).actions).find(([,value])=>value.type==='staff-cancel');
 assert.ok(cancelEntry);
 await bot.handle(callback(2,`a:${cancelEntry[0]}`));
 assert.equal((await store.getRequest('request-1')).status,'cancelled');
 assert.equal(lookups,2);
 const deniedStore=createMemoryBotStore();await seed(deniedStore,'default-denied');
 await botWith(deniedStore,async()=>true,allowlistConfig).handle(message(1,'/staff default-denied',GROUP,987));
 assert.equal(staffCards(await deniedStore.inspect()).length,0);
});

test('group-members mode denies nonmembers and verifier failures',async()=>{
 for(const verifier of [async()=>false,async()=>{throw new Error('transport');}]){
  const store=createMemoryBotStore();await seed(store);
  await botWith(store,verifier).handle(message(1,'/staff request-1'));
  assert.equal(staffCards(await store.inspect()).length,0);
 }
});

test('wrong group, private, channel, and bot contexts are denied without lookup',async()=>{
 const store=createMemoryBotStore();await seed(store);const calls=[];
 const bot=botWith(store,async()=>{calls.push(1);return true;});
 await bot.handle(message(1,'/staff request-1','-10088',987,'group'));
 await bot.handle(message(2,'/staff request-1','987',987,'private'));
 await bot.handle(message(3,'/staff request-1',GROUP,987,'channel'));
 await bot.handle(message(4,'/staff request-1',GROUP,987,'group',true));
 assert.equal(calls.length,0);assert.equal(staffCards(await store.inspect()).length,0);
});

test('group mode requires a valid negative group and membership integration',async()=>{
 const env={...runtimeEnv(),TELEGRAM_STAFF_CHAT_ID:'55'};
 const checked=assessBotConfig(env,{requireEnabled:true,requireRedis:false});
 assert.equal(checked.ok,false);assert.ok(checked.errors.includes('BOT_STAFF_GROUP_ID_INVALID'));
 const invalidBot=createTelegramBot({store:createMemoryBotStore(),config:{...requestConfig,staffChatId:'55'},verifyStaffMembership:async()=>true});
 assert.equal(invalidBot.infoOnly,true);
 const noMode=assessBotConfig({...runtimeEnv(),TELEGRAM_STAFF_AUTH_MODE:undefined,TELEGRAM_STAFF_USER_IDS:''},{requireEnabled:true,requireRedis:false});
 assert.equal(noMode.ok,true);assert.equal(noMode.bookingReady,false);
 const store=createMemoryBotStore();await seed(store,'no-verifier');
 await createTelegramBot({store,config:requestConfig}).handle(message(1,'/staff no-verifier'));
 assert.equal(staffCards(await store.inspect()).length,0);
});

test('unknown staff auth mode is a configuration error',async()=>{
 const checked=assessBotConfig({...runtimeEnv(),TELEGRAM_STAFF_AUTH_MODE:'everyone'},{requireEnabled:true,requireRedis:false});
 assert.equal(checked.ok,false);assert.ok(checked.errors.includes('BOT_STAFF_AUTH_MODE_INVALID'));
});

test('group-members mode rechecks a newly joined staff member through confirm, reschedule, reply, and cancel',async()=>{
 const store=createMemoryBotStore({clock:()=>Date.parse('2026-09-01T10:00:00Z')});
 await seed(store,'membership-lifecycle');
 let lookups=0;
 const bot=botWith(store,async()=>{lookups++;return true;});

 await bot.handle(message(1,'/staff membership-lifecycle'));
 await bot.handle(callback(2,await action(store,'staff-date')));
 await bot.handle(message(3,'2026-09-03T18:30:00+02:00'));
 await bot.handle(callback(4,await action(store,'staff-date-commit')));
 assert.equal((await store.getRequest('membership-lifecycle')).status,'confirmed');

 await bot.handle(message(5,'/staff membership-lifecycle'));
 await bot.handle(callback(6,await action(store,'staff-date')));
 await bot.handle(message(7,'2026-09-04T18:30:00+02:00'));
 await bot.handle(callback(8,await action(store,'staff-date-commit')));
 assert.equal((await store.getRequest('membership-lifecycle')).appointment,Date.parse('2026-09-04T16:30:00Z'));

 await bot.handle(message(9,'/staff membership-lifecycle'));
 await bot.handle(callback(10,await action(store,'staff-reply')));
 await bot.handle(message(11,'Deterministic staff reply'));
 await bot.handle(callback(12,await action(store,'staff-reply-commit')));
 assert.ok(clientMessages(await store.inspect()).some(item=>item.text.includes('Deterministic staff reply')));

 await bot.handle(message(13,'/staff membership-lifecycle'));
 await bot.handle(callback(14,await action(store,'staff-cancel')));
 assert.equal((await store.getRequest('membership-lifecycle')).status,'cancelled');
 assert.equal(lookups,14,'membership is checked afresh for every group staff update');
});

test('a member removed after opening a staff card is denied on the next group-members action',async()=>{
 const store=createMemoryBotStore();
 await seed(store,'removed-member');
 let lookups=0;
 const bot=botWith(store,async()=>++lookups===1);
 await bot.handle(message(1,'/staff removed-member'));
 const date=await action(store,'staff-date');
 await bot.handle(callback(2,date));
 const state=await store.inspect();
 assert.equal(lookups,2);
 assert.equal((await store.getRequest('removed-member')).status,'pending');
 assert.equal(state.sessions['staff:-10099:987'],undefined);
 assert.ok(Object.values(state.actions).some(value=>value.type==='staff-date'));
 assert.equal(state.outbox[Object.keys(state.outbox).at(-1)].method,'answerCallbackQuery');
});

test('group-members runtime fails closed for deterministic timeout, malformed, and network membership responses',async()=>{
 const responses={
  timeout:async()=>{throw new Error('synthetic timeout');},
  malformed:async()=>({status:200,json:async()=>({ok:true,result:{status:'member'}})}),
  network:async()=>{throw new Error('synthetic network failure');}
 };
 for(const [kind,fetchImpl] of Object.entries(responses)){
  const store=createMemoryBotStore();
  await seed(store,kind);
  const runtime=createBotRuntime(runtimeEnv(),{store,fetchImpl});
  await runtime.bot.handle(message(1,`/staff ${kind}`));
  assert.equal(staffCards(await store.inspect()).length,0,kind);
 }
});

test('a duplicate group-members callback cannot duplicate its mutation or messages',async()=>{
 const store=createMemoryBotStore();
 await seed(store,'duplicate-group-members');
 let callbackAction;
 await store.transactUpdate('seed-duplicate-action',tx=>{
  const request=tx.getRequest('duplicate-group-members');
  callbackAction=tx.addAction({scope:'staff',type:'staff-cancel',requestId:request.id,appointmentRevision:request.appointmentRevision});
 });
 let lookups=0;
 const bot=botWith(store,async()=>{lookups++;return true;});
 const update=callback(1,callbackAction);
 await bot.handle(update);
 const afterFirst=await store.inspect();
 assert.equal((await store.getRequest('duplicate-group-members')).status,'cancelled');
 await bot.handle(update);
 assert.deepEqual(await store.inspect(),afterFirst);
 assert.equal(lookups,2,'dedupe happens after each fresh membership preflight');
});

test('real runtime propagates group-members mode and uses fresh membership transport',async()=>{
 const store=createMemoryBotStore(),calls=[];await seed(store,'runtime-request');
 const runtime=createBotRuntime(runtimeEnv(),{store,fetchImpl:async(url,options)=>{
  calls.push({url,body:JSON.parse(options.body)});
  return {status:200,json:async()=>({ok:true,result:{status:'member',user:{id:987,is_bot:false}}})};
 }});
 await runtime.bot.handle(message(1,'/staff runtime-request'));
 assert.equal(calls.length,1);assert.equal(calls[0].url,'https://api.telegram.org/botruntime-test-token/getChatMember');
 assert.equal(staffCards(await store.inspect()).length,1);
});
