import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {story} from '../src/story.js';
import {chapterTwoAfternoon} from '../src/chapter-two-afternoon.js';
import {freshState,applyChoice,visibleLines,validSave,migrateStorySave,nextStoryNode} from '../src/engine.js';
import {beginGarden,beginSoloGarden,pullWeed,finishSoloGarden} from '../assets/garden-game.js';
import {openingAudioCue,tracks} from '../src/opening-audio.js';
import {sceneCue} from '../assets/scene-effects.js';
import {spriteAt,cgAt} from '../src/staging.js';

test('Every afternoon route and channel sequence reaches the real chapter ending',()=>{
 const seen=new Set();let endings=0;
 function walk(s,depth=0){
  assert.ok(depth<65,s.node);const node=story[s.node];assert.ok(node,s.node);seen.add(s.node);
  const text=visibleLines(node,s);assert.ok(text.length,s.node);
  for(let i=0;i<text.length;i++){
   s.line=i;assert.ok(validSave(structuredClone(s),story),s.node);
   assert.doesNotMatch(text[i].text,/Proposed|Branches rejoin|\*\*|\[If|\[MC name\]|script direction/);
   assert.notEqual(sceneCue(s.node,node,text[i].text).ambient,'dream');
  }
  if(node.ending){assert.equal(s.node,'c2FatherPresent');assert.equal(s.flags.rowanAffection,7);assert.equal(s.milestone,'Trusted');endings++;return;}
  if(node.soloGarden){for(const outcome of ['cleared','stopped']){const next=structuredClone(s);next.flags.soloGardenResult=outcome;next.node=node.next;next.line=0;walk(next,depth+1);}return;}
  if(node.choices){for(const choice of node.choices)walk(applyChoice(structuredClone(s),choice),depth+1);}
  else {s.node=nextStoryNode(story,s);s.line=0;walk(s,depth+1);}
 }
 for(const known of [undefined,true]){const s=freshState();s.node='c2Lunch';s.flags.rowanAffection=7;s.flags.porchTopic_rowan=known;s.milestone='Trusted';walk(s);}
 for(const id of ['c2Clothes','c2Flowers','c2Groceries','c2FamilyArrival'])assert.ok([...seen].some(n=>n.startsWith(id)),id);assert.ok(endings>=40);
});

test('Solo gardening saves tugs, supports early exit, and cannot change the first round or relationships',()=>{
 const s=freshState();s.flags.gardenMode='timed';s.flags.rowanAffection=8;s.flags.gardenResult='loss';s.flags.relationship='friendship';
 beginGarden(s,()=>0);const first=structuredClone(s.garden);const r=beginSoloGarden(s,()=>0);
 pullWeed(r,0);const restored=structuredClone(s);assert.equal(beginSoloGarden(restored).attempts[0],1);
 assert.equal(pullWeed(beginSoloGarden(restored),0),true);assert.equal(restored.flags.soloGardenRound.rowan,0);
 assert.equal(finishSoloGarden(restored),'stopped');assert.deepEqual(restored.garden,first);assert.equal(restored.flags.rowanAffection,8);assert.equal(restored.flags.gardenResult,'loss');assert.equal(restored.flags.relationship,'friendship');
 for(let i=0;i<18;i++)while(!r.pulled.includes(i))pullWeed(r,i);
 assert.equal(finishSoloGarden(s),'cleared');assert.deepEqual(s.garden,first);assert.equal(s.flags.rowanAffection,8);
 s.node='c2SoloGarden';assert.ok(validSave(s,story));
});

test('Solo activities exclude Rowan and news follows his return; reveal remembers the chosen route',()=>{
 const s=freshState();for(const id of ['c2WaitGarden','c2SoloGarden','c2GardenAfter','c2WaitTV','c2WaitRest']){s.node=id;assert.equal(spriteAt(story,s),null);}
 assert.equal(story.c2TVReturn.next,'c2TVNews');
 assert.ok(story.c2TVReturn.lines.some(l=>l.text.includes('Rowan comes through the door')));
 assert.ok(story.c2TVNews.lines.some(l=>l.text==='Your “new” mayor seems pretty good.'));
 const dialogue=flags=>visibleLines(story.c2Family,{flags}).map(l=>l.text).join('\n');
 assert.doesNotMatch(dialogue({afternoonActivity:'tv',workshopVisited:false}),/The one on TV earlier/);
 assert.doesNotMatch(dialogue({afternoonActivity:'garden',workshopVisited:false}),/The one on TV earlier/);
 assert.doesNotMatch(visibleLines(story.c2Grave,{flags:{graveTogether:false}}).map(l=>l.text).join('\n'),/Want some time|walk home together/);
});

test('New scenes have real art/music assets, and solo activities use ambience without a rival',()=>{
 const manifest=JSON.parse(fs.readFileSync(new URL('../assets/manifest.json',import.meta.url)));
 for(const [id,node] of Object.entries(chapterTwoAfternoon)){
  assert.ok(fs.existsSync(new URL('../'+manifest.backgrounds[node.place],import.meta.url)),id);
  const s={node:id,line:0,flags:{}};const cg=cgAt(story,s);if(cg)assert.ok(manifest.cgs[cg],id);
  for(const layer of openingAudioCue(node,s).layers){assert.ok(tracks[layer.key]);assert.ok(fs.existsSync(new URL('../'+tracks[layer.key].src,import.meta.url)));}
 }
 assert.deepEqual(openingAudioCue(story.c2SoloGarden,{node:'c2SoloGarden',flags:{}}).layers.map(l=>l.key),['outdoors']);
});

test('Old endpoint and ambition saves retain progress, prior choices, relationship, and historical text',()=>{
 const s=freshState();delete s.carpentryRevision;s.node='c2End';s.line=1;s.completed=true;s.flags.rowanAffection=11;s.flags.relationship='friendship';
 const flags=structuredClone(s.flags);migrateStorySave(s,story);assert.equal(s.node,'c2End');assert.equal(s.line,1);assert.equal(s.completed,false);assert.deepEqual(s.flags,flags);assert.ok(validSave(s,story));assert.equal(story.c2End.next,'c2Lunch');
 const a=freshState();delete a.carpentryRevision;a.node='aTopic0_rowan_start';a.line=17;a.flags.porchTopic_rowan=true;a.history=[{id:a.node+':17',speaker:'Rowan',text:'Previous conversation text.'}];
 migrateStorySave(a,story);assert.ok(validSave(a,story));assert.equal(a.history[0].text,'Previous conversation text.');assert.match(a.history[0].id,/carpentryV0/);assert.equal(a.flags.porchTopic_rowan,true);
});
