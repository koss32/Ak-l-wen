import test from 'node:test';
import assert from 'node:assert/strict';
import {createMemoryBotStore} from '../server/bot-store.js';
import {createTelegramBot} from '../server/telegram-bot.js';
import {contacts,legal} from '../src/data.js';

const cfg={deliveryReady:true,sourceLegalStatus:'published',privacyUrl:'https://example.test/privacy',privacyStatus:'published',consentVersion:legal.consentVersion,staffUserIds:['55'],staffChatId:'99'};
const msg=(id,chat,text,user=chat,type='private')=>({update_id:id,message:{chat:{id:chat,type},from:{id:user},text}});
const cb=(id,chat,data,user=chat,type='private')=>({update_id:id,callback_query:{id:`q${id}`,from:{id:user},data,message:{chat:{id:chat,type}}}});
const sent=state=>Object.values(state.outbox).filter(item=>item.method==='sendMessage');
async function button(store,text){
 const item=sent(await store.inspect()).filter(item=>item.meta?.reply_markup?.inline_keyboard?.flat().some(button=>button.text===text)).at(-1);
 assert.ok(item,`button ${text}`);
 return item.meta.reply_markup.inline_keyboard.flat().find(button=>button.text===text).callback_data;
}
async function bookWithOptIn(store,bot){
 await store.transactUpdate('locale-ru-10',tx=>tx.putClient(10,{locale:'ru'}));
 let id=1;
 await bot.handle(msg(id++,10,'/book'));
 await bot.handle(cb(id++,10,await button(store,'Бокс')));
 await bot.handle(cb(id++,10,await button(store,'15+ лет')));
 await bot.handle(cb(id++,10,await button(store,'Согласен/согласна')));
 await bot.handle(cb(id++,10,await button(store,'Взрослый участник')));
 await bot.handle(msg(id++,10,'Adult Name'));
 await bot.handle(msg(id++,10,'21'));
 await bot.handle(cb(id++,10,await button(store,'Понедельник, Среда, Пятница · 18:30–20:00 · Europe/Berlin')));
 await bot.handle(msg(id++,10,'/skip'));
 await bot.handle(cb(id++,10,await button(store,'Отправить с напоминанием за 2 часа')));
 return id;
}
async function confirm(store,bot,id,requestId,iso){
 await bot.handle(msg(id++,99,`/staff ${requestId}`,55,'group'));
 const card=sent(await store.inspect()).filter(item=>item.kind==='staff-card').at(-1);
 const dateButton=card.meta.reply_markup.inline_keyboard.flat().find(button=>/^Termin (bestätigen|ändern)$/.test(button.text));
 await bot.handle(cb(id++,99,dateButton.callback_data,55,'group'));
 await bot.handle(msg(id++,99,iso,55,'group'));
 await bot.handle(cb(id,99,await button(store,'Verbindlich bestätigen'),55,'group'));
}

test('explicit opt-in schedules one two-hour reminder and confirmation includes cancel, disable, and map controls',async()=>{
 let now=Date.parse('2026-09-01T10:00:00Z');
 const store=createMemoryBotStore({clock:()=>now}),bot=createTelegramBot({store,config:cfg,verifyStaffMembership:async()=>true});
 const id=await bookWithOptIn(store,bot);
 const request=Object.values((await store.inspect()).requests)[0];
 assert.equal(request.reminders.enabled,true);
 await confirm(store,bot,id,request.id,'2026-09-03T12:00:00+02:00');
 const state=await store.inspect(),reminders=Object.values(state.outbox).filter(item=>item.kind==='reminder');
 assert.equal(reminders.length,1);
 assert.equal(reminders[0].notBefore,Date.parse('2026-09-03T08:00:00Z'));
 assert.match(reminders[0].text,/Werwolf 8, 42651 Solingen/);
 assert.match(reminders[0].text,/Europe\/Berlin/);
 const controls=sent(state).filter(item=>item.recipient==='10').at(-1).meta.reply_markup.inline_keyboard.flat();
 assert.ok(controls.some(button=>button.text==='Отменить заявку'));
 assert.ok(controls.some(button=>button.text==='🔕 Выключить напоминания'));
 assert.deepEqual(controls.find(button=>button.text==='📍 Как добраться'),{text:'📍 Как добраться',url:contacts.map});
});

