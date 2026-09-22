// Original synthesized surf: no recordings, downloads, or third-party audio.
let context, gain, source, mod;
export function setAudio(enabled, volume=0.25) {
  if (!enabled) { if(gain) gain.gain.setTargetAtTime(0,context.currentTime,.2); return; }
  if (!context) {
    const Audio = globalThis.AudioContext || globalThis.webkitAudioContext;
    if(!Audio) return;
    context = new Audio();
    const buffer=context.createBuffer(1,context.sampleRate*8,context.sampleRate);
    const data=buffer.getChannelData(0);let previous=0;
    for(let i=0;i<data.length;i++){previous=(previous+Math.random()*.04-.02)/1.02;data[i]=previous*3;}
    source=context.createBufferSource();source.buffer=buffer;source.loop=true;
    const filter=context.createBiquadFilter();filter.type='lowpass';filter.frequency.value=720;
    gain=context.createGain();gain.gain.value=0;
    mod=context.createOscillator();mod.frequency.value=.12;
    const depth=context.createGain();depth.gain.value=.045;
    const wave=context.createGain();wave.gain.value=.22;
    mod.connect(depth).connect(wave.gain);source.connect(filter).connect(wave).connect(gain).connect(context.destination);
    source.start();mod.start();
  }
  context.resume().catch(()=>{});gain.gain.setTargetAtTime(Math.max(0,Math.min(1,volume)),context.currentTime,.4);
}
