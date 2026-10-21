import {chromium} from 'file:///C:/Users/prinz/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
import {spawn} from 'node:child_process';
import assert from 'node:assert/strict';
import {freshState,visibleLines} from '../src/engine.js';
import {story} from '../src/story.js';
const server=spawn(process.execPath,['server.mjs'],{env:{...process.env,PORT:'4199'},windowsHide:true});
await new Promise((resolve,reject)=>{server.stdout.once('data',resolve);server.once('error',reject);server.once('exit',c=>reject(Error('Server exited '+c)));});
let browser;
try{
 browser=await chromium.launch({channel:'chrome',headless:true});
 const page=await browser.newPage({viewport:{width:1280,height:900}});
 const errors=[];page.on('pageerror',e=>errors.push(String(e)));
 await page.goto('http://127.0.0.1:4199');
 await page.evaluate(()=>localStorage.setItem('our-summer-v1-settings',JSON.stringify({speed:0,motion:false,sound:false})));
 await page.reload();await page.locator('[data-action="new"]').first().click();
 await page.locator('.summer-begin').click();
 await page.locator('[name="rowanFeeling"][value="Uncertain"]').check();
 await page.locator('.summer-begin').click();await page.locator('.confirm-summer').click();
 await page.waitForSelector('.game-screen');
 const started=await page.evaluate(()=>JSON.parse(localStorage.getItem('our-summer-v1-auto')).state);
 assert.equal(started.node,'rbJourney_uncertain');
 for(const [level,id] of [['Uncertain','rbVisit_uncertain'],['Familiar','rbBreak'],['Drawn to You','rbReunion_drawn'],['In Love','rbReunion_love']]){
  const s=freshState('Alex','they',{rowanFeeling:level});s.node=id;s.line=visibleLines(story[id],s).length-1;
  if(level==='In Love')s.flags.relationship='romance';
  await page.evaluate(s=>localStorage.setItem('our-summer-v1-auto',JSON.stringify({date:Date.now(),state:s})),s);
  await page.reload();await page.locator('[data-action="continue"]').first().click();
  await page.waitForSelector('.game-screen');
  await page.waitForTimeout(500);
  assert.ok((await page.locator('#dialogue-text').innerText()).length>0);
  assert.equal(await page.locator('.choice').count()>0||await page.locator('[data-choice]').count()>0,true);
  await page.screenshot({path:'tmp/chapter-one-'+level.toLowerCase().replaceAll(' ','-')+'.png'});
 }
 const s=freshState('Alex','they',{rowanFeeling:'Uncertain'});s.node='aEnd';s.line=visibleLines(story.aEnd,s).length-1;
 await page.evaluate(s=>localStorage.setItem('our-summer-v1-auto',JSON.stringify({date:Date.now(),state:s})),s);
 await page.reload();await page.locator('[data-action="continue"]').first().click();
 await page.waitForSelector('[data-feeling="Uncertain"]');
 assert.deepEqual(errors,[]);console.log('Browser: new-game route, four scene renders, and chapter ending passed.');
}finally{await browser?.close();server.kill();}
