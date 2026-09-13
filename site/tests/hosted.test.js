import test from 'node:test';
import assert from 'node:assert/strict';
import {randomUUID} from 'node:crypto';
import {createHostedTrialService} from '../server/hosted-trial.js';
import {legal} from '../src/data.js';

const request=(extra={})=>({name:'Test Person',telegram:'kosstyukov',age:18,directionId:'boxen',groupId:'box-15',locale:'de',consent:true,consentVersion:legal.consentVersion,requestId:randomUUID(),...extra});

function memoryLedger(){
 const records=new Map();
 return {
  limited:async()=>false,
  async claim(id,fingerprint){const record=records.get(id);if(!record){records.set(id,{fingerprint,status:'pending'});return 'claimed';}if(record.fingerprint!==fingerprint)return 'conflict';if(record.status==='failed'){record.status='pending';return 'claimed';}return record.status;},
  async mark(id,status,messageId=''){Object.assign(records.get(id),{status,messageId});},
  records
 };
}

const telegramSuccess=async()=>({ok:true,json:async()=>({ok:true,result:{message_id:4}})});

test('hosted delivery records Telegram acknowledgement and deduplicates retries',async()=>{
 const ledger=memoryLedger();let calls=0;
 const service=createHostedTrialService({ledger,token:'test',chatId:'test',fetchImpl:async()=>{calls++;return telegramSuccess();}});
 const payload=request();const first=await service.handle(payload,'test-ip'),retry=await service.handle({...payload,locale:'ru'},'test-ip');
 assert.equal(first.body.ok,true);assert.equal(first.body.requestId,payload.requestId);assert.equal(retry.body.ok,true);assert.equal(calls,1);assert.equal(ledger.records.get(payload.requestId).status,'delivered');
});

test('hosted delivery keeps ambiguous results from being resent',async()=>{
 const ledger=memoryLedger();let calls=0;
 const service=createHostedTrialService({ledger,token:'test',chatId:'test',fetchImpl:async()=>{calls++;throw new Error('timeout');}});
 const payload=request();assert.equal((await service.handle(payload)).body.code,'uncertain');assert.equal((await service.handle(payload)).body.code,'uncertain');assert.equal(calls,1);
});

test('hosted delivery refuses missing configuration before accepting data',async()=>{
 let calls=0;const service=createHostedTrialService({fetchImpl:async()=>{calls++;}});const result=await service.handle(request());assert.equal(result.httpStatus,503);assert.equal(result.body.code,'not_configured');assert.equal(calls,0);
});

test('confirmed Telegram acknowledgement survives ledger persistence failure without resending',async()=>{
 const ledger=memoryLedger();let calls=0;
 ledger.mark=async()=>{throw new Error('Storage temporarily unavailable');};
 const service=createHostedTrialService({ledger,token:'test',chatId:'test',fetchImpl:async()=>{calls++;return telegramSuccess();}});
 const payload=request();assert.equal((await service.handle(payload)).body.ok,true);
 assert.equal((await service.handle(payload)).body.code,'pending');assert.equal(calls,1);
});
