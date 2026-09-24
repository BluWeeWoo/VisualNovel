import test from 'node:test';
import assert from 'node:assert/strict';
import {story} from '../src/story.js';
import {continuation} from '../src/continuation.js';
import {freshState,applyChoice,visibleLines,validSave,interpolate} from '../src/engine.js';
import {cgAt,spriteAt,expressions} from '../src/staging.js';
import {openingAudioCue,tracks} from '../src/opening-audio.js';

test('All 2592 continuation routes preserve boundaries, save positions and the authored ending',()=>{
 const covered=new Set();let routes=0;
 for(let yellow=0;yellow<3;yellow++)for(let greet=0;greet<4;greet++)for(let hug=0;hug<3;hug++)for(let tears=0;tears<2;tears++)for(let contact=0;contact<3;contact++)for(let family=0;family<2;family++)for(let repair=0;repair<3;repair++)for(let bags=0;bags<2;bags++){
  const s=freshState('River','they');s.node='rGreeting';let finished=false,sawHug=false,sawLetters=false,sawBurn=false;
  const selections={rPorchEnvelopes:yellow,rGreeting:greet,rHugAsk:hug,rEmotion:tears,rContact:contact,rLanding:family,rReturn:repair,rBags:bags};
  for(let step=0;step<50;step++){
   const node=story[s.node];covered.add(s.node);
   for(const [i,line] of visibleLines(node,s).entries()){
    s.line=i;const before=JSON.stringify(s),text=interpolate(line.text,s);assert.doesNotMatch(text,/\{name\}/);
    const cg=cgAt(story,s);if(cg==='reunion-hug')sawHug=true;if(cg==='hidden-letters')sawLetters=true;if(cg==='burning-letters')sawBurn=true;
    const sprite=spriteAt(story,s);assert.equal(!!sprite,!!node.rowan);if(sprite)assert.ok(expressions.includes(sprite.key));
    if(hug===2)assert.doesNotMatch(text,/I hug him back|I lean against him again|He lets go, but stays nearby/);
    const saved=JSON.parse(before);assert.ok(validSave(saved,story));assert.equal(cgAt(story,saved),cg);assert.deepEqual(spriteAt(story,saved),sprite);
    assert.equal(JSON.stringify(s),before);
    const music=openingAudioCue(node,s);for(const l of music.layers)assert.ok(tracks[l.key]);
    if(node.time==='night')assert.ok(music.layers.some(l=>l.key==='rain'));
   }
   if(node.ending){assert.equal(s.node,'rInside');finished=true;break;}
   if(node.choices)applyChoice(s,node.choices[selections[s.node]]);else {s.node=node.next;s.line=0;}
  }
  assert.ok(finished);assert.equal(sawHug,hug!==2);assert.ok(sawLetters&&sawBurn);
  assert.equal(s.milestone,'Reacquainted');assert.equal(s.promiseFound,false);assert.ok(!s.phoneUnlocked);routes++;
 }
 assert.equal(routes,2592);assert.equal(covered.size,Object.keys(continuation).length);
});
test('Existing recognition saves can continue without losing the saved line',()=>{
 const s=freshState();s.node='recognition';s.line=story.recognition.lines.length-1;
 assert.ok(validSave(s,story));assert.equal(story.recognition.next,'rGreeting');assert.ok(!story.recognition.ending);
});
test('Reunion music is fixed by scene; one-shot phone cue occurs only on its authored text',()=>{
 for(const [id,node] of Object.entries(continuation)){
  const s=freshState();s.node=id;s.flags.greeting='shocked';
  for(const [i,line] of visibleLines(node,s).entries()){
   s.line=i;const cue=openingAudioCue(node,s);
   if(node.music)assert.equal(cue.layers[0].key,node.music==='reunion'?'reunion-new':node.music);else assert.ok(cue.layers.every(l=>l.key==='outdoors'));
   assert.equal(cue.layers.some(l=>l.key==='phone'),id==='rReturn'&&line.text==='It’s Rowan.');
  }
 }
 assert.equal(tracks.phone.loop,false);assert.equal(tracks.box.loop,false);
});
