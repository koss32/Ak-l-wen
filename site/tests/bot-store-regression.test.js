import test from 'node:test';
import assert from 'node:assert/strict';
import {BOT_CALLBACK_TTL_MS,BOT_RETENTION_MS,classifyTelegramResponse,createMemoryBotStore,nextAllowedReminderTime} from '../server/bot-store.js';

const confirmed=async(store,id,recipient,appointment)=>store.createBooking({id,clientUserId:recipient,clientChatId:recipient,status:'confirmed',appointment,reminders:{enabled:true}});
const queueReminder=async(store,request,now)=>store.enqueue(request.clientChatId,'care','reminder',now,{requestId:request.id,appointment:request.appointment,appointmentRevision:request.appointmentRevision});

test('client request lookup uses immutable owner and putClient retains existing metadata',async()=>{
 let now=100;const store=createMemoryBotStore({clock:()=>now});
 await store.transactUpdate('seed-client',tx=>tx.putClient('42',{locale:'de',preferences:{care:false}}));
 const first=(await store.transactUpdate('request-a',tx=>tx.createRequest({id:'a',clientUserId:'42',clientChatId:'42',status:'pending'}))).result;
 now=200;
 const second=(await store.transactUpdate('request-b',tx=>{tx.putClient('42',{requestId:'b'});tx.createRequest({id:'other',clientUserId:'77',clientChatId:'77',status:'pending'});return tx.createRequest({id:'b',clientUserId:'42',clientChatId:'42',status:'pending'});})).result;
 const result=(await store.transactUpdate('list-client',tx=>({client:tx.getClient('42'),requests:tx.listClientRequests('42')}))).result;
 assert.deepEqual(result.client,{locale:'de',preferences:{care:false},requestId:'b',expiresAt:now+BOT_RETENTION_MS});
 assert.deepEqual(result.requests.map(record=>record.id),[second.id,first.id]);
 assert.ok(result.requests.every(record=>record.clientUserId==='42'));
});

test('callback answers are globally prioritized and expire quickly',async()=>{
 let now=0;const store=createMemoryBotStore({clock:()=>now});
 const ordinary=await store.enqueue('chat','ordinary');
 const callback=(await store.transactUpdate('callback',tx=>tx.answerCallback('query-1'))).result;
 assert.equal(callback.expiresAt,BOT_CALLBACK_TTL_MS);
 assert.equal((await store.leaseNext('worker')).id,callback.id);
 now=BOT_CALLBACK_TTL_MS+1;
 // A normal mutation prunes expired callback work; ordinary work remains available.
 await store.setSession('prune',{stage:'idle'});
 const state=await store.inspect();
 assert.equal(state.outbox[callback.id],undefined);
 assert.equal((await store.leaseNext('worker')).id,ordinary.id);
});

test('recipient has one active lease, maintains order, and recovers an expired unstarted lease',async()=>{
 let now=0;const store=createMemoryBotStore({clock:()=>now});
 const first=await store.enqueue('r','first');const second=await store.enqueue('r','second');
 const lease=await store.leaseNext('one');
 assert.equal(lease.id,first.id);
 const contenders=await Promise.all([store.leaseNext('two'),store.leaseNext('three')]);
 assert.deepEqual(contenders,[undefined,undefined]);
 now=30001;
 const recovered=await store.leaseNext('two');
 assert.equal(recovered.id,first.id);
 const sending=await store.beginDelivery(recovered.id,recovered.lease.fence);
 assert.equal(sending.state,'sending');
 await store.finishDelivery(sending.id,sending.lease.fence,{state:'sent',messageId:1});
 assert.equal((await store.leaseNext('three')).id,second.id);
});

