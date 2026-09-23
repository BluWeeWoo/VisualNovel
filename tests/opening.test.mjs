import test from 'node:test';
import assert from 'node:assert/strict';
import {story} from '../src/story.js';
import {opening} from '../src/opening.js';
import {freshState,applyChoice,visibleLines,validSave,interpolate,refreshAuthoredHistory} from '../src/engine.js';
import {cgAt,spriteAt} from '../src/staging.js';

test('All 16 opening routes preserve choices and saves, reach recognition without premature later unlocks',()=>{
 const covered=new Set();
 for(let response=0;response<4;response++)for(let grief=0;grief<2;grief++)for(let visit=0;visit<2;visit++){
  let s=freshState('River','they');const choices={busBump:response,hill:grief,otherDoor:visit};let ended=false;
  for(let steps=0;steps<25;steps++){
   const n=story[s.node];assert.ok(n.opening);covered.add(s.node);
   for(const [i,line] of visibleLines(n,s).entries()){
    s.line=i;s.history.push({id:`${s.node}:${i}`,speaker:line.speaker,text:interpolate(line.text,s)});
    const loaded=JSON.parse(JSON.stringify(s));assert.ok(validSave(loaded,story));assert.deepEqual(refreshAuthoredHistory(loaded,story),s);
    assert.equal(spriteAt(story,s),null,'No premature standing portrait');
    if(s.node!=='recognition')assert.notEqual(cgAt(story,s),'familiar-door');
   }
   if(s.node==='recognition'){assert.equal(s.node,'recognition');assert.equal(interpolate(n.lines.at(-1).text,s),'River?');assert.equal(cgAt(story,s),'familiar-door');ended=true;break;}
   if(n.choices){const c=n.choices[choices[s.node]];s.history.push({id:`choice:${s.node}`,speaker:s.name,text:c.text});applyChoice(s,c);}
   else{s.node=n.next;s.line=0;}
  }
  assert.ok(ended);assert.equal(s.flags.knocked,visit===0);assert.equal(s.flags.griefResponse,grief===0?'cry':'hold');
  assert.equal(s.flags.strangerResponse,['kind','glare','angry','silent'][response]);
  assert.equal(s.milestone,'Reacquainted');assert.equal(s.promiseFound,false);assert.equal(s.sunrise,'unstarted');assert.ok(!s.phoneUnlocked);assert.equal(s.completed,false);
 }
 assert.equal(covered.size,Object.keys(opening).length);
});

test('Opening keeps PDF chronology, editable identity, and no invented resolution',()=>{
 const text=Object.values(opening).flatMap(n=>n.lines).map(l=>l.text).join(' ');
 assert.match(text,/Saint Luis/);assert.match(text,/More than four years/);assert.match(text,/Two years ago/);assert.match(text,/finals week/);
 assert.doesNotMatch(text,/eight years|six weeks until|handover|sunrise promise/i);
 for(const pronouns of ['they','she','he']){const s=freshState('Kai',pronouns);assert.equal(s.pronouns,pronouns);assert.equal(interpolate(opening.recognition.lines.at(-1).text,s),'Kai?');}
});
