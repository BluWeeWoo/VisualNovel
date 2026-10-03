import {translate,translateRecorded,setLanguage,normalizeLanguage,languageField} from '../assets/story-language.js';
import {mountNightmare} from '../assets/nightmare.js';
import {chapterMenu,chapterComplete} from '../assets/chapters.js';
import {morningPhone} from './morning-phone.js';
import {mountGarden} from '../assets/garden-game.js';
import {rowansLetter} from './continuation.js';
import {phoneCue,hasRowanContact,phoneBody,phoneIdentity} from './phone-ui.js';
import {story} from './story.js';
import {freshState, interpolate, applyChoice, validSave, visibleLines, promises, milestones, refreshAuthoredHistory, migrateStorySave, nextStoryNode} from './engine.js';
import {rowan, protagonistAge} from './characters.js';
import {spriteAt, expressions, cgAt} from './staging.js';
import {scriptedReply, requestReply, suggestions} from './chat.js';
import {setAudio} from './audio.js';
import {setOpeningAudio, openingAudioCue, menuAudioCue} from './opening-audio.js';
import {desktopMenu} from '../assets/desktop-menu.js';
import {galleryUnlocks,mountGallery} from '../assets/love-interests.js';
import {saveJournal,journalPages} from '../assets/save-journal.js';

const $=s=>document.querySelector(s);
const app=$('#app');
let gardenCleanup=null;
const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const storageKey='our-summer-v1';
const manualSaveKeys=Array.from({length:19},(_,i)=>`-slot${i+1}`);
const saveKeys=['-auto',...manualSaveKeys];
let savePage=0;
let saveMode='load',saveSelection='-auto',saveConfirmKey=null;
let state=null, screen='title', modal=null, timer=null, typing=false, fullText='', timerIndex=0;
let liveConsent=false, busy=false, error='', draft='', chatMode='demo', provider={available:false};
let manifest={backgrounds:{},portraits:{}};
let settings={language:'english',speed:32, motion:!matchMedia('(prefers-reduced-motion: reduce)').matches, sound:false, volume:.35};
try {settings={...settings,...JSON.parse(localStorage.getItem(storageKey+'-settings')||'{}')};}catch{}
settings.language=normalizeLanguage(settings.language);
setLanguage(settings.language);
const display=(text,s=state)=>interpolate(translate(text),s);
let storageAvailable=true;
function read(key){try{const value=JSON.parse(localStorage.getItem(storageKey+key)||'null');if(value?.state)migrateStorySave(value.state,story);return value;}catch{return null;}}
function write(key,value){try{localStorage.setItem(storageKey+key,JSON.stringify(value));return true;}catch{storageAvailable=false;toast('Storage is unavailable. Keep this tab open; saves cannot be retained.');return false;}}
function toast(text){$('#toast').textContent=text;$('#toast').classList.add('show');setTimeout(()=>$('#toast').classList.remove('show'),3800);}
function stopTyping(){clearInterval(timer);timer=null;typing=false;}
function autoSave(){if(state)write('-auto',{date:Date.now(),state});}
function syncGallery(){
  const previous=read('-gallery');
  const states=[state,...saveKeys.map(key=>read(key)?.state)].filter(s=>validSave(s,story));
  const unlocked=galleryUnlocks(story,manifest,states,previous?.unlocked);
  if(JSON.stringify(previous?.unlocked)!==JSON.stringify(unlocked))write('-gallery',{version:1,unlocked});
  return unlocked;
}
function enter(id){state.node=id;state.line=0;Object.assign(state,story[id].enter||{});autoSave();}
function nodeLines(){return visibleLines(story[state.node],state);}
function record(line){
  const text=interpolate(line.text,state);
  const id=`${state.node}:${state.line}`;
  if(!state.history.some(h=>h.id===id))state.history.push({id,speaker:line.speaker||'',text});
  if(cgAt(story,state))syncGallery();
}
function start(name,pronouns){presentedPhone='';presentedLetter='';state=freshState(name,pronouns);screen='game';modal=null;enter(state.node);render();}
function load(slot){presentedPhone='';presentedLetter='';const saved=read(slot);if(!validSave(saved?.state,story)){toast('This save is missing or incompatible.');return;}
  state=refreshAuthoredHistory(structuredClone(saved.state),story);screen='game';modal=null;busy=false;error='';draft='';enterAudio();render();toast('Summer resumed.');}
let audioUnlocked=false;
function enterAudio(){
  const node=screen==='game'&&state?story[state.node]:null;
  const enabled=settings.sound&&audioUnlocked;
  setAudio(enabled&&screen==='game'&&!node?.opening,settings.volume);
  const cue=screen==='title'?menuAudioCue():openingAudioCue(node,state);
  setOpeningAudio(enabled?cue:{layers:[],fade:.2},settings.volume,()=>toast('Audio could not play. Toggle sound off and on in Settings to retry.'));
}
// Browsers require an interaction before audible playback; preserve the saved mute preference.
function unlockAudio(){if(audioUnlocked)return;audioUnlocked=true;enterAudio();}
document.addEventListener('pointerdown',unlockAudio,{once:true});
document.addEventListener('keydown',unlockAudio,{once:true});
function advance(){
  if(screen!=='game'||modal||busy||story[state.node]?.nightmare)return;
  if(typing){stopTyping();$('#dialogue-text').textContent=fullText;return;}
  const node=story[state.node],all=nodeLines();
  if(state.line<all.length-1){state.line++;autoSave();renderGame();return;}
  if(node.choices||node.ending||node.phone)return;
  if(node.next){enter(nextStoryNode(story,state));renderGame();}
}
function choose(index){const node=story[state.node],opt=node.choices?.[index];if(!opt)return;
  const text=interpolate(opt.text,state);
  state.history.push({id:`choice:${state.node}`,speaker:state.name,text});
  applyChoice(state,opt);enter(state.node);renderGame();}
