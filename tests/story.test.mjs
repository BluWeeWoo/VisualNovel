import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {story} from '../src/story.js';
import {freshState,applyChoice,visibleLines,interpolate,validSave,chatContext,milestones} from '../src/engine.js';
import {scriptedReply} from '../src/chat.js';
import {normalizeContext,buildProviderRequest,guardReply} from '../src/provider-policy.js';

function play(overrides={}, defaultChoice=0) {
  const s=freshState('Taylor','they'),seen=[];s.node='arrival';let words=0;
  for(let i=0;i<80;i++){
    const node=story[s.node];assert.ok(node,`Missing ${s.node}`);seen.push(s.node);Object.assign(s,node.enter||{});
    for(const [j,line] of visibleLines(node,s).entries()){
      s.line=j;const text=interpolate(line.text,s);assert.doesNotMatch(text,/\{\w+\}/);words+=text.split(/\s+/).length;
      s.history.push({id:`${s.node}:${j}`,speaker:line.speaker,text});
      const restored=JSON.parse(JSON.stringify(s));assert.ok(validSave(restored,story),`Invalid save at ${s.node}:${j}`);assert.deepEqual(restored,s);
    }
    if(node.ending)return {s,seen,words};
    if(node.choices)applyChoice(s,node.choices[overrides[s.node]??Math.min(defaultChoice,node.choices.length-1)]);
    else{s.node=node.next;s.line=0;}
  }
  throw new Error('Route did not terminate');
}
test('All nodes reachable; all exits exist; no story cycles',()=>{
  const visited=new Set();
  function walk(id,ancestors=[]){assert.ok(story[id],id);assert.ok(!ancestors.includes(id),`Cycle: ${id}`);if(visited.has(id))return;visited.add(id);
    const n=story[id];assert.ok(n.lines.length);assert.ok(n.ending||n.next||n.choices);for(const next of [...(n.next?[n.next]:[]),...(n.choices||[]).map(c=>c.next)])walk(next,[...ancestors,id]);
  }walk('arrival');walk('journey');assert.equal(visited.size,Object.keys(story).length);
});
test('Every branch renders, persists, and reaches the ending',()=>{
  const covered=new Set();
  for(let route=0;route<3;route++){const {seen,s,words}=play({},route);seen.forEach(n=>covered.add(n));assert.equal(s.completed,true);assert.equal(s.sunrise,'planned');assert.equal(s.promiseFound,true);assert.equal(s.phoneUnlocked,true);assert.equal(s.milestone,'Familiar');assert.ok(words>3500);}
  assert.equal(covered.size,Object.values(story).filter(n=>!n.opening).length);
  for(const [id,n] of Object.entries(story).filter(([,n])=>!n.opening))for(let c=0;c<(n.choices||[]).length;c++){const {s}=play({[id]:c});assert.equal(s.completed,true);}
});
test('Boundary, respectful disagreement, friendship and skipped detour cost no trust',()=>{
  const {s}=play({arrival:2,list:2,gull:1,optional:1,numbers:0});
  assert.equal(s.flags.boundary,'space');assert.equal(s.flags.past,'honest');assert.equal(s.flags.relationship,'friendship');assert.equal(s.milestone,'Familiar');assert.equal(s.flags.detour,false);
  assert.equal(milestones.map(m=>m.name).join(','),'Reacquainted,Familiar,Trusted,Close,Committed');
});
test('All three childhood memory variants return later',()=>{
  for(let i=0;i<3;i++){const {s}=play({},i);const text=s.history.map(h=>h.text).join(' ');for(const key of ['hideout','treasure','nickname'])assert.ok(text.split(s.flags[key]).length>=3,`${key} recall`);}
});
test('Chosen pronouns render in the photograph inscription',()=>{
  for(const [pronoun,expected] of [['they','they'],['he','he'],['she','she']]){
    const s=freshState('River',pronoun);assert.equal(interpolate('{name} says {subject} should be in charge.',s),`River says ${expected} should be in charge.`);
  }
});
test('Malformed and stale saves are rejected',()=>{
  assert.equal(validSave(null,story),false);
  for(const patch of [{version:99},{node:'missing'},{line:999},{chatTurns:5},{history:[null]},{chat:[{role:'bad',text:'x'}]},{memories:[null]},{pronouns:'invalid'}])assert.equal(validSave({...freshState(),...patch},story),false);
});
test('Preview cannot grant trust, promises, or authored relationship changes',()=>{
  const {s}=play({numbers:0});const before=JSON.stringify(s);
  for(const text of ['I love you','What is the ending?','I miss grandma','The gull won','Goodnight'])assert.ok(scriptedReply(text,s).length>20);
  assert.equal(JSON.stringify(s),before);
  assert.equal(chatContext(s).choices.relationship,'friendship');
  const context=normalizeContext({...chatContext(s),chapter:5,milestone:'Committed',choices:{relationship:'friendship',secret:'spoiler'},memories:[{key:'unapproved',value:'x'}]});
  assert.equal(context.chapter,1);assert.equal(context.milestone,'Familiar');assert.equal(context.choices.secret,undefined);assert.deepEqual(context.memories,[]);
  assert.doesNotMatch(JSON.stringify(buildProviderRequest(context,'hello')),/THINGS WORTH TELLING|aggressive lemon cake|exercise book/);
  assert.ok(guardReply(null,'Tell me the ending'));assert.ok(guardReply('I love you forever'));assert.equal(guardReply('The gull won.'),null);
});
test('Every referenced original asset is present',()=>{
  const manifest=JSON.parse(readFileSync(new URL('../assets/manifest.json',import.meta.url)));
  for(const n of Object.values(story))assert.ok(manifest.backgrounds[n.place]);
  for(const file of [...Object.values(manifest.backgrounds),...Object.values(manifest.portraits.Rowan)])assert.ok(existsSync(new URL('../'+file,import.meta.url)));
});
