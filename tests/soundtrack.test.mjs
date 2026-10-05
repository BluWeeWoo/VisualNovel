import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync} from 'node:fs';
import {story} from '../src/story.js';
import {openingAudioCue,menuAudioCue,tracks,createSoundtrackPlayer,createNightmareEndingAudio,nightmareAudioContinues} from '../src/opening-audio.js';
const at=(node,fragment)=>openingAudioCue(story[node],{node,line:fragment?story[node].lines.findIndex(l=>l.text.includes(fragment)):0});
const keys=c=>c.layers.map(l=>l.key);

test('Eerie audio carries through calling and blackout, then normal music returns at waking',()=>{
 for(const id of ['c2Wave3','c2Calling','c2Blackout'])assert.equal(nightmareAudioContinues(id),true);
 for(const id of ['c2Wave1','c2Wave2','c2Wake','c2WakeChoice',undefined])assert.equal(nightmareAudioContinues(id),false);
 for(const id of ['c2Calling','c2Blackout'])assert.deepEqual(keys(at(id)),[]);
 for(const id of ['c2Wake','c2WakeChoice'])assert.deepEqual(keys(at(id)),['back-together','outdoors']);
 assert.equal(at('c2Okay').layers[0].key,'letters');
});

test('Ending silence belongs only to third wave',()=>{
 const state={flags:{nightmareWave3:{endingElapsed:1}}};
 for(const wave of [1,2])assert.ok(openingAudioCue(story['c2Wave'+wave],state).layers.length);
 assert.deepEqual(openingAudioCue(story.c2Wave3,state).layers,[]);
});

