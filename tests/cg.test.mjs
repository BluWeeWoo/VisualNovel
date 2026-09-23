import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,statSync} from 'node:fs';
import {cgAt,cgCues} from '../src/staging.js';
import {story} from '../src/story.js';
import {freshState,visibleLines} from '../src/engine.js';

test('All CGs appear only inside their authored cue windows without changing saves',()=>{
 const seen=new Set();
 for(const [node,scene] of Object.entries(story)){
  const state=freshState('Alex','they');state.node=node;
  const lines=visibleLines(scene,state);
  const cue=cgCues[node];
  if(cue){assert.ok(scene.lines.some(l=>l.text.includes(cue.from)));if(cue.until)assert.ok(scene.lines.some(l=>l.text.includes(cue.until)));}
  for(let line=0;line<lines.length;line++){
   state.line=line;const before=JSON.stringify(state);const cg=cgAt(story,state);
   assert.equal(JSON.stringify(state),before);
   assert.equal(cgAt(story,JSON.parse(before)),cg,'Loading a saved moment restores the CG');
   if(cg)seen.add(cg);
   if(cue){const from=lines.findIndex(l=>l.text.includes(cue.from));const until=cue.until?lines.findIndex(l=>l.text.includes(cue.until)):lines.length;assert.equal(cg,line>=from&&line<until?cue.key:null);}
   else assert.equal(cg,null);
  }
 }
 assert.equal(seen.size,11);
});
test('All event illustrations are optimized WebP with accessible descriptions',()=>{
 const manifest=JSON.parse(readFileSync(new URL('../assets/manifest.json',import.meta.url)));
 assert.equal(Object.keys(manifest.cgs).length,11);
 for(const cue of Object.values(cgCues)){
  const asset=manifest.cgs[cue.key];assert.ok(asset.alt.length>30);
  const path=new URL('../'+asset.src,import.meta.url);const data=readFileSync(path);
  assert.equal(data.toString('ascii',8,12),'WEBP');assert.ok(statSync(path).size<600_000,'Each CG stays under 600 KB');
 }
});
