import {translate,localizeGameText} from './story-language.js';
export const waveWords={
 1:['They already said yes.','You weren’t asked.','Where am I going?','Don’t embarrass us.','Sevi’s shadow.','You should know.','He missed class again.','Highest score.','Why not me?','Not enough.'],
 2:['You already agreed.','They’re waiting.','Don’t let them down.','Another deadline.','You handled it before.','No excuses.','Who gets the credit?','They’ll compare you.','What if I can’t?','You should be grateful.'],
 3:['They’re disappointed.','You gave up.','Someone else has to do it.','Why can’t you handle it?','They’ll remember.','Not enough.','Explain yourself.','Don’t be difficult.','What will they say?','Make it stop.']
};
export const waveDurations={1:30,2:22,3:16};
export const cloudCount=(wave,elapsed)=>Math.min(10,1+Math.floor(elapsed/({1:2,2:1.3,3:.65}[wave])));
export function nightmareProgress(state,wave){
 const key='nightmareWave'+wave,old=state.flags[key];
 if(!old||!Number.isFinite(old.elapsed)||old.elapsed<0||!Array.isArray(old.cleared))state.flags[key]={elapsed:0,cleared:[]};
 return state.flags[key];
}
export function nightmareOutcome(progress,wave){
 if(wave!==3&&Array.from({length:10},(_,i)=>i).every(i=>progress.cleared.includes(i)))return 'clear';
 return wave===3&&progress.cleared.length>=3&&progress.elapsed>=waveDurations[wave]?'overwhelmed':null;
}
export function finishNightmare(state,wave,outcome){state.flags['nightmareOutcome'+wave]=outcome;}
export function tickNightmare(progress,wave,seconds){progress.elapsed=Math.min(wave===3&&progress.cleared.length<3?8.9:waveDurations[wave],progress.elapsed+Math.max(0,Math.min(1,seconds)));return nightmareOutcome(progress,wave)!==null;}
export function clearThought(progress,wave,id){
 if((wave===3&&progress.elapsed>=9)||!Number.isInteger(id)||id<0||id>=cloudCount(wave,progress.elapsed))return false;
 if(!progress.cleared.includes(id))progress.cleared.push(id);
 return true;
}
export function mountNightmare(root,state,{wave,motion,save,done,menu}){
 motion=motion&&!matchMedia('(prefers-reduced-motion: reduce)').matches;
 const progress=nightmareProgress(state,wave);
 let timer;
 let stopped=false,paused=false,last=performance.now(),lastSaved=Math.floor(progress.elapsed);
 root.innerHTML=`<main class="nightmare-screen ${motion?'':'still'} ${wave===2?'meeting-dream':wave===3?'empty-corridor-dream':'corridor-dream'}" aria-label="Nightmare: wave ${wave}"><svg width="0" height="0" aria-hidden="true"><defs><filter id="dream-cloud-texture" x="-40%" y="-70%" width="180%" height="240%"><feTurbulence type="fractalNoise" baseFrequency=".025" numOctaves="4" seed="7" result="noise"/><feDisplacementMap in="SourceGraphic" in2="noise" scale="52"/><feGaussianBlur stdDeviation="3"/></filter></defs></svg><div class="nightmare-shade"></div><div class="scene-atmosphere dream" aria-hidden="true"></div><header><span>CHAPTER TWO · A RESTLESS SLEEP</span><button type="button" class="dream-pause">Pause</button></header><div class="thought-field" role="group" aria-label="Thoughts to let go"></div><footer><p class="dream-instruction">Clear each thought to continue.<small>Tab to select · Enter or Space to release · No score or penalty</small></p><div><button class="dream-menu">Save &amp; menu</button></div></footer><p class="sr-only dream-status" role="status" aria-live="polite"></p></main>`;
 const visibility=()=>root.querySelector('.nightmare-screen')?.classList.toggle('fx-hidden',document.hidden);
 document.addEventListener('visibilitychange',visibility);
 const field=root.querySelector('.thought-field'),status=root.querySelector('.dream-status'),pause=root.querySelector('.dream-pause');
 const finish=(outcome=nightmareOutcome(progress,wave))=>{if(stopped||!nightmareOutcome(progress,wave))return;stopped=true;clearInterval(timer);finishNightmare(state,wave,outcome||'overwhelmed');save();done();};
 const blockHeldKey=e=>{if((e.key===' '||e.key==='Enter')&&e.repeat){e.preventDefault();e.stopPropagation();}};
 root.addEventListener('keydown',blockHeldKey);
 delete state.flags.nightmareSkip;
 if(wave===3&&progress.cleared.length<3)progress.elapsed=Math.min(progress.elapsed,8.9);
 if(wave===3)root.querySelector('.dream-instruction').firstChild.textContent='Release three thoughts. Keep going until the dream passes.';
 root.querySelector('.dream-menu').onclick=()=>{save();menu();};
 pause.onclick=()=>{paused=!paused;pause.textContent=translate(paused?'Resume':'Pause');root.querySelector('main').classList.toggle('paused',paused);last=performance.now();};
 const positions=[[19,22],[72,18],[44,46],[17,71],[77,70],[49,15],[78,43],[42,76],[18,47],[61,62],[61,30],[34,30]];
 let announced=false;
 function draw(){
  const count=cloudCount(wave,progress.elapsed);
  const overwhelming=wave===3&&progress.elapsed>=9;
  field.classList.toggle('overwhelming',overwhelming);
  root.querySelector('.scene-atmosphere').classList.toggle('intense',overwhelming);
  field.style.setProperty('--approach',1);
  if(overwhelming&&!announced){announced=true;status.textContent=translate('The voices crowd together. The dream will continue on its own.');root.querySelector('.dream-instruction').firstChild.textContent=translate('The voices crowd together. The dream will pass.');}
  for(let i=0;i<count;i++){
   if(progress.cleared.includes(i)&&!overwhelming)continue;
   let b=field.querySelector(`[data-cloud="${i}"]`);
   if(!b){b=document.createElement('button');b.type='button';b.dataset.cloud=i;b.className='thought-cloud';const label=document.createElement('span');label.textContent=translate(waveWords[wave][i%waveWords[wave].length]);b.append(label);b.style.setProperty('--x',positions[i][0]+'%');b.style.setProperty('--y',positions[i][1]+'%');b.style.setProperty('--delay',(-i*.7)+'s');b.setAttribute('aria-label','Let go: '+b.textContent);field.append(b);
    b.onclick=()=>{if(paused||stopped||!clearThought(progress,wave,i))return;const focused=document.activeElement===b;const fading=document.createElement('span');fading.className='cloud-release';fading.style.left=positions[i][0]+'%';fading.style.top=positions[i][1]+'%';fading.textContent=b.textContent;fading.setAttribute('aria-hidden','true');field.append(fading);if(!motion)fading.remove();else fading.addEventListener('animationend',()=>fading.remove(),{once:true});b.remove();save();if(nightmareOutcome(progress,wave)==='clear'){finish('clear');return;}if(focused)(field.querySelector('button:not(:disabled)')||pause).focus();};

   }
   const age=Math.max(0,progress.elapsed-i*({1:2,2:1.3,3:.65}[wave]));
   b.style.setProperty('--approach',motion?1+Math.min(age/({1:30,2:18,3:8}[wave]),1)*.7:1);
   b.disabled=overwhelming;
  }
 }
 draw();
 localizeGameText(root);
 timer=setInterval(()=>{
  const now=performance.now(),delta=(now-last)/1000;last=now;
  if(stopped||paused||document.hidden)return;
  if(tickNightmare(progress,wave,delta)){finish();return;}
  draw();
  if(Math.floor(progress.elapsed)!==lastSaved){lastSaved=Math.floor(progress.elapsed);save();}
 },150);
 field.querySelector('button')?.focus();
 return ()=>{stopped=true;clearInterval(timer);root.removeEventListener('keydown',blockHeldKey);document.removeEventListener('visibilitychange',visibility);};
}