test('Third-wave audio respects mute, starts impact once, pauses and disposes',()=>{
 let ducked=0,closed=0,stops=0;const sources=[];
 const gain={value:0,cancelScheduledValues(){},setValueAtTime(){},linearRampToValueAtTime(){}};
 const context={sampleRate:100,currentTime:0,state:'running',destination:{},
 createGain:()=>({gain,connect(){},disconnect(){}}),createBuffer:(n,length)=>({getChannelData:()=>new Float32Array(length)}),
 createBufferSource:()=>{const s={connect(){},disconnect(){},start(){},stop(){stops++;}};sources.push(s);return s;},
 resume(){this.state='running';return Promise.resolve();},suspend(){this.state='suspended';return Promise.resolve();},close(){closed++;return Promise.resolve();}};
 const muted=createNightmareEndingAudio({enabled:false,makeContext:()=>{throw Error('Muted must not create audio');},duck:()=>ducked++});
 muted.silence();muted.surge();muted.dispose();assert.equal(ducked,2);
 const audio=createNightmareEndingAudio({enabled:true,volume:.2,makeContext:()=>context});
 assert.equal(gain.value,.096);audio.surge();audio.surge(false);audio.surge(false);assert.equal(sources.length,2);
 audio.volume(.5);assert.equal(gain.value,.24);audio.volume(0);assert.equal(gain.value,0);
 audio.pause(true);assert.equal(context.state,'suspended');audio.pause(false);assert.equal(context.state,'running');
 audio.pause(true);audio.dispose();audio.dispose();audio.surge();assert.equal(stops,2);assert.equal(closed,1);
 const restored=createNightmareEndingAudio({enabled:true,makeContext:()=>context});restored.surge(false);assert.equal(sources.length,3);restored.pause(true);restored.dispose();
});
test('Approved cues follow exact authored lines and both branches',()=>{
 assert.deepEqual(keys(at('journey')),['bus']);
 assert.deepEqual(keys(at('journey','The sea appears')),['arrival']);
 assert.deepEqual(keys(at('journey','Then I remember Lola')),['lola']);
 assert.deepEqual(keys(at('journey','SAINT LUIS!')),['bus']);
 assert.deepEqual(keys(at('wallet')),['bus']);
 assert.deepEqual(keys(at('driver','Upo ka na.')),['kindness','bus']);
 assert.deepEqual(keys(at('hill','Ingat.')),['kindness','bus']);
 assert.deepEqual(keys(at('hill','I wait until')),['hill']);
 for(const id of ['hillCry','hillHold'])assert.equal(at(id).layers[0].level,.36);
 for(const id of ['neighborVisit','neighborWait'])assert.deepEqual(keys(at(id)),['neighbor']);
 assert.deepEqual(keys(at('otherDoor','Rowan’s house is right there.')),['neighbor']);
 assert.deepEqual(keys(at('doorRepair')),['hammer','outdoors']);
 assert.deepEqual(keys(at('doorRepair','Excuse me!')),['outdoors']);
 assert.deepEqual(keys(at('recognition')),['reunion','outdoors']);
 assert.deepEqual(keys(at('arrival')),[]);
 for(const {src} of Object.values(tracks))assert.ok(existsSync(new URL('../'+src,import.meta.url)),src);
});
function fixture(){
 let clock=0;const media=[],errors=[];
 const player=createSoundtrackPlayer({now:()=>clock,schedule:()=>1,onError:key=>errors.push(key),makeAudio:src=>{
  const a={src,currentTime:0,duration:60,ended:false,volume:0,plays:0,pauses:0,events:{},
   play(){this.plays++;return Promise.resolve();},pause(){this.pauses++;},load(){},removeAttribute(){this.src='';},addEventListener(k,fn){this.events[k]=fn;}};
  media.push(a);return a;
 }});
 return {player,media,errors,step:ms=>{clock+=ms;player.tick();}};
}
const single=key=>({layers:[{key}],fade:2});
test('Menu theme persists across menu updates and fades into story audio',()=>{
 const f=fixture();f.player.update(menuAudioCue(),.5);f.step(2000);
 const theme=f.media[0];assert.match(theme.src,/00-main-menu.mp3$/);
 f.player.update(menuAudioCue(),.5);assert.equal(f.media.length,1);
 f.player.update(at('journey'),.5);f.step(500);assert.ok(theme.volume>0);assert.ok(f.media[1].volume>0);
 f.step(500);assert.equal(theme.src,'');assert.match(f.media[1].src,/03-bus.mp3$/);
 f.player.update(menuAudioCue(),.5);f.step(2000);assert.match(f.media[2].src,/00-main-menu.mp3$/);
});
test('Next and volume changes preserve playback; scene changes crossfade and retire old audio',()=>{
 const f=fixture();f.player.update(single('arrival'),.5);f.step(2000);const first=f.media[0];first.currentTime=15;
 for(let i=0;i<20;i++)f.player.update(single('arrival'),.5);
 assert.equal(f.media.length,1);assert.equal(first.currentTime,15);assert.equal(first.plays,1);
 f.player.update(single('arrival'),.2);f.step(2000);assert.ok(Math.abs(first.volume-.11)<.001);
 f.player.update(single('lola'),.5);f.step(1000);assert.ok(first.volume>0);assert.ok(f.media[1].volume>0);
 f.step(1000);assert.equal(first.pauses,1);assert.equal(first.src,'');
});
test('Music repeats with overlap; hammer never loops and stops at the call',()=>{
 const f=fixture();f.player.update(single('arrival'),.5);f.step(2000);f.media[0].currentTime=59;f.step(50);
 assert.equal(f.media.length,2);f.step(2000);assert.equal(f.media[0].pauses,1);
 const h=fixture();h.player.update(at('doorRepair'),.5);h.step(1000);h.media[0].ended=true;h.step(1000);
 assert.equal(h.media.length,2,'No repeated hammer sequence');
 h.player.update(at('doorRepair','Excuse me!'),.5);h.step(150);assert.equal(h.media[0].src,'');assert.ok(h.media[1].volume>0);
});
test('Mute releases all audio; errors report once and sound toggle retries',()=>{
 const f=fixture();f.player.update(single('reunion'),.5);f.media[0].events.error();f.media[0].events.error();assert.deepEqual(f.errors,['reunion']);
 f.player.update({layers:[],fade:.2},.5);f.step(250);assert.equal(f.media[0].src,'');
 f.player.update(single('reunion'),.5);assert.equal(f.media.length,2);assert.equal(f.media[1].plays,1);
});
