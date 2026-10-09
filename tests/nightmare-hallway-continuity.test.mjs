import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {story} from '../src/story.js';
import {freshState,visibleLines} from '../src/engine.js';
import {cgAt,sceneAt} from '../src/staging.js';

test('First nightmare lead-in retains Sevi’s hallway through every thought and reload position',()=>{
 const manifest=JSON.parse(readFileSync(new URL('../assets/manifest.json',import.meta.url)));
 const state=freshState();state.node='c2CloudIntro';
 const hallway=manifest.backgrounds['c2-confrontation'];
 for(let line=0;line<visibleLines(story.c2CloudIntro,state).length;line++){
  state.line=line;
  const restored=structuredClone(state);
  assert.equal(manifest.backgrounds[sceneAt(story,restored).place],hallway);
  assert.equal(manifest.cgs[cgAt(story,restored)].src,hallway);
  assert.deepEqual(restored,state);
 }
 assert.equal(story.c2CloudIntro.next,'c2Wave1');
 assert.equal(story.c2Wave1.nightmare,1);
 assert.equal(manifest.backgrounds[story.c2Wave1.place],hallway);
 const css=readFileSync(new URL('../assets/nightmare.css',import.meta.url),'utf8');
 assert.ok(css.includes(`.nightmare-screen.corridor-dream{background-image:url('${hallway.replace(/^assets\//,'')}')}`));
});
