// Approved soundtrack. Cues follow reading position, not elapsed time.
const base='assets/audio/soundtrack/';
export const tracks={
 paper:{src:'assets/audio/reunion/paper.wav',level:.28,loop:false},
 rain:{src:'assets/audio/reunion/rain.wav',level:.28},fire:{src:'assets/audio/reunion/fire.wav',level:.30},
 phone:{src:'assets/audio/reunion/phone.wav',level:.45,loop:false},box:{src:'assets/audio/reunion/box.wav',level:.38,loop:false},
 tools:{src:'assets/audio/reunion/tools.wav',level:.25,loop:false},steps:{src:'assets/audio/reunion/steps.wav',level:.30,loop:false},
 'reunion-new':{src:'assets/audio/reunion/reunion.mp3',level:.46},
 'catching-up':{src:'assets/audio/reunion/catching-up.mp3',level:.43},
 'lost-contact':{src:'assets/audio/reunion/lost-contact.mp3',level:.36},
 'rainy-night':{src:'assets/audio/reunion/rainy-night.mp3',level:.33},
 'letters':{src:'assets/audio/reunion/letters.mp3',level:.32},
 'back-together':{src:'assets/audio/reunion/back-together.mp3',level:.43},
 menu:{src:base+'00-main-menu.mp3',level:.50},
 arrival:{src:base+'01-coming-home.mp3',level:.55},lola:{src:base+'02-lola.mp3',level:.43},
 bus:{src:base+'03-bus.mp3',level:.26},kindness:{src:base+'04-kindness.mp3',level:.52},
 hill:{src:base+'05-neighborhood.mp3',level:.50},neighbor:{src:base+'06-neighbor-door.mp3',level:.46},
 hammer:{src:'assets/audio/porch/hammer-and-seaside-outdoors.wav',level:.75,loop:false},
 outdoors:{src:base+'07-outdoors-only.wav',level:.75},reunion:{src:base+'08-reunion.mp3',level:.53}
};
const cue=(keys,fade=3)=>({layers:keys.map(key=>typeof key==='string'?{key}:key),fade});
export const menuAudioCue=()=>cue(['menu'],2);
export function openingAudioCue(node,state){
 if(!node?.opening)return cue([], .35);
 if(node.continuation){
  const key=node.music==='reunion'?'reunion-new':node.music;
  const layers=key?[key]:[];
  const lines=node.lines.filter(l=>!l.if||state.flags?.[l.if[0]]===l.if[1]);
  const text=lines[state.line]?.text||'';
  if(node.time==='night')layers.push('rain');
  else if(node.childhood||node.place!=='living')layers.push({key:'outdoors',level:.18});
  if(state.node==='rBurning')layers.push('fire');
  if(state.node==='rLetters'&&text.startsWith('She puts it on'))layers.push('box');
  if(state.node==='rReturn'&&text==='It’s Rowan.')layers.push('phone');
  if(state.node==='rBags'&&state.line===0)layers.push('tools');
  if(state.node==='rInside'&&state.line===0)layers.push('steps');
  if(state.node==='rPorchEnvelopes'&&state.line===0)layers.push('steps');
  if(state.node==='rPorchEnvelopes'&&text.startsWith('Lola sets a small box'))layers.push('box');
  if(state.node==='rPorchEnvelopes'&&(text.startsWith('Lola sets a small box')||text.startsWith('He chooses a yellow envelope')))layers.push('paper');
  return cue(layers,node.time==='night'?2.5:2);
 }
 const reached=fragment=>{const index=node.lines.findIndex(l=>l.text.includes(fragment));return index>=0&&state.line>=index;};
 switch(state.node){
  case 'journey':
   if(reached('SAINT LUIS!'))return cue(['bus'],.45);
   if(reached('Then I remember Lola’s funeral.'))return cue(['lola']);
   if(reached('The sea appears'))return cue(['arrival']);
   return cue(['bus'],1);
  case 'busBump':case 'bumpKind':case 'bumpGlare':case 'bumpAngry':case 'bumpSilent':case 'wallet':return cue(['bus']);
  case 'driver':return reached('Upo ka na. Hindi na kita sisingilin.')?cue(['kindness',{key:'bus',level:.12}],2):cue(['bus']);
  case 'hill':
   if(state.line<2)return cue(['kindness',{key:'bus',level:.12}],2);
   return cue([{key:'hill',level:reached('I can’t remember the last thing')?.36:.50}]);
  case 'hillCry':case 'hillHold':return cue([{key:'hill',level:.36}],1.5);
  case 'otherDoor':return reached('Rowan’s house is right there.')?cue(['neighbor']):cue([{key:'hill',level:.36}]);
  case 'neighborVisit':case 'neighborWait':return cue(['neighbor']);
  case 'doorRepair':return reached('Excuse me!')?cue(['outdoors'],.12):cue(['hammer',{key:'outdoors',level:.30}],.35);
  case 'recognition':return cue(['reunion','outdoors'],2);
  default:return cue([],.35);
 }
}
// Stream compressed files; overlap two voices only during fades and repeats.
export function createSoundtrackPlayer({makeAudio=src=>new Audio(src),now=()=>performance.now(),schedule=fn=>setInterval(fn,50),onError=()=>{}}={}){
 let layers=[],active=new Map(),wanted=new Map(),master=0,timer=null;
 function ramp(layer,target,seconds){
  if(layer.target===target)return;
  layer.from=layer.audio.volume;layer.target=target;layer.start=now();layer.duration=Math.max(0,seconds*1000);
 }
 function retire(layer,seconds){layer.retired=true;ramp(layer,0,seconds);}
 function start(key,level,fade){
  const audio=makeAudio(tracks[key].src);audio.preload='metadata';audio.volume=0;audio.loop=false;
  const layer={key,audio,level,target:-1,retired:false,failed:false};layers.push(layer);active.set(key,layer);
  const fail=()=>{if(layer.retired||layer.failed)return;layer.failed=true;audio.pause();onError(key);};
  audio.addEventListener('error',fail,{once:true});
  try{Promise.resolve(audio.play()).catch(fail);}catch{fail();}
  ramp(layer,level*master,tracks[key].loop===false?.035:fade);return layer;
 }
 function tick(){
  const time=now();
  for(const layer of [...layers]){
   const {audio}=layer;
   const fraction=layer.duration?Math.min(1,(time-layer.start)/layer.duration):1;
   audio.volume=Math.max(0,Math.min(1,layer.from+(layer.target-layer.from)*fraction));
   if(layer.retired&&fraction>=1){audio.pause();audio.removeAttribute('src');audio.load();layers=layers.filter(l=>l!==layer);continue;}
   if(layer.retired||layer.failed||tracks[layer.key].loop===false||!wanted.has(layer.key))continue;
   if(Number.isFinite(audio.duration)&&audio.duration>0){
    const overlap=Math.min(2,audio.duration/8);
    if(audio.ended||audio.currentTime>=audio.duration-overlap){retire(layer,overlap);start(layer.key,layer.level,overlap);}
   }
  }
 }
 function update(next,volume){
  master=Math.max(0,Math.min(1,Number(volume)||0));
  wanted=new Map(next.layers.map(l=>[l.key,l.level??tracks[l.key].level]));
  for(const [key,layer] of active){if(!wanted.has(key)){retire(layer,next.fade);active.delete(key);}}
  for(const [key,level] of wanted){
   const layer=active.get(key);
   if(!layer)start(key,level,next.fade);
   else{layer.level=level;ramp(layer,level*master,next.fade);}
  }
  if(timer===null&&layers.length)timer=schedule(tick);
 }
 return {update,tick};
}
let player;
export function setOpeningAudio(cue,volume,onError){
 if(!player&&!cue.layers.length)return;
 player??=createSoundtrackPlayer({onError});player.update(cue,volume);
}
