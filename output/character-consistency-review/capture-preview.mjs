import {chromium} from 'file:///C:/Users/prinz/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
import {fileURLToPath} from 'node:url';
const browser=await chromium.launch({channel:'chrome',headless:true});
try{
 const page=await browser.newPage({viewport:{width:1156,height:876}});
 await page.goto(new URL('stage-preview.html',import.meta.url).href);
 await page.waitForFunction(()=>[...document.images].every(i=>i.complete&&i.naturalWidth));
 await page.screenshot({path:fileURLToPath(new URL('after-scene-preview.png',import.meta.url))});
}finally{await browser.close();}
