import {chapterTitles} from './chapters.js';
let active=false;
export const transitionActive=()=>active;
export function transitionCopy(kind,{chapter=1,partial=false,language='english'}={}){
 const taglish=language==='taglish';
 return kind==='new'?{eyebrow:'SAINT LUIS · A NEW SUMMER',title:taglish?'Balik ka na.':'Welcome back.',note:taglish?'Kaunting araw ng Saint Luis, saan ka man mapunta.':'A little Saint Luis sunshine, wherever you are.'}:
 {eyebrow:`CHAPTER ${chapter} · ${partial?'TO BE CONTINUED':'COMPLETE'}`,title:partial?(taglish?'May kasunod pa.':'There is more to come.'):(chapterTitles[chapter-1]||`Chapter ${chapter}`),note:partial?'Your place in this summer is waiting.':'Same seas. A little closer, one day at a time.'};
}
// One presentation layer only: callbacks own story progression and saving.
export async function playSummerTransition({kind='new',chapter=1,partial=false,language='english',motion=true,reveal}){
 if(active)return false;
 active=true;
 const reduced=!motion||matchMedia('(prefers-reduced-motion: reduce)').matches;
 if(reduced){try{await reveal();return true;}finally{active=false;}}
 const copy=transitionCopy(kind,{chapter,partial,language});
 const layer=document.createElement('section');
 layer.className=`summer-transition ${kind==='new'?'summer-departure':'summer-memory'}`;
 layer.setAttribute('role','dialog');layer.setAttribute('aria-modal','true');layer.setAttribute('aria-label',kind==='new'?'Beginning your summer':'Keeping this chapter');
 layer.innerHTML=`<div class="transition-light" aria-hidden="true"></div><div class="transition-keepsake"><div class="transition-envelope envelope-back" aria-hidden="true"></div><div class="transition-envelope envelope-flap" aria-hidden="true"></div><div class="transition-envelope envelope-front" aria-hidden="true"><svg class="envelope-boat" viewBox="0 0 110 76" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 48 Q52 52 98 46 L83 62 Q52 67 27 61 Z M55 8 L55 49 M51 13 L25 42 L51 41 Z M60 19 L82 40 L60 41 Z M9 70 Q20 64 32 70 T57 70 T82 70 T105 70"/></svg></div><article class="transition-postcard"><span class="transition-postmark" aria-hidden="true">SAINT LUIS<br>≈ ≈ ≈</span><span class="transition-eyebrow"></span><div class="transition-photo" aria-hidden="true"></div><h2></h2><p></p><span class="transition-signature">— Ro</span></article></div><button class="transition-skip" type="button">Continue →</button><span class="sr-only" role="status"></span>`;
 layer.querySelector('.transition-eyebrow').textContent=copy.eyebrow;
 layer.querySelector('h2').textContent=copy.title;
 layer.querySelector('p').textContent=copy.note;
 layer.querySelector('[role=status]').textContent=`${copy.eyebrow}. ${copy.title}`;
 const oldFocus=document.activeElement;
 const blocked=[...document.body.children].filter(e=>e instanceof HTMLElement&&!e.inert);
 blocked.forEach(e=>e.inert=true);document.body.append(layer);
 let finish;const wait=new Promise(resolve=>finish=resolve);
 const button=layer.querySelector('button');button.onclick=()=>finish();button.focus();
 // Consume held story keys so they cannot advance the newly revealed scene.
 const block=e=>{if(!active)return;if(e.type==='keyup'){e.stopImmediatePropagation();return;}if(e.key==='Tab'){e.preventDefault();button.focus();return;}if([' ','Enter','Escape'].includes(e.key)){e.preventDefault();e.stopImmediatePropagation();if(!e.repeat)finish();}};
 document.addEventListener('keydown',block,true);document.addEventListener('keyup',block,true);
 const timer=setTimeout(()=>finish(),kind==='new'?4400:2700);
 try{
  await wait;clearTimeout(timer);
  await layer.animate([{opacity:1},{opacity:1}],{duration:80}).finished;
  await reveal();
  await layer.animate([{opacity:1},{opacity:0}],{duration:550,easing:'ease-in-out',fill:'forwards'}).finished;
  return true;
 }finally{
  clearTimeout(timer);layer.remove();blocked.forEach(e=>e.inert=false);
  document.removeEventListener('keydown',block,true);document.removeEventListener('keyup',block,true);active=false;
  const target=document.querySelector('.modal button,.next-button');
  if(target)target.focus({preventScroll:true});else if(oldFocus?.isConnected)oldFocus.focus({preventScroll:true});
 }
}
