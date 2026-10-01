import test from 'node:test';
import assert from 'node:assert/strict';
import {affinityView,chapterComplete,chapterMenu,affinityLevels} from '../assets/chapters.js';
import {story} from '../src/story.js';
import {freshState} from '../src/engine.js';
test('affinity follows saved milestones without mutating progress',()=>{
 for(const [pose,milestone] of affinityLevels.entries()){
  const state={...freshState(),milestone,flags:{relationship:'romance'}},before=JSON.stringify(state);
  assert.deepEqual(affinityView(state),{label:milestone,pose});
  assert.equal(JSON.stringify(state),before);
 }
 assert.equal(affinityView({milestone:'Committed',flags:{relationship:'friendship'}}).pose,2);
 assert.equal(affinityView(null).label,'Reacquainted');
});
test('chapter completion requires reaching the actual final line',()=>{
 const state=freshState();state.node='aEnd';state.line=0;
 assert.equal(chapterComplete(state,story),false);
 state.line=story.aEnd.lines.length-1;
 assert.equal(chapterComplete(state,story),true);
});
test('all future chapters remain disabled and only one affinity portrait renders',()=>{
 const html=chapterMenu(freshState(),false);
 assert.equal((html.match(/<button disabled/g)||[]).length,4);
 assert.equal((html.match(/class="affinity-art"/g)||[]).length,1);
 assert.match(html,/Continue chapter/);
 assert.match(chapterMenu(freshState(),true),/Revisit chapter/);
});