test('backoff is checked again at the begin-delivery boundary',async()=>{
 let now=0;const store=createMemoryBotStore({clock:()=>now});
 const item=await store.enqueue('r','first');const lease=await store.leaseNext('one');
 await store.transactUpdate('concurrent-backoff',tx=>{tx.raw.recipientBlockedUntil.r=now+30000;});
 assert.equal(await store.beginDelivery(item.id,lease.lease.fence),undefined);
 const deferred=(await store.inspect()).outbox[item.id];
 assert.equal(deferred.state,'queued');assert.equal(deferred.notBefore,30000);assert.equal(deferred.lease,null);
});

test('final reminder guard defers only to actual Berlin quiet-hour end across DST and cancels late care',async()=>{
 for(const [nowValue,appointment,expected] of [
  [Date.parse('2026-03-29T04:30:00Z'),Date.parse('2026-03-29T07:00:00Z'),Date.parse('2026-03-29T06:00:00Z')],
  [Date.parse('2026-10-25T05:30:00Z'),Date.parse('2026-10-25T08:00:00Z'),Date.parse('2026-10-25T07:00:00Z')]
 ]){
  let now=nowValue;const store=createMemoryBotStore({clock:()=>now});const request=await confirmed(store,`request-${now}`, 'r',appointment);const reminder=await queueReminder(store,request,now);const lease=await store.leaseNext('worker');
  assert.equal(await store.beginDelivery(reminder.id,lease.lease.fence),undefined);
  const deferred=(await store.inspect()).outbox[reminder.id];
  assert.equal(deferred.state,'queued');assert.equal(deferred.notBefore,expected);
  assert.equal(nextAllowedReminderTime(now,appointment),expected);
 }
 let now=Date.parse('2026-10-25T08:00:00Z');const store=createMemoryBotStore({clock:()=>now});const request=await confirmed(store,'late','r',now);const reminder=await queueReminder(store,request,now);const lease=await store.leaseNext('worker');
 assert.equal(await store.beginDelivery(reminder.id,lease.lease.fence),undefined);
 assert.equal((await store.inspect()).outbox[reminder.id].state,'cancelled');
});

test('recipient sequence metadata remains while work exists and resets only after retention pruning',async()=>{
 let now=0;const store=createMemoryBotStore({clock:()=>now});
 const first=await store.enqueue('r','one');const second=await store.enqueue('r','two');
 assert.equal(first.sequence,1);assert.equal(second.sequence,2);
 now=BOT_RETENTION_MS+1;
 const afterRetention=await store.enqueue('r','new');
 assert.equal(afterRetention.sequence,1);
 const state=await store.inspect();
 assert.deepEqual(Object.values(state.outbox).map(item=>item.id),[afterRetention.id]);
 assert.equal(state.recipientSequence.r,1);
 // A recipient-only 429 block also keeps its sequence: it must not reset before
 // the deferred recipient can be considered again.
 let blockedNow=0;const blockedStore=createMemoryBotStore({clock:()=>blockedNow});
 await blockedStore.transactUpdate('seed-block',tx=>{tx.raw.recipientSequence.blocked=4;tx.raw.recipientBlockedUntil.blocked=1000;});
 const blockedItem=await blockedStore.enqueue('blocked','after-backoff');
 assert.equal(blockedItem.sequence,5);
});

test('only authoritative HTTP 200 Telegram acknowledgements are terminal sent',()=>{
 const body={ok:true,result:{message_id:7}};
 assert.deepEqual(classifyTelegramResponse({status:200,ok:true},body),{state:'sent',messageId:7});
 assert.deepEqual(classifyTelegramResponse({status:201,ok:true},body),{state:'uncertain'});
 assert.deepEqual(classifyTelegramResponse({status:202,ok:true},body),{state:'uncertain'});
 assert.deepEqual(classifyTelegramResponse({status:200,ok:true},{ok:true,result:true},'answerCallbackQuery'),{state:'sent',messageId:undefined});
 assert.deepEqual(classifyTelegramResponse({status:500,ok:false},{ok:false,error_code:500}),{state:'uncertain'});
 assert.deepEqual(classifyTelegramResponse({status:429,ok:false},{ok:false,error_code:429,parameters:{retry_after:0}}),{state:'deferred',retryAfter:1});
});
