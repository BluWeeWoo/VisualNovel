import test from 'node:test';
import assert from 'node:assert/strict';
import {story} from '../src/story.js';
import {rowansLetter} from '../src/continuation.js';
import {freshState,applyChoice,visibleLines,validSave,migrateStorySave} from '../src/engine.js';
import {spriteAt} from '../src/staging.js';
import {hasRowanContact} from '../src/phone-ui.js';

test('Reading choices persist and select the correct living-room response',()=>{
 for(const [index,timing] of ['now','later'].entries()){
  const s=freshState('Kai','she');applyChoice(s,story.rEnvelope.choices[index]);
  assert.equal(s.flags.letterTiming,timing);assert.ok(validSave(JSON.parse(JSON.stringify(s)),story));
  s.node='rWaterReply';s.line=0;
  const text=visibleLines(story.rWaterReply,s).map(l=>l.text).join(' ');
  assert.equal(text.includes('I haven’t opened it.'),timing==='later');
  assert.equal(text.includes('She told you to make sure I was eating.'),timing==='now');
  s.node='rLetterLater';assert.ok(validSave(s,story));
  assert.equal(spriteAt(story,s),null);
  assert.equal(visibleLines(story.rLetterLater,s).some(l=>l.text==='This time, I open it.'),timing==='later');
 }
});
test('Letter is authored at twenty-one while Lola is alive; flashback phone remains hidden',()=>{
 const text=rowansLetter.join(' ');assert.match(text,/turned twenty-one/);assert.match(text,/hair’s long/);assert.match(text,/I miss you/);assert.match(text,/Lola made pancit/);
 const s=freshState();s.history=[{id:'rExchange:5',speaker:'',text:'I reach for my phone.'}];
 for(const node of ['rEnvelope','rReadNow','rLetterNow','rReadNowAfter','rKeepSealed','rAfterEnvelope']){s.node=node;assert.equal(hasRowanContact(s),false);assert.equal(spriteAt(story,s),null);}
});
test('Old burning and ending saves remain valid, migrate once, and can continue',()=>{
 for(const [node,line] of [['rBurning',18],['rBurning',21],['rInside',9]]){
  const s=freshState();s.storyRevision=3;s.node=node;s.line=line;s.completed=true;delete s.flags.letterTiming;
  migrateStorySave(s,story);assert.ok(validSave(s,story));assert.equal(s.flags.letterTiming,'later');
  if(node==='rInside'){assert.equal(s.completed,false);assert.equal(story[s.node].next,'rWater');}
  const once=JSON.stringify(s);migrateStorySave(s,story);assert.equal(JSON.stringify(s),once);
 }
});
