import {translate,localizeGameText} from './story-language.js';
import {dreamSmoke} from './scene-effects.js';
export const waveWords={
 1:['They already said yes.','You weren’t asked.','Where am I going?','Don’t embarrass us.','Sevi’s shadow.','You should know.','He missed class again.','Highest score.','Why not me?','Not enough.'],
 2:['You already agreed.','They’re waiting.','Don’t let them down.','Another deadline.','You handled it before.','No excuses.','Who gets the credit?','They’ll compare you.','What if I can’t?','You should be grateful.'],
 3:['They’re disappointed.','You gave up.','Someone else has to do it.','Why can’t you handle it?','They’ll remember.','Not enough.','Explain yourself.','Don’t be difficult.','What will they say?','Make it stop.']
};
export const waveDurations={1:30,2:22,3:16};
// Thirty clouds arrive across the whole screen, one every 75 ms after silence.
export const permanentCloudCount=elapsed=>elapsed<3?0:Math.min(30,1+Math.floor((elapsed-3)/.075));
export const cloudCount=(wave,elapsed)=>Math.min(10,1+Math.floor(elapsed/({1:2,2:1.3,3:.65}[wave])));
export function nightmareProgress(state,wave){
 const key='nightmareWave'+wave,old=state.flags[key];
 if(!old||!Number.isFinite(old.elapsed)||old.elapsed<0||!Array.isArray(old.cleared))state.flags[key]={elapsed:0,cleared:[]};
 const progress=state.flags[key];
 if(wave===3&&progress.cleared.length>=10&&!Number.isFinite(progress.endingElapsed))progress.endingElapsed=0;
 return progress;
}
export function nightmareOutcome(progress,wave){
 if(wave!==3&&Array.from({length:10},(_,i)=>i).every(i=>progress.cleared.includes(i)))return 'clear';
 if(wave!==3&&progress.elapsed>=waveDurations[wave])return 'overwhelmed';
 return wave===3&&progress.endingElapsed>=8?'overwhelmed':null;
}
export function finishNightmare(state,wave,outcome){state.flags['nightmareOutcome'+wave]=outcome;}
export function tickNightmare(progress,wave,seconds){
 const delta=Math.max(0,Math.min(1,seconds));
 if(wave===3&&Number.isFinite(progress.endingElapsed))progress.endingElapsed=Math.min(8,progress.endingElapsed+delta);
 else {
  progress.elapsed=Math.min(waveDurations[wave],progress.elapsed+delta);
  if(wave===3&&progress.elapsed>=8.9)progress.endingElapsed=0;
 }
 return nightmareOutcome(progress,wave)!==null;
}
export function clearThought(progress,wave,id){
 if((wave===3&&(Number.isFinite(progress.endingElapsed)||progress.cleared.includes(id)))||!Number.isInteger(id)||id<0||id>=cloudCount(wave,progress.elapsed))return false;
 if(!progress.cleared.includes(id))progress.cleared.push(id);
 if(wave===3&&progress.cleared.length===10)progress.endingElapsed=0;
 return true;
}
export function mountNightmare(root,state,{wave,motion,save,done,menu,endingAudio}){
 motion=motion&&!matchMedia('(prefers-reduced-motion: reduce)').matches;
 const progress=nightmareProgress(state,wave);
 let timer;
 let stopped=false,paused=false,last=performance.now(),lastSaved=Math.floor(progress.elapsed);
 root.innerHTML=`<main class="nightmare-screen ${motion?'':'still'} ${wave===2?'meeting-dream':wave===3?'empty-corridor-dream':'corridor-dream'}" aria-label="Nightmare: wave ${wave}"><svg width="0" height="0" aria-hidden="true"><defs><filter id="dream-cloud-texture" x="-40%" y="-70%" width="180%" height="240%"><feTurbulence type="fractalNoise" baseFrequency=".025" numOctaves="4" seed="7" result="noise"/><feDisplacementMap in="SourceGraphic" in2="noise" scale="52"/><feGaussianBlur stdDeviation="3"/></filter></defs></svg><div class="nightmare-shade"></div><div class="scene-atmosphere dream" aria-hidden="true">${dreamSmoke()}</div><header><span>CHAPTER TWO · A RESTLESS SLEEP</span><button type="button" class="dream-pause">Pause</button></header><div class="thought-field" role="group" aria-label="Thoughts to let go"></div><footer><p class="dream-instruction">Clear each thought to continue.<small>Tab to select · Enter or Space to release · No score or penalty</small></p><div><button class="dream-menu">Save &amp; menu</button></div></footer><p class="sr-only dream-status" role="status" aria-live="polite"></p></main>`;
 const visibility=()=>{root.querySelector('.nightmare-screen')?.classList.toggle('fx-hidden',document.hidden);if(wave===3){endingAudio?.pause(paused||document.hidden);last=performance.now();}};
 document.addEventListener('visibilitychange',visibility);
 const field=root.querySelector('.thought-field'),status=root.querySelector('.dream-status'),pause=root.querySelector('.dream-pause');
 const finish=(outcome=nightmareOutcome(progress,wave))=>{if(stopped||!outcome)return;stopped=true;clearInterval(timer);finishNightmare(state,wave,outcome);save();done();};
 const skip=document.createElement('button');skip.className='dream-skip';skip.textContent='Skip dream activity';skip.onclick=()=>finish('bypass');root.querySelector('footer div').append(skip);
 const blockHeldKey=e=>{if((e.key===' '||e.key==='Enter')&&e.repeat){e.preventDefault();e.stopPropagation();}};
 root.addEventListener('keydown',blockHeldKey);
 delete state.flags.nightmareSkip;
 if(wave===3&&progress.cleared.length<10)progress.elapsed=Math.min(progress.elapsed,8.9);
 root.querySelector('.dream-instruction').firstChild.textContent=wave===3?'Let the dream pass. You cannot fail this scene.':'Let a thought go, or wait for the dream to pass.';
 root.querySelector('.dream-menu').onclick=()=>{save();menu();};
 pause.onclick=()=>{paused=!paused;pause.textContent=translate(paused?'Resume':'Pause');root.querySelector('main').classList.toggle('paused',paused);last=performance.now();endingAudio?.pause(paused||document.hidden);};
 const positions=[[19,22],[72,18],[44,46],[17,71],[77,70],[49,15],[78,43],[42,76],[18,47],[61,62],[61,30],[34,30]];
 let endingPhase='';
 function drawEnding(){
  const phase=progress.endingElapsed<3?'silence':'surge';
  if(phase===endingPhase){if(phase==='surge')fillEndingClouds();return;}
  const initial=!endingPhase;endingPhase=phase;
  field.replaceChildren();
  const main=root.querySelector('main');
  main.classList.add('third-ending');main.classList.toggle('third-surge',phase==='surge');
  root.querySelector('.dream-instruction').hidden=true;
  field.setAttribute('aria-label','The dream continues');pause.focus();
  if(phase==='silence'){endingAudio?.silence();status.textContent='For a moment, the thoughts are gone.';return;}
  const impact=!initial&&!progress.endingImpactPlayed;
  progress.endingImpactPlayed=true;save();endingAudio?.surge(impact);
  if(!impact)main.classList.add('surge-restored');
  status.textContent='The voices crowd together. These thoughts cannot be cleared. The dream will continue on its own.';
  fillEndingClouds();
 }
 function fillEndingClouds(){
  const count=permanentCloudCount(progress.endingElapsed);
  for(let i=field.children.length;i<count;i++){
   // A fixed scattered order keeps restored saves identical without an edge-only ring.
   const cell=(i*13)%30,column=cell%6,row=Math.floor(cell/6);
   const x=8+column*16.8+(row%2?2:-2),y=8+row*21;
   const cloud=document.createElement('div');cloud.className='thought-cloud permanent-cloud';
   cloud.style.setProperty('--x',x+'%');cloud.style.setProperty('--y',y+'%');cloud.style.setProperty('--delay',(-i*.37)+'s');
   const label=document.createElement('span');label.textContent=translate(waveWords[3][i%10]);cloud.append(label);field.append(cloud);
  }
 }

 function draw(){
  if(wave===3&&Number.isFinite(progress.endingElapsed)){drawEnding();return;}
  const count=cloudCount(wave,progress.elapsed);
  const overwhelming=false;
  field.classList.toggle('overwhelming',overwhelming);
  root.querySelector('.scene-atmosphere').classList.toggle('intense',overwhelming);
  field.style.setProperty('--approach',1);
  for(let i=0;i<count;i++){
   if(progress.cleared.includes(i)&&!overwhelming)continue;
   let b=field.querySelector(`[data-cloud="${i}"]`);
   if(!b){b=document.createElement('button');b.type='button';b.dataset.cloud=i;b.className='thought-cloud';const label=document.createElement('span');label.textContent=translate(waveWords[wave][i%waveWords[wave].length]);b.append(label);b.style.setProperty('--x',positions[i][0]+'%');b.style.setProperty('--y',positions[i][1]+'%');b.style.setProperty('--delay',(-i*.7)+'s');b.setAttribute('aria-label','Let go: '+b.textContent);field.append(b);
    b.onclick=()=>{if(paused||stopped||!clearThought(progress,wave,i))return;if(wave===3&&Number.isFinite(progress.endingElapsed)){last=performance.now();save();draw();return;}const focused=document.activeElement===b;const fading=document.createElement('span');fading.className='cloud-release';fading.style.left=positions[i][0]+'%';fading.style.top=positions[i][1]+'%';fading.textContent=b.textContent;fading.setAttribute('aria-hidden','true');field.append(fading);if(!motion)fading.remove();else fading.addEventListener('animationend',()=>fading.remove(),{once:true});b.remove();save();if(nightmareOutcome(progress,wave)==='clear'){finish('clear');return;}if(focused)(field.querySelector('button:not(:disabled)')||pause).focus();};

   }
   const age=Math.max(0,progress.elapsed-i*({1:2,2:1.3,3:.65}[wave]));
   b.style.setProperty('--approach',motion?1+Math.min(age/({1:30,2:18,3:8}[wave]),1)*.7:1);
   b.disabled=overwhelming;
  }
 }
 draw();
 if(wave===3)visibility();
 localizeGameText(root);
 timer=setInterval(()=>{
  const now=performance.now(),delta=(now-last)/1000;last=now;
  if(stopped||paused||document.hidden)return;
  if(tickNightmare(progress,wave,delta)){finish();return;}
  draw();
  const checkpoint=Math.floor(progress.elapsed+(progress.endingElapsed||0));
  if(checkpoint!==lastSaved){lastSaved=checkpoint;save();}
 },wave===3?30:150);
 field.querySelector('button')?.focus();
 return ()=>{stopped=true;clearInterval(timer);endingAudio?.dispose();if(wave===3)root.querySelector("main")?.getAnimations({subtree:true}).forEach(animation=>animation.cancel());root.removeEventListener('keydown',blockHeldKey);document.removeEventListener('visibilitychange',visibility);};
}
