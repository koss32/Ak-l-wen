import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {legal} from '../src/data.js';

const notice=await readFile(new URL('../public/telegram-privacy/index.html',import.meta.url),'utf8');
const approved=await readFile(new URL('../../privacy/telegram-privacy-approved.md',import.meta.url),'utf8');

test('Telegram privacy notice carries the approved version and controller details',()=>{
 const version=approved.match(/telegram-\d{4}-\d{2}-\d{2}-v\d+/)?.[0];
 assert.ok(version,'the approved source must identify its consent version');
 assert.ok(notice.includes(`name="privacy-consent-version" content="${version}"`));
 for(const value of [legal.entityName,legal.manager,legal.registeredAddress,'HRB 36478','Amtsgericht Wuppertal','aklggmbh@gmail.com']){
  assert.ok(value&&approved.includes(value),`approved source contains ${value}`);
  assert.ok(notice.includes(value),`public notice contains ${value}`);
 }
 for(const value of ['Werwolf 8, 42651 Solingen','/stop','/cancel','/reminders'])assert.ok(notice.includes(value));
 assert.doesNotMatch(notice,/ENTWURF|draft-2026-09-11|Открытые вопросы перед публикацией|VOM VERANTWORTLICHEN ZU ERGÄNZEN/);
});

test('Telegram privacy page has accessible DE/RU navigation without active data collection',()=>{
 assert.match(notice,/<meta\s+name="viewport"/);
 for(const locale of ['de','ru']){
  assert.ok(notice.includes(`href="#${locale}"`));
  assert.match(notice,new RegExp(`<(?:section|article)\\b(?=[^>]*\\bid="${locale}")(?=[^>]*\\blang="${locale}")`));
 }
 assert.doesNotMatch(notice,/<(?:script|form|iframe|img)\b/i);
 assert.doesNotMatch(notice,/<link\b[^>]*rel=["']stylesheet["']/i);
});
