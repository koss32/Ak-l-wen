import {DatabaseSync} from 'node:sqlite';
import {createHash} from 'node:crypto';
import {schedules} from '../src/data.js';

import {validateRequest} from './validate-request.js';
export {validateRequest} from './validate-request.js';

export function createTrialService({databasePath=':memory:',token='',chatId='',enabled=false,fetchImpl=fetch,timeoutMs=10000,clock=()=>Date.now()}={}){
 const db=new DatabaseSync(databasePath);
 db.exec('PRAGMA journal_mode=WAL; CREATE TABLE IF NOT EXISTS requests (id TEXT PRIMARY KEY, fingerprint TEXT NOT NULL, status TEXT NOT NULL, received INTEGER NOT NULL)');
 // A process restart after a send cannot prove whether Telegram accepted it.
 db.prepare("UPDATE requests SET status='uncertain' WHERE status='pending'").run();
 const clients=new Map();
 const reply=(httpStatus,code,ok=false)=>({httpStatus,body:{ok,code}});
 function limited(ip){const now=clock();for(const [key,v] of clients)if(v.reset<=now)clients.delete(key);let entry=clients.get(ip);if(!entry){if(clients.size>=10000)return true;entry={count:0,reset:now+300000};clients.set(ip,entry);}return ++entry.count>12;}
 async function handle(raw,ip='unknown'){
  if(limited(ip))return reply(429,'rate_limited');
  const validated=validateRequest(raw);if(validated.error)return {httpStatus:422,body:{ok:false,code:'invalid',field:validated.error}};
  if(!enabled||!token||!chatId)return reply(503,'not_configured');
  const d=validated.data;
  const fingerprint=createHash('sha256').update(JSON.stringify({...d,locale:undefined})).digest('hex');
  const existing=db.prepare('SELECT fingerprint,status FROM requests WHERE id=?').get(d.requestId);
  if(existing){
   if(existing.fingerprint!==fingerprint)return reply(409,'request_conflict');
   if(existing.status==='delivered')return {httpStatus:200,body:{ok:true,code:'delivered',requestId:d.requestId}};
   if(existing.status==='uncertain')return reply(409,'uncertain');
   if(existing.status==='pending')return reply(202,'pending');
   db.prepare("UPDATE requests SET status='pending' WHERE id=?").run(d.requestId);
  }else db.prepare("INSERT INTO requests VALUES (?,?,'pending',?)").run(d.requestId,fingerprint,clock());
  const text=[`AK Löwen · Probetraining`,`${d.directionId} · ${d.groupId}`,`Name: ${d.name}`,`E-Mail: ${d.email}`,`Telefon: ${d.phone}`,`Telegram: ${d.telegram}`,`Zeit: ${d.preferredTime ? JSON.stringify(schedules.find(s=>s.id===d.preferredTime)) : '—'}`,`Kommentar: ${d.comment}`,`Alter: ${d.age}`,`Sprache: ${d.locale}`,`Datenschutz: ${d.consentVersion}`,`Request: ${d.requestId}`,`Eingang: ${new Date(clock()).toISOString()}`].join('\n');
  try{
   const result=await fetchImpl(`https://api.telegram.org/bot${token}/sendMessage`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({chat_id:chatId,text}),signal:AbortSignal.timeout(timeoutMs)});
   let answer;try{answer=await result.json();}catch{throw new Error('Uncertain response');}
   if(result.ok&&answer.ok===true&&Number.isInteger(answer.result?.message_id)){
    db.prepare("UPDATE requests SET status='delivered' WHERE id=?").run(d.requestId);return {httpStatus:200,body:{ok:true,code:'delivered',requestId:d.requestId}};
   }
   // Only an explicit Telegram refusal proves no delivery. Invalid or 5xx
   // responses are ambiguous and must never trigger an automatic resend.
   const certainFailure=answer.ok===false&&Number.isInteger(answer.error_code)&&answer.error_code>=400&&answer.error_code<500;
   db.prepare('UPDATE requests SET status=? WHERE id=?').run(certainFailure?'failed':'uncertain',d.requestId);
   return reply(certainFailure?502:409,certainFailure?'delivery_failed':'uncertain');
  }catch{
   db.prepare("UPDATE requests SET status='uncertain' WHERE id=?").run(d.requestId);return reply(409,'uncertain');
  }
 }
 return {handle,close:()=>db.close()};
}
