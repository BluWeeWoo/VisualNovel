import test from 'node:test';
import assert from 'node:assert/strict';
import {story} from '../src/story.js';
import {freshState,migrateStorySave,validSave,visibleLines,applyChoice,refreshAuthoredHistory} from '../src/engine.js';

test('Revision six resumes rewritten scenes and preserves player data exactly once',()=>{
 for(const node of ['d2Call','d2Hug','d2Missed','aWater','aNews','aPorch','aTopic0_lola_yes','aTopic14_lola_yes','aTopic0_lola_quiet']){
  for(let line=0;line<40;line++){
   const s=freshState('Mika','she');s.storyRevision=5;s.node=node;s.line=line;
   s.flags={bedroomAffection:'hug',rowanAffection:8,gardenMode:'declined'};
   s.history=[{id:`${node}:${line}`,speaker:'',text:'Previously read wording.'}];
   s.chat=[{role:'player',text:'Keep this message.'}];
   const flags=structuredClone(s.flags),chat=structuredClone(s.chat);
   migrateStorySave(s,story);assert.ok(validSave(s,story),`${node}:${line}`);
   assert.deepEqual(s.flags,flags);assert.deepEqual(s.chat,chat);
   refreshAuthoredHistory(s,story);assert.equal(s.history[0].text,'Previously read wording.');
   const once=structuredClone(s);migrateStorySave(s,story);assert.deepEqual(s,once);
  }
 }
});
test('Unchanged lines and completed chapter saves keep their positions',()=>{
 const s=freshState();s.storyRevision=5;s.node='d2Hug';s.line=3;
 s.history=[{id:'d2Hug:3',speaker:'',text:'He crosses the room. His arms close around me.'}];
 migrateStorySave(s,story);assert.equal(story[s.node].lines[s.line].text,s.history[0].text);
 s.storyRevision=5;s.node='aEnd';s.line=2;s.completed=true;migrateStorySave(s,story);
 assert.equal(s.node,'aEnd');assert.equal(s.line,2);assert.equal(s.completed,true);
});
test('Garden dialogue respects declining and preserves existing affection',()=>{
 for(const mode of ['timed','untimed','declined']){
  const s=freshState();s.flags.gardenMode=mode;
  const text=visibleLines(story.aWater,s).map(l=>l.text).join(' ');
  assert.equal(text.includes('You made me weed.'),mode!=='declined');
 }
 const s=freshState();s.flags.rowanAffection=8;
 applyChoice(s,story.gChallenge.choices[2]);assert.equal(s.flags.rowanAffection,8);
});
