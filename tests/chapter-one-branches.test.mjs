import test from 'node:test';
import assert from 'node:assert/strict';
import {story} from '../src/story.js';
import {freshState,applyChoice,nextStoryNode,visibleLines,validSave} from '../src/engine.js';
import {chapterOneTarget} from '../src/chapter-one-branches.js';
import {confirmFeeling} from '../src/rowan-feelings.js';
import {openingAudioCue,tracks} from '../src/opening-audio.js';
import {spriteAt} from '../src/staging.js';

function run(level,choose=()=>0,romantic=false){
 const s=freshState('Alex','they',{rowanFeeling:level});if(romantic)s.flags.relationship='romance';
 const seen=[],words=[];
 for(let step=0;step<240;step++){
  const id=s.node,n=story[id];assert.ok(n,id);seen.push(id);
  if(n.minigame)s.flags.gardenResult='win';
  const lines=visibleLines(n,s);assert.ok(lines.length,id);
  for(const [i,l] of lines.entries()){
   s.line=i;words.push(l.text);s.history.push({id:id+':'+i,speaker:l.speaker,text:l.text});
   assert.ok(validSave(JSON.parse(JSON.stringify(s)),story),'save '+id+':'+i);
   assert.doesNotMatch(l.text,/\*\*|\[MC\]|^— mutual/);
  }
  for(const layer of openingAudioCue(n,s).layers)assert.ok(tracks[layer.key],id+' audio '+layer.key);
  if(id==='aEnd')return {s,seen,words};
  if(n.choices)applyChoice(s,n.choices[Math.min(choose(id,n),n.choices.length-1)]);
  else {s.node=nextStoryNode(story,s);s.line=0;}
 }
 throw Error('Did not finish '+s.node);
}

test('All starting states finish Chapter 1 across accepting, declining, and mixed choices',()=>{
 for(const level of ['Uncertain','Familiar','Drawn to You','In Love'])for(const mode of [0,1,2]){
  const {s,seen}=run(level,(_id,n)=>mode===2?(n.choices?.length||1)-1:mode);
  for(const id of ['rBedroom','rLetters','rLetterLater'])assert.equal(seen.includes(id),level!=='Uncertain');
  assert.ok(seen.includes('d2Morning'));
  assert.equal(s.flags.rowanFeeling,level);assert.equal(s.milestone,'Reacquainted');
  if(['Uncertain','Familiar'].includes(level)){
   assert.ok(!seen.includes('gPlay'));assert.ok(!seen.includes('rHug'));
   assert.ok(!seen.includes('d2Call'));assert.ok(!seen.includes('aPassing'));
   assert.ok(!seen.some(id=>/^aTopic/.test(id)));
  }
 }
});
test('Uncertain does not anticipate Rowan, and house passing has no knock choice',()=>{
 const s=freshState('Alex','they',{rowanFeeling:'Uncertain'});
 assert.ok(!visibleLines(story[s.node],s).some(l=>/Rowan/.test(l.text)));
 assert.equal(story.rbPass_uncertain.choices,undefined);
 assert.doesNotMatch(story.rbPass_uncertain.lines.map(l=>l.text).join(' '),/Rowan|Mayumi/);
});

