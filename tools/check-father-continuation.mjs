import {chromium} from 'file:///C:/Users/prinz/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {freshState} from '../src/engine.js';
import {story} from '../src/story.js';
const server=spawn(process.execPath,['server.mjs'],{cwd:new URL('..',import.meta.url),env:{...process.env,PORT:'4194'},windowsHide:true,stdio:'pipe'});
await new Promise((resolve,reject)=>{server.stdout.once('data',resolve);server.once('error',reject);});
let browser;
try{
 browser=await chromium.launch({channel:'chrome',headless:true});
 const page=await browser.newPage({viewport:{width:1440,height:900}}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)errors.push(r.status()+' '+r.url());});
 await page.goto('http://127.0.0.1:4194');
 async function load(node,line=0){
  const s=freshState();s.node=node;s.line=line;s.flags.workshopVisited=true;
  await page.evaluate(s=>{localStorage.setItem('our-summer-v1-auto',JSON.stringify({date:Date.now(),state:s}));localStorage.setItem('our-summer-v1-settings',JSON.stringify({speed:0,motion:false,sound:false}));},s);
  await page.reload();await page.locator('[data-action="continue"]').first().click();
  await page.waitForTimeout(600);
  await page.waitForFunction(()=>[...document.querySelectorAll('.scene-art img')].every(i=>i.complete&&i.naturalWidth>0));
 }
 await load('c2NewEnding',3);
 await page.locator('[data-action="next"]').click();
 await page.waitForFunction(()=>document.querySelectorAll('.character-stage').length===2);
 assert.match(await page.locator('.dialogue-card').innerText(),/His father/);
 assert.equal(await page.locator('.character-stage').count(),2);
 for(const [node,file] of [['c2NewEnding','dinner-interrupted'],['c2KitchenHonesty','kitchen-honesty'],['c2BirthdayDinner','birthday'],['c2CardiganGifts','cardigan-gifts'],['c2FatherReveal','father-reveal']]){
  await load(node,node==='c2NewEnding'?1:0);
  assert.match(await page.locator('.event-cg').getAttribute('src'),new RegExp('father-continuation-v1/'+file));
 }
 await page.screenshot({path:'tmp/father-reveal-desktop.png'});
 for(const node of ['c2BirthdayWish','c2BirthdayStairs']){
  await load(node);assert.equal(await page.locator('.character-stage').count(),0);assert.equal(await page.locator('.event-cg').count(),0);
  assert.match(await page.locator('.backdrop').getAttribute('style'),/father-continuation-v1/);
 }
 await load('c2KitchenAsk',story.c2KitchenAsk.lines.length-1);
 assert.equal(await page.locator('[data-choice]').count(),2);
 await page.locator('[data-choice="1"]').click();assert.match(await page.locator('.dialogue-card').innerText(),/want to rest/);
 await load('c2FatherPresent',story.c2FatherPresent.lines.length-1);
 assert.match(await page.locator('.dialogue-card').innerText(),/I’m listening, Ro/);
 assert.equal(await page.locator('.event-cg').count(),0);assert.equal(await page.locator('.character-stage').count(),1);
 await page.screenshot({path:'tmp/father-present-desktop.png'});
 assert.deepEqual(errors,[]);console.log('Desktop: old endpoint continues, all five CGs, flashback backgrounds, choices and new ending passed. No asset or page errors.');
}finally{await browser?.close();server.kill();}