test('opt-out, stop, and rescheduling cancel obsolete two-hour reminders without replay',async()=>{
 let now=Date.parse('2026-09-01T10:00:00Z');
 const store=createMemoryBotStore({clock:()=>now}),bot=createTelegramBot({store,config:cfg,verifyStaffMembership:async()=>true});
 let id=await bookWithOptIn(store,bot);
 const request=Object.values((await store.inspect()).requests)[0];
 await confirm(store,bot,id,request.id,'2026-09-03T12:00:00+02:00');
 id+=4;
 const first=Object.values((await store.inspect()).outbox).find(item=>item.kind==='reminder');
 await bot.handle(msg(id++,10,'/reminders'));
 await bot.handle(cb(id++,10,await button(store,'🔕 Выключить напоминания')));
 assert.equal((await store.inspect()).outbox[first.id].state,'cancelled');
 await bot.handle(msg(id++,10,'/reminders'));
 await confirm(store,bot,id,request.id,'2026-09-04T12:00:00+02:00');
 id+=4;
 const state=await store.inspect(),current=Object.values(state.outbox).filter(item=>item.kind==='reminder'&&item.state==='queued');
 assert.equal(current.length,1);
 assert.notEqual(current[0].id,first.id);
 await bot.handle(msg(id,10,'/stop'));
 assert.equal((await store.getRequest(request.id)).reminders.enabled,false);
 assert.ok(Object.values((await store.inspect()).outbox).filter(item=>item.kind==='reminder').every(item=>item.state==='cancelled'));
});

test('localized map buttons use canonical URL and reminders are not created less than two hours before training',async()=>{
 let now=Date.parse('2026-09-01T10:00:00Z');
 const store=createMemoryBotStore({clock:()=>now}),bot=createTelegramBot({store,config:cfg,verifyStaffMembership:async()=>true});
 const labels={de:'📍 Wegbeschreibung',ru:'📍 Как добраться',uk:'📍 Як дістатися',tr:'📍 Yol tarifi'};
 let id=1;
 for(const [locale,label] of Object.entries(labels)){
  const requestId=`locale-${locale}`,userId=String(100+id);
  await store.transactUpdate(`seed-${locale}`,tx=>tx.createRequest({id:requestId,clientChatId:userId,clientUserId:userId,locale,status:'pending',programId:'boxen',groupId:'box-15',scheduleId:'box-week',personType:'adult',contactName:'Adult Name',participantName:'Adult Name',age:21,guardianRole:'',comment:'',consentVersion:cfg.consentVersion,consentedAt:tx.now,reminders:{enabled:true},appointment:null}));
  await confirm(store,bot,id,requestId,'2026-09-03T12:00:00+02:00');
  id+=4;
  const confirmation=sent(await store.inspect()).filter(item=>item.recipient===userId).at(-1);
  const map=confirmation.meta.reply_markup.inline_keyboard.flat().find(button=>button.text===label);
  assert.deepEqual(map,{text:label,url:contacts.map});
 }
 const nearId='near';
 await store.transactUpdate('seed-near',tx=>tx.createRequest({id:nearId,clientChatId:'500',clientUserId:'500',locale:'de',status:'pending',programId:'boxen',groupId:'box-15',scheduleId:'box-week',personType:'adult',contactName:'Adult Name',participantName:'Adult Name',age:21,guardianRole:'',comment:'',consentVersion:cfg.consentVersion,consentedAt:tx.now,reminders:{enabled:true},appointment:null}));
 await confirm(store,bot,id,nearId,'2026-09-01T13:00:00+02:00');
 assert.equal(Object.values((await store.inspect()).outbox).filter(item=>item.kind==='reminder'&&item.meta.requestId===nearId).length,0);
});
