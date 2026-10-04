import test from 'node:test';
import assert from 'node:assert/strict';
import {freshState,interpolate,validSave,chatContext} from '../src/engine.js';
import {story} from '../src/story.js';
import {defaultProfile} from '../assets/player-identity.js';
import {normalizeContext} from '../src/provider-policy.js';
test('Custom pronouns survive saves and reach story references and chat context',()=>{
 const profile={...defaultProfile(),pronouns:'custom',portrait:'none',customPronouns:{subject:'xe',object:'xem',possessive:'xyr',possessivePronoun:'xyrs',reflexive:'xemself',plural:false}};
 const s=JSON.parse(JSON.stringify(freshState('Mika','custom',profile)));
 assert.ok(validSave(s,story));assert.equal(s.portrait,'none');
 assert.equal(interpolate('{name}: {subject} {be} here; {object}, {possessive}, {possessivePronoun}, {reflexive}, {have}.',s),'Mika: xe is here; xem, xyr, xyrs, xemself, has.');
 assert.deepEqual(normalizeContext(chatContext(s)).customPronouns,profile.customPronouns);
 s.customPronouns.subject='<script>';assert.equal(validSave(s,story),false);
});
test('Existing pronoun saves remain valid and identity never changes relationship flags',()=>{
 for(const pronouns of ['he','she','they']){const s=freshState('Alex',pronouns);delete s.gender;delete s.portrait;assert.ok(validSave(s,story));assert.deepEqual(s.flags,{letterTiming:'later'});assert.equal(s.milestone,'Reacquainted');}
 assert.equal(interpolate('{subject} {be} here and {have} a letter.',freshState()),'they are here and have a letter.');
});
