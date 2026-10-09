import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {story} from '../src/story.js';
import {freshState,migrateStorySave,validSave,visibleLines,nextStoryNode} from '../src/engine.js';
import {cgAt,spritesAt,sceneAt} from '../src/staging.js';

test('Old dinner endpoint saves continue at the same line with choices and history intact',()=>{
 const s=freshState();s.node='c2NewEnding';s.line=3;s.completed=true;
 s.flags={graveTogether:false,workshopVisited:true,rowanAffection:7};
 s.history=[{id:'c2NewEnding:3',speaker:'Rowan',text:'Yeah. He called me too.'}];
 const before=structuredClone(s);migrateStorySave(s,story);
 assert.equal(s.node,before.node);assert.equal(s.line,3);assert.equal(s.completed,false);
 assert.deepEqual(s.flags,before.flags);assert.deepEqual(s.history,before.history);
 assert.ok(validSave(s,story));assert.equal(nextStoryNode(story,s),'c2FatherDinner');
});
test('Dinner remembers workshop and market routes without exposing both branches',()=>{
 const s=freshState();s.node='c2FatherOffer';
 for(const visited of [false,true]){
  s.flags.workshopVisited=visited;const text=visibleLines(story[s.node],s).map(l=>l.text).join('\n');
  assert.equal(text.includes('apprenticeship in Manila'),visited);
  assert.equal(text.includes('Not yet.'),!visited);
 }
 s.node='c2FatherDinner';s.flags.afternoonRoute='market';
 let text=visibleLines(story[s.node],s).map(l=>l.text).join('\n');
 assert.match(text,/calling him at the market/);assert.doesNotMatch(text,/appeared on the news/);
 s.flags.afternoonRoute='home';text=visibleLines(story[s.node],s).map(l=>l.text).join('\n');
 assert.match(text,/appeared on the news/);assert.doesNotMatch(text,/calling him at the market/);
});
test('Approved flashbacks use their art without adult sprites; present resumes in kitchen',()=>{
 const manifest=JSON.parse(fs.readFileSync(new URL('../assets/manifest.json',import.meta.url)));
 for(const id of ['c2BirthdayDinner','c2BirthdayWish','c2BirthdayGiftSetup','c2CardiganGifts','c2BirthdayStairs','c2FatherReveal']){
  const s=freshState();s.node=id;assert.equal(story[id].viewpoint,'Rowan');assert.deepEqual(spritesAt(story,s),[]);
  for(let i=0;i<story[id].lines.length;i++){
   s.line=i;assert.ok(validSave(s,story));const key=cgAt(story,s);
   if(key)assert.ok(fs.existsSync(manifest.cgs[key].src));
  }
 }
 const s=freshState();s.node='c2FatherPresent';assert.equal(sceneAt(story,s).place,'c2-father-kitchen-night');
 assert.equal(cgAt(story,s),null);assert.equal(spritesAt(story,s).length,1);
 assert.equal(story[s.node].lines.at(-1).text,'I’m listening, Ro.');
});
