import {chromium} from 'file:///C:/Users/prinz/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {freshState,visibleLines} from '../src/engine.js';
import {story} from '../src/story.js';
const browser=await chromium.launch({channel:'chrome',headless:true});
const page=await browser.newPage({viewport:{width:1440,height:900}}),errors=[];
const server=spawn(process.execPath,['server.mjs'],{cwd:new URL('..',import.meta.url),env:{...process.env,PORT:'4193'},windowsHide:true,stdio:'pipe'});
await new Promise((resolve,reject)=>{server.stdout.once('data',resolve);server.once('error',reject);server.once('exit',code=>reject(new Error('Preview stopped: '+code)));});
page.on('pageerror',e=>errors.push(e.message));
page.on('response',r=>{if(r.status()>=400)errors.push(r.status()+' '+r.url());});
try{
 await page.goto('http://127.0.0.1:4193');
 async function load(node,line=0,flags={}){
  const s=freshState();s.node=node;s.line=line;Object.assign(s.flags,flags);
  s.history=[{id:'rReturn:0',speaker:'',text:'Rowan’s contact is saved.'}];
  await page.evaluate(s=>{localStorage.setItem('our-summer-v1-auto',JSON.stringify({date:Date.now(),state:s}));localStorage.setItem('our-summer-v1-settings',JSON.stringify({speed:0,motion:false,sound:false}));},s);
  await page.reload();await page.waitForTimeout(700);
  if(!await page.locator('[data-action="continue"]').count())throw new Error(JSON.stringify({errors,body:await page.locator('body').innerText()}));
  await page.locator('[data-action="continue"]').first().click();
  await page.waitForTimeout(500);
  await page.waitForFunction(()=>[...document.querySelectorAll('.scene-art img')].every(i=>i.complete&&i.naturalWidth>0));
 }
 await load('c2Tricycle',0);assert.match(await page.locator('.backdrop').getAttribute('style'),/porch-door-v2\/waiting/);
 await page.screenshot({path:'tmp/tricycle-stop-desktop.png'});
 await load(Object.keys(story).find(id=>story[id].place==='repair'),0);assert.match(await page.locator('.backdrop').getAttribute('style'),/porch-door-v2\/door-repair/);
 await load('c2Workshop',4);assert.match(await page.locator('.event-cg').getAttribute('src'),/scene-approved-v1\/nestor/);
 await page.locator('[data-action="next"]').click();await page.waitForTimeout(100);
 await load('c2Workshop',8);assert.equal(await page.locator('.event-cg').count(),0);
 await load('c2GraveTogether',2,{graveTogether:false,c2Flowers:'roses'});assert.match(await page.locator('.event-cg').getAttribute('src'),/grave-alone-roses/);
 await load('c2GraveTogether',2,{graveTogether:true,c2Flowers:'lilies'});assert.match(await page.locator('.event-cg').getAttribute('src'),/grave-together-lilies/);
 await load('c2Grave',5,{graveTogether:true,c2GraveStay:true,c2Flowers:'orchids'});assert.match(await page.locator('.event-cg').getAttribute('src'),/grave-comfort-orchids/);
 await load('c2Mayumi',0,{graveTogether:true});assert.match(await page.locator('.event-cg').getAttribute('src'),/mayumi/);
 await load('c2Mayumi',7,{graveTogether:true});assert.equal(await page.locator('.character-stage').count(),2);
 await page.screenshot({path:'tmp/approved-dual-cast-desktop.png'});
 await load('c2FamilyArrival',0,{graveTogether:false});assert.equal(await page.locator('.character-stage').count(),1);
 await load('c2FamilyArrival',6,{graveTogether:false});assert.equal(await page.locator('.character-stage').count(),2);
 assert.deepEqual(errors,[]);console.log('Desktop Mayumi, family, flowers, nightmare skip and ending passed. No page or asset errors.');
}finally{await browser.close();server.kill();}

