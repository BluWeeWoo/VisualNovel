import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';

const source=readFileSync(new URL('../src/app.js',import.meta.url),'utf8');
test('Dialogue updates keep the panel, text node and unchanged controls mounted',()=>{
 const selectors=['.dialogue-card','.speaker','.dialogue-reserve','.dialogue-status','.dialogue-extras','.dialogue-footer','.game-footer','#dialogue-text','.scene-backdrops','.scene-art'];
 const make=()=>Object.fromEntries(selectors.map(key=>[key,{innerHTML:key,className:key,replaceChildren(){}}]));
 const old=make(),incoming=make();incoming['.speaker'].innerHTML='Rowan';incoming['.dialogue-reserve'].innerHTML='A longer sentence.';
 let footerWrites=0;Object.defineProperty(old['.dialogue-footer'],'innerHTML',{get:()=>'.dialogue-footer',set:()=>footerWrites++});
 const main={querySelector:s=>old[s]},next={querySelector:s=>incoming[s]};
 const context=vm.createContext({app:{querySelector:()=>main},document:{createElement:()=>({content:{firstElementChild:next}})},updateVisual(){}});
 vm.runInContext(source.slice(source.indexOf('function mountGame('),source.indexOf('function renderGame(')),context);
 const card=old['.dialogue-card'],text=old['#dialogue-text'];context.mountGame('html','bg','art');
 assert.equal(old['.dialogue-card'],card);assert.equal(old['#dialogue-text'],text);assert.equal(footerWrites,0);
 assert.equal(old['.speaker'].innerHTML,'Rowan');assert.equal(old['.dialogue-reserve'].innerHTML,'A longer sentence.');
});

test('Rebinding persistent Next button never accumulates advance handlers',()=>{
 let advances=0;const button={dataset:{action:'next'}};
 const root={querySelectorAll:selector=>selector==='[data-action]'?[button]:[]};
 const context=vm.createContext({app:root,action:()=>advances++});
 vm.runInContext(source.slice(source.indexOf('function bind('),source.indexOf('function action(')),context);
 for(let i=0;i<10;i++)context.bind(root);
 button.onclick();assert.equal(advances,1);
});
const updateSource=source.slice(source.indexOf('async function updateVisual('),source.indexOf('function mountGame('));
function fixture(motion=false){
 const decodes=new Map(),animations=[];
 const host={dataset:{},children:[],isConnected:true,append(layer){this.children.push(layer);}};
 const element=attributes=>({getAttribute:name=>attributes[name],setAttribute:(name,value)=>attributes[name]=value});
 const document={createElement(){
  let html='',sprite=null;const running=[];
  return {
   get innerHTML(){return html;},set innerHTML(value){
    html=value;
    if(value.startsWith('sprite:')){
     const image={...element({src:value,alt:value,width:'1024',height:'1536'}),decode:()=>decodes.get(value)||Promise.resolve()};
     sprite={...element({class:'character-stage day','data-expression':value.slice(7),'data-pose':'ordinary'}),querySelector:selector=>selector==='img'?image:null};
    }
   },
   querySelector:selector=>selector==='.character-stage'?sprite:null,
   querySelectorAll(selector){return selector==='img'?[sprite?sprite.querySelector('img'):{decode:()=>decodes.get(html)||Promise.resolve()}]:selector==='.character-stage'&&sprite?[sprite]:[];},
   animate(frames,options){animations.push(options);const animation={finished:Promise.resolve(),cancel(){animation.cancelled=true;}};running.push(animation);return animation;},
   getAnimations:()=>running,
   remove(){host.children=host.children.filter(child=>child!==this);}
  };
 }};
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

test('Rowan changes expressions on the same image without a body fade or re-entry animation',async()=>{
 for(const motion of [false,true]){
  const f=fixture(motion);await f.update('sprite:neutral','neutral');
  const layer=f.host.children[0],stage=layer.querySelector('.character-stage'),image=stage.querySelector('img');
  const initialAnimations=f.animations.length;
  for(const expression of ['smile','concerned','neutral']){
   await f.update('sprite:'+expression,expression);
   assert.equal(f.host.children.length,1);
   assert.equal(f.host.children[0],layer);
   assert.equal(layer.querySelector('.character-stage'),stage);
   assert.equal(stage.querySelector('img'),image);
   assert.equal(image.getAttribute('src'),'sprite:'+expression);
   assert.equal(image.getAttribute('alt'),'sprite:'+expression);
   assert.equal(stage.getAttribute('data-expression'),expression);
   assert.equal(f.animations.length,initialAnimations);
  }
 }
});

test('A pending or failed expression keeps Rowan visible and cannot overwrite a newer expression',async()=>{
 const f=fixture(true);await f.update('sprite:neutral','neutral');
 const image=f.host.children[0].querySelector('.character-stage').querySelector('img');
 let finish;f.decodes.set('sprite:slow',new Promise(resolve=>finish=resolve));
 const pending=f.update('sprite:slow','slow');
 assert.equal(image.getAttribute('src'),'sprite:neutral');
 await f.update('sprite:smile','smile');finish();await pending;
 assert.equal(image.getAttribute('src'),'sprite:smile');
 f.decodes.set('sprite:broken',Promise.reject(new Error('Decode failed')));
 await f.update('sprite:broken','broken');
 assert.equal(image.getAttribute('src'),'sprite:smile');
 assert.equal(f.host.children.length,1);
 assert.equal(f.host.dataset.visualKey,'');
});
