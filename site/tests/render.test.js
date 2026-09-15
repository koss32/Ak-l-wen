import test from 'node:test';
import assert from 'node:assert/strict';
import {render} from '../src/render.js';

test('VALSET hero entry introduces the dedicated section before booking',()=>{
 for(const locale of ['de','ru','uk','tr']){
  const html=render(locale,'',false,'');
  assert.match(html,/<article class="entry-card b">.*?<a href="#valset" class="btn valset-btn"/);
  assert.match(html,/<section id="valset"[\s\S]*?<a href="#probetraining" class="btn valset-btn" data-direction="valset"/);
 }
});
