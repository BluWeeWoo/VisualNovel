import test from 'node:test';
import assert from 'node:assert/strict';
import {sceneCue,createSceneEffects,motions,dreamSmoke} from '../assets/scene-effects.js';
import {story} from '../src/story.js';
test('Authored action cues exist in the script and never mutate it',()=>{
 const before=JSON.stringify(story),found=new Set();
 for(const [id,node] of Object.entries(story))for(const line of node.lines||[]){const cue=sceneCue(id,node,line.text);if(cue.action)found.add(cue.action);}
 for(const action of Object.keys(motions))assert.ok(found.has(action),`Missing script cue: ${action}`);
 assert.equal(JSON.stringify(story),before);
 assert.equal(sceneCue('c2Blackout',story.c2Blackout).ambient,'');
 assert.equal(sceneCue('c2Wake',story.c2Wake).ambient,'');
});
test('Effects cancel on exit, never replay after a menu, and suppress loaded reactions',()=>{
 const prior=globalThis.document;let starts=0,cancels=0,sounds=0,soundStops=0,removed=0;
 const element=()=>({classList:{add(){}},setAttribute(){},remove(){removed++;},animate(){starts++;return {cancel(){cancels++;}};}});
 globalThis.document={hidden:false,createElement:element};
 try{
 const root={append(){},querySelectorAll:()=>[element(),element()]};
 const fx=createSceneEffects({bump:()=>{sounds++;return ()=>soundStops++;}});
 const context={root,id:'busBump',node:story.busBump,text:'A man bumps into me.',run:1,line:0,motion:true,sound:true,volume:.3};
 fx.update(context);assert.equal(starts,2);assert.equal(sounds,1);
 fx.stop();assert.equal(cancels,2);assert.equal(soundStops,1);assert.ok(removed);
 fx.resume();assert.equal(starts,2);
 fx.update({...context,run:2,suppress:true});assert.equal(starts,2);
 fx.update({...context,run:3,motion:false});assert.equal(starts,2);assert.equal(sounds,2);
 fx.dispose();
 }finally{globalThis.document=prior;}
});

test('Nightmare smoke stays mounted between dialogue lines and stops with motion disabled',()=>{
 const prior=globalThis.document,children=[];
 globalThis.document={hidden:false,createElement:()=>({setAttribute(){},remove(){const i=children.indexOf(this);if(i>=0)children.splice(i,1);}})};
 try{
  const root={append:element=>children.push(element),querySelectorAll:()=>[]};
  const fx=createSceneEffects();
  const context={root,id:'c2Classroom',node:{place:'c2-school'},text:'',run:1,line:0,motion:true,sound:false};
  fx.update(context);
  assert.equal(children.length,1);
  const overlay=children[0];
  assert.equal(overlay.innerHTML,dreamSmoke());
  assert.match(overlay.innerHTML,/smoke-left/);
  assert.match(overlay.innerHTML,/smoke-right/);
  assert.match(overlay.innerHTML,/smoke-low/);
  fx.update({...context,line:1});
  assert.equal(children[0],overlay);
  fx.update({...context,line:2,motion:false});
  assert.equal(children.length,0);
  fx.update({...context,line:3});
  assert.equal(children.length,1);
  fx.update({...context,id:'c2Wake',node:{place:'c2-rest'},line:0});
  assert.notEqual(children[0]?.innerHTML,dreamSmoke());
  fx.dispose();assert.equal(children.length,0);
 }finally{globalThis.document=prior;}
});
