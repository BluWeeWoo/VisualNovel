// Presentation only: cues use the original script, independently of translation.
export function dreamSmoke(){
 return '<span class="dream-smoke smoke-left"></span><span class="dream-smoke smoke-right"></span><span class="dream-smoke smoke-low"></span>';
}
export function sceneCue(id,node,text=''){
 let ambient='';
 if(node.place?.startsWith('c2-')&&!['c2Blackout','c2Wake'].includes(id)&&node.place!=='c2-rest')ambient=['c2Hall','c2CloudIntro'].includes(id)?'dream intense':'dream';
 else if(node.audio==='bus')ambient='bus';
 else if(id==='rLanding')ambient='rain';
 else if(id==='rBurning')ambient='ember';
 else if(['rInside','d2Morning','d2Breakfast'].includes(id))ambient='dust';
 else if(id==='d2Garden'||/^aTopic\d+_lola_quiet$/.test(id))ambient='leaves';
 let action='';
 if(id==='busBump'&&text.includes('A man bumps into me.'))action='bump';
 else if((id==='journey'&&text.startsWith('The sea appears'))||(id==='hill'&&text.startsWith('I can see his house')))action='pan';
 else if(id==='rHug'&&text.startsWith('He rocks us gently once'))action='sway';
 else if(id==='c2Calling'&&text==='The corridor tilts.')action='tilt';
 else if(id==='c2Wake'&&text.startsWith('The blue edge of the curtain'))action='focus';
 else if(id==='d2Poke'&&text.startsWith('Rowan goes still.'))action='react';
 else if(id==='d2Scare'&&text==='AH—!')action='recoil';
 else if(id==='rYellowPromise'&&text==='I’ll write first.')action='letter';
 else if((id==='rLetterPromise'&&text==='I was eleven. We were leaving at the end of the week.')||(id==='c2Curtains'&&text==='I pull the curtain farther aside.'))action='warm';
 else if((id==='rReturn'&&text==='It’s Rowan.')||(id==='aBedroom'&&text==='My phone lights up with one more message.')||(id==='c2Wave2After'&&text==='My phone lights up beside the folder.'))action='phone';
 return {ambient,action};
}
export const motions={
 bump:{duration:350,frames:[{transform:'translate(0)'},{transform:'translate(-5px,2px)',offset:.25},{transform:'translate(2px,-1px)',offset:.6},{transform:'translate(0)'}]},
 pan:{duration:8000,frames:[{transform:'scale(1.015) translateX(-3px)'},{transform:'scale(1.03) translateX(3px)'}]},
 letter:{duration:7000,frames:[{transform:'scale(1)'},{transform:'scale(1.01)'}]},
 sway:{duration:900,frames:[{transform:'translateX(0)'},{transform:'translateX(3px)'},{transform:'translateX(-2px)'},{transform:'translateX(0)'}]},
 tilt:{duration:650,frames:[{transform:'rotate(0)'},{transform:'rotate(.3deg)'},{transform:'rotate(0)'}]},
 focus:{duration:700,frames:[{filter:'blur(1px)'},{filter:'blur(0)'}]},
 react:{duration:250,frames:[{transform:'translateY(0)'},{transform:'translateY(-2px)'},{transform:'translateY(0)'}]},
 recoil:{duration:300,frames:[{transform:'translateX(0)'},{transform:'translateX(4px)'},{transform:'translateX(0)'}]},
 warm:{duration:900,frames:[{opacity:0},{opacity:.08},{opacity:0}]},
 phone:{duration:180,frames:[{transform:'translateX(0)'},{transform:'translateX(-2px)'},{transform:'translateX(2px)'},{transform:'translateX(0)'}]}
};
export function createSceneEffects({bump=()=>()=>{}}={}){
 let host,overlay,ambient='',key='',animations=[],cancelSound=()=>{},last;
 const seen=new Set();
 function cancel(){animations.forEach(a=>a.cancel());animations=[];cancelSound();cancelSound=()=>{};}
 function stop(){cancel();for(const target of host?.querySelectorAll('.scene-backdrops,.scene-art')||[])for(const animation of target.getAnimations?.({subtree:true})||[]){try{animation.finish();}catch{animation.cancel();}}overlay?.remove();overlay=null;host=null;ambient='';}
 function update(context){
  last=context;
  const {root,id,node,text,run,line,motion,sound,volume,suppress=false}=context;
  const cue=sceneCue(id,node,text),nextKey=`${run}:${id}:${line}`;
  const onceKey=`${run}:${id}:${['letter','warm'].includes(cue.action)?cue.action:line}`;
  const fresh=!seen.has(onceKey);seen.add(onceKey);
  if(host!==root||key!==nextKey){cancel();key=nextKey;}
  if(!root||document.hidden){stop();return;}
  if(!motion){stop();if(fresh&&!suppress&&cue.action==='bump'&&sound)cancelSound=bump(volume);return;}
  if(host!==root||ambient!==cue.ambient){
   overlay?.remove();host=root;ambient=cue.ambient;
   overlay=document.createElement('div');overlay.className=`scene-atmosphere ${ambient}`;overlay.setAttribute('aria-hidden','true');
   if(ambient.startsWith('dream'))overlay.innerHTML=dreamSmoke();
   if(['dust','leaves','rain'].includes(ambient))overlay.innerHTML=Array.from({length:ambient==='dust'?6:3},(_,i)=>`<i style="--i:${i}"></i>`).join('');
   root.append(overlay);
  }
  if(!fresh||suppress||!cue.action)return;
  const spec=motions[cue.action];
  const targets=cue.action==='warm'?[overlay]:cue.action==='phone'?[root.querySelector('.morning-phone,.phone-indicator,[data-action="phone"]')]:[...root.querySelectorAll('.scene-backdrops,.scene-art')];
  if(cue.action==='warm')overlay.classList.add('sun-wash');
  for(const target of targets.filter(Boolean))animations.push(target.animate(spec.frames,{duration:spec.duration,easing:'ease-in-out'}));
  if(cue.action==='bump'&&sound)cancelSound=bump(volume);
 }
 return {update,stop,resume(){if(last)update({...last,suppress:true});},reset(){stop();seen.clear();last=null;},dispose(){stop();last=null;}};
}
