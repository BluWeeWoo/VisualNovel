import test from 'node:test';
import assert from 'node:assert/strict';
import {story} from '../src/story.js';
import {dayTwo} from '../src/day-two.js';
import {freshState,applyChoice,visibleLines,validSave,migrateStorySave} from '../src/engine.js';
import {cgAt} from '../src/staging.js';
import {openingAudioCue} from '../src/opening-audio.js';
import {morningPhone} from '../src/morning-phone.js';
test('All 48 new routes reach the garden with branch-only hugs and messages',()=>{
 const covered=new Set();let count=0;
 for(let evening=0;evening<3;evening++)for(let phone=0;phone<2;phone++)for(let route=0;route<2;route++)for(let greet=0;greet<4;greet++){
  const s=freshState('Kai','they');s.node='d2Settling';let hugged=false,read=false,finished=false;
  const choices={d2Settling:evening===2?1:0,d2Call:evening,d2Morning:phone,d2GetUp:route,d2Garden:greet};
  for(let step=0;step<30;step++){
   const n=story[s.node];covered.add(s.node);
   for(const [i,l] of visibleLines(n,s).entries()){
    s.line=i;assert.ok(validSave(JSON.parse(JSON.stringify(s)),story));
    if(cgAt(story,s)==='d2-bedroom-hug')hugged=true;
    if(morningPhone(n,s)){read=true;assert.equal(phone,1);}
    if(n.time==='night')assert.ok(!openingAudioCue(n,s).layers.some(l=>l.key==='rain'));
   }
   if(n.ending){assert.equal(s.node,'d2Reveal');finished=true;break;}
   if(n.choices)applyChoice(s,n.choices[choices[s.node]]);else {s.node=n.next;s.line=0;}
  }
  assert.ok(finished);assert.equal(hugged,evening===0);assert.equal(read,phone===1);
  assert.equal(s.milestone,'Reacquainted');assert.equal(s.promiseFound,false);count++;
 }
 assert.equal(count,48);assert.equal(covered.size,Object.keys(dayTwo).length);
});
test('Old ending resumes without losing name, choices or reading position',()=>{
 const s=freshState('Mika','she');s.node='rLetterLaterAfter';s.line=4;s.completed=true;s.flags.letterTiming='now';
 migrateStorySave(s,story);assert.equal(s.completed,false);assert.equal(s.line,4);assert.equal(s.name,'Mika');assert.equal(s.flags.letterTiming,'now');assert.ok(validSave(s,story));
 assert.equal(story[s.node].next,'d2Settling');
});
test('Phone shows only messages read so far, with the correct sender',()=>{
 const s=freshState();s.node='d2PhoneOpen';const n=story[s.node];
 s.line=n.lines.findIndex(l=>l.speaker==='Sevi · SG');
 const html=morningPhone(n,s);assert.match(html,/Hey, Dos/);assert.doesNotMatch(html,/Bye, Dos|Nasaan ka/);
 s.node='d2PhoneAway';assert.equal(morningPhone(story[s.node],s),'');
});
