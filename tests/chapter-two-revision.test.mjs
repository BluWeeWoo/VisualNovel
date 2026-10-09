import test from 'node:test';
import assert from 'node:assert/strict';
import {story} from '../src/story.js';
import {freshState,migrateStorySave,validSave,nextStoryNode,visibleLines} from '../src/engine.js';
import {spriteAt,cgAt} from '../src/staging.js';
test('Revised saves clamp shortened scenes and retain choices, relationships and read history',()=>{
 for(const id of Object.keys(story).filter(id=>id.startsWith('c2'))){
  const s=freshState();s.chapterTwoRevision=1;s.node=id;s.line=999;s.flags.rowanAffection=8;
  s.history=[{id:id+':999',speaker:'',text:'Previously read wording'}];
  const flags=structuredClone(s.flags);migrateStorySave(s,story);
  assert.ok(validSave(s,story),id);assert.deepEqual(s.flags,flags);assert.equal(s.history[0].text,'Previously read wording');
  const snapshot=structuredClone(s);migrateStorySave(s,story);assert.deepEqual(s,snapshot);
 }
});
test('Solitude and grocery routes cannot accidentally put Rowan at a solo grave visit',()=>{
 for(const route of ['alone','market','wait']){
  const s=freshState();s.flags.afternoonRoute=route;s.flags.graveTogether=route!=='alone';
  s.node='c2GraveTogether';assert.equal(nextStoryNode(story,s),route==='alone'?'c2Grave':'c2GraveChoice');
  s.node='c2GraveLeave';assert.equal(nextStoryNode(story,s),route==='market'?'c2Groceries':'c2Mayumi');
  const text=visibleLines(story.c2TalkVisit,s).map(l=>l.text).join(' ');
  assert.equal(text.includes('deduct it from your allowance'),route==='market');
 }
});
test('Mayumi has her own sprite and the ending stops before revealing her son’s surname',()=>{
 const s=freshState();s.node='c2Mayumi';
 assert.equal(spriteAt(story,s).character,'Mayumi');assert.equal(cgAt(story,s),'c2-review-mayumi');
 s.node='c2NewEnding';s.line=1;assert.equal(cgAt(story,s),'c2-father-dinner-interrupted');
 assert.equal(story.c2NewEnding.lines.at(-1).text,'Yeah. He called me too.');
 assert.doesNotMatch(story.c2NewEnding.lines.map(l=>l.text).join(' '),/Sanchez|mayor/i);
 for(const id of ['c2Mayumi','c2Wait','c2TVNews','c2FamilyArrival'])assert.doesNotMatch(story[id].lines.map(l=>l.text).join(' '),/\bgate\b/i);
});