test('Uncertain uses the revised reunion and a present-day letter explanation before leaving',()=>{
 for(const mode of [0,1]){
  const {seen,s}=run('Uncertain',()=>mode);
  for(const id of ['rLetterPromise','rPorchEnvelopes','rYellowPromise','rLetterYears','rbContactReturn'])assert.ok(!seen.includes(id),id);
  assert.ok(seen.includes('rbContactPresent'));
  assert.ok(seen.indexOf('rbLetterBrief')>seen.indexOf('rbInsideUncertain'));
  assert.equal(seen[seen.indexOf('rbLetterBrief')+1],'rbLeaveUncertain');
  assert.equal(seen[seen.indexOf('rbLeaveUncertain')+1],'rbEveningUncertain');
  for(const id of ['rBedroom','rLetters','rLetterLater','rbEnvelopeSolo'])assert.ok(!seen.includes(id));
  for(const node of ['rbReunion_uncertain','rbContactPresent','rbLetterBrief','rbLeaveUncertain','rbPracticalUncertain','rbContactUncertain','rbInsideUncertain']){
   for(let line=0;line<story[node].lines.length;line++)assert.ok(['neutral','concerned','confused','downcast'].includes(spriteAt(story,{...s,node,line}).expression));
  }
 }
 const lines=story.rbReunion_uncertain.lines;
 assert.ok(lines.some(l=>l.text==='This is so awkward.'&&l.kind==='thought'));
 assert.ok(lines.some(l=>l.text==='So he comes here often?'&&l.kind==='thought'));
 assert.ok(lines.some(l=>l.text==='Long. Pero I’m glad it’s over.'));
 for(const level of ['Familiar','Drawn to You','In Love']){
  const {seen}=run(level);assert.ok(seen.includes('rLetterPromise'));assert.ok(!seen.includes('rbLetterBrief'));
 }
});
test('Uncertain expressions respond to authored beats and survive reload',()=>{
 const flags={rbScene_reunion:'uncertain',rbScene_visit:'uncertain'};
 for(const [node,text,expression] of [
  ['rbReunion_uncertain','You actually came back?','confused'],
  ['rbReunion_uncertain','I’m sorry about Lola, by the way.','downcast'],
  ['rbPracticalUncertain','Wait. Are you okay?','concerned'],
  ['rbLetterBrief','Oh. I didn’t know.','downcast'],
  ['rbVisit_uncertain','Good timing, then.','weak-smile'],
  ['rbVisitShort','Still clicking.','confused'],
  ['rbVisitLeaveUncertain','Of course.','weak-smile']
 ]){
  const s={node,line:story[node].lines.findIndex(l=>l.text===text),flags};
  assert.ok(s.line>=0,text);assert.equal(spriteAt(story,s).expression,expression);
  assert.deepEqual(spriteAt(story,JSON.parse(JSON.stringify(s))),spriteAt(story,s));
 }
 const familiar={node:'rbLowBags',line:0,flags:{rbScene_reunion:'familiar'}};
 assert.equal(spriteAt(story,familiar).expression,'smile');
});
test('Uncertain morning choices differ and every evening passes through dinner once',()=>{
 for(const id of ['rbRestUncertain','rbWorkshopText','rbLolaText']){
  assert.equal(story[id].place,'living');
  assert.equal(story[id].time,'day');
  assert.equal(story[id].rowan,false);
 }
 assert.equal(story.rbDuskUncertain.place,'living');
 assert.ok(story.rbDuskUncertain.lines.at(-1).text.includes('head upstairs'));
 for(const morningChoice of [0,1])for(const visitChoice of [0,1])for(const messageChoice of [0,1,2]){
  const {seen,words}=run('Uncertain',(id)=>id==='d2GetUp'?morningChoice:id==='rbVisit_uncertain'?visitChoice:id==='rbRestUncertain'?messageChoice:0);
  assert.ok(seen.includes(morningChoice===0?'rbMorningPauseUncertain':'rbMorningDownUncertain'));
  assert.ok(!seen.includes(morningChoice===0?'rbMorningDownUncertain':'rbMorningPauseUncertain'));
  assert.equal(seen.filter(id=>id==='rbDuskUncertain').length,1);
  assert.equal(seen[seen.indexOf('rbDuskUncertain')+1],'rbBedroom');
  assert.ok(!words.includes('I get dressed and head downstairs.'));
  assert.equal(words.includes('What do you do at the workshop?'),visitChoice===0);
  assert.equal(words.includes('Thanks for this morning. Sleep well.'),visitChoice===0);
 }
 assert.ok(!story.rbPracticalUncertain.lines.some(l=>l.text==='Repairs. Sanding. A lot of sanding.'));
});
test('Choosing In Love does not establish reciprocity; explicit romance enables tender branch',()=>{
 const solo=run('In Love');assert.ok(solo.seen.includes('rbReunion_drawn'));
 assert.ok(!solo.seen.includes('rbReunion_love'));
 const mutual=run('In Love',()=>0,true);assert.ok(mutual.seen.includes('rbReunion_love'));
 assert.ok(mutual.seen.includes('rbGoodbye_love'));
});
test('Scene snapshots survive saves and later feelings never rewrite the journey',()=>{
 const s=freshState('Alex','they',{rowanFeeling:'Uncertain'});
 const before=visibleLines(story[s.node],s);
 assert.ok(confirmFeeling(s,1,'Familiar'));
 assert.equal(chapterOneTarget('journey',s),'rbJourney_uncertain');
 assert.deepEqual(visibleLines(story[s.node],s),before);
 assert.equal(chapterOneTarget('rGreeting',s),'rbReunion_familiar');
 assert.equal(confirmFeeling(s,2,'Uncertain'),false);
});
test('Leaving early removes the downstairs and shared-breakfast assumptions',()=>{
 const {s,seen,words}=run('Uncertain',()=>1);
 assert.ok(!seen.includes('rbWaterSolo'));assert.ok(seen.includes('rbEveningUncertain'));
 assert.ok(!words.some(t=>/he’s downstairs|He’s still here/.test(t)));
 const lunch=visibleLines(story.c2LunchMeal,s).map(l=>l.text);
 assert.ok(!lunch.some(t=>t.includes('First the tapa')));
 assert.ok(lunch.includes('This is really good, Ro.'));
});
test('Older saves retain their route; new data has no dangling exits or editorial markers',()=>{
 const legacy=freshState();legacy.node='recognition';
 assert.equal(nextStoryNode(story,legacy),'rGreeting');
 for(const [id,n] of Object.entries(story).filter(([id])=>id.startsWith('rb'))){
  for(const edge of [n.next,...(n.choices||[]).map(c=>c.next)].filter(Boolean))assert.ok(story[edge],id+' -> '+edge);
  for(const l of n.lines)assert.doesNotMatch(l.text,/\*\*|\[Retain|\[Continue|^— mutual/);
 }
});
