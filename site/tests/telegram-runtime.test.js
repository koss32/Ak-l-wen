import test from 'node:test';
import assert from 'node:assert/strict';
import {createMemoryBotStore} from '../server/bot-store.js';
import {drainTelegramOutbox} from '../server/telegram-bot.js';

test('bounded outbox drain leaves queued work when the next full request cannot fit budget',async()=>{
 const store=createMemoryBotStore();
 await store.enqueue('1','first');
 await store.enqueue('2','second');
 let elapsed=0,calls=0;
 const processed=await drainTelegramOutbox({store,token:'test-token',timeoutMs:250,maxDurationMs:800,monotonicNow:()=>elapsed,fetchImpl:async()=>{calls++;elapsed=100;return {status:200,json:async()=>({ok:true,result:{message_id:calls}})};}});
 assert.equal(processed,1);
 assert.equal(calls,1);
 const state=await store.inspect();
 assert.equal(Object.values(state.outbox).find(item=>item.text==='first').state,'sent');
 assert.equal(Object.values(state.outbox).find(item=>item.text==='second').state,'queued');
});

test('drain does not lease an item when one timeout plus delivery margin cannot fit',async()=>{
 const store=createMemoryBotStore();
 await store.enqueue('1','pending');
 const processed=await drainTelegramOutbox({store,token:'test-token',timeoutMs:250,maxDurationMs:749,fetchImpl:async()=>{throw new Error('must not call');}});
 assert.equal(processed,0);
 assert.equal(Object.values((await store.inspect()).outbox)[0].state,'queued');
});

test('successful Telegram transport requires HTTP 200 and authoritative body',async()=>{
 const store=createMemoryBotStore();
 await store.enqueue('1','unexpected 201');
 const processed=await drainTelegramOutbox({store,token:'test-token',timeoutMs:250,maxDurationMs:1000,fetchImpl:async()=>({status:201,json:async()=>({ok:true,result:{message_id:1}})})});
 assert.equal(processed,1);
 assert.equal(Object.values((await store.inspect()).outbox)[0].state,'uncertain');
});
