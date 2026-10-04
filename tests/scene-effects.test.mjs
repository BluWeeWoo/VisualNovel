import test from 'node:test';
import assert from 'node:assert/strict';
import {sceneCue,createSceneEffects,motions} from '../assets/scene-effects.js';
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
