import test from 'node:test';
import assert from 'node:assert/strict';
import {story} from '../src/story.js';
import {freshState} from '../src/engine.js';
import {cgAt} from '../src/staging.js';

test('Lunch CG stays through choices and every seated branch without mutating saves',()=>{
 for(const [node,from,until] of [
  ['c2LunchMeal','He sits across from me.',null],
  ['c2Wait',null,'After lunch, he picks up the shopping bags.'],
  ['c2Market',null,'We clean up and prepare to go to the market.'],
  ['c2AloneGrave',null,'He reaches for the shopping bags.']
 ]){
  const s=freshState();s.node=node;
  const lines=story[node].lines;
  const a=from?lines.findIndex(l=>l.text===from):0,b=until?lines.findIndex(l=>l.text===until):lines.length;
  assert.ok(a>=0&&b>a);
  for(let i=a;i<b;i++){
   s.line=i;const before=structuredClone(s);
   assert.match(cgAt(story,s),/^summer-lunch/,node+':'+i);
   assert.deepEqual(s,before);
  }
  if(until){s.line=b;assert.equal(cgAt(story,s),null);}
 }
});
test('Lunch expressions match emotional cues including resumed choice screen',()=>{
 for(const [node,text,expected] of [
  ['c2LunchMeal','He notices.','worried'],
  ['c2LunchMeal','Hey, Ro?','attentive'],
  ['c2LunchMeal','She used to ask what you’d want to eat when you came ba—','wistful'],
  ['c2Wait','Right.','embarrassed'],
  ['c2Market','Another lutang moment. Haha. Sorry.','embarrassed'],
  ['c2AloneGrave','Well, I really wanted to come.','wistful']
 ]){
  const s=freshState();s.node=node;s.line=story[node].lines.findIndex(l=>l.text===text);
  assert.ok(s.line>=0);assert.equal(cgAt(story,s),'summer-lunch-'+expected);
 }
 const s=freshState();s.node='c2LunchMeal';s.line=story[s.node].lines.length-1;
 assert.equal(story[s.node].choices.length,3);
 assert.equal(cgAt(story,s),'summer-lunch-attentive');
});
