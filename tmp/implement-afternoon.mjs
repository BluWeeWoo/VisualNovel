import fs from 'node:fs';
function edit(path,from,to){let s=fs.readFileSync(path,'utf8');if(!s.includes(from))throw Error(path+' missing '+from.slice(0,70));fs.writeFileSync(path,s.replace(from,to));}
edit('src/chapter-two.js',"const scene=", "const scene=");
edit('src/chapter-two.js',"ending:true,openingEnd:true,cgCue:{key:'c2-rest'","next:'c2Lunch',cgCue:{key:'c2-rest'");
edit('src/story.js',"import {chapterTwo}","import {chapterTwoAfternoon} from './chapter-two-afternoon.js';\nimport {repairedDoor,apprenticeshipConversation} from './carpentry-setup.js';\nimport {chapterTwo}");
edit('src/story.js','Object.assign(story, chapterTwo);',`Object.assign(story, chapterTwo, chapterTwoAfternoon);
story.rCatchup.lines.push(...repairedDoor);
for(const [id,node] of Object.entries(story))if(/^aTopic\\d+_rowan_start$/.test(id))node.lines=apprenticeshipConversation.map(l=>({...l}));`);
edit('src/continuation.js'," 'Some things here haven’t changed much.',",` 'I’ve been helping at Mang Nestor’s workshop sometimes.',
 'Mostly sanding things. Apparently you have to do a lot of that before anyone lets you touch the expensive wood.',
 'I made Lola a little shelf last month.',
 'It leaned.',
 'She put a plant on it anyway and told me it was fine.',
 'I fixed it before she could show anyone.',
 'Some things here haven’t changed much.',`);
