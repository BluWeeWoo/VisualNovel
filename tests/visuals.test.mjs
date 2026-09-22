import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';

const source=readFileSync(new URL('../src/app.js',import.meta.url),'utf8');
const updateSource=source.slice(source.indexOf('async function updateVisual('),source.indexOf('function mountGame('));
function fixture(motion=false){
 const decodes=new Map(),animations=[];
 const host={dataset:{},children:[],isConnected:true,append(layer){this.children.push(layer);}};
 const document={createElement(){return {
  innerHTML:'',querySelectorAll(selector){return selector==='img'?[{decode:()=>decodes.get(this.innerHTML)||Promise.resolve()}]:[];},
  animate(frames,options){animations.push(options);return {finished:Promise.resolve()};},
  remove(){host.children=host.children.filter(child=>child!==this);}
 };}};
 const context=vm.createContext({document,settings:{motion},matchMedia:()=>({matches:false}),Image:class{}});
 vm.runInContext(updateSource,context);
 return {host,decodes,animations,update:(html,key)=>context.updateVisual(host,html,key)};
}
test('Unchanged artwork keeps its mounted layer across dialogue updates',async()=>{
 const f=fixture();await f.update('neutral','neutral');const original=f.host.children[0];
 await f.update('neutral','neutral');assert.equal(f.host.children.length,1);assert.equal(f.host.children[0],original);
});
test('Pending images keep old artwork visible; stale loads cannot replace newer scenes',async()=>{
 const f=fixture();await f.update('old','old');const original=f.host.children[0];
 let finish;f.decodes.set('slow',new Promise(resolve=>finish=resolve));const pending=f.update('slow','slow');
 assert.equal(f.host.children[0],original);
 await f.update('new','new');finish();await pending;
 assert.equal(f.host.children.length,1);assert.equal(f.host.children[0].innerHTML,'new');
});
test('Visual replacements crossfade with motion and swap directly with reduced motion',async()=>{
 for(const motion of [false,true]){
  const f=fixture(motion);await f.update('a','a');await f.update('b','b');
  assert.equal(f.host.children.length,1);assert.equal(f.animations.length,motion?2:0);
 }
});
