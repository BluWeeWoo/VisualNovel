import {story} from './story.js';
import {freshState, interpolate, applyChoice, validSave, visibleLines, promises, milestones, refreshAuthoredHistory} from './engine.js';
import {rowan, protagonistAge} from './characters.js';
import {spriteAt, expressions, cgAt} from './staging.js';
import {scriptedReply, requestReply, suggestions} from './chat.js';
import {setAudio} from './audio.js';
import {desktopMenu} from '../assets/desktop-menu.js';

const $=s=>document.querySelector(s);
const app=$('#app');
const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const storageKey='our-summer-v1';
let state=null, screen='title', modal=null, timer=null, typing=false, fullText='', timerIndex=0;
let liveConsent=false, busy=false, error='', draft='', chatMode='demo', provider={available:false};
let manifest={backgrounds:{},portraits:{}};
let settings={speed:32, motion:!matchMedia('(prefers-reduced-motion: reduce)').matches, sound:false, volume:.35};
try {settings={...settings,...JSON.parse(localStorage.getItem(storageKey+'-settings')||'{}')};}catch{}
let storageAvailable=true;
function read(key){try{return JSON.parse(localStorage.getItem(storageKey+key)||'null');}catch{return null;}}
function write(key,value){try{localStorage.setItem(storageKey+key,JSON.stringify(value));return true;}catch{storageAvailable=false;toast('Storage is unavailable. Keep this tab open; saves cannot be retained.');return false;}}
function toast(text){$('#toast').textContent=text;$('#toast').classList.add('show');setTimeout(()=>$('#toast').classList.remove('show'),3800);}
function stopTyping(){clearInterval(timer);timer=null;typing=false;}
function autoSave(){if(state)write('-auto',{date:Date.now(),state});}
function enter(id){state.node=id;state.line=0;Object.assign(state,story[id].enter||{});autoSave();}
function nodeLines(){return visibleLines(story[state.node],state);}
function record(line){
  const text=interpolate(line.text,state);
  const id=`${state.node}:${state.line}`;
  if(!state.history.some(h=>h.id===id))state.history.push({id,speaker:line.speaker||'',text});
}
function start(name,pronouns){state=freshState(name,pronouns);screen='game';modal=null;enter('arrival');render();}
function load(slot){const saved=read(slot);if(!validSave(saved?.state,story)){toast('This save is missing or incompatible.');return;}
  state=refreshAuthoredHistory(structuredClone(saved.state),story);screen='game';modal=null;busy=false;error='';draft='';enterAudio();render();toast('Summer resumed.');}
function enterAudio(){setAudio(settings.sound,settings.volume);}
function advance(){
  if(screen!=='game'||modal||busy)return;
  if(typing){stopTyping();$('#dialogue-text').textContent=fullText;return;}
  const node=story[state.node],all=nodeLines();
  if(state.line<all.length-1){state.line++;autoSave();renderGame();return;}
  if(node.choices||node.ending||node.phone)return;
  if(node.next){enter(node.next);renderGame();}
}
function choose(index){const node=story[state.node],opt=node.choices?.[index];if(!opt)return;
  const text=interpolate(opt.text,state);
  state.history.push({id:`choice:${state.node}`,speaker:state.name,text});
  applyChoice(state,opt);enter(state.node);renderGame();}
