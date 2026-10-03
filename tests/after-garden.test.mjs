import test from 'node:test';
import assert from 'node:assert/strict';
import {story} from '../src/story.js';
import {afterGarden} from '../src/after-garden.js';
import {freshState,applyChoice,visibleLines,validSave,migrateStorySave} from '../src/engine.js';
import {authoredMessages,phoneCue} from '../src/phone-ui.js';
import {cgAt,spriteAt} from '../src/staging.js';
import {openingAudioCue,tracks} from '../src/opening-audio.js';

test('Every after-garden branch saves, terminates and preserves relationship state',()=>{
 const covered=new Set();let endings=0;
 function walk(s,depth=0){
  assert.ok(depth<55);const n=story[s.node];covered.add(s.node);
  for(const [i,l] of visibleLines(n,s).entries()){
   s.line=i;assert.ok(validSave(JSON.parse(JSON.stringify(s)),story),s.node);
   assert.equal(!!spriteAt(story,s),n.rowan);
   for(const layer of openingAudioCue(n,s).layers)assert.ok(tracks[layer.key]);
   if(n.time==='night')assert.ok(!openingAudioCue(n,s).layers.some(l=>l.key==='rain'));
  }
  if(n.ending){assert.equal(s.node,'aEnd');assert.equal(s.flags.rowanAffection,7);assert.equal(s.milestone,'Reacquainted');endings++;return;}
  if(n.choices)for(const c of n.choices){const next=structuredClone(s);applyChoice(next,c);walk(next,depth+1);}
  else{const next=structuredClone(s);next.node=n.next;next.line=0;walk(next,depth+1);}
 }
 const s=freshState();s.node='aWater';s.flags.rowanAffection=7;s.flags.gardenGreeting='scare';walk(s);
 assert.equal(covered.size,Object.keys(afterGarden).length);assert.ok(endings>100);
});
test('Topic menus prevent repeat conversations and permit stopping after one topic',()=>{
 assert.equal(story.aTopics0.choices.length,5);
 for(let mask=1;mask<16;mask++){
  const choices=story['aTopics'+mask].choices;
  assert.equal(choices.at(-1).next,'aEvening');
  assert.equal(choices.length,5-mask.toString(2).replaceAll('0','').length);
 }
});
test('Existing garden-ending saves continue without moving their reading position',()=>{
 const s=freshState('Mika','she');s.node='gAfter';s.flags.gardenMode='declined';s.completed=true;s.line=2;
 const before=structuredClone(s);migrateStorySave(s,story);
 assert.equal(s.node,before.node);assert.equal(s.line,before.line);assert.deepEqual(s.flags,before.flags);
 assert.equal(s.completed,false);assert.ok(validSave(s,story));assert.equal(story.gAfter.next,'aWater');
});
test('Porch illustrations and night messages appear only at their authored moments',()=>{
 const s=freshState();s.node='aTopic0_lola_notYet';s.line=0;assert.equal(cgAt(story,s),null);
 s.node='aTopic0_lola_quiet';s.line=5;assert.equal(cgAt(story,s),'after-garden-quiet');
 s.node='aGoodnight';s.line=21;assert.equal(cgAt(story,s),'after-garden-wave');
 s.node='aBedroom';s.line=6;assert.equal(phoneCue(story,s).page,'messages');
 assert.deepEqual(authoredMessages(s),[]);
 const line=story.aBedroom.lines[6];s.history.push({id:'aBedroom:6',speaker:line.speaker,text:line.text});
 assert.deepEqual(authoredMessages(s),[{sender:'rowan',text:'Goodnight, sunshine. Welcome back.',time:'21:48'}]);
 assert.ok(!authoredMessages(s).some(m=>m.text==='🐶'));
});
