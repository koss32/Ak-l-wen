import test from 'node:test';
import assert from 'node:assert/strict';
import {execFile,spawn} from 'node:child_process';
import {promisify} from 'node:util';
import {createUpstashBotStore} from '../server/bot-store.js';
const run=promisify(execFile);
const port=20000+(process.pid%20000);
const cli=async(...args)=>(await run('redis-cli',['-p',String(port),'--json',...args],{maxBuffer:2*1024*1024})).stdout.trim();
const redis={async eval(script,keys,args){return JSON.parse(await cli('EVAL',script,String(keys.length),...keys,...args.map(String)));}};

test('production aggregate adapter uses real Redis Lua CAS, TTL and atomic update dedupe',async t=>{
 try{await run('redis-server',['--version']);}catch{t.skip('redis-server is not installed');return;}
 const server=spawn('redis-server',['--port',String(port),'--save','','--appendonly','no'],{stdio:'ignore'});t.after(()=>server.kill('SIGTERM'));
 for(let i=0;i<50;i++){try{if(await cli('PING')==='"PONG"')break;}catch{}await new Promise(r=>setTimeout(r,20));}
 await cli('FLUSHDB');const store=createUpstashBotStore(redis,{prefix:'{integration}:'});
 const concurrent=await Promise.all(Array.from({length:24},(_,i)=>store.transactUpdate(i+1,tx=>{const value=tx.getSession('counter')||{count:0};tx.putSession('counter',{count:value.count+1});tx.enqueue('staff',`event-${i}`);})));assert.equal(concurrent.length,24);assert.equal((await store.getSession('counter')).count,24);
 const first=await store.transactUpdate(999,tx=>tx.enqueue('client','only-once')),second=await store.transactUpdate(999,tx=>tx.enqueue('client','duplicate'));assert.equal(first.dropped,undefined);assert.equal(second.dropped,true);const state=await store.inspect();assert.equal(Object.values(state.outbox).filter(x=>x.recipient==='client').length,1);
 assert.ok(Number(JSON.parse(await cli('PTTL','{integration}:state')))>0);assert.ok(Number(JSON.parse(await cli('PTTL','{integration}:generation')))>0);
});