function bg(place,time){const url=manifest.backgroundVariants?.[place]?.[time]||manifest.backgrounds[place]||`assets/backgrounds/${place}.svg`;return `<div class="backdrop ${time}" style="background-image:url('${escape(url)}')" aria-hidden="true"></div><div class="paper-grain" aria-hidden="true"></div>`;}
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
    <header class="title-header">${brand()}<span class="edition">AN INTERACTIVE SUMMER STORY <span>•</span> CHAPTER ONE</span></header>
    <section class="title-copy"><div class="eyebrow"><span class="short-line"></span> SOME THINGS WAIT FOR YOU</div>
    <h1>Our Summer,<br><em>Unfinished</em><span class="title-period">.</span></h1>
    <p class="tagline">An old house. Five promises.<br>Someone who remembers.</p>
    <div class="title-actions"><button class="primary" data-action="${resume?'continue':'new'}">${resume?'Continue your summer':'Begin your summer'} <span aria-hidden="true">↗</span></button>
    ${resume?'<button class="text-button" data-action="new">Start a new summer</button>':''}
    <div class="title-secondary"><button data-action="saves">Saved moments</button><span>·</span><button data-action="settings">Settings</button><span>·</span><button data-action="cast">Rowan</button><span>·</span><button data-action="about">About</button></div></div>
    <p class="content-note">A gentle story about returning, remembering, and finding room.<br>Includes bereavement, a difficult home life, and being away.</p></section>
    <aside class="postcard" aria-hidden="true"><span>Summerhouse, late June</span><small>the blue door still sticks a little</small></aside>
    <footer class="title-footer"><span>01 <i></i> THE HOUSE WITH THE BLUE DOOR</span><span>Take your time. There’s no wrong way to feel.</span><button data-action="accessibility">Reading & accessibility ↗</button></footer></main>`;
  bind();
}
function render(){stopTyping();document.documentElement.classList.toggle('reduced-motion',!settings.motion);if(screen==='title')title();else renderGame();}
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
  if(main!==next)main.querySelector('.scene-bottom').replaceWith(next.querySelector('.scene-bottom'));
}
function renderGame(){
  stopTyping();
  const node=story[state.node],all=nodeLines(),line=all[Math.min(state.line,all.length-1)];
  if(!line){toast('This scene could not be loaded.');return;}
  record(line);autoSave();
  const last=state.line>=all.length-1;
  const staging=spriteAt(story,state);
  const portrait=staging&&manifest.portraits.Rowan?.[staging.key];
  const cg=manifest.cgs?.[cgAt(story,state)];
  const gameHTML=`<main class="game-screen"><div class="scene-backdrops">${bg(node.place,node.time)}</div>
    <div class="scene-art" aria-label="Scene illustration">
    ${cg?`<img class="event-cg" src="${escape(cg.src)}" width="1536" height="1024" alt="${escape(cg.alt)}" fetchpriority="high" decoding="async">`:portrait?`<aside class="character-stage ${node.time}" data-expression="${staging.expression}" data-pose="${staging.pose}"><img src="${escape(portrait)}" width="${manifest.spriteCanvas.width}" height="${manifest.spriteCanvas.height}" alt="Rowan, ${staging.expression}${staging.pose==='book'?', holding an illustrated book':''}." fetchpriority="high"></aside>`:''}
    </div>
    <div class="scene-bottom">
    <section class="dialogue-card ${line.speaker?'spoken':'narration'}" aria-label="Story dialogue">
    <div class="dialogue-top"><span class="speaker">${escape(line.speaker==='You'?state.name:line.speaker||'SUMMERHOUSE · DAY ONE')}</span><span class="dialogue-ornament" aria-hidden="true">✳</span></div>
    <p id="dialogue-text" aria-live="off"></p><span class="sr-only" role="status">${escape((line.speaker?line.speaker+': ':'')+interpolate(line.text,state))}</span>
    ${last&&node.choices?`<div class="choices" aria-label="Choose your response">${node.choices.map((c,i)=>`<button data-choice="${i}"><span class="choice-number">${i+1}</span>${escape(interpolate(c.text,state))}<span class="choice-arrow" aria-hidden="true">↗</span></button>`).join('')}</div>`:''}
    ${last&&node.phone?'<div class="phone-invitation"><p>A short late-night conversation · up to 4 messages<br><small>An early preview. Open conversations unlock at Close in future chapters.</small></p><button class="primary" data-action="phone">Open your phone ↗</button><button class="text-button" data-action="skip-chat">Save your words for morning</button></div>':''}
    ${last&&node.ending?`<div class="chapter-end"><span class="eyebrow">END OF CHAPTER ONE</span><h2>A little less unfinished.</h2><p>Your summer is saved. The sunrise is planned, not yet fulfilled.</p><div><button class="primary" data-action="promises">Keep the list ↗</button><button class="secondary" data-action="title">Back to the title</button></div><small>Chapter two continues the sunrise promise. This build contains chapter one.</small></div>`:''}
    <div class="dialogue-footer"><nav class="dialogue-tools" aria-label="Game tools"><button data-action="history">History</button><button data-action="saves">Save / load</button><button data-action="settings">Settings</button><button data-action="promises">Promises</button><button data-action="title" aria-label="Return to title">Menu</button></nav>${!(last&&(node.choices||node.phone||node.ending))?'<button class="next-button" data-action="next" aria-label="Continue dialogue">Continue <span aria-hidden="true">→</span></button>':'<span class="small-flower" aria-hidden="true">✳</span>'}</div></section>
    <footer class="game-footer"><span>${escape(state.name)}’s summer <span class="footer-dot">·</span> <button data-action="relationship" aria-label="Relationship milestones">${escape(state.milestone)}</button></span><span>${state.phoneUnlocked?'<button data-action="phone">↗ Late-night messages</button>':'A story at your own pace'}</span><span class="save-indicator">${storageAvailable?'● Progress saved locally':'! Local saves unavailable'}</span></footer></div></main>`;
  mountGame(gameHTML,`${node.place}:${node.time}`,cg?`cg:${cg.src}`:`sprite:${portrait||'none'}:${node.time}`);
  bind();
  fullText=interpolate(line.text,state);
  const textNode=$('#dialogue-text');
  if(settings.speed===0||!settings.motion||last&&(node.choices||node.phone||node.ending)){textNode.textContent=fullText;}
  else {typing=true;timerIndex=0;timer=setInterval(()=>{timerIndex+=2;textNode.textContent=fullText.slice(0,timerIndex);if(timerIndex>=fullText.length)stopTyping();},1000/settings.speed);}
  $('.dialogue-card').addEventListener('click',e=>{if(!e.target.closest('button,input,textarea'))advance();});
}
let previousFocus;
function openModal(kind){
  previousFocus=document.activeElement;
  if(typing){stopTyping();$('#dialogue-text').textContent=fullText;}
  modal=kind;drawModal();
}
function closeModal(){if(busy)return;$('.modal-layer')?.remove();modal=null;error='';if(screen==='title'&&Boolean($('.seaglass-menu'))!==matchMedia('(min-width: 1051px)').matches){render();return;}if(previousFocus?.isConnected)previousFocus.focus();}
function shell(title,body,extra=''){
  $('.modal-layer')?.remove();
  const layer=document.createElement('div');layer.className='modal-layer';
  layer.innerHTML=`<section class="modal ${extra}" role="dialog" aria-modal="true" aria-labelledby="modal-title"><header class="modal-header"><div><span class="eyebrow">OUR SUMMER, UNFINISHED</span><h2 id="modal-title">${title}</h2></div><button class="close" data-action="close" aria-label="Close dialog" ${busy?'disabled':''}>×</button></header>${body}</section>`;
  document.body.append(layer);bind(layer);
  layer.addEventListener('click',e=>{if(e.target===layer&&!busy)closeModal();});
  (layer.querySelector('input:not([type=range]),textarea')||layer.querySelector('button'))?.focus();
}
function drawModal(){
  if(modal==='cast'){
    shell('Rowan',`<p class="cast-bio">${rowan.age} · ${rowan.pronouns} · your childhood friend<br><span>Warm, a little guarded, and still terrible at defending his chips.</span></p><div class="cast-art" style="background-image:url('${escape(manifest.backgrounds.exterior)}')"><img id="cast-sprite" src="${escape(manifest.portraits.Rowan.neutral)}" alt="Rowan, neutral expression." width="1254" height="1254"></div><div class="cast-options" aria-label="Expression previews">${[...expressions,'book'].map(key=>`<button class="secondary" data-preview="${key}" aria-pressed="${key==='neutral'}">${{smile:'Warm smile',playful:'Teasing',embarrassed:'Blushing',sad:'Quiet grief',book:'With book',neutral:'Neutral',concerned:'Concerned',surprised:'Surprised'}[key]}</button>`).join('')}</div><div class="cast-locations" aria-label="Background previews">${Object.keys(manifest.backgrounds).map(key=>`<button class="text-button" data-location="${key}">${{exterior:'Guesthouse',living:'Living room',bedroom:'Bedroom',street:'Seaside street',pier:'Old pier'}[key]}</button>`).join('')}</div><p class="small-note">Official character design and original illustration by you. Additional expressions and backgrounds created from your reference.</p>`,'cast-modal');
    document.querySelectorAll('[data-preview]').forEach(button=>button.onclick=()=>{const key=button.dataset.preview;$('#cast-sprite').src=manifest.portraits.Rowan[key];$('#cast-sprite').alt=`Rowan, ${key} expression.`;document.querySelectorAll('[data-preview]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));});
    document.querySelectorAll('[data-location]').forEach(button=>button.onclick=()=>{$('.cast-art').style.backgroundImage=`url('${manifest.backgrounds[button.dataset.location]}')`;});
  }
  if(modal==='new')shell('A name to come home to',`<p class="muted">You’re ${protagonistAge}. It’s been years since your last proper summer here.<br>The rest is yours to remember.</p><form id="new-form"><label>Your name<input name="name" maxlength="24" value="Alex" required autocomplete="off"></label><fieldset><legend>Pronouns</legend><div class="pronouns"><label><input type="radio" name="pronouns" value="they" checked> they / them</label><label><input type="radio" name="pronouns" value="she"> she / her</label><label><input type="radio" name="pronouns" value="he"> he / him</label></div></fieldset><p class="small-note">Friendship, romance, and taking your time are all welcome.<br>${read('-auto')?'Starting replaces the autosave. Manual save slots stay safe.':'Progress saves automatically in this browser.'}</p><button class="primary" type="submit">Open the gate ↗</button></form>`);
  if(modal==='promises'){
    const found=state?.promiseFound;
    shell('Before we get boring',`<div class="journal"><div class="journal-date">A summer, years ago <span>in green ink</span></div>${found?`<ol class="promise-list">${promises.map((p,i)=>`<li><span class="promise-check ${i===0&&state.sunrise==='planned'?'planned':''}">${i===0&&state.sunrise==='planned'?'◷':'○'}</span><div>${p}${i===0?`<small>${state.sunrise==='planned'?`Tomorrow · 4:40 at the gate · ${escape(state.flags.ritual||'a flask')}<br>Planned — still waiting for the sunrise.`:'Not yet begun.'}</small>`:'<small>For another day.</small>'}</div></li>`).join('')}</ol><p class="handwritten">A promise isn’t a trap.</p>`:'<p class="empty-state">Some things are waiting in the drawers.<br>You haven’t found the list yet.</p>'}</div>`);
  }
  if(modal==='history')shell('The things we said',`<div class="history-list">${state?.history.length?state.history.map(h=>`<article><strong>${escape(h.speaker==='You'?state.name:h.speaker||'—')}</strong><p>${escape(h.text)}</p></article>`).join(''):'<p>No dialogue yet. Begin your summer first.</p>'}</div>`);
  if(modal==='saves')shell('Saved moments',`<p class="muted">Stored in this browser on this device. Manual saves hold the story, choices, and conversation.</p><div class="save-list">${['-auto','-slot1','-slot2','-slot3'].map((key,i)=>{const data=read(key);const valid=validSave(data?.state,story);return `<article><div><span class="eyebrow">${i?'MOMENT 0'+i:'AUTOSAVE'}</span><strong>${valid?escape(data.state.name)+' · '+escape(story[data.state.node].title):'An empty page'}</strong><small>${valid?new Date(data.date).toLocaleString():'Nothing saved here yet.'}</small></div><div>${i&&state?`<button class="secondary" data-save="${key}">${valid?'Replace':'Save'}</button>`:''}<button class="secondary" data-load="${key}" ${!valid?'disabled':''}>Load</button></div></article>`;}).join('')}</div><p class="small-note">Loading replaces your current moment. Your other manual saves are kept.</p>`);
  if(modal==='settings')shell('Make yourself comfortable',`<div class="settings-list"><label>Text speed <span id="speed-label">${settings.speed===0?'Instant':settings.speed+' letters / second'}</span><input id="speed" aria-label="Text speed, zero is instant" type="range" min="0" max="80" step="8" value="${settings.speed}"></label><label class="toggle-row"><span>Reduced motion<small>Also displays dialogue instantly.</small></span><input id="motion" type="checkbox" ${!settings.motion?'checked':''}></label><label class="toggle-row"><span>Soft sea ambience<small>Original synthesized surf. Off by default.</small></span><input id="sound" type="checkbox" ${settings.sound?'checked':''}></label><label>Ambience volume<input id="volume" aria-label="Ambience volume" type="range" min="0" max="1" step=".05" value="${settings.volume}"></label></div><div class="controls-note"><strong>At your own pace</strong><p>Space / Enter: reveal or advance · 1–3: choose a response<br>H: history · P: promises · S: save / load · Esc: close a panel<br>Tab and Shift+Tab move between controls. There are no timed choices.</p></div><button class="secondary" data-action="memories">Review saved chat memories</button>`);
  if(modal==='about')shell('A summer worth taking slowly',`<p>A story about an old guesthouse, unfinished promises, and choosing how to come back to someone.</p><p>Original story, interface, and synthesized ambience created for this project. Rowan’s official design is your original illustration, with matching generated expressions and illustrated backgrounds. Both Rowan and the protagonist are 23.</p><p><strong>Chapter one is complete.</strong> Later chapters and their endings are outlined separately in the development documents; they aren’t playable in this build.</p><p class="muted">Reading time varies. Includes grief, bereavement, and references to a difficult childhood home. All romantic characters are adults. Nothing is timed.</p><p class="small-note">The default phone is a scripted demo, not live AI. No messages leave this device in demo mode. Local progress stays in this browser.</p>`);
  if(modal==='relationship')shell('Becoming familiar',`<p>Trust grows through shared moments and honest choices. It isn’t a score. Friendship and romance have the same room to grow.</p><ol class="milestone-list">${milestones.map(m=>`<li><strong>${m.name}${state?.milestone===m.name?' · now':''}</strong><p>${m.unlock}</p></li>`).join('')}</ol><p class="small-note">Chapter one ends at Familiar. Later milestones await future chapters. Skipping chat, disagreeing respectfully, or needing space never takes trust away.</p>`);
  if(modal==='memories')memoryModal();
  if(modal==='phone')phoneModal();
  if(modal==='history') {const history=$('.history-list');history.scrollTop=history.scrollHeight;}
  bindForms();
}
function bindForms(){
  $('#new-form')?.addEventListener('submit',e=>{e.preventDefault();const form=new FormData(e.target);$('.modal-layer').remove();start(form.get('name'),form.get('pronouns'));enterAudio();});
  const saveSettings=()=>{write('-settings',settings);document.documentElement.classList.toggle('reduced-motion',!settings.motion);};
  $('#speed')?.addEventListener('input',e=>{settings.speed=Number(e.target.value);$('#speed-label').textContent=settings.speed===0?'Instant':settings.speed+' letters / second';saveSettings();});
  $('#motion')?.addEventListener('change',e=>{settings.motion=!e.target.checked;saveSettings();});
  $('#sound')?.addEventListener('change',e=>{settings.sound=e.target.checked;enterAudio();saveSettings();});
  $('#volume')?.addEventListener('input',e=>{settings.volume=Number(e.target.value);enterAudio();saveSettings();});
}
function memoryModal(){shell('Only what you choose to keep',`<p class="muted">Nothing is extracted automatically. Add a small detail you want Rowan to remember, such as a favorite drink. Up to eight notes, 120 characters each. In live mode, these notes are sent with your messages.</p>${state?`<ul class="memory-list">${state.memories.length?state.memories.map((m,i)=>`<li><span>${escape(m.value)}</span><button class="text-button" data-forget="${i}">Forget</button></li>`).join(''):'<li>No saved chat memories.</li>'}</ul><form id="memory-form"><label>A detail I choose to remember<input name="memory" maxlength="120" required placeholder="e.g. I like tea with milk" ${state.memories.length>=8?'disabled':''}></label><button class="secondary" ${state.memories.length>=8?'disabled':''}>Save this detail</button></form><div class="memory-actions"><button class="text-button" data-action="clear-memories">Clear all chat memories</button><button class="text-button" data-action="clear-transcript">Clear saved phone messages</button></div><p class="small-note">Clearing also removes these details from existing local save slots. Authored story choices remain. Clearing messages does not reset the four-message preview.</p>`:'<p>Start a summer to save your own details.</p>'}`);
  $('#memory-form')?.addEventListener('submit',e=>{e.preventDefault();const value=new FormData(e.target).get('memory').trim();if(value&&state.memories.length<8){state.memories.push({key:'player-approved note',value});autoSave();drawModal();toast('Detail saved with your permission.');}});
}
function scrubSaves(field){for(const key of ['-auto','-slot1','-slot2','-slot3']){const save=read(key);if(validSave(save?.state,story)){save.state[field]=[];write(key,save);}}}
function phoneModal(){
  if(!state?.phoneUnlocked){shell('A number, not yet exchanged','<p>The phone opens later in chapter one.</p>');return;}
  const done=state.chatDone||state.chatTurns>=4||state.node!=='texting';
  shell('<img class="phone-avatar" src="assets/references/rowan-original.png" alt="">Rowan <span class="online-dot" aria-hidden="true"></span>',`<div class="phone-status"><span>21:48 · HE/HIM · AGE 23</span><span>${state.chatTurns}/4 messages</span></div><div class="chat-mode"><strong>${chatMode==='live'?'External AI conversation':'Scripted chat demo · not live AI'}</strong><p>${chatMode==='live'?`Your message, recent conversation, chapter-one choices, name, pronouns, and approved memories are sent to ${escape(provider.provider)}. Provider retention rules apply. No plot changes are made by chat.`:'Original prewritten replies respond to broad topics. Nothing is sent to an external provider.'}</p>${provider.available&&!done?`<button class="text-button" data-action="${chatMode==='live'?'demo':'live'}">${chatMode==='live'?'Use scripted demo':'Use external AI…'}</button>`:''}</div>
    <div class="chat-log" role="log" aria-label="Messages with Rowan" aria-live="polite"><div class="chat-date">TONIGHT</div><div class="bubble rowan">Important clarification: the gull was not representative of the local hospitality industry.</div>${state.chat.map(m=>`<div class="bubble ${m.role==='player'?'player':'rowan'}">${escape(m.text)}</div>`).join('')}${busy?'<div class="bubble rowan typing" role="status">Rowan is typing<span>…</span></div>':''}</div>
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
  root.querySelectorAll('[data-action]').forEach(el=>el.addEventListener('click',()=>action(el.dataset.action)));
  root.querySelectorAll('[data-choice]').forEach(el=>el.addEventListener('click',()=>choose(Number(el.dataset.choice))));
  root.querySelectorAll('[data-save]').forEach(el=>el.addEventListener('click',()=>{const key=el.dataset.save;if(read(key)){shell('Replace this saved moment?',`<p>Your current point will replace this manual save. Other slots stay as they are.</p><div class="confirm-actions"><button class="primary" id="confirm-save">Replace saved moment</button><button class="secondary" data-action="saves">Keep old save</button></div>`);$('#confirm-save').onclick=()=>{write(key,{date:Date.now(),state});modal='saves';drawModal();toast('Moment saved.');};}else{write(key,{date:Date.now(),state});drawModal();toast('Moment saved.');}}));
  root.querySelectorAll('[data-load]').forEach(el=>el.addEventListener('click',()=>{load(el.dataset.load);$('.modal-layer')?.remove();}));
  root.querySelectorAll('[data-suggest]').forEach(el=>el.addEventListener('click',()=>{draft=el.dataset.suggest;const input=$('#chat-input');input.value=draft;input.focus();}));
  root.querySelectorAll('[data-forget]').forEach(el=>el.addEventListener('click',()=>{const removed=state.memories.splice(Number(el.dataset.forget),1)[0];for(const key of ['-slot1','-slot2','-slot3']){const save=read(key);if(validSave(save?.state,story)){save.state.memories=save.state.memories.filter(m=>m.value!==removed.value);write(key,save);}}autoSave();drawModal();}));
}
function action(type){
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
  if(['1','2','3'].includes(e.key)&&state.line>=nodeLines().length-1)choose(Number(e.key)-1);
  if(e.key.toLowerCase()==='h')openModal('history');
  if(e.key.toLowerCase()==='p')openModal('promises');
  if(e.key.toLowerCase()==='s')openModal('saves');
});
try {manifest=await(await fetch('assets/manifest.json')).json();}catch{}
try {provider=await(await fetch('/api/config')).json();}catch{}
matchMedia('(min-width: 1051px)').addEventListener('change',()=>{if(screen==='title'&&!modal)render();});
render();
