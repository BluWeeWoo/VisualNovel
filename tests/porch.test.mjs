import test from 'node:test';
import assert from 'node:assert/strict';
import {story} from '../src/story.js';
import {freshState,migrateStorySave,validSave,applyChoice} from '../src/engine.js';
import {cgAt,spriteAt} from '../src/staging.js';
import {openingAudioCue} from '../src/opening-audio.js';
test('Porch CG ends before envelopes; yellow CG follows selection and all choices rejoin without relationship changes',()=>{
 const s=freshState();s.node='rLetterPromise';s.line=40;
 assert.equal(cgAt(story,s),'porch-before-letters');
 s.node='rPorchEnvelopes';s.line=0;assert.equal(cgAt(story,s),null);assert.equal(spriteAt(story,s).character,'RowanChild');
 assert.ok(openingAudioCue(story[s.node],s).layers.some(l=>l.key==='steps'));
 s.line=1;assert.equal(cgAt(story,s),null);assert.ok(openingAudioCue(story[s.node],s).layers.some(l=>l.key==='paper'));
 for(const choice of story.rPorchEnvelopes.choices){const branch=structuredClone(s);branch.flags={relationship:'friends',boundary:'space'};applyChoice(branch,choice);assert.deepEqual(branch.flags,{relationship:'friends',boundary:'space'});assert.equal(story[branch.node].next,'rYellowPromise');}
 s.node='rYellowPromise';s.line=1;assert.equal(cgAt(story,s),'yellow-envelope-promise');s.line=4;assert.equal(cgAt(story,s),null);
});
test('Every pre-revision porch save maps to a valid moment and preserves player data exactly once',()=>{
 for(let i=0;i<37;i++){
  const s=freshState('River','they');s.storyRevision=2;s.node='rLetterPromise';s.line=i;
  s.flags={relationship:'friends',boundary:'space'};s.chat=[{role:'player',text:'Keep this'}];s.history=[{id:`rLetterPromise:${i}`,speaker:'',text:'Old authored line'}];
  migrateStorySave(s,story);assert.ok(validSave(s,story));assert.deepEqual(s.flags,{relationship:'friends',boundary:'space'});assert.equal(s.chat[0].text,'Keep this');assert.equal(s.name,'River');
  const once=JSON.stringify(s);migrateStorySave(s,story);assert.equal(JSON.stringify(s),once);
 }
});
test('Porch responses retain the chosen wording after save migration',()=>{
 for(const choice of story.rPorchEnvelopes.choices){
  const s=freshState();s.storyRevision=2;s.history=[{id:'choice:rPorchEnvelopes',speaker:'You',text:choice.text}];
  migrateStorySave(s,story);assert.equal(s.history[0].text,choice.text);
 }
});
