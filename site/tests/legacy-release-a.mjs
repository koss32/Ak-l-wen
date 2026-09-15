import {chromium} from 'playwright-core';
import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
const base=process.env.TEST_BASE_URL||'http://127.0.0.1:4173';
const browser=await chromium.launch({executablePath:process.env.CHROME_PATH||'C:/Program Files/Google/Chrome/Application/chrome.exe'});
const issues=[],checks=[];await mkdir('test-results/release-a',{recursive:true});
try{
 for(const width of [360,390,768,1024,1440]){
  const context=await browser.newContext({viewport:{width,height:900}});const p=await context.newPage();
  p.on('pageerror',e=>issues.push({width,error:e.message}));p.on('console',m=>{if(m.type()==='error')issues.push({width,console:m.text()});});
  for(const lang of ['de','ru','uk','tr']){
   await p.goto(`${base}/${lang}/`);await p.waitForFunction(()=>!document.querySelector('#submit-trial').disabled);
   assert.equal(await p.locator('.site-header [data-locale][aria-current]').count(),1);
   assert.equal(await p.locator('[data-schedule-row]:visible').count(),0);await p.locator('.schedule-picker>summary').click();
   assert.equal(await p.locator('[data-schedule-row]:visible').count(),8);
   for(const section of ['start','trainer','stundenplan','preise','probetraining','valset']){
    await p.locator('#'+section).scrollIntoViewIfNeeded();await p.waitForTimeout(200);
    const overflow=await p.evaluate(()=>[...document.querySelectorAll('main *')].filter(e=>{const r=e.getBoundingClientRect(),s=getComputedStyle(e);return r.width&&r.right>innerWidth+1&&s.position!=='absolute'&&s.position!=='fixed'&&s.display!=='none'&&!e.closest('[hidden]');}).map(e=>({tag:e.tagName,cls:e.className,right:e.getBoundingClientRect().right})));
    assert.deepEqual(overflow,[],`${width} ${lang} ${section}: overflow`);
    if(lang==='de'&&(width===390||width===1440))await p.screenshot({path:`test-results/release-a/${width}-${section}.png`});
   }
   await p.selectOption('#schedule-brand','valset');assert.equal(await p.locator('[data-schedule-row]:visible').count(),3);
   await p.selectOption('#schedule-direction','boxen');assert.equal(await p.locator('[data-schedule-row]:visible').count(),0);assert.ok(await p.locator('#schedule-empty').isVisible());
   await p.selectOption('#schedule-direction','all');await p.selectOption('#schedule-brand','ak');
   await p.locator('[data-schedule-row][data-direction-id="sambo-mma"] a').first().click();
   assert.equal(await p.inputValue('#directionId'),'sambo-mma');assert.equal(await p.inputValue('#groupId'),'sambo-9-15');
  }
  checks.push(`${width}px: four locales, section overflow, filter results/empty state, booking preselection`);
  await context.close();
 }
 const c=await browser.newContext({viewport:{width:390,height:844}}),p=await c.newPage();p.on('pageerror',e=>issues.push({error:e.message}));await p.goto(base+'/de/');
 await p.fill('#name','Test Person');await p.locator('.schedule-picker>summary').click();await p.selectOption('#schedule-brand','valset');
 for(const lang of ['ru','uk','tr','de']){await p.locator(`.site-header [data-locale="${lang}"]`).click();await p.waitForFunction(l=>document.documentElement.lang===l,lang);assert.equal(await p.locator('.site-header [data-locale][aria-current]').count(),1);assert.equal(await p.inputValue('#name'),'Test Person');assert.equal(await p.inputValue('#schedule-brand'),'valset');assert.equal(await p.locator('[data-schedule-row]:visible').count(),3);}
 await p.locator('.telegram-booking').click();assert.ok(await p.locator('#question-dialog').isVisible());assert.equal(await p.locator('#question-dialog a').getAttribute('href'),'https://t.me/ak_loewenbot?start=site_question');
 for(let i=0;i<6;i++){await p.keyboard.press('Tab');assert.ok(await p.evaluate(()=>document.querySelector('#question-dialog').contains(document.activeElement)));}
 await p.keyboard.press('Escape');assert.ok(await p.locator('.telegram-booking').evaluate(e=>e===document.activeElement));
 checks.push('Locale changes retain form/filter state; one active locale; Telegram dialog traps/restores focus');
 for(const lang of ['de','ru','uk','tr'])for(const page of ['impressum','datenschutz']){const r=await p.goto(`${base}/${lang}/${page}/`);assert.equal(r.status(),200);assert.ok(await p.locator('main h1').isVisible());}
 checks.push('Eight legal placeholder routes accessible');await c.close();
 assert.deepEqual(issues,[]);await writeFile('test-results/release-a/report.json',JSON.stringify({checks,issues},null,2));console.log(JSON.stringify({checks,issues},null,2));
}finally{await browser.close();}
