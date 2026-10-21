import {chromium} from 'file:///C:/Users/prinz/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
import {spawn} from 'node:child_process';
import assert from 'node:assert/strict';
import {freshState,visibleLines} from '../src/engine.js';
import {story} from '../src/story.js';
const server=spawn(process.execPath,['server.mjs'],{env:{...process.env,PORT:'4198'},windowsHide:true});
await new Promise((resolve,reject)=>{server.stdout.once('data',resolve);server.once('error',reject);});
let browser;
try{
 browser=await chromium.launch({channel:'chrome',headless:true});
 const page=await browser.newPage({viewport:{width:1280,height:900}});
 await page.goto('http://127.0.0.1:4198');
 for(const level of ['Uncertain','Drawn to You']){
  const state=freshState('Alex','they',{rowanFeeling:level});state.node='aEnd';state.line=visibleLines(story.aEnd,state).length-1;
  await page.evaluate(state=>{localStorage.setItem('our-summer-v1-auto',JSON.stringify({date:Date.now(),state}));localStorage.setItem('our-summer-v1-settings',JSON.stringify({speed:0,motion:false,sound:false}));},state);
  await page.reload();await page.locator('[data-action=continue]').first().click();
  await page.waitForSelector('.feelings-modal');
  assert.equal(await page.locator('#confirm-feeling').isDisabled(),true);
  await page.locator(`[data-feeling="${level}"]`).click();
  assert.equal(await page.locator(`[data-feeling="${level}"]`).getAttribute('aria-pressed'),'true');
  assert.equal(await page.locator('#confirm-feeling').isDisabled(),false);
  if(level==='Drawn to You')assert.equal(await page.locator('[data-feeling=Uncertain]').isDisabled(),true);
  await page.screenshot({path:'tmp/feeling-cards-'+level.replaceAll(' ','-')+'.png'});
 }
 await page.setViewportSize({width:390,height:844});
 assert.ok(await page.locator('.feelings-modal').evaluate(el=>el.scrollWidth<=el.clientWidth));
 await page.locator('#confirm-feeling').click();
 await page.waitForSelector('.chapters-modal');
 console.log('Cards: selection, disabled earlier states, mobile width and confirmation passed.');
}finally{await browser?.close();server.kill();}
