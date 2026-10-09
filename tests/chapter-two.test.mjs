import test from 'node:test';
import assert from 'node:assert/strict';
import {story} from '../src/story.js';
import {chapterTwo} from '../src/chapter-two.js';
import {freshState,validSave,applyChoice,visibleLines,interpolate,migrateStorySave} from '../src/engine.js';
import {chapterMenu,chapterComplete} from '../assets/chapters.js';
import {nightmareProgress,tickNightmare,clearThought,waveDurations,cloudCount,nightmareOutcome,finishNightmare,permanentCloudCount} from '../assets/nightmare.js';
import {openingAudioCue,tracks} from '../src/opening-audio.js';
import {cgAt} from '../src/staging.js';

test('Third ending builds clouds individually and restores the same density',()=>{
 assert.equal(permanentCloudCount(2.999),0);
 assert.equal(permanentCloudCount(3),1);
 assert.equal(permanentCloudCount(3.08),2);
 assert.equal(permanentCloudCount(3.16),3);
 assert.equal(permanentCloudCount(4),14);
 assert.equal(permanentCloudCount(5.2),30);
 assert.equal(permanentCloudCount(7.9),30);
 const state={flags:{nightmareWave3:{elapsed:4,cleared:[0,1,2],endingElapsed:4}}};
 assert.equal(permanentCloudCount(nightmareProgress(structuredClone(state),3).endingElapsed),14);
});

test('Final nightmare ends on its own and resumes saved time without a failure penalty',()=>{
 const s=freshState();s.flags.rowanAffection=9;const p=nightmareProgress(s,3);
 for(let i=0;i<10;i++)tickNightmare(p,3,1);
 assert.ok(Number.isFinite(p.endingElapsed));
 const restored=structuredClone(s),resumed=nightmareProgress(restored,3);
 for(let i=0;i<8;i++)tickNightmare(resumed,3,1);
 assert.equal(nightmareOutcome(resumed,3),'overwhelmed');
 assert.equal(clearThought(resumed,3,0),false);assert.equal(restored.flags.rowanAffection,9);
});

test('Legacy third-wave saves preserve clears and an ending already in progress',()=>{
 const s=freshState();s.flags.nightmareWave3={elapsed:12,cleared:[0,1,2]};s.flags.seviDescription='rival';
 assert.equal(nightmareProgress(s,3).endingElapsed,undefined);assert.equal(s.flags.seviDescription,'rival');
 s.flags.nightmareWave3.endingElapsed=4;assert.equal(nightmareProgress(s,3).endingElapsed,4);
 for(const wave of [1,2]){const p=nightmareProgress(s,wave);tickNightmare(p,wave,1);assert.equal(p.endingElapsed,undefined);}
});

test('Nightmare settings remain continuous and waking passes through darkness',()=>{
 for(const id of ['c2CloudIntro','c2Wave1','c2Wave1After'])assert.equal(story[id].place,'c2-city');
 for(const id of ['c2Wave2','c2Wave2After'])assert.equal(story[id].place,'c2-assignment');
 for(const id of ['c2Hall','c2Wave3','c2Calling','c2Blackout'])assert.equal(story[id].place,'c2-empty-hallway');
 assert.equal(story.c2Calling.next,'c2Blackout');
 assert.equal(story.c2Blackout.blackout,true);assert.equal(story.c2Blackout.next,'c2Wake');
 const s=freshState();s.seviSceneRevision=2;s.node='c2Wave2';
 nightmareProgress(s,2).elapsed=7;
 const flags=structuredClone(s.flags);
 migrateStorySave(s,story);
 assert.deepEqual(s.flags,flags);assert.equal(s.seviSceneRevision,3);assert.ok(validSave(s,story));
});

test('Every nightmare and recovery choice reaches the afternoon bridge with boundaries and saves intact',()=>{
 const seen=new Set();let endings=0;
 function walk(s,depth=0){
  assert.ok(depth<40);seen.add(s.node);const n=story[s.node];
  for(const [i,l] of visibleLines(n,s).entries()){
   s.line=i;assert.ok(validSave(structuredClone(s),story),s.node);assert.doesNotMatch(interpolate(l.text,s),/\{name\}/);
   for(const layer of openingAudioCue(n,s).layers)assert.ok(tracks[layer.key]);
  }
  if(s.node==='c2End'){assert.equal(n.next,'c2Lunch');assert.equal(s.flags.rowanAffection,6);assert.equal(s.milestone,'Trusted');endings++;return;}
  if(n.choices)for(const choice of n.choices){const next=structuredClone(s);applyChoice(next,choice);walk(next,depth+1);}
  else {s.node=n.next;s.line=0;walk(s,depth+1);}
 }
 for(const one of ['clear','overwhelmed','bypass'])for(const two of ['clear','overwhelmed','bypass']){const s=freshState('Morgan','they');s.node='c2Start';s.flags.rowanAffection=6;s.milestone='Trusted';s.flags.nightmareOutcome1=one;s.flags.nightmareOutcome2=two;walk(s);}
 assert.equal(seen.size,Object.keys(chapterTwo).length);assert.equal(endings,405);
});
test('Chapter Two unlocks from old completed saves without resetting them; future chapters stay locked',()=>{
 const s=freshState();s.storyRevision=5;s.node='aEnd';s.line=2;const flags=structuredClone(s.flags);migrateStorySave(s,story);
 assert.equal(chapterComplete(s,story),true);assert.deepEqual(s.flags,flags);
 const html=chapterMenu(s,true);assert.match(html,/data-action="chapter-two"/);assert.equal((html.match(/<button disabled/g)||[]).length,3);
 assert.equal(chapterMenu(freshState(),false).includes('data-action="chapter-two"'),false);
});
test('Nightmare progress resumes and all waves are time-bounded without changing affinity',()=>{
 for(const wave of [1,2,3]){
  const s=freshState();s.flags.rowanAffection=9;const p=nightmareProgress(s,wave);
  tickNightmare(p,wave,1);clearThought(p,wave,0);
  assert.deepEqual(nightmareProgress(structuredClone(s),wave),p);
  for(let i=0;i<40;i++)tickNightmare(p,wave,1);
  assert.equal(nightmareOutcome(p,wave),'overwhelmed');assert.equal(s.flags.rowanAffection,9);
 }
});