function bg(place,time){const url=manifest.backgroundVariants?.[place]?.[time]||manifest.backgrounds[place]||`assets/backgrounds/${place}.svg`;return `<div class="backdrop ${time} ${(place.startsWith('manila-')||place.startsWith('d2-'))?'painted-light':''}" style="background-image:url('${escape(url)}')" aria-hidden="true"></div><div class="paper-grain" aria-hidden="true"></div>`;}
function brand(){return '<span class="brand-mark" aria-hidden="true">☼</span><span class="brand-name">SUMMERHOUSE<br><small>A place to come back to</small></span>';}
function iconButton(action,label,symbol){return `<button class="tool" data-action="${action}" aria-label="${label}" title="${label}"><span aria-hidden="true">${symbol}</span><span>${label}</span></button>`;}
function title(){
  const saved=read('-auto');const resume=validSave(saved?.state,story);
  if(matchMedia('(min-width: 1051px)').matches){
    app.innerHTML=desktopMenu(resume);
    bind();
    app.querySelectorAll('.plank').forEach(button=>button.addEventListener('click',()=>{
      app.querySelectorAll('.plank').forEach(item=>item.classList.remove('is-selected'));
      button.classList.add('is-selected');
    }));
    return;
  }
  app.innerHTML=`<main class="title-screen">${bg('exterior','day')}<div class="title-wash"></div>
    <header class="title-header">${brand()}<span class="edition">AN INTERACTIVE SUMMER STORY <span>•</span> CHAPTERS ONE &amp; TWO</span></header>
    <section class="title-copy"><div class="eyebrow"><span class="short-line"></span> SOME THINGS WAIT FOR YOU</div>
    <h1>Our Summer,<br><em>Unfinished</em><span class="title-period">.</span></h1>
    <div class="title-actions"><button class="primary" data-action="${resume?'continue':'new'}">${resume?'Continue your summer':'Begin your summer'} <span aria-hidden="true">↗</span></button>
    ${resume?'<button class="text-button" data-action="new">Start a new summer</button>':''}
    <div class="title-secondary"><button data-action="saves">Saved moments</button><span>·</span><button data-action="settings">Settings</button><span>·</span><button data-action="love-interests">Love Interests</button><span>·</span><button data-action="about">About</button></div></div>
    <p class="content-note">A gentle story about returning, remembering, and finding room.<br>Includes bereavement, a difficult home life, and being away.</p></section>
    <aside class="postcard" aria-hidden="true"><span>Summerhouse, late June</span><small>the blue door still sticks a little</small></aside>
    <footer class="title-footer"><span>01 <i></i> THE HOUSE WITH THE BLUE DOOR</span><span>Take your time. There’s no wrong way to feel.</span><button data-action="accessibility">Reading & accessibility ↗</button></footer></main>`;
  bind();
}
function render(){if(screen==='title'){gardenCleanup?.();gardenCleanup=null;}stopTyping();enterAudio();document.documentElement.classList.toggle('reduced-motion',!settings.motion);if(screen==='title')title();else renderGame();}
// Keep visual DOM alive across dialogue renders. Decode replacements before fading
// them in, and discard stale loads if the player advances quickly.
async function updateVisual(host,html,key){
  if(host.dataset.visualKey===key)return;
  host.dataset.visualKey=key;
  const revision=host._revision=(host._revision||0)+1;
  const layer=document.createElement('div');layer.className='visual-layer';layer.innerHTML=html;
  const images=[...layer.querySelectorAll('img')];
  for(const backdrop of layer.querySelectorAll('.backdrop')){
    const url=backdrop.style.backgroundImage.match(/url\(["']?(.*?)["']?\)/)?.[1];
    if(url){const image=new Image();image.src=url;images.push(image);}
  }
  try{await Promise.all(images.map(image=>image.decode()));}catch{if(host._revision===revision)host.dataset.visualKey='';return;}
  if(host._revision!==revision||!host.isConnected)return;
  const previous=[...host.children];host.append(layer);
  const motion=settings.motion&&!matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(motion&&previous.length){
    const fades=[layer.animate([{opacity:0},{opacity:1}],{duration:420,easing:'ease-in-out'})];
    for(const old of previous)fades.push(old.animate([{opacity:1},{opacity:0}],{duration:420,easing:'ease-in-out',fill:'forwards'}));
    await Promise.all(fades.map(fade=>fade.finished.catch(()=>{})));
  }
  previous.forEach(old=>old.remove());
}
function mountGame(html,backgroundKey,artKey){
  const template=document.createElement('template');template.innerHTML=html;
  const next=template.content.firstElementChild;
  let main=app.querySelector('.game-screen');
  if(!main){main=next;app.replaceChildren(main);}
  for(const selector of ['.scene-backdrops','.scene-art']){
    const target=main.querySelector(selector),incoming=next.querySelector(selector);
    const content=incoming.innerHTML;
    if(main===next)target.replaceChildren();
    updateVisual(target,content,selector==='.scene-art'?artKey:backgroundKey);
  }
  if(main!==next){
    // Preserve the panel and unchanged controls, including keyboard focus.
    main.querySelector('.dialogue-card').className=next.querySelector('.dialogue-card').className;
    for(const selector of ['.speaker','.dialogue-reserve','.dialogue-status','.dialogue-extras','.dialogue-footer','.game-footer']){
      const current=main.querySelector(selector),incoming=next.querySelector(selector);
      if(current.innerHTML!==incoming.innerHTML)current.innerHTML=incoming.innerHTML;
    }
  }
}
function renderGame(){
  stopTyping();
  gardenCleanup?.();gardenCleanup=null;
  const nightmareNode=story[state.node];
  if(nightmareNode.nightmare){
    enterAudio();
    gardenCleanup=mountNightmare(app,state,{wave:nightmareNode.nightmare,motion:settings.motion,save:autoSave,done:()=>{enter(nightmareNode.next);renderGame();},menu:()=>{screen='title';render();}});
    return;
  }
  if(story[state.node].minigame){
    enterAudio();
    gardenCleanup=mountGarden(app,state,{save:autoSave,motion:settings.motion,sound:settings.sound,volume:settings.volume,done:()=>{enter('gResult');renderGame();},menu:()=>{screen='title';render();}});
    return;
  }
  const node=story[state.node],all=nodeLines(),line=all[Math.min(state.line,all.length-1)];
  if(!line){toast('This scene could not be loaded.');return;}
  record(line);autoSave();enterAudio();
  const last=state.line>=all.length-1;
  const cue=phoneCue(story,state);
  const displayText=cue?.message?(line.speaker==='You · text'?'I send him a message.':'A message from Rowan lights up your phone.'):display(line.text);
  const staging=spriteAt(story,state);
  const portrait=staging&&manifest.portraits[staging.character||'Rowan']?.[staging.key];
  const cg=manifest.cgs?.[cgAt(story,state)];
  const gameHTML=`<main class="game-screen"><div class="scene-backdrops">${bg(node.place,node.time)}</div>
    <div class="scene-art" aria-label="Scene illustration">
    ${cg?`<img class="event-cg" src="${escape(cg.src)}" width="1536" height="1024" alt="${escape(cg.alt)}" fetchpriority="high" decoding="async">`:portrait?`<aside class="character-stage ${node.time}${node.childhood?' childhood':''}" data-expression="${staging.expression}" data-pose="${staging.pose}"><img src="${escape(portrait)}" width="${manifest.spriteCanvas.width}" height="${manifest.spriteCanvas.height}" alt="Rowan${node.childhood?', age eleven':''}, ${staging.expression}${staging.pose==='book'?', holding an illustrated book':''}." fetchpriority="high"></aside>`:''}
    </div>
    <div class="scene-bottom">
    <section class="dialogue-card ${cue?.message?'narration':line.kind|| (line.speaker?'spoken':'narration')}" aria-label="Story dialogue">
    <div class="dialogue-top"><span class="speaker"><span class="speaker-name">${escape(line.kind==='spoken'?(line.speaker==='You'?state.name:line.speaker):'')}</span></span><span class="dialogue-ornament" aria-hidden="true">✳</span></div>
    <div class="dialogue-copy"><p class="dialogue-reserve" aria-hidden="true">${escape(displayText)}</p><p id="dialogue-text" aria-live="off"></p></div><span class="sr-only dialogue-status" role="status">${escape(cue?.message?displayText:(line.speaker?line.speaker+': ':'')+display(line.text))}</span>
    <div class="dialogue-extras">${morningPhone(node,state)}${node.letter?'<button class="secondary" data-action="letter">Read Rowan’s letter ↗</button>':''}${last&&node.choices?`<div class="choices" aria-label="Choose your response">${node.choices.map((c,i)=>`<button data-choice="${i}"><span class="choice-number">${i+1}</span>${escape(display(c.text))}<span class="choice-arrow" aria-hidden="true">↗</span></button>`).join('')}</div>`:''}
    ${last&&node.phone?'<div class="phone-invitation"><p>A short late-night conversation · up to 4 messages<br><small>An early preview. Open conversations unlock at Close in future chapters.</small></p><button class="primary" data-action="phone">Open your phone ↗</button><button class="text-button" data-action="skip-chat">Save your words for morning</button></div>':''}
    ${last&&node.openingEnd?`<div class="opening-end"><span class="eyebrow">END OF THE CURRENT STORY</span><p>${node.chapterTwo?'Chapter Two’s opening is complete. Your place is saved; the rest of the chapter is still to come.':node.afterGarden?'Chapter One — Reunion at a Familiar House. Chapter Two is ready in Chapters.':'Your place is saved. You can continue from here.'}</p><button class="text-button" data-action="title">Back to the title ↗</button><button class="secondary" data-action="chapters">View chapters ↗</button></div>`:''}
    ${last&&node.ending&&!node.openingEnd?`<div class="chapter-end"><span class="eyebrow">END OF CHAPTER ONE</span><h2>A little less unfinished.</h2><p>Your summer is saved. The sunrise is planned, not yet fulfilled.</p><div><button class="primary" data-action="promises">Keep the list ↗</button><button class="secondary" data-action="title">Back to the title</button></div><small>Chapter two continues the sunrise promise. This build contains chapter one.</small></div>`:''}
    </div><div class="dialogue-footer"><nav class="dialogue-tools" aria-label="Game tools"><button data-action="history">History</button><button data-action="saves">Save / load</button><button data-action="settings">Settings</button><button data-action="promises">Promises</button>${hasRowanContact(state)?'<button data-action="sg">Phone</button>':''}<button data-action="title" aria-label="Return to title">Menu</button></nav>${!(last&&(node.choices||node.phone||node.ending))?'<button class="next-button" data-action="next" aria-label="Continue dialogue">Continue <span aria-hidden="true">→</span></button>':'<span class="small-flower" aria-hidden="true">✳</span>'}</div></section>
    <footer class="game-footer"><span>${escape(state.name)}’s summer <span class="footer-dot">·</span> <button data-action="relationship" aria-label="Relationship milestones">${escape(state.milestone)}</button></span><span>${state.phoneUnlocked?'<button data-action="phone">↗ Late-night messages</button>':'A story at your own pace'}</span><span class="save-indicator">${storageAvailable?'● Progress saved locally':'! Local saves unavailable'}</span></footer></div></main>`;
  mountGame(gameHTML,`${node.place}:${node.time}`,cg?`cg:${cg.src}`:`sprite:${portrait||'none'}:${node.time}`);
  const gameScreen=app.querySelector('.game-screen');
  gameScreen.classList.toggle('dream-waking-sequence',['c2Calling','c2Blackout','c2Wake'].includes(state.node));
  gameScreen.classList.toggle('dream-blackout',!!node.blackout);
  const morningMessages=$('.morning-phone');
  if(morningMessages){morningMessages.scrollTop=morningMessages.scrollHeight;morningMessages.onclick=e=>e.stopPropagation();}
  bind();
  fullText=displayText;
  const textNode=$('#dialogue-text');
  if(settings.speed===0||!settings.motion||last&&(node.choices||node.phone||node.ending)){textNode.textContent=fullText;}
  else {textNode.textContent='';typing=true;timerIndex=0;timer=setInterval(()=>{timerIndex+=2;textNode.textContent=fullText.slice(0,timerIndex);if(timerIndex>=fullText.length)stopTyping();},1000/settings.speed);}
  $('.dialogue-card').onclick=e=>{if(!e.target.closest('button,input,textarea'))advance();};
  const endKey=String(state.startedAt)+':'+state.node;
  if(state.node==='aEnd'&&last&&presentedChapterEnd!==endKey){presentedChapterEnd=endKey;autoSave();openModal('chapters');}
  const cueKey=state.node+':'+state.line;
  if(node.letter&&presentedLetter!==state.node&&(state.node==='rLetterNow'||state.flags.letterTiming==='later')&&last){presentedLetter=state.node;openModal('letter');}
  if(cue&&presentedPhone!==cueKey){presentedPhone=cueKey;phonePage=cue.page;openModal('story-phone');}
}
let previousFocus;
let presentedPhone='',phonePage='contact',presentedLetter='',presentedChapterEnd='';
function openModal(kind){
  if(!document.activeElement?.closest('.modal-layer'))previousFocus=document.activeElement;
  if(typing){stopTyping();$('#dialogue-text').textContent=fullText;}
  if(kind==='saves'){
    saveMode=state&&screen==='game'?'save':'load';saveConfirmKey=null;
    if(saveMode==='save'&&saveSelection==='-auto')saveSelection=journalPages(manualSaveKeys,savePage).keys[0];
  }
  modal=kind;drawModal();
}
function closeModal(){if(busy)return;const layer=$('.modal-layer');if(layer?.querySelector('.sg-device,.phone-modal,.letter-paper')&&settings.motion&&!matchMedia('(prefers-reduced-motion: reduce)').matches){layer.style.pointerEvents='none';layer.animate([{opacity:1},{opacity:0}],{duration:160}).finished.catch(()=>{}).then(()=>layer.remove());}else layer?.remove();modal=null;error='';if(screen==='title'&&Boolean($('.seaglass-menu'))!==matchMedia('(min-width: 1051px)').matches){render();return;}if(previousFocus?.isConnected&&!previousFocus.closest('.modal-layer'))previousFocus.focus();else $('.next-button')?.focus();}
function shell(title,body,extra=''){
  const existing=$('.modal-layer');
  const reuse=extra==='saves-modal'&&existing?.querySelector('.saves-modal');
  const scrollTop=reuse?existing.querySelector('.modal')?.scrollTop||0:0;
  if(!reuse)existing?.remove();
  const layer=reuse?existing:document.createElement('div');layer.className='modal-layer';
  const heading=extra==='saves-modal'?'':`<header class="modal-header"><div><span class="eyebrow">OUR SUMMER, UNFINISHED</span><h2 id="modal-title">${title}</h2></div><button class="close" data-action="close" aria-label="Close dialog" ${busy?'disabled':''}>×</button></header>`;
  layer.innerHTML=`<section class="modal ${extra} ${['settings','about'].includes(modal)?'coastal-panel '+modal+'-panel':''}" role="dialog" aria-modal="true" aria-labelledby="modal-title">${heading}${body}</section>`;
  if(!reuse){
    document.body.append(layer);
    layer.addEventListener('click',e=>{if(e.target===layer&&!busy)closeModal();});
  }
  bind(layer);
  if(reuse){const panel=layer.querySelector('.modal');if(panel)panel.scrollTop=scrollTop;}
  else (layer.querySelector('input:not([type=range]),textarea')||layer.querySelector('button:not([disabled])'))?.focus();
}
function savePreview(saved){
  const node=story[saved.node];
  const background=manifest.backgroundVariants?.[node.place]?.[node.time]||manifest.backgrounds[node.place]||`assets/backgrounds/${node.place}.svg`;
  const cg=manifest.cgs?.[cgAt(story,saved)],sprite=spriteAt(story,saved);
  const portrait=!cg&&sprite&&manifest.portraits[sprite.character||'Rowan']?.[sprite.key];
  return `<span class="save-preview" role="img" aria-label="${escape(node.title)} — scene preview"><img class="save-background ${escape(node.time)} ${node.place.startsWith('manila-')?'painted-light':''}" src="${escape(background)}" alt="" loading="lazy">${cg?`<img class="save-cg" src="${escape(cg.src)}" alt="" loading="lazy">`:portrait?`<img class="save-portrait" src="${escape(portrait)}" alt="" loading="lazy">`:''}</span>`;
}
function drawSaveJournal(){
  const entries=saveKeys.map((key,i)=>{
    const data=read(key),valid=validSave(data?.state,story);
    const saved=valid?data.state:null,node=saved&&story[saved.node],line=saved&&visibleLines(node,saved)[saved.line];
    const date=new Date(data?.date);
    return {key,chapter:valid?(story[saved.node].chapter||1):1,number:String(i).padStart(2,'0'),label:i?'Moment '+String(i).padStart(2,'0'):'Autosave',exists:!!data,valid,
      title:node?.title.replace(/^\d+\s*\/\s*/,''),name:saved?.name,
      date:valid&&!Number.isNaN(date.getTime())?date.toLocaleString(undefined,{month:'short',day:'numeric',year:'numeric',hour:'numeric',minute:'2-digit'}):'Date unknown',
      excerpt:line?display(line.text,saved):'A quiet place in your summer.',preview:valid?savePreview(saved):''};
  });
  shell('Saved moments',saveJournal({entries,page:savePage,mode:saveMode,selected:saveSelection,canSave:!!state&&screen==='game',confirmKey:saveConfirmKey}),'saves-modal');
}
function redrawSaveJournal(focusSelector){
  drawSaveJournal();
  $(focusSelector)?.focus({preventScroll:true});
}
function saveMoment(key,confirmed=false){
  if(!state||screen!=='game'||!manualSaveKeys.includes(key))return;
  saveSelection=key;
  if(read(key)&&!confirmed){saveConfirmKey=key;redrawSaveJournal('[data-save-cancel]');return;}
  if(write(key,{date:Date.now(),state})){
    saveConfirmKey=null;redrawSaveJournal(`[data-save-select="${key}"]`);toast('Moment saved.');
  }
}
function drawModal(){
  if(modal==='chapters'){
    const current=state||read('-auto')?.state;
    shell('Chapters of our summer',chapterMenu(current,chapterComplete(current,story)),'chapters-modal');
    $('.chapters-modal>.modal-header')?.remove();
    $('.chapters-heading .close')?.focus();
    return;
  }

  if(modal==='letter'){
    if(!state||!story[state.node]?.letter){closeModal();return;}
    rowansLetter.forEach((text,i)=>{const id='letter:'+state.node+':'+i;if(!state.history.some(h=>h.id===id))state.history.push({id,speaker:'Rowan · letter',text:interpolate(text,state)});});
    state.flags.letterRead=true;autoSave();
    shell('A letter from Ro',`<article class="letter-paper"><p class="letter-date">Written just after Rowan’s twenty-first birthday · a few months before Lola passed away</p>${rowansLetter.map(text=>`<p>${escape(display(text))}</p>`).join('')}<p class="letter-drawing" aria-label="A small boat drawn beneath Rowan’s name">⛵</p></article><button class="secondary" data-action="close">Fold the letter</button>`,'letter-modal');return;
  }

  if(modal==='love-interests'){
    shell('Love Interests','','li-modal');
    mountGallery($('.li-modal'),{manifest,unlocks:syncGallery(),onClose:closeModal});
    return;
  }
  if(modal==='cast'){
    shell('Rowan',`<p class="cast-bio">${rowan.age} · ${rowan.pronouns} · your childhood friend<br><span>Warm, a little guarded, and still terrible at defending his chips.</span></p><div class="cast-art" style="background-image:url('${escape(manifest.backgrounds.exterior)}')"><img id="cast-sprite" src="${escape(manifest.portraits.Rowan.neutral)}" alt="Rowan, neutral expression." width="1254" height="1254"></div><div class="cast-options" aria-label="Expression previews">${[...expressions,'book'].map(key=>`<button class="secondary" data-preview="${key}" aria-pressed="${key==='neutral'}">${{smile:'Warm smile',playful:'Teasing',embarrassed:'Blushing',sad:'Quiet grief',book:'With book',neutral:'Neutral',concerned:'Concerned',surprised:'Surprised'}[key]}</button>`).join('')}</div><div class="cast-locations" aria-label="Background previews">${Object.keys(manifest.backgrounds).map(key=>`<button class="text-button" data-location="${key}">${{exterior:'Guesthouse',living:'Living room',bedroom:'Bedroom',street:'Seaside street',pier:'Old pier'}[key]||key}</button>`).join('')}</div><p class="small-note">Official character design and original illustration by you. Additional expressions and backgrounds created from your reference.</p>`,'cast-modal');
    document.querySelectorAll('[data-preview]').forEach(button=>button.onclick=()=>{const key=button.dataset.preview;$('#cast-sprite').src=manifest.portraits.Rowan[key];$('#cast-sprite').alt=`Rowan, ${key} expression.`;document.querySelectorAll('[data-preview]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));});
    document.querySelectorAll('[data-location]').forEach(button=>button.onclick=()=>{$('.cast-art').style.backgroundImage=`url('${manifest.backgrounds[button.dataset.location]}')`;});
  }
  if(modal==='new')shell('A name to come home to',`<p class="muted">You’re ${protagonistAge}. It’s been years since your last proper summer here.<br>The rest is yours to remember.</p><form id="new-form">${languageField('new-language')}<label>Your name<input name="name" maxlength="24" value="Alex" required autocomplete="off"></label><fieldset><legend>Pronouns</legend><div class="pronouns"><label><input type="radio" name="pronouns" value="they" checked> they / them</label><label><input type="radio" name="pronouns" value="she"> she / her</label><label><input type="radio" name="pronouns" value="he"> he / him</label></div></fieldset><p class="small-note">Friendship, romance, and taking your time are all welcome.<br>${read('-auto')?'Starting replaces the autosave. Manual save slots stay safe.':'Progress saves automatically in this browser.'}</p><button class="primary" type="submit">Open the gate ↗</button></form>`);
  if(modal==='promises'){
    const found=state?.promiseFound;
    shell('Before we get boring',`<div class="journal"><div class="journal-date">A summer, years ago <span>in green ink</span></div>${found?`<ol class="promise-list">${promises.map((p,i)=>`<li><span class="promise-check ${i===0&&state.sunrise==='planned'?'planned':''}">${i===0&&state.sunrise==='planned'?'◷':'○'}</span><div>${p}${i===0?`<small>${state.sunrise==='planned'?`Tomorrow · 4:40 at the gate · ${escape(state.flags.ritual||'a flask')}<br>Planned — still waiting for the sunrise.`:'Not yet begun.'}</small>`:'<small>For another day.</small>'}</div></li>`).join('')}</ol><p class="handwritten">A promise isn’t a trap.</p>`:'<p class="empty-state">Some things are waiting in the drawers.<br>You haven’t found the list yet.</p>'}</div>`);
  }
  if(modal==='history')shell('The things we said',`<div class="history-list">${state?.history.length?state.history.map(h=>`<article><strong>${escape(h.speaker==='You'?state.name:h.speaker||'—')}</strong><p>${escape(translateRecorded(h.text,state))}</p></article>`).join(''):'<p>No dialogue yet. Begin your summer first.</p>'}</div>`);
  if(modal==='saves'){drawSaveJournal();return;}
  if(modal==='settings')shell('Make yourself comfortable',`<div class="settings-list"><div class="language-setting">${languageField()}</div><label>Text speed <span id="speed-label">${settings.speed===0?'Instant':settings.speed+' letters / second'}</span><input id="speed" aria-label="Text speed, zero is instant" type="range" min="0" max="80" step="8" value="${settings.speed}"></label><label class="toggle-row"><span>Reduced motion<small>Also displays dialogue instantly.</small></span><input id="motion" type="checkbox" ${!settings.motion?'checked':''}></label><label class="toggle-row"><span>Music & ambience<small>Your scene soundtrack and ambience. Off by default.</small></span><input id="sound" type="checkbox" ${settings.sound?'checked':''}></label><label>Audio volume<input id="volume" aria-label="Audio volume" type="range" min="0" max="1" step=".05" value="${settings.volume}"></label></div><div class="controls-note"><strong>At your own pace</strong><p>Space / Enter: reveal or advance · 1–4: choose a response<br>H: history · P: promises · S: save / load · Esc: close a panel<br>Tab and Shift+Tab move between controls. There are no timed choices.</p></div><button class="secondary" data-action="memories">Review saved chat memories</button>`);
  if(modal==='about')shell('A summer worth coming back to',`<div class="about-story-layout"><aside class="about-rowan"><svg viewBox="335 132 270 435" role="img" aria-label="Chibi Rowan smiling and waving with a yellow envelope" overflow="hidden"><image href="assets/chapters/affinity-sheet.png" width="1536" height="1024"/></svg><p>Same skies.<br>A little closer, one day at a time.</p></aside><div class="about-story-copy"><p class="about-lead">An old house. A childhood friend. A summer with room to begin again.</p><p>At twenty-three, you return to Saint Luis and Lola’s familiar house. Rowan is here too—with shared memories, a yellow-envelope promise, and years of things you never quite got to say.</p><p><strong>Chapter 1 · Reunion at a familiar house</strong><br>Follow the journey home, remember the letters that once connected you, and settle into the small moments of being together again: breakfast, a little gardening, and conversations on the porch as day turns to evening.</p><p>Choose what to share, what to ask, and how close to let Rowan become. Friendship, the possibility of romance, and taking your time all have a place here.</p><p class="about-status">Chapter 1 and the opening of Chapter 2 are playable. Chapter 2 begins with a nightmare about city life, a thought-clearing mini-game, and Rowan checking on you. The rest of Chapter 2 and Chapters 3–5 are still to come.</p></div></div><footer class="about-details"><p>Rowan’s original character design is by the creator, with generated supporting illustrations. Rowan and the protagonist are both adults, aged 23.</p><p>Content notes: grief, bereavement, controlling parents, destroyed personal letters, nightmares, and academic pressure. Complete each nightmare mini-game to continue; you can pause and resume.</p><p>Progress is saved in this browser. The default phone uses scripted replies; no messages leave your device in demo mode.</p></footer>`);
  if(modal==='relationship')shell('Becoming familiar',`<p>Trust grows through shared moments and honest choices. It isn’t a score. Friendship and romance have the same room to grow.</p><ol class="milestone-list">${milestones.map(m=>`<li><strong>${m.name}${state?.milestone===m.name?' · now':''}</strong><p>${m.unlock}</p></li>`).join('')}</ol><p class="small-note">Chapter one ends at Familiar. Later milestones await future chapters. Skipping chat, disagreeing respectfully, or needing space never takes trust away.</p>`);
  if(modal==='memories')memoryModal();
  if(modal==='phone')phoneModal();
  if(modal==='story-phone')storyPhoneModal();
  if(modal==='history') {const history=$('.history-list');history.scrollTop=history.scrollHeight;}
  bindForms();
}
function bindForms(){
  $('#new-form')?.addEventListener('submit',e=>{e.preventDefault();const form=new FormData(e.target);settings.language=normalizeLanguage(form.get('language'));setLanguage(settings.language);write('-settings',settings);$('.modal-layer').remove();start(form.get('name'),form.get('pronouns'));enterAudio();});
  const saveSettings=()=>{write('-settings',settings);document.documentElement.classList.toggle('reduced-motion',!settings.motion);};
  $('#language')?.addEventListener('change',e=>{settings.language=normalizeLanguage(e.target.value);setLanguage(settings.language);saveSettings();stopTyping();render();if(typing){stopTyping();$('#dialogue-text').textContent=fullText;}modal='settings';drawModal();$('#language')?.focus();});
  $('#speed')?.addEventListener('input',e=>{settings.speed=Number(e.target.value);$('#speed-label').textContent=settings.speed===0?'Instant':settings.speed+' letters / second';saveSettings();});
  $('#motion')?.addEventListener('change',e=>{settings.motion=!e.target.checked;saveSettings();});
  $('#sound')?.addEventListener('change',e=>{settings.sound=e.target.checked;enterAudio();saveSettings();});
  $('#volume')?.addEventListener('input',e=>{settings.volume=Number(e.target.value);enterAudio();saveSettings();});
}
function memoryModal(){shell('Only what you choose to keep',`<p class="muted">Nothing is extracted automatically. Add a small detail you want Rowan to remember, such as a favorite drink. Up to eight notes, 120 characters each. In live mode, these notes are sent with your messages.</p>${state?`<ul class="memory-list">${state.memories.length?state.memories.map((m,i)=>`<li><span>${escape(m.value)}</span><button class="text-button" data-forget="${i}">Forget</button></li>`).join(''):'<li>No saved chat memories.</li>'}</ul><form id="memory-form"><label>A detail I choose to remember<input name="memory" maxlength="120" required placeholder="e.g. I like tea with milk" ${state.memories.length>=8?'disabled':''}></label><button class="secondary" ${state.memories.length>=8?'disabled':''}>Save this detail</button></form><div class="memory-actions"><button class="text-button" data-action="clear-memories">Clear all chat memories</button><button class="text-button" data-action="clear-transcript">Clear saved phone messages</button></div><p class="small-note">Clearing also removes these details from existing local save slots. Authored story choices remain. Clearing messages does not reset the four-message preview.</p>`:'<p>Start a summer to save your own details.</p>'}`);
  $('#memory-form')?.addEventListener('submit',e=>{e.preventDefault();const value=new FormData(e.target).get('memory').trim();if(value&&state.memories.length<8){state.memories.push({key:'player-approved note',value});autoSave();drawModal();toast('Detail saved with your permission.');}});
}
function scrubSaves(field){for(const key of saveKeys){const save=read(key);if(validSave(save?.state,story)){save.state[field]=[];write(key,save);}}}
function storyPhoneModal(){
  const cue=phoneCue(story,state);
  if(phonePage!=='lola'&&!hasRowanContact(state))return;
  const next=nodeLines()[state.line+1];
  const nextMessage=['Rowan · text','You · text'].includes(next?.speaker);
  const content=phoneBody(phonePage,state,{typing:cue?.typing&&phonePage==='messages'});
  const nextButton=nextMessage?'<button class="sg-main-button" data-action="phone-next">Read next message →</button>':'';
  const existing=$('.sg-device');
  if(existing){const activeAction=document.activeElement?.dataset.action;existing.querySelector('.sg-body').innerHTML=content+nextButton;bind(existing);const target=[...existing.querySelectorAll('[data-action]')].find(el=>el.dataset.action===activeAction);(target||existing.querySelector('[data-action=close]'))?.focus();}
  else shell('Your phone',`<div class="sg-body">${content}${nextButton}</div>`,'sg-device');
}
function phoneModal(){
  if(!state?.phoneUnlocked){shell('A number, not yet exchanged','<p>The phone opens later in chapter one.</p>');return;}
  const done=state.chatDone||state.chatTurns>=4||state.node!=='texting';
  shell('<img class="phone-avatar" src="assets/references/rowan-original.png" alt="">Rowan <span class="online-dot" aria-hidden="true"></span>',`<div class="phone-status"><span>21:48 · HE/HIM · AGE 23</span><span>${state.chatTurns}/4 messages</span></div><p class="sg-thread-number">${phoneIdentity.number} · fictional number · private conversation</p><div class="chat-mode"><strong>${chatMode==='live'?'External AI conversation':'Scripted chat demo · not live AI'}</strong><p>${chatMode==='live'?`Your message, recent conversation, chapter-one choices, name, pronouns, and approved memories are sent to ${escape(provider.provider)}. Provider retention rules apply. No plot changes are made by chat.`:'Original prewritten replies respond to broad topics. Nothing is sent to an external provider.'}</p>${provider.available&&!done?`<button class="text-button" data-action="${chatMode==='live'?'demo':'live'}">${chatMode==='live'?'Use scripted demo':'Use external AI…'}</button>`:''}</div>
    <div class="chat-log" role="log" aria-label="Messages with Rowan" aria-live="polite"><div class="chat-date">TONIGHT</div><div class="bubble rowan">Important clarification: the gull was not representative of the local hospitality industry.</div>${state.chat.map(m=>`<div class="bubble ${m.role==='player'?'player':'rowan'}">${escape(m.text)}<small class="chat-receipt">21:48 · ${m.role==='player'?'Read':'Received'}</small></div>`).join('')}${busy?'<div class="bubble rowan typing" role="status">Rowan is typing<span>…</span></div>':''}</div>
    ${error?`<div class="chat-error" role="alert">${escape(error)}<div><button class="secondary" data-action="retry">Retry</button><button class="text-button" data-action="demo">Use scripted demo</button></div></div>`:''}
    ${!done?`<div class="suggestions">${suggestions.map(s=>`<button data-suggest="${escape(s)}" ${busy?'disabled':''}>${escape(s)}</button>`).join('')}</div><form id="chat-form"><label class="sr-only" for="chat-input">Your message to Rowan</label><textarea id="chat-input" maxlength="600" rows="2" placeholder="Say something in your own words…" ${busy?'disabled':''}>${escape(draft)}</textarea><button class="send-button" aria-label="Send message" ${busy?'disabled':''}>↑</button></form><p class="small-note">Up to 4 messages tonight. Enter to send; Shift+Enter for a new line.</p>`:'<p class="chat-goodnight">Enough for tonight. Tomorrow has room for more.</p>'}
    <footer class="phone-footer"><button class="text-button" data-action="memories" ${busy?'disabled':''}>Saved memories</button><button class="secondary" data-action="finish-chat" ${busy?'disabled':''}>${state.node==='texting'?'Put the phone down':'Back to the story'}</button></footer>`,'phone-modal');
  const log=$('.chat-log');log.scrollTop=log.scrollHeight;
  $('#chat-input')?.addEventListener('input',e=>draft=e.target.value);
  $('#chat-input')?.addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();sendMessage();}});
  $('#chat-form')?.addEventListener('submit',e=>{e.preventDefault();sendMessage();});
}
async function sendMessage(){
  if(busy||!state||state.chatDone||state.chatTurns>=4||state.node!=='texting')return;
  const message=draft.trim().slice(0,600);if(!message)return;
  busy=true;error='';phoneModal();
  try {
    let reply;
    if(chatMode==='live'){
      if(!liveConsent)throw new Error('Consent is required before messages can be sent.');
      reply=await requestReply(state,message,AbortSignal.timeout(23000));
    } else {
      await new Promise(resolve=>setTimeout(resolve,settings.motion?650:150));
      reply=scriptedReply(message,state);
    }
    state.chat.push({role:'player',text:message},{role:'rowan',text:reply});state.chatTurns++;draft='';autoSave();
  } catch(e){error=e.name==='TimeoutError'?'The connection timed out. Retry, switch to the scripted demo, or put the phone down.':e.message;}
  finally{busy=false;if(modal==='phone')phoneModal();}
}
function bind(root=app){
  root.querySelectorAll('[data-save-page]').forEach(el=>el.onclick=e=>{
    e.stopPropagation();const next=journalPages(manualSaveKeys,Number(el.dataset.savePage));
    savePage=next.page;saveSelection=next.keys[0];saveConfirmKey=null;
    redrawSaveJournal(`[data-save-page="${savePage}"][aria-current="page"]`);
  });
  root.querySelectorAll('[data-save-select]').forEach(el=>el.onclick=e=>{
    e.stopPropagation();saveSelection=el.dataset.saveSelect;saveConfirmKey=null;
    redrawSaveJournal(`[data-save-select="${saveSelection}"]`);
  });
  root.querySelectorAll('[data-save-mode]').forEach(el=>el.onclick=e=>{
    e.stopPropagation();saveMode=el.dataset.saveMode;saveConfirmKey=null;
    if(saveMode==='save'&&saveSelection==='-auto')saveSelection=journalPages(manualSaveKeys,savePage).keys[0];
    redrawSaveJournal(`[data-save-mode="${saveMode}"]`);
  });
  root.querySelectorAll('[data-save-cancel]').forEach(el=>el.onclick=e=>{e.stopPropagation();saveConfirmKey=null;redrawSaveJournal('[data-save]');});
  root.querySelectorAll('[data-save-confirm]').forEach(el=>el.onclick=e=>{e.stopPropagation();if(el.dataset.saveConfirm===saveConfirmKey)saveMoment(saveConfirmKey,true);});
  root.querySelectorAll('[data-action]').forEach(el=>{el.onclick=()=>action(el.dataset.action);});
  root.querySelectorAll('[data-choice]').forEach(el=>{el.onclick=()=>choose(Number(el.dataset.choice));});
  root.querySelectorAll('[data-save]').forEach(el=>el.onclick=e=>{e.stopPropagation();saveMoment(el.dataset.save);});
  root.querySelectorAll('[data-load]').forEach(el=>el.onclick=e=>{e.stopPropagation();if(validSave(read(el.dataset.load)?.state,story)){load(el.dataset.load);$('.modal-layer')?.remove();}});
  root.querySelectorAll('[data-suggest]').forEach(el=>el.addEventListener('click',()=>{draft=el.dataset.suggest;const input=$('#chat-input');input.value=draft;input.focus();}));
  root.querySelectorAll('[data-forget]').forEach(el=>el.addEventListener('click',()=>{const removed=state.memories.splice(Number(el.dataset.forget),1)[0];for(const key of manualSaveKeys){const save=read(key);if(validSave(save?.state,story)){save.state.memories=save.state.memories.filter(m=>m.value!==removed.value);write(key,save);}}autoSave();drawModal();}));
}
function action(type){
  if(type==='chapter-two'){
    const current=state||read('-auto')?.state;
    if(!validSave(current,story)||!chapterComplete(current,story))return;
    state=structuredClone(current);closeModal();screen='game';
    if(!story[state.node].chapterTwo){state.flags.chapterOneComplete=true;state.completed=false;enter('c2Start');}
    render();return;
  }
  if(type==='chapter-resume'){
    const current=state||read('-auto')?.state;
    if(chapterComplete(current,story)){
      const lines=current.history.filter(h=>!h.id.startsWith('choice:')&&!h.id.startsWith('c2'));
      shell('Chapter 1 · Your memories',`<p>Your saved choices and relationship remain unchanged.</p><div class="chapter-memories">${lines.map(h=>`<p><strong>${escape(h.speaker==='You'?current.name:h.speaker)}</strong> ${escape(h.text)}</p>`).join('')}</div><button class="secondary" data-action="chapters">Back to chapters</button>`);
    }else if(state){closeModal();screen='game';render();}else load('-auto');
    return;
  }

  if(type==='sg'){phonePage='profile';openModal('story-phone');return;}
  if(type.startsWith('sg-')){phonePage=type.slice(3);storyPhoneModal();return;}
  if(type==='phone-next'){modal=null;advance();return;}
  if(type==='next'){advance();return;}
  if(type==='close'){closeModal();return;}
  if(type==='continue'){load('-auto');return;}
  if(type==='title'){autoSave();closeModal();screen='title';render();return;}
  if(type==='accessibility')type='settings';
  if(type==='skip-chat'){state.flags.skippedChat=state.chatTurns===0;state.chatDone=true;enter('afterchat');renderGame();return;}
  if(type==='finish-chat'){closeModal();if(state.node==='texting'){state.chatDone=true;state.flags.skippedChat=state.chatTurns===0;enter('afterchat');renderGame();}return;}
  if(type==='retry'){sendMessage();return;}
  if(type==='demo'){chatMode='demo';error='';phoneModal();return;}
  if(type==='live'){
    if(liveConsent){chatMode='live';phoneModal();return;}
    shell('Before you send',`<p>External AI is optional. ${escape(provider.provider)} will receive your typed messages, recent conversation, current chapter choices, player name and pronouns, and any notes you explicitly saved.</p><p>Messages go through this local server to the configured provider. Its own retention and privacy rules apply. This game cannot delete provider-held copies. Don’t include information you don’t want to share.</p><p>Generated dialogue may be imperfect. Story decisions, milestones, and endings remain authored.</p><button id="consent-live" class="primary">Agree and enable external chat</button><button class="text-button" data-action="demo">Stay with the scripted demo</button>`);
    $('#consent-live').onclick=()=>{liveConsent=true;chatMode='live';phoneModal();};return;
  }
  if(type==='clear-memories'){if(state){state.memories=[];scrubSaves('memories');autoSave();drawModal();toast('Chat memories cleared from local saves.');}return;}
  if(type==='clear-transcript'){if(state){state.chat=[];scrubSaves('chat');autoSave();drawModal();toast('Phone messages cleared from local saves.');}return;}
  openModal(type);
}
document.addEventListener('keydown',e=>{
  if(screen==='game'&&state&&(story[state.node]?.minigame||story[state.node]?.nightmare))return;
  if(modal){
    if(e.key==='Escape'){e.preventDefault();closeModal();return;}
    if(e.key==='Tab'){
      const focusable=[...document.querySelectorAll('.modal button:not([disabled]),.modal input:not([disabled]),.modal textarea:not([disabled])')];
      const first=focusable[0],last=focusable.at(-1);
      if(e.shiftKey&&document.activeElement===first){e.preventDefault();last?.focus();}
      else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first?.focus();}
    }
    return;
  }
  if(e.target.closest('input,textarea,select')||screen!=='game')return;
  if(e.key===' '||e.key==='Enter'){
    if(e.target.closest('button')&&e.key==='Enter')return;
    e.preventDefault();advance();
  }
  if(['1','2','3','4'].includes(e.key)&&state.line>=nodeLines().length-1)choose(Number(e.key)-1);
  if(e.key.toLowerCase()==='h')openModal('history');
  if(e.key.toLowerCase()==='p')openModal('promises');
  if(e.key.toLowerCase()==='s')openModal('saves');
});
try {manifest=await(await fetch('assets/manifest.json')).json();}catch{}
try {provider=await(await fetch('/api/config')).json();}catch{}
matchMedia('(min-width: 1051px)').addEventListener('change',()=>{if(screen==='title'&&!modal)render();});
render();
