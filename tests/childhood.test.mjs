import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {story} from '../src/story.js';
import {freshState,visibleLines,validSave,migrateStorySave} from '../src/engine.js';
import {spriteAt} from '../src/staging.js';
import {phoneIdentity,hasRowanContact} from '../src/phone-ui.js';
import {rowan} from '../src/characters.js';
import {guardReply} from '../src/provider-policy.js';

test('Childhood uses all six approved sprites, no adult portraits or present-day phone',()=>{
 const manifest=JSON.parse(readFileSync(new URL('../assets/manifest.json',import.meta.url)));
 const s=freshState();s.node='rLetterPromise';s.history=[{id:'rExchange:5',speaker:'',text:'I reach for my phone.'}];
 const seen=new Set();
 for(let i=0;i<story.rLetterPromise.lines.length;i++){
  s.line=i;const sprite=spriteAt(story,s);assert.equal(sprite.character,'RowanChild');seen.add(sprite.key);
  assert.ok(validSave(s,story));assert.equal(hasRowanContact(s),false);
  const bytes=readFileSync(new URL('../'+manifest.portraits.RowanChild[sprite.key],import.meta.url));
  assert.equal(bytes.readUInt32BE(16),1024);assert.equal(bytes.readUInt32BE(20),1536);assert.equal(bytes[25],6);
 }
 assert.deepEqual([...seen].sort(),['neutral','smile','playful','concerned','sad','surprised'].sort());
});
test('Twelve-year separation is consistent and family reveal remains withheld',()=>{
 assert.equal(rowan.timeline.movedAwayAge,11);assert.equal(rowan.timeline.yearsApart,12);assert.equal(rowan.age,23);
 const prose=Object.values(story).flatMap(n=>n.lines).map(l=>l.text).join(' ');
 assert.doesNotMatch(prose,/Sanchez|four years|eight years|at fifteen|both twelve/i);
 assert.equal(phoneIdentity.name,'Rowan');assert.equal(rowan.nickname,'Ro');
 assert.match(story.rContact.choices[0].text,/didn’t really get the chance/);
 assert.match(guardReply('My father is the mayor.'),/Just Rowan/);
});
test('Existing phone-reading saves migrate to the same message exactly once',()=>{
 for(const greeting of ['normal','excited','oblivious','shocked']){
  const s=freshState('River','they');delete s.storyRevision;s.node='rReturn';s.line=9;s.flags.greeting=greeting;
  s.history=[{id:'rReturn:9',speaker:'Rowan · text',text:'It’s Rowan.'}];s.chat=[{role:'player',text:'My words.'}];
  migrateStorySave(s,story);assert.ok(validSave(s,story));assert.equal(visibleLines(story[s.node],s)[s.line].text,'It’s Rowan.');
  assert.equal(s.chat[0].text,'My words.');assert.equal(s.flags.greeting,greeting);
  const once=JSON.stringify(s);migrateStorySave(s,story);assert.equal(JSON.stringify(s),once);
 }
});
