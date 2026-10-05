import {translate,localizeGameText} from './story-language.js';
// Saved, deterministic round state; no score-based relationship reward.
export function validGarden(r){
 return !!r&&['timed','untimed'].includes(r.mode)&&Number.isFinite(r.elapsed)&&r.elapsed>=0&&r.elapsed<=45&&
  Number.isInteger(r.you)&&r.you>=0&&r.you<=18&&Number.isInteger(r.rowan)&&r.rowan>=0&&r.rowan<=18&&
  typeof r.finished==='boolean'&&Array.isArray(r.pulled)&&r.pulled.length===r.you&&new Set(r.pulled).size===r.you&&
  r.pulled.every(i=>Number.isInteger(i)&&i>=0&&i<18)&&
  (r.required===undefined&&r.attempts===undefined||Array.isArray(r.required)&&r.required.length===18&&r.required.every(n=>Number.isInteger(n)&&n>=2&&n<=5)&&Array.isArray(r.attempts)&&r.attempts.length===18&&r.attempts.every((n,i)=>Number.isInteger(n)&&n>=0&&n<=r.required[i]));
}
export function beginGarden(state,random=Math.random){
 if(!state.garden)state.garden={mode:state.flags.gardenMode==='untimed'?'untimed':'timed',elapsed:0,you:0,rowan:0,pulled:[],finished:false};
 // Upgrade older rounds without changing scores, time or already removed weeds.
 state.garden.required??=Array.from({length:18},()=>2+Math.min(3,Math.floor(random()*4)));
 state.garden.attempts??=Array.from({length:18},(_,i)=>state.garden.pulled.includes(i)?state.garden.required[i]:0);
 return state.garden;
}
export function gardenAffection(state,played){
 if(state.flags.gardenAffectionApplied)return;
 state.flags.rowanAffection=(Number(state.flags.rowanAffection)||0)+(played?1:0);
 state.flags.gardenAffectionApplied=true;
}
export function pullWeed(round,index){
 if(round.finished||!Number.isInteger(index)||index<0||index>=18||round.pulled.includes(index))return false;
 round.attempts[index]++;
 if(round.attempts[index]<round.required[index])return false;
 round.pulled.push(index);round.you++;
 if(round.mode==='untimed'&&!round.solo)round.rowan=Math.min(18,Math.floor(round.you*.9));
 return true;
}
export function tickGarden(round,seconds){
 if(round.finished||round.mode!=='timed')return;
 round.elapsed=Math.min(45,round.elapsed+Math.max(0,seconds));
 round.rowan=Math.min(18,Math.floor(round.elapsed/2.7));
}
export function finishGarden(state){
 const r=beginGarden(state);r.finished=true;
 state.flags.gardenResult=r.you>r.rowan?'win':r.you<r.rowan?'loss':'tie';
 gardenAffection(state,true);
 return state.flags.gardenResult;
}
export function beginSoloGarden(state,random=Math.random){
 const saved=state.flags.soloGardenRound;
 const adapter={flags:{gardenMode:'untimed'},garden:validGarden(saved)?saved:undefined};
 const round=beginGarden(adapter,random);round.mode='untimed';round.solo=true;round.rowan=0;
 state.flags.soloGardenRound=round;return round;
}
export function finishSoloGarden(state){
 const round=beginSoloGarden(state);round.finished=true;
 state.flags.soloGardenResult=round.you===18?'cleared':'stopped';return state.flags.soloGardenResult;
}
const weed=`<svg viewBox="0 0 90 100" aria-hidden="true"><g stroke="#354f26" stroke-width="1.4" stroke-linejoin="round"><path fill="#748143" d="M43 92Q18 77 9 38Q36 57 43 92M45 91Q24 51 31 12Q45 39 45 91M46 92Q49 34 77 16Q56 57 46 92"/><path fill="#9b9b52" d="M42 91Q5 66 0 65Q27 65 42 91M45 91Q32 29 48 0Q52 51 45 91M48 92Q67 54 88 48Q66 74 48 92"/><path fill="#526935" d="M43 92Q38 51 17 26Q41 36 43 92M48 92Q57 77 84 72Q70 89 48 92"/></g></svg>`;
const bucket=(side)=>`<div class="weed-bucket ${side}" aria-label="${side==='you'?'Your':'Rowan’s'} bucket"><div class="bucket-weeds" aria-hidden="true"></div><svg viewBox="0 0 150 130" aria-hidden="true"><defs><linearGradient id="metal-${side}"><stop stop-color="#7b8b8c"/><stop offset=".5" stop-color="#c8cebf"/><stop offset="1" stop-color="#667579"/></linearGradient></defs><path d="M18 32Q75 -8 132 32" fill="none" stroke="#c5c3b0" stroke-width="6"/><path d="M12 35L27 116Q75 134 123 116L138 35Z" fill="url(#metal-${side})" stroke="#4e6064" stroke-width="3"/><ellipse cx="75" cy="35" rx="64" ry="17" fill="#45544a" stroke="#dad8c6" stroke-width="5"/><path d="M22 66Q75 84 128 66M25 95Q75 112 125 95" fill="none" stroke="#eff0d8" opacity=".4"/></svg><span>${side==='you'?'Your bucket':'Rowan’s bucket'}</span></div>`;
export function mountGarden(root,state,{save,done,menu,motion=true,sound=false,volume=.35,solo=false}){
 const r=solo?beginSoloGarden(state):beginGarden(state);let running=false,disposed=false,last=performance.now(),selected=-1;
 let lastRemoved=-Infinity,audioContext=null;
 save(); // Persist random requirements immediately, including after an old save upgrade.
 function rustle(success){
  if(!sound||volume<=0)return;
  try{
   audioContext??=new (window.AudioContext||window.webkitAudioContext)();
   audioContext.resume().catch(()=>{});
   const duration=success?.24:.1,buffer=audioContext.createBuffer(1,Math.ceil(audioContext.sampleRate*duration),audioContext.sampleRate);
   const data=buffer.getChannelData(0);
   for(let i=0;i<data.length;i++)data[i]=(Math.random()*2-1)*Math.pow(1-i/data.length,success?1.2:2);
   const source=audioContext.createBufferSource(),filter=audioContext.createBiquadFilter(),gain=audioContext.createGain();
   source.buffer=buffer;filter.type='lowpass';filter.frequency.value=success?1600:900;gain.gain.value=volume*(success?.28:.14);
   source.connect(filter).connect(gain).connect(audioContext.destination);source.start();source.onended=()=>{source.disconnect();filter.disconnect();gain.disconnect();};
  }catch{} // Audio availability never blocks a pull.
 }
 root.innerHTML=`<main class="weed-game"><div class="weed-canvas"><header class="weed-top"><div class="wood-board weed-title"><small>OUR SUMMER, UNFINISHED</small><h1>One More Weed</h1></div><div class="wood-board weed-score" aria-label="Weeds pulled"><span>YOU <b data-you>0</b></span><span>ROWAN <b data-rowan>0</b></span></div><div class="wood-board weed-clock"><span data-clock></span><progress max="45" value="45" aria-label="Round progress"></progress></div><button class="wood-board weed-pause" type="button">Pause</button></header><div class="weed-patch" role="group" aria-label="Your weeds. Select one, then pull toward your bucket.">${Array.from({length:18},(_,i)=>`<button class="weed" type="button" data-weed="${i}" aria-label="Weed ${i+1}" style="--x:${(i%6)*16+3}%;--y:${Math.floor(i/6)*31+3}%;--tilt:${(i%3-1)*9}deg">${weed}</button>`).join('')}</div>${bucket('you')}${bucket('rowan')}<footer class="weed-bottom"><div class="wood-board weed-banter"><strong>Rowan</strong><span data-banter>Ready for a rematch?</span></div><div class="wood-board weed-help">Click a weed repeatedly to loosen its roots.<br><small>Click to tug · Arrow keys + Space also work.</small></div><button class="wood-board weed-pull" type="button" disabled>Pull selected weed ↓</button></footer><section class="weed-overlay" aria-label="Gardening controls"><div class="wood-board weed-card"><h2>One More Weed</h2><p>${r.mode==='timed'?'45 seconds. Pull as many weeds as you can.':'No rush. Clear your 18 weeds at your own pace.'}</p><p>Each weed takes several tugs. Keep clicking the same weed until its roots come free. Use arrow keys to select and Space to tug.</p><p>Playing matters more than the score.</p><button class="primary weed-resume">${r.elapsed||r.you?'Resume round':'Start rematch'}</button><button class="secondary weed-menu">Save & return to menu</button></div></section><p class="sr-only weed-status" aria-live="polite"></p></div></main>`;
 if(solo){
  root.querySelector('.weed-game').classList.add('solo-garden');
  root.querySelector('.weed-title h1').textContent='A Little Gardening';
  root.querySelector('.weed-score [data-rowan]').parentElement.remove();
  root.querySelector('.weed-bucket.rowan').remove();root.querySelector('.weed-banter').remove();
  const card=root.querySelector('.weed-card');card.querySelector('h2').textContent='The garden to myself';
  card.querySelectorAll('p')[2].textContent='Stay as long as you like. You can stop whenever you want.';
  card.querySelector('.weed-resume').textContent=r.attempts.some(n=>n>0)?'Resume gardening':'Start gardening';
  const stop=document.createElement('button');stop.type='button';stop.className='secondary weed-stop';stop.textContent='Put the bucket down';stop.onclick=()=>finish();card.append(stop);
  const finishButton=stop.cloneNode(true);finishButton.className='wood-board weed-stop';finishButton.onclick=()=>finish();root.querySelector('.weed-bottom').append(finishButton);
 }
 const q=s=>root.querySelector(s),weeds=[...root.querySelectorAll('.weed')];
 function draw(){
  q('[data-you]').textContent=r.you;if(!solo)q('[data-rowan]').textContent=r.rowan;
  q('[data-clock]').textContent=r.mode==='timed'?`00:${String(Math.ceil(45-r.elapsed)).padStart(2,'0')}`:`${r.you} / 18`;
  q('progress').max=r.mode==='timed'?45:18;q('progress').value=r.mode==='timed'?45-r.elapsed:r.you;
  weeds.forEach((w,i)=>{w.disabled=r.pulled.includes(i);w.classList.toggle('pulled',w.disabled);w.classList.toggle('selected',i===selected);w.setAttribute('aria-pressed',String(i===selected));});
  q('.weed-pull').disabled=selected<0||!running;
  for(const side of solo?['you']:['you','rowan'])q(`.weed-bucket.${side} .bucket-weeds`).innerHTML=Array.from({length:Math.min(8,r[side])},(_,i)=>`<i style="left:${i*10}%;transform:rotate(${i*13-40}deg)">${weed}</i>`).join('');
 }
 function finish(){if(disposed)return;running=false;if(solo)finishSoloGarden(state);else finishGarden(state);save();dispose();done();}
 function pull(i){
  if(!running||i<0||r.pulled.includes(i)||performance.now()-lastRemoved<220)return;
  const success=pullWeed(r,i),w=weeds[i],strength=r.attempts[i]/r.required[i];
  selected=success?-1:i;rustle(success);
  w.getAnimations().forEach(a=>a.cancel());
  if(motion){
   const lift=success?48:3+strength*10,tilt=success?18:3+strength*8;
   w.animate([{opacity:1,transform:'translateY(0) rotate(0deg)'},{opacity:1,transform:`translateY(-${lift}px) rotate(-${tilt}deg)`},{opacity:success?0:1,transform:success?'translateY(-65px) rotate(22deg)':'translateY(0) rotate(0deg)'}],{duration:success?320:160});
   for(let n=0;n<(success?9:3);n++){
    const soil=document.createElement('i');soil.className='weed-soil';soil.style.left=w.style.getPropertyValue('--x');soil.style.top=`calc(${w.style.getPropertyValue('--y')} + 24%)`;w.parentElement.append(soil);
    soil.animate([{opacity:1,transform:'translate(20px,0)'},{opacity:0,transform:`translate(${20+(Math.random()-.5)*65}px,${-10-Math.random()*(success?55:25)}px)`}],{duration:success?420:240}).finished.catch(()=>{}).then(()=>soil.remove());
   }
  }else w.animate([{filter:'brightness(1.5)'},{filter:'brightness(1)'}],{duration:120});
  if(!success){q('.weed-status').textContent=translate('The roots loosen a little.');draw();save();return;}
  lastRemoved=performance.now();
  q('.weed-patch').tabIndex=-1;q('.weed-patch').focus({preventScroll:true});
  q('.weed-status').textContent=`${r.you} ${r.you===1?'weed':'weeds'} pulled.`;
  if(!solo)q('[data-banter]').textContent=r.you<4?'Roots too. Just checking.':r.you<9?'Are you counting the stems again?':r.you<14?'My hat is helping you. I’ve noticed.':'That was quicker with you.';
  localizeGameText(root);draw();save();if(r.you===18){running=false;setTimeout(()=>{if(!disposed)finish();},motion?330:0);}
 }
 function select(i){if(!running||weeds[i].disabled)return;selected=i;draw();}
 weeds.forEach((w,i)=>{
  w.onclick=()=>pull(i);
 });
 q('.weed-pull').onclick=()=>pull(selected);
 function pause(){if(disposed)return;running=false;q('.weed-overlay').hidden=false;q('.weed-resume').textContent=translate('Resume round');draw();save();q('.weed-resume').focus();}
 q('.weed-pause').onclick=pause;
 q('.weed-resume').onclick=()=>{if(r.finished){finish();return;}running=true;last=performance.now();q('.weed-overlay').hidden=true;draw();weeds.find(w=>!w.disabled)?.focus();};
 q('.weed-menu').onclick=()=>{save();dispose();menu();};
 function keys(e){
  if(e.key==='Escape'){e.preventDefault();pause();return;}
  if(!running)return;
  if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown',' '].includes(e.key)){
   e.preventDefault();e.stopPropagation();
   if(e.repeat)return;
   if(e.key===' '){if(selected>=0)pull(selected);return;}
   const delta={ArrowLeft:-1,ArrowRight:1,ArrowUp:-6,ArrowDown:6}[e.key];
   let i=selected<0?-delta:selected,found=false;for(let n=0;n<18;n++){i=(i+delta+18)%18;if(!weeds[i].disabled){select(i);weeds[i].focus();found=true;break;}}
   if(!found){i=weeds.findIndex(w=>!w.disabled);if(i>=0){select(i);weeds[i].focus();}}
  }
 }
 const visibility=()=>{if(document.hidden)pause();};
 root.addEventListener('keydown',keys);document.addEventListener('visibilitychange',visibility);window.addEventListener('blur',pause);
 const timer=setInterval(()=>{const now=performance.now(),dt=Math.min((now-last)/1000,.5);last=now;if(!running||document.hidden)return;tickGarden(r,dt);draw();save();if(r.elapsed>=45)finish();},250);
 function dispose(){disposed=true;clearInterval(timer);audioContext?.close().catch(()=>{});root.removeEventListener('keydown',keys);document.removeEventListener('visibilitychange',visibility);window.removeEventListener('blur',pause);}
 localizeGameText(root);draw();q('.weed-resume').focus();return dispose;
}
