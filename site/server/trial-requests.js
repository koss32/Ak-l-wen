import {DatabaseSync} from 'node:sqlite';
import {createHash} from 'node:crypto';
import {groups,locales,legal} from '../src/data.js';

export function validateRequest(raw){
 if(!raw||typeof raw!=='object'||Array.isArray(raw))return {error:'invalid'};
 const {name,email,phone,age,directionId,groupId,locale,consent,consentVersion,requestId}=raw;
 if(typeof name!=='string'||!name.trim()||name.trim().length>100||/[\r\n\u0000-\u001f]/.test(name))return {error:'name'};
 if(typeof email!=='string'||email.length>254||!/^\S+@[^\s@]+\.[^\s@]+$/.test(email))return {error:'email'};
 if(typeof phone!=='string'||!/^[+\d][\d\s()\-]{5,39}$/.test(phone)||/[\r\n]/.test(phone)||phone.replace(/\D/g,'').length<6||phone.replace(/\D/g,'').length>20)return {error:'phone'};
 if(!Number.isInteger(age)||age<1||age>120)return {error:'age'};
 if(!['boxen','sambo-mma'].includes(directionId))return {error:'directionId'};
 const g=groups.find(g=>g.id===groupId&&g.programId===directionId);
 if(!g)return {error:'groupId'};
 if(age<g.minAge||(g.maxAge!==null&&age>g.maxAge))return {error:'age'};
 if(!locales.includes(locale))return {error:'locale'};
 if(consent!==true||consentVersion!==legal.consentVersion)return {error:'consent'};
 if(typeof requestId!=='string'||!/^[a-f\d]{8}-[a-f\d]{4}-4[a-f\d]{3}-[89ab][a-f\d]{3}-[a-f\d]{12}$/i.test(requestId))return {error:'requestId'};
 return {data:{name:name.trim(),email:email.trim(),phone:phone.trim(),age,directionId,groupId,locale,consent,consentVersion,requestId}};
}

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
   if(existing.status==='delivered')return reply(200,'delivered',true);
   if(existing.status==='uncertain')return reply(409,'uncertain');
   if(existing.status==='pending')return reply(202,'pending');
   db.prepare("UPDATE requests SET status='pending' WHERE id=?").run(d.requestId);
  }else db.prepare("INSERT INTO requests VALUES (?,?,'pending',?)").run(d.requestId,fingerprint,clock());
  const text=[`AK Löwen · Probetraining`,`${d.directionId} · ${d.groupId}`,`Name: ${d.name}`,`E-Mail: ${d.email}`,`Telefon: ${d.phone}`,`Alter: ${d.age}`,`Sprache: ${d.locale}`,`Datenschutz: ${d.consentVersion}`,`Request: ${d.requestId}`,`Eingang: ${new Date(clock()).toISOString()}`].join('\n');
  try{
   const result=await fetchImpl(`https://api.telegram.org/bot${token}/sendMessage`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({chat_id:chatId,text}),signal:AbortSignal.timeout(timeoutMs)});
   let answer;try{answer=await result.json();}catch{throw new Error('Uncertain response');}
   if(result.ok&&answer.ok===true&&Number.isInteger(answer.result?.message_id)){
    db.prepare("UPDATE requests SET status='delivered' WHERE id=?").run(d.requestId);return reply(200,'delivered',true);
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
