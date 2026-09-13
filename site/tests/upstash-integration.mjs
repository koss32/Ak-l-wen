import {Redis} from '@upstash/redis';
import {randomUUID,createHash} from 'node:crypto';
import assert from 'node:assert/strict';
import {createUpstashLedger} from '../server/hosted-trial.js';

const redis=new Redis({url:process.env.UPSTASH_REDIS_REST_URL||process.env.KV_REST_API_URL,token:process.env.UPSTASH_REDIS_REST_TOKEN||process.env.KV_REST_API_TOKEN});
const ledger=createUpstashLedger(redis),id=randomUUID(),stale=randomUUID(),ip='integration-'+randomUUID(),now=Date.now();
const keys=[`trial:req:${id}`,`trial:req:${stale}`,`trial:rate:${createHash('sha256').update(ip).digest('hex').slice(0,24)}`];
try{
 const claims=await Promise.all(Array.from({length:5},()=>ledger.claim(id,'test-fingerprint',now)));
 assert.equal(claims.filter(state=>state==='claimed').length,1);assert.equal(claims.filter(state=>state==='pending').length,4);
 assert.equal(await ledger.claim(id,'different-fingerprint',now),'conflict');
 await ledger.mark(id,'delivered',123);await ledger.mark(id,'uncertain');
 assert.equal(await ledger.claim(id,'test-fingerprint',now),'delivered');
 assert.ok(await redis.ttl(`trial:req:${id}`)>0);
 await ledger.claim(stale,'test',now-61000);assert.equal(await ledger.claim(stale,'test',now),'uncertain');
 for(let i=0;i<12;i++)assert.equal(await ledger.limited(ip),false);assert.equal(await ledger.limited(ip),true);
 console.log('PASS real Upstash: atomic concurrent claim, conflict, delivered cannot downgrade, TTL, stale pending, rate limit.');
}finally{await redis.del(...keys);}