test('Privacy branches never show seated Rowan CG and Sevi’s confrontations use their separate settings',()=>{
 const s=freshState();for(const id of ['c2Alone','c2Silent']){s.node=id;for(let i=0;i<story[id].lines.length;i++){s.line=i;assert.equal(cgAt(story,s),null);}}
 assert.equal(cgAt(story,{...s,node:'c2Confrontation',line:0}),'c2-sevi-meeting');assert.equal(cgAt(story,{...s,node:'c2Corridor',line:0}),'c2-sevi-confrontation');assert.equal(story.c2Wake.music,null);
});

test('Sevi interest beats require the earlier explicit response; ordinary scenes stay platonic',()=>{
 const s=freshState();
 for(const id of ['c2CorridorAfter','c2MeetingAfter']){
  const ordinary=visibleLines(story[id],s).map(l=>l.text).join('\n');
  assert.doesNotMatch(ordinary,/Will you be in the library|You can still sit with me/);
 }
 s.flags.seviDescription='something';
 assert.ok(visibleLines(story.c2CorridorAfter,s).some(l=>l.text==='Will you be in the library later?'));
 assert.ok(visibleLines(story.c2MeetingAfter,s).some(l=>l.text==='I still have to be Top 1.'));
 assert.ok(story.c2Corridor.lines.filter(l=>l.kind==='thought').every(l=>l.speaker===''));
});
test('Legacy confrontation saves remain valid without changing relationships or archived history',()=>{
 const s=freshState();delete s.seviSceneRevision;s.node='c2Confrontation';s.line=30;s.flags.seviDescription='fine';
 s.history=[{id:'c2Confrontation:30',speaker:'',text:'Previously read text'}];
 const flags=structuredClone(s.flags),history=structuredClone(s.history);
 migrateStorySave(s,story);assert.equal(s.line,0);assert.ok(validSave(s,story));assert.deepEqual(s.flags,flags);assert.deepEqual(s.history.map(h=>h.text),history.map(h=>h.text));assert.match(s.history[0].id,/^chapterTwoV1:/);
 s.line=5;migrateStorySave(s,story);assert.equal(s.line,5);
});

test('Ten gradual clouds have distinct outcomes and never block story progression',()=>{
 for(const wave of [1,2]){
  const s=freshState(),p=nightmareProgress(s,wave);
  assert.equal(cloudCount(wave,0),1);assert.equal(clearThought(p,wave,9),false);
  while(p.elapsed<waveDurations[wave]&&!nightmareOutcome(p,wave)){
   for(let i=0;i<cloudCount(wave,p.elapsed);i++)clearThought(p,wave,i);
   if(!nightmareOutcome(p,wave))tickNightmare(p,wave,1);
  }
  assert.equal(p.cleared.length,10);assert.equal(nightmareOutcome(p,wave),'clear');
  finishNightmare(s,wave,'clear');
  const clear=visibleLines(story['c2Wave'+wave+'After'],s).map(l=>l.text).join(' ');
  finishNightmare(s,wave,'overwhelmed');
  const overwhelmed=visibleLines(story['c2Wave'+wave+'After'],s).map(l=>l.text).join(' ');
  finishNightmare(s,wave,'bypass');
  const bypass=visibleLines(story['c2Wave'+wave+'After'],s).map(l=>l.text).join(' ');
  assert.notEqual(clear,overwhelmed);assert.notEqual(bypass,overwhelmed);assert.ok(validSave({...s,node:'c2Wave'+wave+'After'},story));
 }
 assert.ok(cloudCount(2,8)>cloudCount(1,8));assert.ok(cloudCount(3,4)>cloudCount(2,4));
});
test('Removed committee choices migrate safely; revised script keeps withdrawal fixed',()=>{
 for(const node of ['c2TaskList','c2Responsibility','c2Lead','c2Support','c2Withdraw']){
  const s=freshState();s.seviSceneRevision=1;s.node=node;s.line=6;s.flags.rowanAffection=7;
  migrateStorySave(s,story);assert.equal(s.node,'c2Confrontation');assert.ok(validSave(s,story));assert.equal(s.flags.rowanAffection,7);
  assert.equal(story[node],undefined);
 }
 assert.ok(!story.c2Confrontation.choices);assert.ok(story.c2Explain.lines.some(l=>l.text.includes('Still asked.')));
 assert.equal(story.c2Wave3.place,'c2-empty-hallway');assert.equal(story.c2SmallStep.choices[1].set.morningStep,'bed');
});
