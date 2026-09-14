import {programs,groups,locales,legal} from '../src/data.js';

export function validateRequest(raw){
 if(!raw||typeof raw!=='object'||Array.isArray(raw))return {error:'invalid'};
 const {name,age,directionId,groupId,locale,consent,consentVersion,requestId}=raw;
 const {email='',phone='',telegram='',preferredTime='',comment=''}=raw;
 if(typeof name!=='string'||name.trim().length<2||name.trim().length>80||/[\u0000-\u001f]/.test(name))return {error:'name'};
 if(typeof email!=='string'||(email&&(!/^\S+@[^\s@]+\.[^\s@]+$/.test(email)||email.length>254)))return {error:'email'};
 if(typeof phone!=='string'||(phone&&(!/^[+\d][\d\s()-]{5,39}$/.test(phone)||/[\r\n]/.test(phone)||phone.replace(/\D/g,'').length<6||phone.replace(/\D/g,'').length>20)))return {error:'phone'};
 if(typeof telegram!=='string'||(telegram&&!/^@?[a-zA-Z][a-zA-Z0-9_]{4,31}$/.test(telegram)))return {error:'telegram'};
 if(!email&&!phone&&!telegram)return {error:'contact'};
 if(!Number.isInteger(age)||age<1||age>120)return {error:'age'};
 if(!programs.some(program=>program.id===directionId))return {error:'directionId'};
 const g=groups.find(g=>g.id===groupId&&g.programId===directionId);
 if(!g)return {error:'groupId'};
 if(age<g.minAge||(g.maxAge!==null&&age>g.maxAge))return {error:'age'};
 if(typeof preferredTime!=='string'||(preferredTime&&!g.scheduleIds.includes(preferredTime)))return {error:'preferredTime'};
 if(typeof comment!=='string'||comment.length>1000||/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(comment))return {error:'comment'};
 if(!locales.includes(locale))return {error:'locale'};
 if(consent!==true||consentVersion!==legal.consentVersion)return {error:'consent'};
 if(typeof requestId!=='string'||!/^[a-f\d]{8}-[a-f\d]{4}-4[a-f\d]{3}-[89ab][a-f\d]{3}-[a-f\d]{12}$/i.test(requestId))return {error:'requestId'};
 return {data:{name:name.trim(),email:email.trim(),phone:phone.trim(),telegram:telegram.replace(/^@/,''),preferredTime,comment:comment.trim(),age,directionId,groupId,locale,consent,consentVersion,requestId}};
}
