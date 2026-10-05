import fs from 'node:fs';
fs.writeFileSync('tmp/afternoon-preview.html',fs.readFileSync('index.html','utf8').replace('<head>','<head><base href="/">').replace('src="src/app.js"','src="tmp/afternoon-preview.js"'));
fs.writeFileSync('tmp/afternoon-preview.js',`import {freshState} from '../src/engine.js';
import {story} from '../src/story.js';
const params=new URLSearchParams(location.search),id=params.get('scene')||'c2Lunch';
if(!sessionStorage.getItem(location.search)){
 const state=freshState('Alex','they');state.node=id;state.line=Number(params.get('line')||0);state.flags={...state.flags,chapterOneComplete:true,afternoonRoute:'wait',afternoonActivity:'tv',workshopVisited:false,graveTogether:true,rowanAffection:7};
 if(params.has('almost')){state.flags.soloGardenRound={mode:'untimed',elapsed:0,you:17,rowan:0,pulled:Array.from({length:17},(_,i)=>i),finished:false,required:Array(18).fill(2),attempts:[...Array(17).fill(2),1],solo:true};}
 localStorage.setItem('our-summer-v1-auto',JSON.stringify({date:Date.now(),state}));
 localStorage.setItem('our-summer-v1-settings',JSON.stringify({speed:0,motion:false,sound:true,volume:.15,language:'english'}));sessionStorage.setItem(location.search,'seeded');
}
await import('../src/app.js');
`);
