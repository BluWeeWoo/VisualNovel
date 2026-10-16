import test from 'node:test';
import assert from 'node:assert/strict';
import {story} from '../src/story.js';
import {freshState,visibleLines,nextStoryNode,applyChoice,refreshAuthoredHistory,validSave} from '../src/engine.js';
import {confirmFeeling,rememberFeelingLine} from '../src/rowan-feelings.js';
import {cgAt} from '../src/staging.js';
const make=feeling=>freshState('Alex','they',{rowanFeeling:feeling});
const text=(id,s)=>visibleLines(story[id],s).map(l=>l.text);

test('Each feeling has an exclusive response; rest and boundaries remain player choices',()=>{
 const expected=['I want to catch up properly.','You’re my friend, Ro.','I thought I was being pretty obvious.','I care about how you’re doing, Ro.'];
 ['Uncertain','Familiar','Drawn to You','In Love'].forEach((f,i)=>{
  const s=make(f),lines=text('c2KitchenSeeYou',s);
  assert.equal(lines.filter(t=>t.startsWith('Yeah. To see you.')).length,1);
  assert.ok(lines[0].includes(expected[i]));
  assert.equal(story.c2KitchenAsk.choices.length,2);
  assert.equal(story.rHugAsk.choices.length,3);
  assert.equal(story.c2KitchenListen.choices.length,2);
 });
});
test('Progression never lowers feelings or rewrites a completed chapter',()=>{
 const s=make('Uncertain'),before=text('aGoodnight',s);
 const line=visibleLines(story.aGoodnight,s).find(l=>l.feelingMemory);
 rememberFeelingLine(s,line);
 s.history=[{id:'aGoodnight:'+visibleLines(story.aGoodnight,s).indexOf(line),speaker:line.speaker,text:line.text}];
 assert.ok(confirmFeeling(s,1,'Drawn to You'));
 assert.deepEqual(text('aGoodnight',s),before);
 assert.equal(s.flags.rowanFeelingChapter2,'Drawn to You');
 assert.ok(text('c2Lunch',s).some(t=>t.includes('Yesterday you said')));
 assert.ok(!text('c2Lunch',s).some(t=>t.includes('We got to tomorrow')));
 assert.equal(refreshAuthoredHistory(s,story).history[0].text,line.text);
 assert.equal(confirmFeeling(s,2,'Familiar'),false);
 const chapterTwo=text('c2EndStay',s);
 assert.ok(confirmFeeling(s,2,'In Love'));
 assert.deepEqual(text('c2EndStay',s),chapterTwo);
 assert.equal(confirmFeeling(s,2,'In Love'),false);
 assert.equal(s.flags.relationship,undefined);
});
test('Apology requires the actual cold reply and choices carry no romantic rewards',()=>{
 const s=make('Familiar');s.node='c2KitchenCabinet';
 assert.equal(nextStoryNode(story,s),'c2KitchenAsk');
 s.history.push({id:'c2TVNews:31',speaker:'Rowan',text:'I just got back from carrying groceries uphill. Give me a minute.'});
 assert.equal(nextStoryNode(story,s),'c2FeelingApology');
 for(const choice of story.c2FeelingApology.choices){
  const copy=structuredClone(s);applyChoice(copy,choice);
  assert.equal(copy.milestone,s.milestone);assert.equal(copy.flags.rowanFeeling,'Familiar');
  assert.equal(story[copy.node].next,'c2KitchenAsk');
  assert.equal(text('c2EndGlass',copy).includes('I’m trying the “actually say it” thing.'),choice.set.rowanApology==='hurt');
 }
});
test('Lunch artwork remains visible across inserted expressions and choices',()=>{
 for(const f of ['Uncertain','Familiar','Drawn to You','In Love']){
  const s=make(f);s.node='c2LunchMeal';const lines=visibleLines(story[s.node],s);
  for(let i=lines.findIndex(l=>l.text==='He sits across from me.');i<lines.length;i++){
   s.line=i;assert.ok(cgAt(story,s)?.startsWith('summer-lunch'));
  }
 }
});
test('Pre-feature saves retain original passages and remain valid',()=>{
 const s=freshState();s.node='c2KitchenSeeYou';
 assert.deepEqual(text(s.node,s),['Yeah. To see you.','Oh…','Rowan blushes.','I’m sorry. I should have said something.']);
 for(let i=0;i<4;i++){s.line=i;assert.ok(validSave(s,story));}
 assert.ok(!text('aGoodnight',s).includes('Today was a lot.'));
});
