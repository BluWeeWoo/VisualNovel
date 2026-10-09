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
 await load('c2MarketWalk');assert.match(await page.locator('.backdrop').getAttribute('style'),/saint-luis-palengke/);
 await load('c2Groceries',3,{afternoonRoute:'market',graveTogether:true});assert.match(await page.locator('.backdrop').getAttribute('style'),/hill-houses-night/);
 await load('c2Mayumi',5,{afternoonRoute:'wait',graveTogether:true});
 assert.match(await page.locator('.character-stage img').getAttribute('src'),/mayumi-v2/);
 assert.match(await page.locator('.character-stage img').getAttribute('alt'),/Mayumi/);
 await page.screenshot({path:'tmp/chapter-two-mayumi-desktop.png'});
 await load('c2FamilyArrival',13,{afternoonRoute:'alone'});
 await page.screenshot({path:'tmp/chapter-two-table-desktop.png'});
 await load('c2Flowers',0,{graveTogether:true});
 assert.equal(await page.locator('[data-choice]').count(),4);
 await page.screenshot({path:'tmp/chapter-two-flowers-desktop.png'});
 await page.locator('[data-choice="2"]').click();
 assert.match(await page.locator('#dialogue-text').textContent(),/Lola/);
 await load('c2Wave3');await page.locator('.dream-skip').click();
 assert.match(await page.locator('#dialogue-text').textContent(),/I can’t/);
 await load('c2NewEnding',story.c2NewEnding.lines.length-1);
 assert.match(await page.locator('.event-cg').getAttribute('src'),/family-night.webp/);
 await page.screenshot({path:'tmp/chapter-two-ending-desktop.png'});
 assert.deepEqual(errors,[]);console.log('Desktop Mayumi, family, flowers, nightmare skip and ending passed. No page or asset errors.');
}finally{await browser.close();server.kill();}

