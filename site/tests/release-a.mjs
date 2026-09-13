import {chromium} from 'playwright-core';
import assert from 'node:assert/strict';
import {mkdir,writeFile,readFile} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import {programs,groups,schedules,trainers,legal} from '../src/data.js';
import {translations} from '../src/locales.js';
const base=process.env.TEST_BASE_URL||'http://127.0.0.1:4173';
const out='test-results/release-a-extra';
await mkdir(out,{recursive:true});
const browser=await chromium.launch({executablePath:process.env.CHROME_PATH||'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
const checks=[],issues=[],shots=[];
async function context(options={}){const c=await browser.newContext(options);await c.addInitScript(()=>{Element.prototype.requestPointerLock=()=>{};Element.prototype.setPointerCapture=()=>{};Element.prototype.releasePointerCapture=()=>{};});return c;}
function watch(p){p.on('pageerror',e=>issues.push(e.message));}
async function shot(p,name){const file=`${out}/${name}.png`;await p.screenshot({path:file});shots.push(file);}
try{
 const css=await readFile('public/style.css','utf8');
 assert.match(css,/--accent:#E85A22;/);assert.match(css,/--accent-light:#C4501E;/);assert.match(css,/--accent-hover:#FF7A3D;/);assert.doesNotMatch(css,/#fe4123/i);
 const original=execFileSync('git',['show','e82e4692dc89e76d68684ef838d2c44c7044207c:site/public/client.js'],{encoding:'utf8'});
 const current=await readFile('public/client.js','utf8');
 const motion=s=>s.slice(s.indexOf(' // ScrollCraft supplies')).replaceAll('\r\n','\n');
 assert.equal(motion(current),motion(original),'existing choreography and reveal initialization must remain unchanged');
 assert.equal(legal.publicationStatus,'pending');assert.equal(legal.entityName,'AK-LOEWEN gGmbH');
 checks.push('approved palette, unchanged choreography/reveal code, publication remains pending');
 for(const locale of ['de','ru','uk','tr']){
  const c=await context({viewport:{width:390,height:844},reducedMotion:'reduce'}),p=await c.newPage();watch(p);await p.goto(`${base}/${locale}/`);
  assert.equal(await p.locator('html').getAttribute('lang'),locale);
  assert.equal(await p.locator('meta[name="robots"]').getAttribute('content'),'noindex,nofollow');
  assert.equal(await p.locator('#trial-form').getAttribute('data-live'),'false');
  assert.equal(await p.locator('#stundenplan .schedule-row').count(),groups.length);
  assert.equal(await p.locator('#stundenplan .time-row').count(),schedules.length);
  for(const g of groups){const row=p.locator(`[data-schedule-group="${g.id}"]`);for(const id of g.scheduleIds){const s=schedules.find(x=>x.id===id),text=await row.innerText();assert.ok(text.includes(s.startTime)&&text.includes(s.endTime));for(const d of s.weekdayIds)assert.ok(text.includes(translations[locale].weekdays[d]));if(s.byArrangement)assert.ok(text.includes(translations[locale].arrangement));}}
  for(const program of programs)assert.ok((await p.locator('#preise').innerText()).includes(String(program.monthlyPriceEUR)));
  assert.equal(await p.locator('.trainer-card').count(),trainers.length);
  assert.ok((await p.locator('#trainer').innerText()).includes('Anar Karimov'));
  assert.ok((await p.locator('#trainer').innerText()).includes(translations[locale].coachName));
  assert.equal(await p.locator('.trainer-image figcaption').count(),2);
  assert.ok((await p.locator('#kontakt').innerText()).includes(legal.entityName));
  for(const width of [320,360,390,540,541,768,800,801,1024,1190,1191,1440]){
   await p.setViewportSize({width,height:900});
   const bad=await p.evaluate(()=>[...document.querySelectorAll('main *,header *,footer *')].filter(e=>{const r=e.getBoundingClientRect(),s=getComputedStyle(e);return r.width>0&&r.height>0&&s.position!=='absolute'&&s.position!=='fixed'&&!e.closest('dialog')&&(r.right>innerWidth+1||r.left< -1);}).map(e=>({tag:e.tagName,cls:e.className,right:e.getBoundingClientRect().right,left:e.getBoundingClientRect().left})));
   assert.deepEqual(bad,[],`${locale} ${width}px overflowing content`);
   assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`${locale} ${width}px page overflow`);
  }
  await p.setViewportSize({width:360,height:800});
  for(const id of ['start','trainer','stundenplan','preise','probetraining','valset']){await p.locator('#'+id).evaluate(e=>e.scrollIntoView({block:'start',behavior:'instant'}));await shot(p,`${locale}-${id}`);}
  assert.ok(await p.locator('#name').evaluate(e=>parseFloat(getComputedStyle(e).fontSize)>=16));
  assert.ok(await p.locator('.menu-button').evaluate(e=>e.getBoundingClientRect().height>=44));
  assert.ok(await p.locator('.hero .btn').evaluate(e=>e.getBoundingClientRect().height>=56));
  const adult=p.locator('[data-schedule-group="sambo-16"] a');await adult.click();assert.equal(await p.locator('#groupId').inputValue(),'sambo-16');
  await p.locator('[data-schedule-group="val-mama"] a').click();assert.equal(await p.locator('#groupId').inputValue(),'val-mama');assert.equal(await p.locator('#ak-fields').isVisible(),false);
  for(const page of ['impressum','datenschutz']){const r=await p.request.get(`${base}/${locale}/${page}/`);assert.equal(r.status(),200);const text=await r.text();assert.ok(text.includes(legal.entityName));assert.ok(text.includes('noindex,nofollow'));}
  await c.close();checks.push(`${locale}: 12 widths 320–1440px, all 6 groups/8 time records, 2 legal routes, schedule booking, touch/input sizing`);
 }
 const c=await context({viewport:{width:390,height:844},reducedMotion:'reduce'}),p=await c.newPage();watch(p);await p.goto(base+'/de/');
 await p.keyboard.press('Tab');assert.equal(await p.locator('.skip-link').evaluate(e=>document.activeElement===e),true);await p.keyboard.press('Enter');await p.waitForFunction(()=>document.activeElement.id==='main');
 await p.locator('.menu-button').click();await p.locator('#mobile-menu a[href="#trainer"]').click();await p.waitForFunction(()=>document.activeElement.matches('#trainer h2'));assert.equal(await p.locator('#mobile-menu').evaluate(e=>e.open),false);
 await p.locator('.menu-button').click();await p.keyboard.press('Escape');assert.equal(await p.locator('.menu-button').evaluate(e=>document.activeElement===e),true);
 await p.locator('#directionId').selectOption('sambo-mma');await p.locator('#submit-trial').click();assert.equal(await p.locator('#groupId').getAttribute('aria-invalid'),'true');await p.locator('#groupId').selectOption('sambo-9-15');assert.equal(await p.locator('#groupId').getAttribute('aria-invalid'),'false');
 await p.locator('#name').fill('Review Test');await p.locator('#email').fill('review@example.com');await p.locator('#phone').fill('+491511234567');await p.locator('#age').fill('16');await p.locator('#consent').check();await p.locator('#submit-trial').click();await p.locator('#apply-group').click();assert.equal(await p.locator('#groupId').inputValue(),'sambo-16');assert.equal(await p.locator('#groupId').evaluate(e=>document.activeElement===e),true);assert.equal(await p.locator('#age').getAttribute('aria-invalid'),'false');
 let posts=0;p.on('request',r=>{if(r.method()==='POST')posts++;});
 for(const locale of ['ru','uk','tr','de']){await p.locator(`.site-header [data-locale="${locale}"]`).click();await p.waitForFunction(l=>document.documentElement.lang===l,locale);for(const switcher of ['.site-header .languages','#mobile-menu .languages']){assert.equal(await p.locator(switcher+' [aria-current]').count(),1);assert.equal(await p.locator(switcher+' [aria-current]').getAttribute('data-locale'),locale);}assert.equal(await p.locator('#name').inputValue(),'Review Test');assert.equal(await p.locator('#groupId').inputValue(),'sambo-16');assert.equal(await p.locator('#consent').isChecked(),true);await p.locator('#submit-trial').click();}
 assert.equal(posts,0);
 const transform=await p.locator('.glove-near').evaluate(e=>getComputedStyle(e).transform);await p.evaluate(()=>scrollTo({top:0,behavior:'instant'}));await p.waitForTimeout(120);assert.equal(await p.locator('.glove-near').evaluate(e=>getComputedStyle(e).transform),transform);
 await c.close();checks.push('keyboard skip/menu/Escape focus, corrected field errors, age suggestion focus, unique locale markers, retained data, demo zero POST, static reduced-motion gloves');
 const m=await context({viewport:{width:1440,height:1000}}),mp=await m.newPage();watch(mp);await mp.goto(base+'/de/');await mp.waitForTimeout(160);
 assert.ok(await mp.evaluate(()=>window.ScrollCraft.instances.length>0));const first=await mp.locator('.glove-near').evaluate(e=>e.style.transform);const count=await mp.locator('.motion-in').count();
 await mp.locator('.site-header [data-locale="ru"]').click();await mp.waitForFunction(()=>document.documentElement.lang==='ru');assert.equal(await mp.locator('.motion-in').count(),count);
 await mp.evaluate(()=>scrollTo({top:400,behavior:'instant'}));await mp.waitForTimeout(600);assert.notEqual(await mp.locator('.glove-near').evaluate(e=>e.style.transform),first);
 await mp.locator('#trainer').evaluate(e=>e.scrollIntoView({behavior:'instant'}));await mp.waitForTimeout(700);assert.equal(await mp.locator('.trainer-card.is-visible').count(),2);
 await m.close();checks.push('ScrollCraft mounted, normal-motion gloves move, locale morph retains reveals, trainer reveals remain visible');
 const f=await context({viewport:{width:320,height:900},forcedColors:'active',reducedMotion:'reduce'}),fp=await f.newPage();watch(fp);await fp.goto(base+'/de/');await fp.locator('.hero .btn').focus();assert.ok(await fp.locator('.hero .btn').evaluate(e=>getComputedStyle(e).outlineStyle!=='none'));await shot(fp,'forced-colors');await f.close();
 const n=await context({viewport:{width:390,height:844},javaScriptEnabled:false}),np=await n.newPage();await np.goto(base+'/de/');assert.equal(await np.locator('#stundenplan .time-row').count(),8);assert.equal(await np.locator('#submit-trial').isDisabled(),true);await n.close();checks.push('forced-colors keyboard focus and readable no-JavaScript schedule');
 assert.deepEqual(issues,[]);
 console.log(JSON.stringify({checks,screenshots:shots.length,issues},null,2));
}finally{await writeFile(`${out}/report.json`,JSON.stringify({checks,shots,issues},null,2));await browser.close();}
