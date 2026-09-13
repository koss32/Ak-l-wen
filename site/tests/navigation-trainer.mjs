import {chromium} from 'playwright-core';
import assert from 'node:assert/strict';
import {mkdir,writeFile,readFile} from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
import path from 'node:path';
import {trainers} from '../src/data.js';
const base=process.env.TEST_BASE_URL||'http://127.0.0.1:4173';
const out='test-results/navigation-trainer';
await mkdir(out,{recursive:true});
const browser=await chromium.launch({executablePath:process.env.CHROME_PATH||'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
const issues=[],checks=[],screenshots=[];
// Wait for actual scroll settlement, not a transient active link during travel.
async function settle(p){await p.evaluate(()=>new Promise((resolve,reject)=>{let last=scrollY,stable=0,start=performance.now();function tick(){stable=Math.abs(scrollY-last)<.1?stable+1:0;last=scrollY;if(stable>=10)return resolve();if(performance.now()-start>8000)return reject(Error('scroll did not settle'));requestAnimationFrame(tick);}requestAnimationFrame(tick);}));}
async function verifyCurrent(p,id){await settle(p);assert.deepEqual(await p.locator('.nav-links [aria-current="location"]').evaluateAll(xs=>xs.map(x=>x.hash)),['#'+id]);assert.deepEqual(await p.locator('#mobile-menu [aria-current="location"]').evaluateAll(xs=>xs.map(x=>x.hash)),['#'+id]);const top=await p.locator('#'+id).evaluate(e=>e.getBoundingClientRect().top);assert.ok(top<=160&&top>=-1,`${id} anchor top ${top} must reach the active threshold`);}
async function navigate(p,id,mobile){if(mobile){await p.locator('.menu-button').click();await p.locator(`#mobile-menu [data-nav][href="#${id}"]`).click();}else await p.locator(`.nav-links [href="#${id}"]`).click();await verifyCurrent(p,id);}
async function shot(p,name){const file=`${out}/${name}.png`;await p.screenshot({path:file});screenshots.push(file);}
try{
 for(const locale of ['de','ru','uk','tr']){
  for(const mobile of [false,true]){
   const c=await browser.newContext({viewport:mobile?{width:390,height:844}:{width:1440,height:1000},reducedMotion:'reduce'}),p=await c.newPage();p.on('pageerror',e=>issues.push(e.message));await p.goto(`${base}/${locale}/`);
   for(const id of ['trainer','stundenplan','preise','kontakt','ak-loewen','valset','kampfsport','start','stundenplan'])await navigate(p,id,mobile);
   await navigate(p,'stundenplan',mobile); // Same-hash repeat must not regress.
   if(locale==='de'&&!mobile)await shot(p,'desktop-schedule-active');
   await p.goto(`${base}/${locale}/#stundenplan`);await verifyCurrent(p,'stundenplan');
   await navigate(p,'trainer',mobile);await p.goBack();await verifyCurrent(p,'stundenplan');await p.goForward();await verifyCurrent(p,'trainer');
   await p.locator('#detail-boxen summary').click();await navigate(p,'stundenplan',mobile);
   // Manual scrolling must continue to track the viewport rather than lock to hash.
   await p.locator('#preise').evaluate(e=>e.scrollIntoView({block:'start',behavior:'instant'}));await verifyCurrent(p,'preise');
   await navigate(p,'trainer',mobile);
   const trainer=trainers.find(t=>t.id==='sambo-coach'),card=p.locator('[data-trainer="sambo-coach"]');
   assert.equal(await card.locator('h3').innerText(),trainer.localizedName?.[locale]||trainer.name);
   assert.equal(await card.locator('figcaption').count(),0);
   const image=card.locator('img');await image.scrollIntoViewIfNeeded();await image.evaluate(img=>img.decode());
   assert.equal(await image.getAttribute('alt'),trainer.localizedName?.[locale]||trainer.name);
   assert.equal(await image.evaluate(img=>img.naturalWidth),1122);
   assert.equal(await image.evaluate(img=>img.naturalHeight),1402);
   const social=card.locator('a[href="https://www.instagram.com/aliyev__11/"]');assert.equal(await social.count(),1);assert.ok((await social.innerText()).includes('@aliyev__11'));assert.equal(await social.getAttribute('target'),'_blank');assert.match(await social.getAttribute('rel'),/noopener/);
   assert.equal(await p.locator('[data-trainer="anar"] figcaption').count(),1);
   assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
   await p.locator('#trainer').evaluate(e=>e.scrollIntoView({block:'start',behavior:'instant'}));await settle(p);if(locale==='de'||locale==='ru')await shot(p,`${mobile?'phone':'desktop'}-${locale}-trainer`);
   await c.close();checks.push(`${locale} ${mobile?'mobile':'desktop'}: every menu target, repeated click, direct hash, back/forward, disclosure, manual scroll, supplied portrait/profile`);
  }
 }
 const c=await browser.newContext({viewport:{width:1440,height:1000}}),p=await c.newPage();p.on('pageerror',e=>issues.push(e.message));await p.goto(base+'/de/');
 for(const id of ['stundenplan','trainer','preise','stundenplan'])await navigate(p,id,false);
 await p.locator('.site-header [data-locale="ru"]').click();await p.waitForFunction(()=>document.documentElement.lang==='ru');await navigate(p,'stundenplan',false);
 await c.close();checks.push('normal smooth scrolling and locale switch: correct settled highlight');
 const f=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce'}),fp=await f.newPage();fp.on('pageerror',e=>issues.push(e.message));
 // Inspect the built file offline; no server asset fallback can hide a missing image.
 await f.route('http://**',r=>r.abort());await f.route('https://**',r=>r.abort());
 await fp.goto(pathToFileURL(path.resolve('dist/ak-loewen-valset-v1.html')).href);
 for(const locale of ['de','ru','uk','tr']){if(locale!=='de'){await fp.locator(`.site-header [data-locale="${locale}"]`).click();await fp.waitForFunction(l=>document.documentElement.lang===l,locale);}await navigate(fp,'stundenplan',false);const img=fp.locator('[data-trainer="sambo-coach"] img');assert.match(await img.getAttribute('src'),/^data:image\/jpeg;base64,/);await img.evaluate(i=>i.decode());assert.equal(await img.evaluate(i=>i.naturalWidth),1122);}
 const response=await fetch(base+'/assets/namag-aliyev.jpg');assert.equal(response.status,200);assert.deepEqual(Buffer.from(await response.arrayBuffer()),await readFile('public/assets/namag-aliyev.jpg'));
 await f.close();checks.push('offline standalone: four locales, embedded portrait, active navigation; original image bytes served');
 assert.deepEqual(issues,[]);console.log(JSON.stringify({checks,screenshots,issues},null,2));
}catch(error){issues.push(error.stack||String(error));throw error;}finally{await writeFile(`${out}/report.json`,JSON.stringify({passed:issues.length===0,checks,screenshots,issues},null,2));await browser.close();}
