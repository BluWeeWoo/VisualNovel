import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {rowan,protagonistAge} from '../src/characters.js';
import {character} from '../src/provider-policy.js';
import {story} from '../src/story.js';
import {freshState,visibleLines,refreshAuthoredHistory,validSave} from '../src/engine.js';
import {expressions,spriteAt,directions} from '../src/staging.js';
test('Both characters are 23; Rowan is he/him and player choices remain available',()=>{
 assert.equal(rowan.age,23);assert.equal(protagonistAge,23);assert.equal(character.pronouns,'he/him');assert.equal(character.age,23);
 assert.equal(rowan.timeline.lastVisit,'twelve years ago');assert.equal(rowan.timeline.lolaDiedYearsAgo,2);
 for(const p of ['he','she','they'])assert.equal(freshState('Alex',p).pronouns,p);
 const prose=Object.values(story).flatMap(n=>n.lines).map(l=>l.text).join(' ');
 assert.doesNotMatch(prose,/twenty-five|twenty-six|were he|He charge|he have|he are/);
});
test('All expression cues match authored text and every expression is used',()=>{
 const seen=new Set();
 for(const [id,node] of Object.entries(story)){
   for(const [fragment] of directions[id]||[])assert.ok(node.lines.some(l=>l.text.includes(fragment)),`${id}: ${fragment}`);
   const s=freshState();s.node=id;
   for(let line=0;line<visibleLines(node,s).length;line++){s.line=line;const sprite=spriteAt(story,s);if(sprite)seen.add(sprite.expression);}
 }
 assert.deepEqual([...seen].sort(),expressions.slice().sort());
});
test('Book pose is present in sorting, absent in outdoor scenes and night texting',()=>{
 const s=freshState();s.node='sort';s.line=visibleLines(story.sort,s).findIndex(l=>l.text.includes('Rowan lifts an old illustrated book'));assert.equal(spriteAt(story,s).key,'book');
 for(const id of ['arrival','street','pier']){s.node=id;s.line=visibleLines(story[id],s).length-1;assert.equal(spriteAt(story,s).pose,'ordinary');}
 s.node='night';s.line=4;assert.equal(spriteAt(story,s),null);
});
test('Existing saves retain choices while old authored pronouns are refreshed',()=>{
 const s=freshState('Alex','they');s.node='arrival';s.line=7;s.flags.boundary='warm';
 s.history=[{id:'arrival:7',speaker:'',text:'Old words about their sleeve.'},{id:'choice:arrival',speaker:'Alex',text:'Offer them a hug.'}];
 s.chat=[{role:'player',text:'My own words stay.'}];s.memories=[{key:'player-approved note',value:'I like tea.'}];
 const refreshed=refreshAuthoredHistory(structuredClone(s),story);assert.match(refreshed.history[0].text,/his sleeve/);assert.match(refreshed.history[1].text,/him a hug/);
 assert.equal(refreshed.line,7);assert.equal(refreshed.pronouns,'they');assert.deepEqual(refreshed.chat,s.chat);assert.deepEqual(refreshed.memories,s.memories);assert.ok(validSave(refreshed,story));
});
test('All ten approved sprite PNGs share canvas and RGBA transparency format',()=>{
 const manifest=JSON.parse(readFileSync(new URL('../assets/manifest.json',import.meta.url)));
 assert.equal(manifest.spriteCanvas.height/manifest.spriteCanvas.width,1.5,'Standing sprites use a portrait canvas');
 assert.equal(Object.keys(manifest.portraits.Rowan).length,10);
 for(const key of Object.keys(manifest.portraits.Rowan)){
   const data=readFileSync(new URL('../'+manifest.portraits.Rowan[key],import.meta.url));
   assert.equal(data.toString('hex',0,8),'89504e470d0a1a0a');assert.equal(data.readUInt32BE(16),manifest.spriteCanvas.width);assert.equal(data.readUInt32BE(20),manifest.spriteCanvas.height);assert.equal(data[25],6,`${key} needs RGBA`);
 }
 assert.equal(manifest.portraitLabel,'');
});
