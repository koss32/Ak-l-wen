import test from 'node:test';
import assert from 'node:assert/strict';
import {createMemoryBotStore} from '../server/bot-store.js';
import {createTelegramBot} from '../server/telegram-bot.js';
import {createBotRuntime} from '../server/bot-runtime.js';
import {legal} from '../src/data.js';

const groupChatId='-10099';
const config={deliveryReady:true,sourceLegalStatus:'published',privacyUrl:'https://example.test/privacy',privacyStatus:'published',consentVersion:legal.consentVersion,staffUserIds:['55','56'],staffChatId:groupChatId};
// Deterministic Telegram-update fixtures: update_id is independent from chat identity.
const message=(id,text,chat=groupChatId,user=55,type='group')=>({update_id:id,message:{chat:{id:chat,type},from:{id:user},text}});
const callback=(id,data,chat=groupChatId,user=55,type='group')=>({update_id:id,callback_query:{id:`q${id}`,from:{id:user},data,message:{chat:{id:chat,type}}}});
const sent=state=>Object.values(state.outbox).filter(item=>item.method==='sendMessage');
const answers=state=>Object.values(state.outbox).filter(item=>item.method==='answerCallbackQuery');
const staffCards=state=>sent(state).filter(item=>item.kind==='staff-card');
async function seed(store,id='request-1'){
 await store.transactUpdate(`seed-${id}`,tx=>tx.createRequest({id,clientChatId:'10',clientUserId:'10',locale:'ru',status:'pending',programId:'boxen',groupId:'box-15',scheduleId:'box-week',personType:'adult',contactName:'Adult Name',participantName:'Adult Name',age:25,guardianRole:'',comment:'',consentVersion:legal.consentVersion,consentedAt:tx.now,reminders:{enabled:false},appointment:null}));
 return id;
}
async function action(store,type){
 const entry=Object.entries((await store.inspect()).actions).filter(([,value])=>value.type===type).at(-1);
 assert.ok(entry,`missing ${type} action`);
 return `a:${entry[0]}`;
}
const botWith=(store,verifyStaffMembership)=>createTelegramBot({store,config,verifyStaffMembership});

 test('allowlisted member is allowed only after the designated negative group is verified',async()=>{
 const store=createMemoryBotStore(),calls=[];
 await seed(store);
 const bot=botWith(store,async(chat,user)=>{calls.push([chat,user]);return true;});
 await bot.handle(message(1,'/staff request-1'));
 assert.deepEqual(calls,[[groupChatId,55]]);
 assert.equal(staffCards(await store.inspect()).length,1);
});

test('missing verifier and a false departed/nonmember result both fail closed',async()=>{
 const missingStore=createMemoryBotStore();
 await seed(missingStore,'missing');
 await createTelegramBot({store:missingStore,config}).handle(message(1,'/staff missing'));
 assert.equal(staffCards(await missingStore.inspect()).length,0);
 const leftStore=createMemoryBotStore(),calls=[];
 await seed(leftStore,'left');
 await botWith(leftStore,async()=>{calls.push(1);return false;}).handle(message(2,'/staff left'));
 assert.equal(calls.length,1);
 assert.equal(staffCards(await leftStore.inspect()).length,0);
});

test('an unallowlisted current-group member is denied without a membership lookup',async()=>{
 const store=createMemoryBotStore(),calls=[];
 await seed(store);
 await botWith(store,async()=>{calls.push(1);return true;}).handle(message(1,'/staff request-1',groupChatId,777));
 assert.equal(calls.length,0);
 assert.equal(staffCards(await store.inspect()).length,0);
});

test('wrong group, private, and channel contexts are denied without lookup',async()=>{
 const store=createMemoryBotStore(),calls=[];
 await seed(store);
 const bot=botWith(store,async()=>{calls.push(1);return true;});
 await bot.handle(message(1,'/staff request-1','-10088',55,'group'));
 await bot.handle(message(2,'/staff request-1','55',55,'private'));
 await bot.handle(message(3,'/staff request-1',groupChatId,55,'channel'));
 assert.equal(calls.length,0);
 assert.equal(staffCards(await store.inspect()).length,0);
 assert.equal(Object.keys((await store.inspect()).requests).length,1);
});

test('verifier exceptions and timeout-like rejections fail closed',async()=>{
 for(const [id,verifier] of [['throws',async()=>{throw new Error('transport failure');}],['timeout',async()=>{throw new Error('timeout');}]]){
  const store=createMemoryBotStore();
  await seed(store,id);
  await botWith(store,verifier).handle(message(Number(id==='throws'?1:2),`/staff ${id}`));
  assert.equal(staffCards(await store.inspect()).length,0,id);
 }
});

test('truthy nonboolean verifier results do not grant staff access',async()=>{
 const store=createMemoryBotStore();
 await seed(store);
 await botWith(store,async()=>({ok:true})).handle(message(1,'/staff request-1'));
 assert.equal(staffCards(await store.inspect()).length,0);
});

