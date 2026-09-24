// Presentation-only phone data. No network, relationship changes or future messages.
export const phoneIdentity={name:'Rowan',username:'rowan.bythewater',number:'+1 (202) 555-0147',app:'Seaglass',initials:'SG'};
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function phoneCue(story,state){
 if(!state)return null;
 const line=story[state.node].lines.filter(l=>!l.if||state.flags[l.if[0]]===l.if[1])[state.line];
 const text=line?.text||'';
 if(line?.speaker==='Rowan · text')return {page:'messages',message:true};
 if(state.node==='rExchange'&&text==='I reach for my phone.')return {page:'contact'};
 if(state.node==='rReturn'&&text==='I’ll send you a message so you have mine.')return {page:'messages',typing:true};
 if(state.node==='rReturn'&&text==='I enter his number.')return {page:'contact'};
 if(state.node==='rBedroom'&&text==='I kept opening her contact.')return {page:'lola'};
 if(state.node==='numbers'&&text.startsWith('You exchange phones.'))return {page:'contact'};
 if(state.node==='numbers'&&text==='You send a single wave. His pocket lights up.')return {page:'messages',wave:true};
 if(state.node==='night'&&line?.speaker==='Rowan')return {page:'messages',message:true,legacy:true};
 return null;
}
export function hasRowanContact(state){
 if(['rLetterPromise','rBedroom','rLanding','rPush','rQuiet','rLetters','rBurning'].includes(state?.node))return false;
 return !!state&&(state.phoneUnlocked||state.history.some(h=>h.id.startsWith('rReturn:')||h.id.startsWith('rExchange:')&&h.text==='I reach for my phone.'||h.id.startsWith('numbers:')&&h.text.startsWith('You exchange phones.')));
}
export function authoredMessages(state){
 const messages=[];
 for(const h of state.history){
  if(h.speaker==='Rowan · text')messages.push({text:h.text,sender:'rowan',time:'16:42'});
  if(h.id.startsWith('numbers:')&&h.text==='You send a single wave. His pocket lights up.')messages.push({text:'👋',sender:'player',time:'19:16'});
  if(h.id.startsWith('night:')&&h.speaker==='Rowan')messages.push({text:h.text,sender:'rowan',time:'21:48'});
 }
 if(state.phoneUnlocked)for(const m of state.chat)messages.push({text:m.text,sender:m.role==='player'?'player':'rowan',time:'21:48'});
 return messages;
}
const avatar='<img class="sg-avatar" src="assets/references/rowan-original.png" alt="Rowan’s profile picture">';
const logo='<span class="sg-logo" aria-hidden="true">◇<span>≈</span></span>';
export function phoneBody(page,state,{typing=false}={}){
 if(page==='lola')return `<div class="device-clock">22:06 <span>◒ ▰</span></div><div class="sg-lola"><div class="contact-letter">L</div><h3>Lola</h3><p>Contact</p><p class="phone-muted">I knew she wouldn’t answer.</p></div><button class="sg-return" data-action="close">Put the phone down</button>`;
 const header=`<div class="device-clock">${state.node==='night'?'21:48':'16:42'} <span>◒ ▰</span></div><div class="sg-brand">${logo}<span>Seaglass<small>A little closer.</small></span></div>`;
 const tabs=`<nav class="sg-tabs" aria-label="Seaglass screens">${[['contact','Contact'],['profile','Profile'],['feed','Feed'],['messages','Messages']].map(([key,label])=>`<button data-action="sg-${key}" aria-pressed="${page===key}">${label}</button>`).join('')}</nav>`;
 const posts=[{src:'assets/backgrounds/pier-day.png',caption:'Best part of getting up early. Before the boats get loud.',time:'3 days ago'},{src:'assets/cg/reunion/reunion-porch.webp',caption:'Taking a break in the shade.',time:'1 week ago'}];
 let content='';
 if(page==='contact')content=`<div class="sg-contact">${avatar}<h3>Rowan</h3><p>@${phoneIdentity.username}</p><div class="sg-contact-number"><small>Mobile · fictional number</small><strong>${phoneIdentity.number}</strong></div><p class="phone-muted">Saved on your phone</p><button class="sg-main-button" data-action="sg-messages">Open conversation</button><button class="sg-link" data-action="sg-profile">View Seaglass profile ↗</button></div>`;
 if(page==='profile')content=`<div class="sg-profile">${avatar}<div><h3>Rowan</h3><p>@${phoneIdentity.username}</p><small>he/him · Saint Luis</small></div></div><p class="sg-bio">By the water. Usually fixing something.<br>Photos from home, when I remember to take them.</p><button class="sg-main-button" data-action="sg-messages">Message Rowan</button><h4 class="sg-section">POSTCARDS · 2</h4><div class="sg-post-grid">${posts.map((p,i)=>`<button data-action="sg-feed" aria-label="View Rowan’s post: ${esc(p.caption)}"><img src="${p.src}" alt="${i?'The shaded guesthouse porch':'The old pier in daylight'}"></button>`).join('')}</div>`;
 if(page==='feed')content=`<div class="sg-feed">${posts.map((p,i)=>`<article class="sg-post"><header>${avatar}<div><strong>Rowan</strong><small>@${phoneIdentity.username} · ${p.time}</small></div></header><img class="sg-post-photo" src="${p.src}" alt="${i?'Sunlight on the wooden porch':'A quiet view of the old pier'}"><p>${esc(p.caption)}</p><span class="sg-post-mark" aria-hidden="true">◇ A moment kept</span></article>`).join('')}</div>`;
 if(page==='messages'){
  const messages=authoredMessages(state);
  content=`<header class="sg-thread-head">${avatar}<div><strong>Rowan</strong><small>@${phoneIdentity.username}</small></div><span class="sg-private">Private</span></header><p class="sg-thread-number">${phoneIdentity.number} · fictional</p><div class="sg-notification" role="status">${messages.length?'Rowan · conversation':'Contact saved · say hello in the story'}</div><div class="sg-messages" role="log" aria-label="Private messages with Rowan"><div class="sg-date">TODAY</div>${messages.map(m=>`<div class="sg-message ${m.sender}"><p>${esc(m.text)}</p><small>${m.time} · ${m.sender==='player'?'Read':'Received'}</small></div>`).join('')}${!messages.length?'<p class="phone-muted">Your conversation starts here.</p>':''}${typing?'<div class="sg-typing" role="status">Rowan is typing <span>● ● ●</span></div>':''}</div>${state.phoneUnlocked?'<button class="sg-main-button" data-action="phone">Open late-night conversation</button>':'<div class="sg-compose" aria-label="Authored story conversation">Messages follow the story <span aria-hidden="true">↑</span></div>'}`;
 }
 return `${header}${tabs}<div class="sg-content">${content}</div><footer class="sg-bottom"><small>Fictional account · story content</small><button data-action="close">Back to scene ↘</button></footer>`;
}
