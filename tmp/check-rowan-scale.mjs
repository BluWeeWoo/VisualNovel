import {chromium} from 'file:///C:/Users/prinz/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
import {spawn} from 'node:child_process';
import {freshState} from '../src/engine.js';
import {story} from '../src/story.js';
import assert from 'node:assert/strict';
const server=spawn(process.execPath,['server.mjs'],{cwd:process.cwd(),env:{...process.env,PORT:'4195'},windowsHide:true});
await new Promise(r=>server.stdout.once('data',r));
let browser;
try{
 browser=await chromium.launch({channel:'chrome',headless:true});
 const page=await browser.newPage({viewport:{width:1440,height:900}});
 await page.goto('http://127.0.0.1:4195');
 for(const [node,text,key] of [
 ['c2KitchenAsk','You’d just got here. I didn’t want to burden you with my problems.','weak-smile'],
 ['c2EndYourself','Thank you, {name}. For reminding me.','relieved'],
 ['c2EndSupport','Then came Lola’s funeral.','downcast']]){
 const s=freshState();s.node=node;s.line=story[node].lines.findIndex(l=>l.text===text);
 await page.evaluate(s=>{localStorage.setItem('our-summer-v1-auto',JSON.stringify({date:Date.now(),state:s}));localStorage.setItem('our-summer-v1-settings',JSON.stringify({speed:0,motion:false,sound:false}));},s);
 await page.reload();await page.locator('[data-action="continue"]').first().click();
 await page.waitForFunction(()=>[...document.querySelectorAll('.scene-art img')].every(i=>i.complete&&i.naturalWidth));
 await page.waitForTimeout(300);
 const bounds=await page.locator('.character-stage[data-character=Rowan]').boundingBox();assert(Math.abs(bounds.height-1450.8)<2,'Rowan must use the original full-body scale');const images=await page.locator('img').evaluateAll(imgs=>imgs.map(i=>i.getAttribute('src')));
 assert(images.some(s=>s?.includes('rowan-expressions-v3/'+key)));
 assert((await page.content()).includes('kitchen-night-clear-v2'));
 await page.screenshot({path:'tmp/rowan-'+key+'-fixed.png'});
 }
 console.log('All three corrected sprites and table-free background loaded in game.');
}finally{await browser?.close();server.kill();}


