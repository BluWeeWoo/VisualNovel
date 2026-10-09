import {chromium} from 'file:///C:/Users/prinz/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
import {spawn} from 'node:child_process';
import assert from 'node:assert/strict';
import {story} from '../src/story.js';
import {freshState} from '../src/engine.js';
const server=spawn(process.execPath,['server.mjs'],{cwd:new URL('..',import.meta.url),env:{...process.env,PORT:'4196'},windowsHide:true,stdio:'pipe'});
await new Promise((resolve,reject)=>{server.stdout.once('data',resolve);server.once('error',reject);});
let browser;
try{
 browser=await chromium.launch({channel:'chrome',headless:true});
 const page=await browser.newPage({viewport:{width:1440,height:900}}),errors=[];
 page.on('pageerror',e=>{errors.push(e.message);console.log('PAGE ERROR',e.message);});page.on('response',r=>{if(r.status()>=400)errors.push(r.url());});
 await page.goto('http://127.0.0.1:4196');
 async function load(node,line){
  const s=freshState();s.node=node;s.line=line;
  await page.evaluate(s=>{localStorage.setItem('our-summer-v1-auto',JSON.stringify({date:Date.now(),state:s}));localStorage.setItem('our-summer-v1-settings',JSON.stringify({speed:0,motion:true,sound:false}));},s);
  await page.reload();await page.locator('[data-action="continue"]').first().click();await page.waitForTimeout(700);
  await page.waitForFunction(()=>[...document.querySelectorAll('.scene-art img')].every(i=>i.complete&&i.naturalWidth>0));
 }
 for(let choice=0;choice<3;choice++){
  await load('c2LunchMeal',story.c2LunchMeal.lines.length-1);
  assert.equal(await page.locator('[data-choice]').count(),3);
  assert.match(await page.locator('.event-cg').getAttribute('src'),/attentive/);
  assert.equal(await page.locator('.character-stage').count(),0);
  await page.locator(`[data-choice="${choice}"]`).click();await page.waitForTimeout(700);
  assert.equal(await page.locator('.event-cg').count(),1);
  assert.equal(await page.locator('.character-stage').count(),0);
 }
 for(const [node,text] of [['c2Wait','After lunch, he picks up the shopping bags.'],['c2Market','We clean up and prepare to go to the market.'],['c2AloneGrave','He reaches for the shopping bags.']]){
  await load(node,story[node].lines.findIndex(l=>l.text===text));
  assert.equal(await page.locator('.event-cg').count(),0);assert.ok(await page.locator('.character-stage').count()>0);
 }
 await load('c2LunchMeal',story.c2LunchMeal.lines.findIndex(l=>l.text==='He notices.'));
 assert.match(await page.locator('.event-cg').getAttribute('src'),/worried/);
 await page.screenshot({path:'tmp/lunch-worried-desktop.png'});
 assert.deepEqual(errors,[]);console.log('Lunch CG: three choices, branch replies, sprite exits and worried reaction passed.');
}finally{await browser?.close();server.kill();}
