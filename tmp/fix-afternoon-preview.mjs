import fs from 'node:fs';
let s=fs.readFileSync('server.mjs','utf8').replace("from './src/provider-policy.js'","from '../src/provider-policy.js'").replace('const root = path.dirname(fileURLToPath(import.meta.url));',"const root = path.resolve('.');").replace('const target=path.resolve(root,relative);',"const target=path.resolve(root,relative==='index.html'?'tmp/afternoon-preview.html':relative);");fs.writeFileSync('tmp/afternoon-server.mjs',s);
s=fs.readFileSync('index.html','utf8').replace('src="src/app.js"','src="assets/afternoon-preview.js"');fs.writeFileSync('tmp/afternoon-preview.html',s);
s=fs.readFileSync('tests/childhood.test.mjs','utf8').replace('filter(n=>!n.chapterTwo)',"filter(n=>!n.chapterTwo&&n.title!=='The local news')");fs.writeFileSync('tests/childhood.test.mjs',s);
const p='src/chapter-two-afternoon.js',src=fs.readFileSync(p,'utf8'),prefix=src.slice(0,src.indexOf('{')),nodes=JSON.parse(src.slice(src.indexOf('{')).trim().replace(/;$/,''));nodes.c2Wait.place='living';
const at=nodes.c2Workshop.lines.findIndex(l=>l.text==='Outside, Rowan walks a little faster.');
nodes.c2WorkshopAfter={...nodes.c2Workshop,title:'An answer by Friday',place:'street',rowan:true,lines:nodes.c2Workshop.lines.slice(at)};delete nodes.c2WorkshopAfter.cgCue;
nodes.c2Workshop.lines=nodes.c2Workshop.lines.slice(0,at);nodes.c2Workshop.next='c2WorkshopAfter';fs.writeFileSync(p,prefix+JSON.stringify(nodes,null,2)+';\n');
