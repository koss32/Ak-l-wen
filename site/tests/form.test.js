import test from 'node:test';
import assert from 'node:assert/strict';
import {randomUUID} from 'node:crypto';
import {validateRequest} from '../server/validate-request.js';
import {legal} from '../src/data.js';
const payload=overrides=>({name:'Test Person',age:18,directionId:'boxen',groupId:'box-15',locale:'de',consent:true,consentVersion:legal.consentVersion,requestId:randomUUID(),...overrides});
test('exactly one valid contact is sufficient',()=>{
 for(const contact of [{email:'test@example.com'},{phone:'+491511234567'},{telegram:'@test_person'}])assert.ok(validateRequest(payload(contact)).data);
 assert.equal(validateRequest(payload({})).error,'contact');
 assert.equal(validateRequest(payload({email:'bad',telegram:'test_person'})).error,'email');
});
test('names use the specification bounds and comments reject control bytes',()=>{
 for(const length of [2,80])assert.ok(validateRequest(payload({name:'a'.repeat(length),email:'test@example.com'})).data);
 for(const length of [1,81])assert.equal(validateRequest(payload({name:'a'.repeat(length),email:'test@example.com'})).error,'name');
 for(const comment of ['x'.repeat(1001),'bad\0value'])assert.equal(validateRequest(payload({email:'test@example.com',comment})).error,'comment');
 assert.ok(validateRequest(payload({email:'test@example.com',comment:'Line one\nLine two'})).data);
});
test('preferred time must belong to the selected confirmed group',()=>{
 assert.ok(validateRequest(payload({telegram:'test_person',preferredTime:'box-week'})).data);
 assert.equal(validateRequest(payload({telegram:'test_person',preferredTime:'sambo-adult-week'})).error,'preferredTime');
});
test('input projection drops role and administrative fields',()=>{
 const {data}=validateRequest(payload({telegram:'@test_person',role:'Owner',chatId:'123',comment:' note '}));
 assert.equal(data.role,undefined);assert.equal(data.chatId,undefined);assert.equal(data.telegram,'test_person');assert.equal(data.comment,'note');
});
