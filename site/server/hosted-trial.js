import {createHash} from 'node:crypto';
import {schedules} from '../src/data.js';
import {validateRequest} from './validate-request.js';

const ledgerTtl=30*24*60*60;
const rateWindow=5*60;
const rateLimit=12;

const claimScript=`
local fingerprint=redis.call('HGET',KEYS[1],'fingerprint')
if fingerprint then
 if fingerprint~=ARGV[1] then return 'conflict' end
 local status=redis.call('HGET',KEYS[1],'status')
 if status=='failed' then
  redis.call('HSET',KEYS[1],'status','pending')
  return 'claimed'
 end
 return status
end
redis.call('HSET',KEYS[1],'fingerprint',ARGV[1],'status','pending','received',ARGV[2])
redis.call('EXPIRE',KEYS[1],ARGV[3])
return 'claimed'`;

const rateScript=`
local count=redis.call('INCR',KEYS[1])
if count==1 then redis.call('EXPIRE',KEYS[1],ARGV[1]) end
return count`;

export function createUpstashLedger(redis){
 return {
  async limited(ip){const key=createHash('sha256').update(ip).digest('hex').slice(0,24);return Number(await redis.eval(rateScript,[`trial:rate:${key}`],[rateWindow]))>rateLimit;},
  claim:(id,fingerprint,received)=>redis.eval(claimScript,[`trial:req:${id}`],[fingerprint,String(received),ledgerTtl]),
  async mark(id,status,messageId=''){await redis.hset(`trial:req:${id}`,{status,telegramMessageId:String(messageId)});await redis.expire(`trial:req:${id}`,ledgerTtl);}
 };
}

const reply=(httpStatus,code,ok=false,requestId='')=>({httpStatus,body:{ok,code,...(requestId?{requestId}:{})}});

export function createHostedTrialService({ledger,token='',chatId='',fetchImpl=fetch,timeoutMs=10000,clock=()=>Date.now()}={}){
 async function handle(raw,ip='unknown'){
  if(!ledger||!token||!chatId)return reply(503,'not_configured');
  if(await ledger.limited(ip))return reply(429,'rate_limited');
  const validated=validateRequest(raw);if(validated.error)return {httpStatus:422,body:{ok:false,code:'invalid',field:validated.error}};
  const d=validated.data;
  const fingerprint=createHash('sha256').update(JSON.stringify({...d,locale:undefined})).digest('hex');
  const state=await ledger.claim(d.requestId,fingerprint,clock());
  if(state==='conflict')return reply(409,'request_conflict');
  if(state==='delivered')return reply(200,'delivered',true,d.requestId);
  if(state==='uncertain')return reply(409,'uncertain');
  if(state==='pending')return reply(202,'pending');
  if(state!=='claimed')return reply(503,'not_configured');
  const schedule=d.preferredTime?schedules.find(item=>item.id===d.preferredTime):null;
  const text=[
   'AK Löwen · Probetraining',
   `${d.directionId} · ${d.groupId}`,
   `Name: ${d.name}`,
   `E-Mail: ${d.email||'—'}`,
   `Telefon: ${d.phone||'—'}`,
   `Telegram: ${d.telegram?`@${d.telegram}`:'—'}`,
   `Zeit: ${schedule?`${schedule.weekdayIds.join(',')} ${schedule.startTime}–${schedule.endTime}`:'—'}`,
   `Kommentar: ${d.comment||'—'}`,
   `Alter: ${d.age}`,
   `Sprache: ${d.locale}`,
   `Datenschutz: ${d.consentVersion}`,
   `Request: ${d.requestId}`,
   `Eingang: ${new Date(clock()).toISOString()}`
  ].join('\n');
  try{
   const response=await fetchImpl(`https://api.telegram.org/bot${token}/sendMessage`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({chat_id:chatId,text}),signal:AbortSignal.timeout(timeoutMs)});
   let answer;try{answer=await response.json();}catch{throw new Error('Uncertain response');}
   if(response.ok&&answer.ok===true&&Number.isInteger(answer.result?.message_id)){
    await ledger.mark(d.requestId,'delivered',answer.result.message_id);return reply(200,'delivered',true,d.requestId);
   }
   const certainFailure=answer.ok===false&&Number.isInteger(answer.error_code)&&answer.error_code>=400&&answer.error_code<500;
   await ledger.mark(d.requestId,certainFailure?'failed':'uncertain');
   return reply(certainFailure?502:409,certainFailure?'delivery_failed':'uncertain');
  }catch{
   await ledger.mark(d.requestId,'uncertain');return reply(409,'uncertain');
  }
 }
 return {handle};
}
