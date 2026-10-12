import test from 'node:test';
import assert from 'node:assert/strict';
import {story} from '../src/story.js';
import {freshState,nextStoryNode,applyChoice,migrateStorySave} from '../src/engine.js';
import {surnameRevealed} from '../src/chapter-two-ending.js';
test('Both support choices and skip reach the correct ending without relationship changes',()=>{
 for(const skip of [false,true])for(const support of [0,1])for(const sevi of [false,true]){
  const s=freshState();s.node='c2KitchenListen';s.flags={rowanAffection:7,seviDescription:sevi?'something':'friend'};
  const before=structuredClone(s.flags);const visited=[];
  for(let i=0;i<80;i++){
   const n=story[s.node];visited.push(s.node);
   s.history.push(...n.lines.map((l,j)=>({id:`${s.node}:${j}`,speaker:l.speaker||'',text:l.text})));
   if(n.ending)break;
   if(n.choices)applyChoice(s,n.choices[s.node==='c2KitchenListen'?(skip?1:0):support]);
   else{s.node=nextStoryNode(story,s);s.line=0;}
  }
  assert.equal(s.node,skip?'c2EndQuiet':'c2EndKnown');
  assert.equal(visited.includes('c2EndSevi'),sevi);
  assert.equal(visited.includes('c2EndConfrontation'),!skip);
  assert.deepEqual(s.flags,before);
  assert.equal(surnameRevealed(s),!skip);
 }
});
test('Former ending saves resume and surname stays hidden until closing line',()=>{
 const s=freshState();s.node='c2FatherPresent';s.line=3;s.completed=true;
 migrateStorySave(s,story);assert.equal(s.line,3);assert.equal(s.completed,false);
 assert.equal(surnameRevealed(s),false);s.node='c2EndKnown';s.line=0;
 assert.equal(surnameRevealed(s),false);s.line=6;assert.equal(surnameRevealed(s),true);
});
