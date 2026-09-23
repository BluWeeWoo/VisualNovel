import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync} from 'node:fs';
import {story} from '../src/story.js';
import {openingAudioCue,menuAudioCue,tracks,createSoundtrackPlayer} from '../src/opening-audio.js';
const at=(node,fragment)=>openingAudioCue(story[node],{node,line:fragment?story[node].lines.findIndex(l=>l.text.includes(fragment)):0});
const keys=c=>c.layers.map(l=>l.key);
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
