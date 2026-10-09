import {lineVisible} from './line-visibility.js';
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
 if(node.afternoon){
  const layers=node.music?[{key:node.music,level:state.node==='c2TVNews'?.12:state.node==='c2Family'?.18:.26}]:[];
  layers.push({key:'outdoors',level:node.soloGarden||['c2WaitGarden','c2GardenAfter','c2WaitRest'].includes(state.node)?.18:.07});
  return cue(layers,2.5);
 }
 if(node.chapterTwo){
  if(node.nightmare===3&&Number.isFinite(state.flags?.nightmareWave3?.endingElapsed))return cue([],.2);
  const music=Object.hasOwn(node,'music')?node.music:(node.place==='d2-bedroom-morning'?'back-together':null);
  const layers=music?[{key:music,level:.24}]:[];
  if(!node.place.startsWith('c2-')||node.place==='c2-rest')layers.push({key:'outdoors',level:.08});
  return cue(layers,2);
 }
 if(node.dayTwo){
  const layers=node.music?[{key:node.music,level:.32}]:[];
  layers.push({key:'outdoors',level:node.time==='night'?.05:.14});
  if(node.afterGarden&&['Rowan · text','You · text'].includes(node.lines[state.line]?.speaker))layers.push('phone');
  if(state.node==='d2Call'&&state.line===1)layers.push('steps');
  return cue(layers,2);
 }
 if(node.continuation){
  const key=node.music==='reunion'?'reunion-new':node.music;
  const layers=key?[key]:[];
  const lines=node.lines.filter(l=>lineVisible(l,state.flags));
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
// Short, low-passed contact sound; independent of soundtrack progression.
export function playSoftBump(volume=.35){
 const Context=globalThis.AudioContext||globalThis.webkitAudioContext;
 if(!Context||volume<=0)return ()=>{};
 const context=new Context();let cancelled=false,source;
 const stop=()=>{if(cancelled)return;cancelled=true;try{source?.stop();}catch{}void context.close().catch(()=>{});};
 void context.resume().then(()=>{
  if(cancelled)return;
  const buffer=context.createBuffer(1,Math.ceil(context.sampleRate*.12),context.sampleRate),data=buffer.getChannelData(0);
  for(let i=0;i<data.length;i++)data[i]=(Math.random()*2-1)*(1-i/data.length);
  source=context.createBufferSource();source.buffer=buffer;
  const filter=context.createBiquadFilter();filter.type='lowpass';filter.frequency.value=180;
  const gain=context.createGain();gain.gain.setValueAtTime(0,context.currentTime);gain.gain.linearRampToValueAtTime(Math.min(1,volume)*.16,context.currentTime+.012);gain.gain.exponentialRampToValueAtTime(.0001,context.currentTime+.12);
  source.connect(filter).connect(gain).connect(context.destination);source.onended=stop;source.start();
 }).catch(stop);
 return stop;
}
let player;
export function setOpeningAudio(cue,volume,onError){
 if(!player&&!cue.layers.length)return;
 player??=createSoundtrackPlayer({onError});player.update(cue,volume);
}

export const nightmareAudioContinues=id=>['c2Wave3','c2Calling','c2Blackout'].includes(id);
// Begins in wave three and continues until waking. The app owns its lifetime.
export function createNightmareEndingAudio({enabled=false,volume=.35,duck=()=>{},makeContext=()=>new (globalThis.AudioContext||globalThis.webkitAudioContext)()}={}){
 let context,master,disposed=false,started=false,held=false,closeTimer;
 const sources=[];
 const level=enabled?Math.max(0,Math.min(1,Number(volume)||0)):0;
 function prepare(){
  if(context||!level||disposed)return;
  try{context=makeContext();master=context.createGain();master.gain.value=level*.48;master.connect(context.destination);}catch{context=null;}
 }
 // Prime during the player's interaction; do not rely on a delayed autoplay grant.
 prepare();
 if(context)void context.resume().catch(()=>{});
 function sound(impact){
  const duration=impact?1.1:4,buffer=context.createBuffer(1,Math.ceil(context.sampleRate*duration),context.sampleRate),data=buffer.getChannelData(0);
  let noise=0;
  for(let i=0;i<data.length;i++){
   const t=i/context.sampleRate;noise=(noise+(Math.random()*2-1)*.06)/1.06;
   const beat=t%1,pulse=Math.exp(-beat*32)+.55*Math.exp(-Math.max(0,beat-.19)*40)*(beat>=.19);
   // Detuned minor/cluster tones sit above the sub-bass so laptop speakers carry
   // the eerie music too. Slow beating creates movement without a loud jump.
   const pad=(Math.sin(2*Math.PI*146.75*t)+Math.sin(2*Math.PI*147.5*t)+Math.sin(2*Math.PI*174.5*t)+Math.sin(2*Math.PI*207.75*t))*.105;
   const bell=Math.sin(2*Math.PI*(t<2?587.25:622.25)*t)*Math.exp(-(t%2)*2.6)*.18;
   const edge=Math.min(1,t/.035,(duration-t)/.035);
   data[i]=impact?(noise*2+Math.sin(2*Math.PI*(72*t-18*t*t))*.5)*Math.exp(-t*6)*Math.min(1,t/.008):(pad*(.8+.2*Math.cos(Math.PI*t))+bell+noise*.2+Math.sin(2*Math.PI*86*t)*(.08+pulse*.2))*edge;
  }
  const source=context.createBufferSource();source.buffer=buffer;source.loop=!impact;source.connect(master);sources.push(source);source.start();
 }
 return {
  volume(value){if(master&&!disposed)master.gain.value=Math.max(0,Math.min(1,Number(value)||0))*.48;},
  silence(){if(!disposed)duck();},
  surge(impact=true){
   if(disposed||started)return;started=true;duck();if(!context)return;
   if(impact)sound(true);sound(false);
   if(held)void context.suspend().catch(()=>{});
  },
  pause(value){held=value;if(context&&!disposed)void (value?context.suspend():context.resume()).catch(()=>{});},
  dispose(){
   if(disposed)return;disposed=true;if(!context)return;
   const close=()=>{clearTimeout(closeTimer);for(const source of sources){try{source.stop();source.disconnect();}catch{}}master.disconnect();void context.close().catch(()=>{});};
   if(held||context.state==='suspended'){close();return;}
   master.gain.cancelScheduledValues(context.currentTime);master.gain.setValueAtTime(master.gain.value,context.currentTime);master.gain.linearRampToValueAtTime(0,context.currentTime+.45);
   closeTimer=setTimeout(close,500);
  }
 };
}
