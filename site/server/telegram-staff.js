const unavailable=()=>new Error('BOT_STAFF_MEMBERSHIP_UNAVAILABLE');
const record=value=>value!==null&&typeof value==='object'&&!Array.isArray(value);
const statuses=new Set(['creator','administrator','member','restricted','left','kicked']);

function canonicalId(value,negative=false){
 if(typeof value!=='string'&&typeof value!=='number')return null;
 const raw=String(value);
 if(raw.length>17||!(negative?/^-[1-9]\d*$/:/^[1-9]\d*$/).test(raw))return null;
 const id=Number(raw);
 return Number.isSafeInteger(id)&&String(id)===raw?id:null;
}

// getChatMember is guaranteed for other users only when the bot is a chat admin.
// https://core.telegram.org/bots/api#getchatmember
export function createStaffMembershipVerifier({token,fetchImpl=fetch,timeoutMs=2000}={}){
 return async function verifyStaffMembership(chatId,userId){
  const chat=canonicalId(chatId,true),user=canonicalId(userId);
  if(chat===null||user===null)return false;
  try{
   if(typeof token!=='string'||token!==token.trim()||token.length>256||!/^[A-Za-z0-9:_-]+$/.test(token)||typeof fetchImpl!=='function'||!Number.isInteger(timeoutMs)||timeoutMs<1||timeoutMs>10000)throw unavailable();
   const response=await fetchImpl(`https://api.telegram.org/bot${token}/getChatMember`,{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({chat_id:chat,user_id:user}),
    redirect:'error',
    signal:AbortSignal.timeout(timeoutMs)
   });
   if(response?.status!==200||response.redirected===true)throw unavailable();
   const body=await response.json();
   const member=body?.result;
   if(!record(body)||body.ok!==true||!record(member)||!statuses.has(member.status)||!record(member.user)||!Number.isSafeInteger(member.user.id)||member.user.id<=0)throw unavailable();
   if(typeof member.user.is_bot!=='boolean')throw unavailable();
   if(member.user.id!==user||member.user.is_bot===true)return false;
   if(member.status==='restricted')return member.is_member===true;
   return member.status==='creator'||member.status==='administrator'||member.status==='member';
  }catch{
   // Never attach a transport cause: it may contain the token-bearing URL.
   throw unavailable();
  }
 };
}
