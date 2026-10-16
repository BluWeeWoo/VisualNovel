import {chromium} from 'file:///C:/Users/prinz/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
import {spawn} from 'node:child_process';
import assert from 'node:assert/strict';
import {freshState,visibleLines} from '../src/engine.js';
import {story} from '../src/story.js';
const server=spawn(process.execPath,['server.mjs'],{env:{...process.env,PORT:'4198'},windowsHide:true});
await new Promise(r=>server.stdout.once('data',r));
let browser;
try{
 browser=await chromium.launch({channel:'chrome',headless:true});
 const page=await browser.newPage({viewport:{width:1280,height:900}});
 page.on('console',m=>{if(m.type()==='error')console.log(m.text())});page.on('requestfailed',r=>console.log('FAILED',r.url(),r.failure())); const errors=[];page.on('pageerror',e=>{errors.push(String(e));console.log('PAGE ERROR',String(e));});
 await page.goto('http://127.0.0.1:4198');
 await page.evaluate(()=>localStorage.setItem('our-summer-v1-settings',JSON.stringify({speed:0,motion:false,sound:false})));
 await page.reload();await page.waitForTimeout(2000);console.log('PAGE',await page.locator('body').innerText());await page.screenshot({path:'tmp/feelings-debug.png'});await page.locator('[data-action="new"]').first().click();
 await page.locator('#summer-name').fill('Mika');
 assert.equal(await page.getByText('No portrait',{exact:true}).count(),0);
 for(const [pronoun,key] of [['he','androgynous-v1'],['she','female-v1'],['they','androgynous-v2']]){
  await page.locator('[name="pronouns"][value="'+pronoun+'"]').check();
  await page.waitForFunction(key=>{const i=document.querySelector('.player-silhouette');return i.src.includes('silhouette-'+key+'.png')&&i.complete&&i.naturalWidth>0;},key);
  await page.screenshot({path:'tmp/silhouette-'+key+'-setup.png'});
 }
 await page.locator('[name="pronouns"][value="custom"]').check();
 await page.locator('.cancel-custom').click();
 assert.ok(await page.locator('[name="pronouns"][value="they"]').isChecked());
 await page.locator('[name="pronouns"][value="custom"]').check();
 await page.locator('.custom-pronoun-form button[type="submit"]').click();
 assert.match(await page.locator('.player-silhouette').getAttribute('src'),/androgynous/);
 await page.locator('[name="pronouns"][value="she"]').check();

 assert.equal(await page.locator('.summer-page-two').isVisible(),false);
 await page.screenshot({path:'tmp/feelings-setup-about.png'});
 await page.locator('.summer-begin').click();
 assert.equal(await page.locator('.summer-page-one').isVisible(),false);

 for(const [level,file] of [['Uncertain','uncertain'],['Familiar','familiar'],['Drawn to You','drawn'],['In Love','love']]){
  await page.locator('[name="rowanFeeling"][value="'+level+'"]').check();
  await page.waitForFunction(file=>{const img=document.querySelector('.summer-rowan-crop img');return img.src.endsWith('/'+file+'-v1.png')&&img.complete&&img.naturalWidth>0;},file);
  await page.screenshot({path:'tmp/rowan-affinity-'+file+'.png'});
 }
 await page.locator('[name="rowanFeeling"][value="Drawn to You"]').check();
 await page.waitForFunction(()=>document.querySelector('.summer-rowan-crop img').src.endsWith('/drawn-v1.png'));

 assert.match(await page.locator('#preview-mc').textContent(),/glad/);
 await page.screenshot({path:'tmp/feelings-setup-rowan.png'});
 await page.locator('.summer-begin').click();
 await page.screenshot({path:'tmp/feelings-setup-review.png'});
 await page.locator('.keep-editing').click();
 await page.locator('.summer-back').click();
 assert.equal(await page.locator('#summer-name').inputValue(),'Mika');
 await page.locator('.summer-begin').click();
 assert.ok(await page.locator('[value="Drawn to You"]').isChecked());
 await page.locator('.summer-begin').click();await page.locator('.confirm-summer').click();
 await page.waitForSelector('.game-screen');
 const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('our-summer-v1-auto')).state);
 assert.equal(saved.flags.rowanFeelingChapter1,'Drawn to You');assert.equal(saved.pronouns,'she');assert.equal(saved.portrait,'silhouette');
 const s=freshState('Mika','they',{rowanFeeling:'Familiar'});s.node='aEnd';s.line=visibleLines(story.aEnd,s).length-1;
 await page.evaluate(s=>localStorage.setItem('our-summer-v1-auto',JSON.stringify({date:Date.now(),state:s})),s);
 await page.reload();await page.locator('[data-action="continue"]').first().click();
 await page.waitForSelector('[data-feeling="Familiar"]');
 assert.ok(await page.locator('[data-feeling="Uncertain"]').isDisabled());
 await page.locator('[data-feeling="Drawn to You"]').click();await page.locator('#confirm-feeling').click();
 await page.locator('[data-action="chapter-two"]').click();
 const reflected=await page.evaluate(()=>JSON.parse(localStorage.getItem('our-summer-v1-auto')).state);
 assert.equal(reflected.flags.rowanFeelingChapter1,'Familiar');assert.equal(reflected.flags.rowanFeelingChapter2,'Drawn to You');
 assert.deepEqual(errors,[]);console.log('Setup pages, confirmation, persistence, reflection, and Chapter 2 handoff passed.');
}finally{await browser?.close();server.kill();}

