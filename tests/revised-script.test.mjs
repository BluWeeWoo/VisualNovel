import test from 'node:test';
import assert from 'node:assert/strict';
import {story} from '../src/story.js';
import {freshState,applyChoice,visibleLines,nextStoryNode,migrateStorySave,validSave} from '../src/engine.js';
import {phoneCue,authoredMessages,hasRowanContact} from '../src/phone-ui.js';

test('New playthrough reaches the house before the rainy flashback and returns to water',()=>{
 const s=freshState();s.node='rGreeting';const visited=[];
 while(!story[s.node].ending&&visited.length<70){
  visited.push(s.node);
  if(story[s.node].choices)applyChoice(s,story[s.node].choices[0]);
  else s.node=nextStoryNode(story,s);
 }
 assert.equal(s.node,'rLetterLaterAfter');
 assert.ok(visited.indexOf('rReturn')<visited.indexOf('rInside'));
 assert.ok(visited.indexOf('rInside')<visited.indexOf('rBedroom'));
 assert.equal(visited[visited.indexOf('rAfterEnvelope')+1],'rWater');
 assert.equal(new Set(visited).size,visited.length);
});

test('Revision-four saves complete the old order without repeating the flashback or losing choices',()=>{
 for(const start of ['rBedroom','rEnvelope','rReturn','rInside','rWater']){
  const s=freshState('Kai','she');s.storyRevision=4;s.node=start;
  s.flags.greeting='normal';s.flags.yellowPromise='words';s.flags.letterTiming='now';
  migrateStorySave(s,story);assert.ok(validSave(s,story));
  const visited=[];
  while(!story[s.node].ending&&visited.length<70){
   visited.push(s.node);
   if(story[s.node].choices)applyChoice(s,story[s.node].choices[0]);
   else s.node=nextStoryNode(story,s);
  }
  assert.equal(s.node,'rLetterLaterAfter');assert.equal(new Set(visited).size,visited.length);
  if(['rReturn','rInside','rWater'].includes(start))assert.ok(!visited.includes('rBedroom'));
  assert.equal(s.name,'Kai');assert.equal(s.flags.yellowPromise,'words');
 }
});

test('Childhood reply shapes the present-day phone without revealing future messages',()=>{
 const s=freshState();applyChoice(s,story.rPorchEnvelopes.choices[2]);
 s.node='rReturn';s.line=visibleLines(story.rReturn,s).findIndex(l=>l.speaker==='You · text');
 assert.ok(s.line>=0);assert.equal(phoneCue(story,s).page,'messages');
 assert.deepEqual(authoredMessages(s),[]);
 s.history.push({id:`rReturn:${s.line}`,speaker:'You · text',text:'Made it here.'});
 assert.deepEqual(authoredMessages(s),[{text:'Made it here.',sender:'player',time:'16:42'}]);
 for(const node of ['rLetterPromise','rPorchEnvelopes','rYellowWords','rYellowPromise']){
  s.node=node;assert.equal(hasRowanContact(s),false);
 }
});