test('membership is rechecked for training-choice callback, reply text, and training commit',async()=>{
 // Revoke at the callback stage: the initial card is allowed, but its action remains.
 {
  const store=createMemoryBotStore();await seed(store,'callback-revoked');let n=0;
  const bot=botWith(store,async()=>[true,false][n++]??false);
  await bot.handle(message(1,'/staff callback-revoked'));
  const training=await action(store,'staff-training');
  await bot.handle(callback(2,training));
  const state=await store.inspect();
  assert.equal(Object.keys(state.sessions).length,0);
  assert.ok(Object.values(state.actions).some(value=>value.type==='staff-training'));
  assert.equal(answers(state).length,1);
 }
 // Revoke at free reply text: the reply action is consumed, but no preview/commit is created.
 {
  const store=createMemoryBotStore();await seed(store,'text-revoked');let n=0;
  const bot=botWith(store,async()=>[true,true,false][n++]??false);
  await bot.handle(message(1,'/staff text-revoked'));
  await bot.handle(callback(2,await action(store,'staff-reply')));
  await bot.handle(message(3,'Personal reply'));
  const state=await store.inspect();
  assert.equal(state.sessions['staff:-10099:55']?.value.stage,'staff-reply');
  assert.equal(Object.values(state.actions).some(value=>value.type==='staff-reply-commit'),false);
  assert.equal((await store.getRequest('text-revoked')).status,'pending');
 }
 // Revoke at training commit: its token remains, and the booking is unchanged.
 {
  const store=createMemoryBotStore({clock:()=>Date.parse('2026-09-01T10:00:00Z')});await seed(store,'commit-revoked');let n=0;
  const bot=botWith(store,async()=>[true,true,false][n++]??false);
  await bot.handle(message(1,'/staff commit-revoked'));
  await bot.handle(callback(2,await action(store,'staff-training')));
  const commit=await action(store,'staff-training-commit');
  await bot.handle(callback(3,commit));
  const state=await store.inspect();
  assert.equal((await store.getRequest('commit-revoked')).status,'pending');
  assert.equal(Object.keys(state.sessions).length,0);
  assert.ok(Object.values(state.actions).some(value=>value.type==='staff-training-commit'));
 }
});

test('denied callback is durably acknowledged, does not consume action or mutate state, and duplicate is a no-op',async()=>{
 const store=createMemoryBotStore(),calls=[];await seed(store);
 let callbackAction;
 await store.transactUpdate('action-seed',tx=>{const request=tx.getRequest('request-1');callbackAction=tx.addAction({scope:'staff',type:'staff-cancel',requestId:request.id,appointmentRevision:request.appointmentRevision});});
 const bot=botWith(store,async()=>{calls.push(1);return false;});
 const update=callback(1,callbackAction);
 const before=await store.inspect();
 await bot.handle(update);
 const denied=await store.inspect();
 assert.deepEqual(denied.requests,before.requests);
 assert.deepEqual(denied.sessions,before.sessions);
 assert.deepEqual(denied.actions,before.actions);
 assert.equal(answers(denied).length,1);
 assert.equal(sent(denied).length,0);
 await bot.handle(update);
 const duplicate=await store.inspect();
 assert.equal(answers(duplicate).length,1);
 assert.deepEqual(duplicate.requests,before.requests);
 assert.ok(Object.values(duplicate.actions).some(value=>value.type==='staff-cancel'));
 assert.equal(calls.length,2);
});

test('permitted duplicate staff callback does not repeat a booking mutation',async()=>{
 const store=createMemoryBotStore(),calls=[];await seed(store);
 let callbackAction;
 await store.transactUpdate('permitted-action-seed',tx=>{const request=tx.getRequest('request-1');callbackAction=tx.addAction({scope:'staff',type:'staff-cancel',requestId:request.id,appointmentRevision:request.appointmentRevision});});
 const bot=botWith(store,async()=>{calls.push(1);return true;});
 const update=callback(1,callbackAction);
 await bot.handle(update);
 const first=await store.inspect();
 assert.equal((await store.getRequest('request-1')).status,'cancelled');
 assert.equal(sent(first).length,3,'cancellation queues the client notice, staff acknowledgement, and refreshed staff card');
 assert.equal(answers(first).length,1);
 await bot.handle(update);
 const duplicate=await store.inspect();
 assert.equal((await store.getRequest('request-1')).status,'cancelled');
 assert.equal(sent(duplicate).length,3);
 assert.equal(answers(duplicate).length,1);
 assert.equal(calls.length,2);
});

test('runtime injects the real membership verifier and skips lookup for an unallowlisted user',async()=>{
 const env={BOT_ENABLED:'true',BOT_WEBHOOK_ENABLED:'true',BOT_WORKER_ENABLED:'true',PUBLIC_ORIGIN:'https://example.test',TELEGRAM_WEBHOOK_SECRET:'h'.repeat(32),TELEGRAM_WORKER_SECRET:'w'.repeat(32),TELEGRAM_BOT_TOKEN:'runtime-test-token',TELEGRAM_STAFF_USER_IDS:'55',TELEGRAM_STAFF_CHAT_ID:groupChatId,TELEGRAM_SEND_TIMEOUT_MS:'250',PRIVACY_PUBLICATION_STATUS:'published',PRIVACY_CONSENT_VERSION:legal.consentVersion,PRIVACY_URL:'https://example.test/telegram-privacy/'};
 const store=createMemoryBotStore(),calls=[];
 const runtime=createBotRuntime(env,{store,fetchImpl:async(url,options)=>{
  calls.push({url,body:JSON.parse(options.body)});
  const body=JSON.parse(options.body);
  return {status:200,json:async()=>({ok:true,result:{status:'member',user:{id:body.user_id,is_bot:false}}})};
 }});
 await seed(store,'runtime-request');
 await runtime.bot.handle(message(1,'/staff runtime-request'));
 assert.equal(calls.length,1);
 assert.equal(calls[0].url,'https://api.telegram.org/botruntime-test-token/getChatMember');
 assert.deepEqual(calls[0].body,{chat_id:-10099,user_id:55});
 assert.equal(staffCards(await store.inspect()).length,1);
 await runtime.bot.handle(message(1,'/staff runtime-request',groupChatId,55));
 assert.equal(staffCards(await store.inspect()).length,1);
 await runtime.bot.handle(message(2,'/staff runtime-request',groupChatId,56));
 assert.equal(calls.length,2);
 assert.equal(staffCards(await store.inspect()).length,1);
});
