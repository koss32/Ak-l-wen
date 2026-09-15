import test from 'node:test';
import assert from 'node:assert/strict';
import {createMemoryBotStore,classifyTelegramResponse,secureEqual} from '../server/bot-store.js';
import {drainTelegramOutbox,reminderTimes,safeReminderTime} from '../server/telegram-bot.js';

test('whole update transaction dedupes atomically, retries conflicts, and does not consume failures',async()=>{
 const store=createMemoryBotStore();
 await assert.rejects(store.transactUpdate(1,()=>{throw new Error('fail')}));
 assert.equal((await store.transactUpdate(1,tx=>tx.enqueue('1','once'))).dropped,undefined);
 assert.equal((await store.transactUpdate(1,tx=>tx.enqueue('1','twice'))).dropped,true);
 const results=await Promise.all(Array.from({length:20},(_,i)=>store.transactUpdate(i+2,tx=>{const old=tx.getSession('counter')||{count:0};tx.putSession('counter',{count:old.count+1});})));
 assert.equal(results.length,20);assert.equal((await store.getSession('counter')).count,20);
 const state=await store.inspect();assert.equal(Object.values(state.outbox).filter(x=>x.text==='once').length,1);
});

test('request numbers start at 1, increase atomically, and do not overwrite an existing numeric request',async()=>{
 const store=createMemoryBotStore();
 const first=(await store.transactUpdate('request-1',tx=>tx.nextRequestId())).result;
 const second=(await store.transactUpdate('request-2',tx=>tx.nextRequestId())).result;
 assert.deepEqual([first,second],['1','2']);
 await store.createBooking({id:'3'});
 const next=(await store.transactUpdate('request-3',tx=>tx.nextRequestId())).result;
 assert.equal(next,'4');
});

test('opaque revisions avoid ABA and delivery has lease + begin fence with crash uncertainty',async()=>{
 let now=0;const store=createMemoryBotStore({clock:()=>now});await store.setSession('x',{stage:'a'});const first=(await store.getSession('x')).revision;await store.clearSession('x');await store.setSession('x',{stage:'a'});assert.notEqual((await store.getSession('x')).revision,first);
 const queued=await store.enqueue('1','hello');const lease=await store.leaseNext('a',10);assert.equal(await store.beginDelivery(queued.id,'wrong'),undefined);const sending=await store.beginDelivery(queued.id,lease.lease.fence,10);assert.equal(sending.state,'sending');now=20;await store.enqueue('2','trigger');assert.equal((await store.inspect()).outbox[queued.id].state,'uncertain');
});

test('future reminder does not block immediate reply; retry_after blocks the recipient',async()=>{
 let now=0;const store=createMemoryBotStore({clock:()=>now});await store.enqueue('1','later','reminder',1000);const immediate=await store.enqueue('1','now');assert.equal((await store.leaseNext('w')).id,immediate.id);
 const active=await store.beginDelivery(immediate.id,(await store.inspect()).outbox[immediate.id].lease.fence);await store.finishDelivery(active.id,active.lease.fence,classifyTelegramResponse({status:429,ok:false},{ok:false,error_code:429,parameters:{retry_after:30}}));await store.enqueue('1','another');assert.equal(await store.leaseNext('w'),undefined);now=30000;assert.ok(await store.leaseNext('w'));
});

test('final beginDelivery guard suppresses stale or opted-out reminders and DST quiet time stays before appointment',async()=>{
 let now=Date.parse('2026-10-20T10:00:00Z');const store=createMemoryBotStore({clock:()=>now}),appointment=Date.parse('2026-10-25T09:00:00+01:00');const request=await store.createBooking({id:'r',status:'confirmed',clientChatId:'1',appointment,reminders:{enabled:true}});const reminder=await store.enqueue('1','care','reminder',now,{requestId:'r',appointment,appointmentRevision:request.appointmentRevision});const lease=await store.leaseNext('w');await store.transition('r',request.revision,{reminders:{enabled:false}});assert.equal(await store.beginDelivery(reminder.id,lease.lease.fence),undefined);assert.equal((await store.inspect()).outbox[reminder.id].state,'cancelled');for(const at of reminderTimes(appointment,now)){assert.ok(at>now&&at<appointment);assert.ok(localHourForTest(at)>=8&&localHourForTest(at)<21);}assert.equal(safeReminderTime(Date.parse('2026-10-25T07:00:00+01:00'),Date.parse('2026-10-25T07:30:00+01:00')),null);
});
const localHourForTest=at=>Number(new Intl.DateTimeFormat('en-GB',{timeZone:'Europe/Berlin',hour:'2-digit',hourCycle:'h23'}).format(new Date(at)));

test('Telegram classifications and secure secret comparison fail closed',()=>{
 assert.equal(secureEqual('',''),false);assert.equal(secureEqual('short','short'),false);const secret='x'.repeat(32);assert.equal(secureEqual(secret,secret),true);assert.equal(secureEqual(secret,'y'.repeat(32)),false);
 assert.deepEqual(classifyTelegramResponse({status:200,ok:true},{ok:true,result:{}}),{state:'uncertain'});assert.deepEqual(classifyTelegramResponse({status:429,ok:false},{ok:false,error_code:429,parameters:{retry_after:90}}),{state:'deferred',retryAfter:90});assert.deepEqual(classifyTelegramResponse({status:200,ok:true},{ok:true,result:true},'answerCallbackQuery'),{state:'sent',messageId:undefined});
});

test('worker begins delivery, uses a timeout signal, and never retries ambiguous response',async()=>{
 const store=createMemoryBotStore();const item=await store.enqueue('1','hello');let signal;await drainTelegramOutbox({store,token:'test',fetchImpl:async(_url,options)=>{signal=options.signal;throw new Error('network');},limit:1,timeoutMs:50});assert.ok(signal);assert.equal((await store.inspect()).outbox[item.id].state,'uncertain');assert.equal(await store.leaseNext('w'),undefined);
});
