import test from 'node:test';
import assert from 'node:assert/strict';
import {story} from '../src/story.js';
import {cgAt,spritesAt} from '../src/staging.js';
import {freshState,visibleLines} from '../src/engine.js';
test('Approved grave art follows companion and flower choices without mutating saves',()=>{
 for(const flower of ['chrysanthemums','lilies','roses','orchids'])for(const together of [false,true]){
  const s=freshState();Object.assign(s.flags,{graveTogether:together,c2Flowers:flower,c2GraveStay:true});s.node='c2GraveTogether';s.line=2;
  const before=JSON.stringify(s),suffix=flower==='chrysanthemums'?'':'-'+flower;
  assert.equal(cgAt(story,s),'c2-review-grave-'+(together?'together':'alone')+suffix);assert.equal(JSON.stringify(s),before);
  s.node='c2Grave';
  for(s.line=0;s.line<visibleLines(story[s.node],s).length;s.line++)if(!together)assert.equal(cgAt(story,s),null);
  if(together){s.line=5;assert.equal(cgAt(story,s),'c2-review-grave-comfort'+suffix);}
 }
});
test('Nestor introduction and Mayumi reveal return to sprites at their anchors',()=>{
 const s=freshState();s.node='c2Workshop';s.line=4;assert.equal(cgAt(story,s),'c2-review-nestor');s.line=8;assert.equal(cgAt(story,s),null);
 s.node='c2Mayumi';s.flags.graveTogether=true;s.line=0;assert.equal(cgAt(story,s),'c2-review-mayumi');
 s.line=visibleLines(story[s.node],s).findIndex(l=>l.text==='She turns.');assert.equal(cgAt(story,s),null);assert.equal(spritesAt(story,s).length,2);
});
test('Rowan joins the solo return only when he actually comes home',()=>{
 const s=freshState();s.node='c2FamilyArrival';s.line=0;assert.deepEqual(spritesAt(story,s).map(x=>x.character),['Mayumi']);
 s.line=visibleLines(story[s.node],s).findIndex(l=>l.speaker==='Rowan');assert.deepEqual(spritesAt(story,s).map(x=>x.character),['Rowan','Mayumi']);
});
