import test from 'node:test';
import assert from 'node:assert/strict';
import {story} from '../src/story.js';
import {sceneAt,spriteAt} from '../src/staging.js';
import {freshState,visibleLines} from '../src/engine.js';
test('All return routes progress into night without mutating story or save data',()=>{
 for(const route of ['alone','wait','market']){
  const s=freshState();s.flags.afternoonRoute=route;s.flags.graveTogether=route!=='alone';
  const times=[];
  for(const node of ['c2GraveLeave',...(route==='market'?['c2Groceries']:[]),'c2Mayumi','c2FamilyArrival','c2NewEnding']){
   s.node=node;
   for(s.line=0;s.line<visibleLines(story[node],s).length;s.line++){
    const before=JSON.stringify(s);times.push(sceneAt(story,s).time);assert.equal(JSON.stringify(s),before);
   }
  }
  const rank={evening:0,twilight:1,night:2};assert.ok(times.includes('twilight'));assert.ok(times.includes('night'));
  for(let i=1;i<times.length;i++)assert.ok(rank[times[i]]>=rank[times[i-1]],route);
 }
});
test('Mayumi has authored reaction changes and previous chapters keep their backgrounds',()=>{
 const s=freshState();s.node='c2TalkTrip';s.line=3;assert.equal(spriteAt(story,s).expression,'surprised');
 s.line=4;assert.equal(spriteAt(story,s).expression,'concerned');
 for(const id of Object.keys(story).filter(id=>!id.startsWith('c2'))){s.node=id;s.line=0;assert.equal(sceneAt(story,s),story[id]);}
});

