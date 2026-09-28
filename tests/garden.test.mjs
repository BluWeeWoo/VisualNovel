import test from 'node:test';
import assert from 'node:assert/strict';
import {freshState,applyChoice,migrateStorySave,validSave} from '../src/engine.js';
import {story} from '../src/story.js';
import {beginGarden,pullWeed as attempt,tickGarden,finishGarden} from '../assets/garden-game.js';
import {readFileSync} from 'node:fs';

test('Every weed requires its assigned 2–5 clicks, with attempts preserved across saves',()=>{
 for(let count=2;count<=5;count++){
  const s=freshState();const r=beginGarden(s,()=>((count-2)+.1)/4);
  assert.equal(r.required[0],count);
  for(let click=1;click<count;click++){assert.equal(attempt(r,0),false);assert.equal(r.you,0);}
  const restored=JSON.parse(JSON.stringify(s));assert.deepEqual(beginGarden(restored).required,r.required);
  assert.equal(attempt(restored.garden,0),true);assert.equal(restored.garden.you,1);
  assert.equal(attempt(restored.garden,0),false);
 }
 const old=freshState();old.garden={mode:'timed',elapsed:13,you:1,rowan:4,pulled:[2],finished:false};
 assert.ok(validSave(old,story));beginGarden(old,()=>0);assert.equal(old.garden.elapsed,13);assert.equal(old.garden.you,1);assert.equal(old.garden.attempts[2],2);
 assert.equal(beginGarden(freshState(),()=>.99).required[0],5);
});
test('Wide garden art is exclusive to minigame, dialogue uses the close Rowan CG',()=>{
 const manifest=JSON.parse(readFileSync(new URL('../assets/manifest.json',import.meta.url)));
 for(const node of Object.values(story))if(!node.minigame)assert.notEqual(manifest.backgrounds[node.place],'assets/garden/rematch.webp');
 assert.equal(manifest.backgrounds['garden-rematch'],'assets/cg/day-two/garden-reveal.webp');
});
test('Wins, losses, ties and untimed play award equal affection once',()=>{
 for(const [you,seconds,result] of [[18,20,'win'],[4,45,'loss'],[16,45,'tie']]){
  const s=freshState();s.flags.gardenMode='timed';const r=beginGarden(s);
  for(let i=0;i<you;i++)assert.ok(pullWeed(r,i));
  assert.equal(pullWeed(r,0),false);tickGarden(r,seconds);
  assert.equal(finishGarden(s),result);assert.equal(s.flags.rowanAffection,1);
  finishGarden(s);assert.equal(s.flags.rowanAffection,1);assert.equal(pullWeed(r,17),false);
 }
 const s=freshState();s.flags.gardenMode='untimed';const r=beginGarden(s);tickGarden(r,100);assert.equal(r.elapsed,0);
 for(let i=0;i<18;i++)pullWeed(r,i);finishGarden(s);assert.equal(s.flags.rowanAffection,1);
});
test('Declining reduces affection once without reducing trust or blocking the ending',()=>{
 const s=freshState();const choice=story.gChallenge.choices[2];applyChoice(s,choice);applyChoice(s,choice);
 assert.equal(s.flags.rowanAffection,-1);assert.equal(s.milestone,'Reacquainted');assert.equal(story[s.node].next,'gAfter');
});
test('An unfinished round survives save/load with scores, remaining time and weeds intact',()=>{
 const s=freshState();s.node='gPlay';s.flags.gardenMode='timed';const r=beginGarden(s);
 pullWeed(r,2);pullWeed(r,7);tickGarden(r,12.5);
 const saved=JSON.parse(JSON.stringify(s));assert.ok(validSave(saved,story));assert.deepEqual(beginGarden(saved),r);
 assert.equal(pullWeed(saved.garden,2),false);assert.equal(saved.garden.elapsed,12.5);
 saved.garden.pulled=null;assert.equal(validSave(saved,story),false);
});
test('Old garden-ending saves resume at the new choice',()=>{
 const s=freshState();s.node='d2Reveal';s.line=16;s.completed=true;migrateStorySave(s,story);
 assert.ok(validSave(s,story));assert.equal(s.completed,false);assert.equal(s.line,1);assert.equal(story[s.node].choices.length,3);
});

function pullWeed(r,i){ if(r.finished||r.pulled.includes(i))return false; let pulled=false; for(let n=0;n<5&&!pulled;n++)pulled=attempt(r,i);return pulled;}
