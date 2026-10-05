import fs from 'node:fs';
const draft=fs.readFileSync('drafts/Chapters-1-and-2-Revised-Script.md','utf8');
function section(id){const start=draft.indexOf('*Scene: '+id+' ·');if(start<0)throw Error(id);return draft.slice(start).split('\n---')[0].split('\n').slice(1).join('\n').trim();}
function parse(text){return text.split(/\r?\n/).map(s=>s.trim()).filter(s=>s&&!s.startsWith('*Continue')&&!s.startsWith('<')&&!s.startsWith('---')).map(s=>{const m=/^\*\*([^*]+):\*\* (.*)$/.exec(s);return m?{speaker:m[1]==='MC'?'You':m[1]==='MC (thought)'?'Thought':m[1],text:m[2].replaceAll('[MC name]','{name}') }:{speaker:'',text:s};});}
const nodes={};
function add(id,title,text,place,music,next,extra={}){nodes[id]={title,place,time:'day',day:3,chapter:2,chapterTwo:true,afternoon:true,opening:true,continuation:true,rowan:false,music,lines:typeof text==='string'?parse(text):text,...(next?{next}:{}),...extra};return nodes[id];}
const opt=(text,next,set={})=>({text,next,set});
const before=(text,mark)=>text.slice(0,text.indexOf(mark)).trim();
const after=(text,mark)=>text.slice(text.indexOf(mark)+mark.length).trim();
function conditional(text,rules){let conditions=[];const result=[];for(const raw of text.split(/\r?\n/)){const s=raw.trim();if(!s)continue;if(s.startsWith('[')){if(!(s in rules))throw Error('Unknown direction '+s);conditions=rules[s];continue;}for(const line of parse(s))result.push({...line,...(conditions.length?{conditions}:{} )});}return result;}
add('c2Lunch','Something better than eggs',before(section('c2Lunch'),'**MC choices:**'),'summer-lunch','back-together',null,{choices:[opt('Sure. I’ll wait for you.','c2Wait',{afternoonRoute:'wait',graveTogether:true,workshopVisited:false}),opt('Can I come with you?','c2Market',{afternoonRoute:'market',graveTogether:true,workshopVisited:true}),opt('Actually, I think I’d rather go alone.','c2AloneGrave',{afternoonRoute:'alone',graveTogether:false,workshopVisited:true})]});
add('c2Wait','A little time at home',before(section('c2Wait'),'**MC choices:**'),'summer-lunch','back-together',null,{choices:[opt('Do a little gardening.','c2WaitGarden',{afternoonActivity:'garden'}),opt('Watch some TV.','c2WaitTV',{afternoonActivity:'tv'}),opt('Rest on the porch.','c2WaitRest',{afternoonActivity:'porch'})]});
const garden=section('c2WaitGarden');
add('c2WaitGarden','The garden to myself',before(garden,'**[SOLO'),'summer-solo-garden',null,'c2SoloGarden');
add('c2SoloGarden','A little gardening','The garden is mine for a little while.','summer-solo-garden',null,'c2GardenAfter',{minigame:true,soloGarden:true});
const gardenEnd=after(garden,'**If the player finishes the patch:**');
const clear=parse(before(gardenEnd,'**If the player stops early:**')).map(l=>({...l,if:['soloGardenResult','cleared']}));
const early=parse(before(after(gardenEnd,'**If the player stops early:**'),'**Both outcomes continue:**')).map(l=>({...l,if:['soloGardenResult','stopped']}));
const shared=after(gardenEnd,'**Both outcomes continue:**');
add('c2GardenAfter','An afternoon in the garden',[...clear,...early,...parse(before(shared,'The front gate rattles.'))],'summer-solo-garden',null,'c2GardenReturn');
add('c2GardenReturn','Back from the market','The front gate rattles.\n'+after(shared,'The front gate rattles.'),'summer-solo-garden','back-together','c2GraveTogether',{rowan:true});
const tv=section('c2WaitTV');
add('c2WaitTV','An afternoon with the television',before(tv,'**[OPTIONAL'),'summer-television','catching-up','c2Channels0');
const channelDefs=[['cooking','A cooking show.'],['quiz','A game show.'],['movie','An old movie.']];
for(let mask=0;mask<8;mask++){
 const choices=[];
 channelDefs.forEach(([key,label],bit)=>{if(mask&(1<<bit))return;const id=`c2Channel${mask}_${key}`;choices.push(opt(label,id));const start='- **'+label+'**';const rest=after(tv,start);const end=bit<2?'- **'+channelDefs[bit+1][1]+'**':'**Channels rejoin:**';add(id,label,before(rest,end),'summer-television','catching-up','c2Channels'+(mask|(1<<bit)));});
 choices.push(opt('Keep watching for a while.','c2TVReturn'));
 add('c2Channels'+mask,'On television',mask?'I turn the remote over in my hand.':'What else is on?','summer-television','catching-up',null,{choices});
}
const tvReturn=before(after(tv,'**Channels rejoin:**'),'The local news comes on');
add('c2TVReturn','A couple of hours later',tvReturn,'summer-television','back-together','c2TVNews');
let news='The local news comes on'+after(tv,'The local news comes on');news=before(news,'*[Continuity:').replace('**[On-screen caption: MAYOR SANCHEZ — SAINT LUIS]**','On the screen: MAYOR SANCHEZ — SAINT LUIS.');
add('c2TVNews','The local news',news,'summer-television','back-together','c2GraveTogether',{rowan:true});
const rest=section('c2WaitRest'),call='**Rowan:** [MC name]!';
add('c2WaitRest','A quiet afternoon on the porch',before(rest,call),'reunion-porch',null,'c2PorchReturn');
add('c2PorchReturn','A voice at the gate',call+'\n'+after(rest,call),'reunion-porch','back-together','c2GraveTogether',{rowan:true});
const market=conditional(section('c2Market'),{'[If the Chapter 1 ambition conversation was read:]':[['porchTopic_rowan',true]],'[Otherwise:]':[['porchTopic_rowan',true,true]],'[Branches rejoin.]':[]});
const marketStart=market.findIndex(l=>l.text==='At the market, someone seems to know him at every stall.');
const workshopStart=market.findIndex(l=>l.text==='The workshop smells of sawdust.');
add('c2Market','Coming along',market.slice(0,marketStart),'summer-lunch','catching-up','c2MarketWalk',{rowan:true});
add('c2MarketWalk','At the market',market.slice(marketStart,workshopStart),'street','hill','c2Workshop',{rowan:true});
add('c2Workshop','The workshop',market.slice(workshopStart),'summer-workshop','catching-up','c2GraveTogether');
add('c2AloneGrave','A little time alone',section('c2AloneGrave'),'summer-lunch','back-together','c2Grave');
add('c2GraveTogether','At the cemetery',section('c2GraveTogether'),'summer-grave','lola','c2Grave',{rowan:true});
let grave=section('c2Grave').replace('[If Rowan came: He gets up when I reach the path, and we walk home together.]','[Together return]\nHe gets up when I reach the path, and we walk home together.').replace('[If I came alone: I follow Rowan’s directions back through the gate. When I get home, his market bags are on the kitchen table.]','[Alone return]\nI follow Rowan’s directions back through the gate. When I get home, his market bags are on the kitchen table.');
add('c2Grave','Hi, Lola',conditional(grave,{'[Only if Rowan came along:]':[['graveTogether',true]],'[Both branches continue.]':[],'[Together return]':[['graveTogether',true]],'[Alone return]':[['graveTogether',false]]}),'summer-grave','lola','c2Mayumi');
const mayumi=conditional(section('c2Mayumi'),{'[If the MC watched TV:]':[['afternoonActivity','tv']],'[Otherwise:]':[['afternoonActivity','tv',true]],'[Branches rejoin.]':[],'[If Rowan visited the workshop, with or without MC:]':[['workshopVisited',true]],'[If Rowan postponed the workshop:]':[['workshopVisited',false]]});
const reveal=mayumi.findIndex(l=>l.text==='Ro. Your father called.');
add('c2Mayumi','A familiar voice',mayumi.slice(0,reveal),'summer-mayumi','back-together','c2Family');
add('c2Family','An unanswered call',mayumi.slice(reveal),'summer-mayumi','letters','c2NewEnding');
const ending=before(section('c2NewEnding'),'**End of Chapter 2.**');
add('c2NewEnding','What Rowan wants',conditional(ending,{'[If the MC has not heard about it yet:]':[['porchTopic_rowan',true,true],['afternoonRoute','market',true]],'[All routes continue.]':[],'[If MC waited at home:]':[['afternoonRoute','wait']],'[If MC joined the market trip:]':[['afternoonRoute','market']],'[If MC visited Lola alone:]':[['afternoonRoute','alone']],'[Branches rejoin.]':[]}),'living','letters',null,{rowan:true,ending:true,openingEnd:true});
for(const [id,node] of Object.entries(nodes))if(['summer-lunch','summer-workshop','summer-mayumi'].includes(node.place)){node.cgCue={key:node.place,from:node.lines[0].text};}
fs.writeFileSync('src/chapter-two-afternoon.js','// Approved afternoon script. Route conditions preserve earlier player choices.\nexport const chapterTwoAfternoon='+JSON.stringify(nodes,null,2)+';\n');
// Add the workshop setup without changing existing reunion line indices.
const catchup=section('rCatchup');const added=parse(after(catchup,'I glance back at the door.'));added.unshift({speaker:'',text:'I glance back at the door.'});
const ambition=parse(section('aTopic_rowan_start'));
fs.writeFileSync('src/carpentry-setup.js','// Approved Chapter One additions, applied after stable scene IDs are compiled.\nexport const repairedDoor='+JSON.stringify(added,null,2)+';\nexport const apprenticeshipConversation='+JSON.stringify(ambition,null,2)+';\n');
console.log('Created',Object.keys(nodes).length,'afternoon scenes.');