// Shared conditional rendering keeps the text, staging and audio reading positions aligned.
fs.writeFileSync('src/line-visibility.js',`export function lineVisible(line,flags={}){
 return (!line.if||flags[line.if[0]]===line.if[1])&&(!line.conditions||line.conditions.every(([key,value,negate])=>negate?flags[key]!==value:flags[key]===value));
}
`);
for(const file of ['src/engine.js','src/staging.js','src/opening-audio.js']){let s=fs.readFileSync(file,'utf8');s="import {lineVisible} from './line-visibility.js';\n"+s;s=s.replaceAll('!line.if || state.flags[line.if[0]] === line.if[1]','lineVisible(line,state.flags)').replaceAll('!l.if||state.flags[l.if[0]]===l.if[1]','lineVisible(l,state.flags)').replaceAll('!l.if||state.flags?.[l.if[0]]===l.if[1]','lineVisible(l,state.flags)');fs.writeFileSync(file,s);}
// Preserve current text/history when the optional ambition conversation expands.
edit('src/engine.js','export function migrateStorySave(s,story){',`export function migrateStorySave(s,story){
 if(s?.version===VERSION&&s.flags&&Array.isArray(s.history)&&!s.carpentryRevision){
  const changed=id=>/^aTopic\\d+_rowan_start$/.test(id);
  if(changed(s.node)&&story[s.node]){
   const old=s.history.find(h=>h.id===s.node+':'+s.line);
   const index=old?story[s.node].lines.findIndex(l=>interpolate(l.text,s)===old.text):-1;
   s.line=index>=0?index:Math.min(s.line,story[s.node].lines.length-1);
  }
  s.history=s.history.map(h=>{
   const cut=h.id.lastIndexOf(':'),id=h.id.slice(0,cut);
   if(!changed(id)&&!h.id.startsWith('letter:'))return h;
   if(h.id.startsWith('letter:'))return {...h,id:'carpentryV0:'+h.id};
   const index=story[id]?.lines.findIndex(l=>interpolate(l.text,s)===h.text)??-1;
   return {...h,id:index>=0?id+':'+index:'carpentryV0:'+h.id};
  });
  if(s.node==='c2End')s.completed=false;
  s.carpentryRevision=1;
 }
`);
edit('src/engine.js','storyRevision: 6, seviSceneRevision: 3','storyRevision: 6, seviSceneRevision: 3, carpentryRevision: 1');
edit('src/app.js',"volume:settings.volume,done:()=>{enter('gResult');", "volume:settings.volume,solo:!!story[state.node].soloGarden,done:()=>{enter(story[state.node].soloGarden?story[state.node].next:'gResult');");
edit('src/app.js',"Chapter Two’s opening is complete. Your place is saved; the rest of the chapter is still to come.","Chapter Two is complete. Your choices and this moment are saved.");
edit('src/app.js',"busy||story[state.node]?.nightmare)return;","busy||story[state.node]?.nightmare||story[state.node]?.minigame)return;");
edit('assets/chapters.js',"state?.node==='c2End'?'Opening read':inTwo?'In progress':'Opening available'","state?.node==='c2NewEnding'?'Chapter ending':inTwo?'In progress':'Available'");
edit('assets/chapters.js','<small>Chapter opening · More to come</small>','<small>Reunions, choices, and the rest of the afternoon</small>');
// Separate optional solo round: original competitive round stays untouched.
edit('assets/garden-game.js',"if(round.mode==='untimed')round.rowan", "if(round.mode==='untimed'&&!round.solo)round.rowan");
edit('assets/garden-game.js','const weed=',`export function beginSoloGarden(state,random=Math.random){
 const saved=state.flags.soloGardenRound;
 const adapter={flags:{gardenMode:'untimed'},garden:validGarden(saved)?saved:undefined};
 const round=beginGarden(adapter,random);round.mode='untimed';round.solo=true;round.rowan=0;
 state.flags.soloGardenRound=round;return round;
}
export function finishSoloGarden(state){
 const round=beginSoloGarden(state);round.finished=true;
 state.flags.soloGardenResult=round.you===18?'cleared':'stopped';return state.flags.soloGardenResult;
}
const weed=`);
edit('assets/garden-game.js','sound=false,volume=.35})','sound=false,volume=.35,solo=false})');
edit('assets/garden-game.js','const r=beginGarden(state);let running','const r=solo?beginSoloGarden(state):beginGarden(state);let running');
edit('assets/garden-game.js','const q=s=>root.querySelector(s),weeds=',`if(solo){
  root.querySelector('.weed-game').classList.add('solo-garden');
  root.querySelector('.weed-title h1').textContent='A Little Gardening';
  root.querySelector('.weed-score [data-rowan]').parentElement.remove();
  root.querySelector('.weed-bucket.rowan').remove();root.querySelector('.weed-banter').remove();
  const card=root.querySelector('.weed-card');card.querySelector('h2').textContent='The garden to myself';
  card.querySelectorAll('p')[2].textContent='Stay as long as you like. You can stop whenever you want.';
  card.querySelector('.weed-resume').textContent=r.you?'Resume gardening':'Start gardening';
  const stop=document.createElement('button');stop.type='button';stop.className='secondary weed-stop';stop.textContent='Put the bucket down';stop.onclick=()=>finish();card.append(stop);
  const finishButton=stop.cloneNode(true);finishButton.className='wood-board weed-stop';finishButton.onclick=()=>finish();root.querySelector('.weed-bottom').append(finishButton);
 }
 const q=s=>root.querySelector(s),weeds=`);
edit('assets/garden-game.js',"q('[data-you]').textContent=r.you;q('[data-rowan]').textContent=r.rowan;","q('[data-you]').textContent=r.you;if(!solo)q('[data-rowan]').textContent=r.rowan;");
edit('assets/garden-game.js',"for(const side of ['you','rowan'])","for(const side of solo?['you']:['you','rowan'])");
edit('assets/garden-game.js','running=false;finishGarden(state);save();dispose();done();','running=false;if(solo)finishSoloGarden(state);else finishGarden(state);save();dispose();done();');
edit('assets/garden-game.js',"q('[data-banter]').textContent=r.you", "if(!solo)q('[data-banter]').textContent=r.you");
// Prevent a restored completed round from trapping the player.
edit('assets/garden-game.js',"q('.weed-resume').onclick=()=>{running=true;", "q('.weed-resume').onclick=()=>{if(r.finished){finish();return;}running=true;");
console.log('Integrated script, solo round, migration and presentation.');
