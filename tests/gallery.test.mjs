import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {galleryUnlocks,galleryCatalog} from '../assets/love-interests.js';
import {freshState,visibleLines} from '../src/engine.js';
import {story} from '../src/story.js';
import {cgCues} from '../src/staging.js';
const manifest=JSON.parse(readFileSync(new URL('../assets/manifest.json',import.meta.url)));

test('Gallery does not reveal future CGs or mutate progress; exact viewed history migrates',()=>{
 const state=freshState();const cue=cgCues.journey;
 state.line=visibleLines(story.journey,state).findIndex(l=>l.text.includes(cue.from));
 const before=JSON.stringify(state);
 assert.deepEqual(galleryUnlocks(story,manifest,[state]),['way-back']);
 assert.equal(JSON.stringify(state),before);
 state.history=[{id:`journey:${state.line}`,speaker:'',text:'A recorded moment'}];
 state.node='recognition';state.line=0;
 assert.ok(galleryUnlocks(story,manifest,[state]).includes('way-back'));
 assert.ok(!galleryUnlocks(story,manifest,[state]).includes('burning-letters'));
 assert.deepEqual(galleryUnlocks(story,manifest,[],['way-back','invalid']),['way-back']);
 assert.deepEqual(galleryUnlocks(story,manifest,[],{}),[]);
});

test('Every CG unlocks only at its cue, including branch-specific illustrations',()=>{
 for(const [node,cue] of Object.entries(cgCues)){
  const state=freshState();state.node=node;
  const start=visibleLines(story[node],state).findIndex(l=>l.text.includes(cue.from));
  if(start<0)continue;
  state.line=start;
  assert.ok(galleryUnlocks(story,manifest,[state]).includes(cue.key));
  if(start>0){state.line=start-1;assert.ok(!galleryUnlocks(story,manifest,[state]).includes(cue.key));}
 }
});

test('Catalog preserves character order, teaser-only Sevi, and asset references',()=>{
 const catalog=galleryCatalog(manifest,[]);
 assert.deepEqual(Object.keys(catalog),['rowan','sevi']);
 assert.equal(catalog.rowan.Artwork.filter(a=>a.locked).length,Object.keys(manifest.cgs).length);
 for(const character of Object.values(catalog))for(const category of ['Outfits','Expressions','Artwork'])for(const item of character[category]){
  assert.ok(existsSync(new URL('../'+item.src,import.meta.url)),item.src);
  assert.equal(item.next,undefined);assert.equal(item.set,undefined);
 }
 assert.equal(catalog.sevi.Artwork.length,1);
});
