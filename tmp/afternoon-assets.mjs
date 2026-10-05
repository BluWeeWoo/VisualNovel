import fs from 'node:fs';
const p='assets/manifest.json',m=JSON.parse(fs.readFileSync(p));
const art={lunch:'Rowan shares fried tilapia, tomatoes and rice at Lola’s kitchen table.', 'solo-garden':'An empty sunlit garden, with gloves and a bucket ready beside the steps.', television:'A quiet afternoon in the living room with the television on.',workshop:'Rowan inspects a handmade table in Mang Nestor’s workshop.',grave:'Flowers beside Lola’s grave under a shady tree.',mayumi:'Mayumi and Rowan talk across the kitchen table.'};
for(const [id,alt] of Object.entries(art)){const src='assets/cg/chapter-two/'+id+'.png';m.backgrounds['summer-'+id]=src;m.cgs['summer-'+id]={src,alt};}
fs.writeFileSync(p,JSON.stringify(m,null,2)+'\n');
fs.appendFileSync('styles.css',`
/* The afternoon round has no rival imagery or score. */
.solo-garden .weed-canvas{background-image:url('assets/cg/chapter-two/solo-garden.png');background-size:cover}
.solo-garden .weed-patch{background:#705034c9;border:3px solid #9c7951;border-radius:48% 44% 42% 46%;box-shadow:inset 0 0 24px #30211280}
.solo-garden .weed-bottom{grid-template-columns:1fr auto;left:22%;right:5%}
.solo-garden .weed-stop{padding:10px 18px;min-height:44px;grid-column:1/-1;justify-self:end}
@media(max-width:700px){.solo-garden .weed-bottom{left:3%;right:3%;grid-template-columns:1fr}.solo-garden .weed-stop{justify-self:stretch}.solo-garden .weed-patch{background:#705034e8}.solo-garden .weed-canvas{background-size:auto 100%;background-position:center}}
`);
// Reduce score music during news; use quiet nature alone in the garden and porch.
let audio=fs.readFileSync('src/opening-audio.js','utf8');audio=audio.replace('if(node.chapterTwo){',`if(node.afternoon){
  const layers=node.music?[{key:node.music,level:state.node==='c2TVNews'?.12:state.node==='c2Family'?.18:.26}]:[];
  layers.push({key:'outdoors',level:node.soloGarden||['c2WaitGarden','c2GardenAfter','c2WaitRest'].includes(state.node)?.18:.07});
  return cue(layers,2.5);
 }
 if(node.chapterTwo){`);fs.writeFileSync('src/opening-audio.js',audio);
let test=fs.readFileSync('tests/chapter-two.test.mjs','utf8').replace('Every Chapter Two choice reaches the partial ending','Every nightmare and recovery choice reaches the afternoon bridge').replace("if(n.ending){assert.equal(s.node,'c2End');","if(s.node==='c2End'){assert.equal(n.next,'c2Lunch');");fs.writeFileSync('tests/chapter-two.test.mjs',test);
console.log('Registered artwork and audio.');
