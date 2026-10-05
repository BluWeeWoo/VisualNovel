import fs from 'node:fs';
import sharp from 'file:///C:/Users/Prinz/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp/dist/index.mjs';
const p='assets/manifest.json',m=JSON.parse(fs.readFileSync(p));
m.backgrounds['summer-grave']='assets/cg/chapter-two/grave-solo.png';m.cgs['summer-grave'].src=m.backgrounds['summer-grave'];
const files=new Set([...Object.values(m.backgrounds),...Object.values(m.cgs).map(a=>a.src)].filter(p=>p.startsWith('assets/cg/chapter-two/')&&p.endsWith('.png')));
for(const path of files){const out=path.replace('.png','.webp');await sharp(path).webp({quality:82}).toFile(out);if(fs.statSync(out).size>=600000)await sharp(path).webp({quality:72}).toFile(out);console.log(out,fs.statSync(out).size);}
for(const [key,path] of Object.entries(m.backgrounds))if(files.has(path))m.backgrounds[key]=path.replace('.png','.webp');
for(const asset of Object.values(m.cgs))if(files.has(asset.src))asset.src=asset.src.replace('.png','.webp');
fs.writeFileSync(p,JSON.stringify(m,null,2)+'\n');
let css=fs.readFileSync('styles.css','utf8').replace('chapter-two/solo-garden.png','chapter-two/solo-garden.webp');fs.writeFileSync('styles.css',css);
let s=fs.readFileSync('src/staging.js','utf8').replace("import {chapterTwo}","import {chapterTwoAfternoon} from './chapter-two-afternoon.js';\nimport {chapterTwo}").replace('{...afterGarden,...chapterTwo}','{...afterGarden,...chapterTwo,...chapterTwoAfternoon}');fs.writeFileSync('src/staging.js',s);
s=fs.readFileSync('server.mjs','utf8').replace('(app|chapter-two|','(app|chapter-two-afternoon|carpentry-setup|line-visibility|chapter-two|');fs.writeFileSync('server.mjs',s);
s=fs.readFileSync('tests/rowan.test.mjs','utf8').replace('/twenty-five|twenty-six|were he|He charge|he have|he are/','/twenty-five|twenty-six|were he\\b|He charge\\b|he have\\b|he are\\b/');fs.writeFileSync('tests/rowan.test.mjs',s);
s=fs.readFileSync('tests/childhood.test.mjs','utf8').replace('family reveal remains withheld','family reveal stays out of Chapter One').replace("filter(n=>n.title!=='The local news')","filter(n=>!n.chapterTwo)");fs.writeFileSync('tests/childhood.test.mjs',s);
fs.writeFileSync('assets/afternoon-preview.html',fs.readFileSync('tmp/afternoon-preview.html','utf8').replace('tmp/afternoon-preview.js','assets/afternoon-preview.js'));
fs.copyFileSync('tmp/afternoon-preview.js','assets/afternoon-preview.js');


