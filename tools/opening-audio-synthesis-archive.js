// Original procedural sound: no third-party samples or voice impersonation.
// Scene-level beds persist across dialogue; brief cues fire once per reading position.
let context, master, bed, mode=null, lastCue='', enabled=false, musicTimer;
const tones=new Set();
function tone(frequency, duration, level, delay=0, type='sine') {
  if(!enabled)return;
  const t=context.currentTime+delay, osc=context.createOscillator(), gain=context.createGain();
  osc.type=type;osc.frequency.value=frequency;
  gain.gain.setValueAtTime(0,t);gain.gain.linearRampToValueAtTime(level,t+.015);
  gain.gain.exponentialRampToValueAtTime(.0001,t+duration);
  osc.connect(gain).connect(master);osc.start(t);osc.stop(t+duration+.05);
  tones.add(osc);osc.onended=()=>{tones.delete(osc);osc.disconnect();gain.disconnect();};
}
function phrase(){[220,329.63,293.66,246.94].forEach((f,i)=>tone(f,3,.045,i*1.3,'triangle'));}
export function setOpeningAudio(next,volume,position,text){
  if(!next){enabled=false;mode=null;clearInterval(musicTimer);if(master)master.gain.setTargetAtTime(0,context.currentTime,.15);return;}
  if(!context){
    const Audio=globalThis.AudioContext||globalThis.webkitAudioContext;if(!Audio)return;
    context=new Audio();master=context.createGain();master.gain.value=0;master.connect(context.destination);
  }
  enabled=true;context.resume().catch(()=>{});master.gain.setTargetAtTime(Math.max(0,Math.min(1,volume)),context.currentTime,.2);
  if(next!==mode){
    clearInterval(musicTimer);for(const osc of tones){try{osc.stop();}catch{}}
    if(bed){bed.source.stop();bed.source.disconnect();bed.filter.disconnect();bed.gain.disconnect();}
    mode=next;
    const buffer=context.createBuffer(1,context.sampleRate*6,context.sampleRate), data=buffer.getChannelData(0);
    let prev=0;for(let i=0;i<data.length;i++){prev=(prev+Math.random()*.035-.0175)/1.015;data[i]=prev;}
    const source=context.createBufferSource(),filter=context.createBiquadFilter(),gain=context.createGain();
    source.buffer=buffer;source.loop=true;filter.type='lowpass';filter.frequency.value=next==='bus'?240:850;
    gain.gain.value=next==='bus'?1.3:.45;source.connect(filter).connect(gain).connect(master);source.start();bed={source,filter,gain};
    if(next==='home'||next==='recognition'){phrase();musicTimer=setInterval(phrase,18000);}
  }
  if(position===lastCue)return;lastCue=position;
  if(text.startsWith('The sea appears'))phrase();
  if(text==='I knock.'||text.startsWith('Then knock again')||position==='doorRepair:0'){
    [0,.19,.42].forEach(delay=>tone(130,.13,.18,delay,'triangle'));
  }
  if(text.includes('hand slips off'))tone(75,.18,.12,0,'triangle');
}
