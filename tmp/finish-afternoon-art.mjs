import fs from 'node:fs';
import sharp from 'file:///C:/Users/Prinz/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp/dist/index.mjs';
await sharp('assets/cg/chapter-two/television-news.png').webp({quality:82}).toFile('assets/cg/chapter-two/television-news.webp');
const p='assets/manifest.json',m=JSON.parse(fs.readFileSync(p));m.backgrounds['summer-news']='assets/cg/chapter-two/television-news.webp';m.cgs['summer-news']={src:m.backgrounds['summer-news'],alt:'Mayor Sanchez appears in a local news report on the living room television.'};fs.writeFileSync(p,JSON.stringify(m,null,2)+'\n');
let script=fs.readFileSync('src/chapter-two-afternoon.js','utf8');const prefix=script.slice(0,script.indexOf('{')),nodes=JSON.parse(script.slice(script.indexOf('{')).trim().replace(/;$/,''));nodes.c2TVNews.place='summer-news';
// Keep the first news report readable; Rowan's portrait would cover the television.
nodes.c2TVNews.rowan=false;
for(const id of ['c2WaitTV','c2TVReturn'])nodes[id].rowan=false;
// Rowan departs in this scene: dismiss the lunch CG as he reaches the gate.
nodes.c2Wait.cgCue.until='He starts down the steps';nodes.c2Wait.rowan=false;
// Morning clothes are intentionally consistent across all afternoon CGs.
fs.writeFileSync('src/chapter-two-afternoon.js',prefix+JSON.stringify(nodes,null,2)+';\n');
