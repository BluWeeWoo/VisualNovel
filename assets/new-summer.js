import {defaultProfile,pronounForms,rowanFeelings,silhouettePreview} from './player-identity.js';
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let draft=defaultProfile();
const art=(box,label)=>`<svg viewBox="${box}" role="img" aria-label="${label}"><image href="assets/new-summer-reference.png" width="1672" height="941"/></svg>`;
export function mountNewSummer(root,{onBack,onBegin,hasSave}){
  root.innerHTML=`<div class="summer-canvas"><header class="summer-heading"><h1 id="modal-title">Before your summer begins</h1><p>A few details before you arrive.</p></header><button type="button" class="summer-close" aria-label="Close character setup">×</button><form class="summer-form"><div class="summer-columns"><section><h2>Your details</h2><label class="name-label" for="summer-name">First name</label><input id="summer-name" name="name" maxlength="24" required autocomplete="given-name"><fieldset><legend>Gender &amp; pronouns</legend><div class="summer-options">${[['he','Male · He/Him'],['she','Female · She/Her'],['they','Non-binary · They/Them'],['custom','Custom']].map(([v,l])=>`<label><input type="radio" name="pronouns" value="${v}">${l}</label>`).join('')}</div></fieldset><p class="summer-hint">All romance options remain available.</p><button type="button" class="custom-edit" hidden>Edit custom pronouns</button><fieldset class="summer-affinity"><legend>Your feelings for Rowan</legend><div class="summer-options">${rowanFeelings.map(v=>`<label><input type="radio" name="rowanFeeling" value="${v}">${v}</label>`).join('')}</div><p class="summer-hint">Choose where your summer starts. Friendship is always welcome.</p></fieldset></section><section class="summer-preview"><h2>Your summer</h2><p class="summer-preview-note">Portrait preview only · Story scenes use your perspective.</p><div class="portrait-row"><div class="summer-portrait"><img class="player-silhouette" alt=""></div><div class="silhouette-caption"><strong>Your silhouette</strong><span id="silhouette-label"></span><small>Matched to your selection.</small></div></div><div class="summer-dialogue" aria-live="polite"><h3>Dialogue preview</h3><p><span>Rowan</span><span id="preview-rowan"></span></p><p><span id="preview-name"></span><span id="preview-mc"></span></p></div><div class="summer-keepsake">${art('960 552 422 184','An open yellow envelope. A little Saint Luis sunshine, wherever you are. So you’ll always know it’s from me. — Ro. The color of summers together.')}</div></section></div><footer class="summer-footer"><p class="summer-summary" aria-live="polite"></p><div class="summer-actions"><button type="button" class="summer-back">← Back</button><button type="button" class="summer-reset">Reset</button><button type="submit" class="summer-begin">Begin Summer →</button></div><p class="summer-hint">You’ll review your choices before the story begins.</p></footer></form><div class="summer-review" hidden></div></div>`;
  const form=root.querySelector('form'),canvas=root.querySelector('.summer-canvas'),review=root.querySelector('.summer-review');
  const heading=root.querySelector('.summer-heading');
  heading.insertAdjacentHTML('afterbegin','<span class="summer-edition">OUR SUMMER, UNFINISHED <span>✧</span> SAINT LUIS</span>');
  heading.insertAdjacentHTML('beforeend','<nav class="summer-steps" aria-label="Setup progress"><span data-step="1"><b>01</b> About you</span><i></i><span data-step="2"><b>02</b> You &amp; Rowan</span><i></i><span data-step="3"><b>03</b> Begin summer</span></nav>');
  let step=1;
  function markStep(value){root.querySelectorAll('[data-step]').forEach(el=>{el.classList.toggle('is-active',Number(el.dataset.step)===value);if(Number(el.dataset.step)===value)el.setAttribute('aria-current','step');else el.removeAttribute('aria-current');});}

  const columns=root.querySelector('.summer-columns');
  const firstPage=document.createElement('div');firstPage.className='summer-page summer-page-one';
  columns.before(firstPage);firstPage.append(columns);
  const secondPage=document.createElement('div');secondPage.className='summer-page summer-page-two';secondPage.hidden=true;
  secondPage.innerHTML='<div class="summer-rowan-portrait"><div class="summer-rowan-crop"><img src="assets/portraits/rowan-upgraded/smile.png" alt="Rowan smiling"></div><p>An old friend. A new summer.</p></div><section class="summer-feelings-panel"><h2>You and Rowan</h2></section>';
  firstPage.after(secondPage);
  columns.querySelector('section').insertAdjacentHTML('beforeend','<div class="summer-ticket"><span class="ticket-sun" aria-hidden="true">☼</span><div><small>ONE SUMMER IN SAINT LUIS</small><strong class="ticket-name"></strong><span>A place to come back to.</span></div><span class="ticket-number" aria-hidden="true">SUMMER<br>01</span></div>');
  const preview=root.querySelector('.summer-preview');
  preview.querySelector('h2').textContent='Your next chapter';
  preview.querySelector('.portrait-row').insertAdjacentHTML('beforebegin','<div class="summer-arrival-photo"><span class="summer-postmark" aria-hidden="true">SAINT LUIS<br>☼<br>SUMMER MAIL</span><p>A little closer to home.</p></div>');
  preview.append(preview.querySelector('.summer-preview-note'));

  const panel=secondPage.querySelector('section');
  panel.append(root.querySelector('.summer-affinity'),root.querySelector('.summer-dialogue'));
  const descriptions=['I’m still figuring out how I feel.','He’s an old friend I’ve missed.','There might be something more.','My feelings have stayed with me.'];
  panel.querySelectorAll('.summer-options label').forEach((label,i)=>{const copy=document.createElement('span');copy.innerHTML='<strong>'+rowanFeelings[i]+'</strong><small>'+descriptions[i]+'</small>';label.lastChild.remove();label.append(copy);});
  const keepsake=root.querySelector('.summer-keepsake');keepsake.remove();
  root.querySelector('.summer-summary').hidden=true;
  function page(value){step=value;markStep(value);firstPage.hidden=step!==1;secondPage.hidden=step!==2;root.querySelector('.summer-heading p').textContent=step===1?'1 of 2 · About you':'2 of 2 · Your feelings';root.querySelector('.summer-begin').textContent=step===1?'Next →':'Review & Begin →';root.querySelector('.summer-footer > .summer-hint').textContent=step===1?'A few details before you arrive.':'You can keep a friendship or let your feelings grow.';}
  const resize=()=>{const scale=Math.min(1,(innerWidth-64)/1040,(innerHeight-64)/860);root.style.width=`${1040*scale}px`;root.style.height=`${860*scale}px`;canvas.style.transform=`translate(-50%,-50%) scale(${scale})`;};
  resize();window.addEventListener('resize',resize);
  const observer=new MutationObserver(()=>{if(!root.isConnected){window.removeEventListener('resize',resize);observer.disconnect();}});observer.observe(document.body,{childList:true});
  const summary=()=>{const p=pronounForms(draft);return `${draft.name.trim()||'Alex'} · ${p.subject}/${p.object} · ${silhouettePreview(draft).label} · ${draft.rowanFeeling}`;};
  const affinityArtwork={
    'Uncertain':{file:'uncertain',version:2,caption:'A familiar face. A little distance.'},
    'Familiar':{file:'familiar',caption:'An old friend. An easy smile.'},
    'Drawn to You':{file:'drawn',version:2,caption:'Something more, between the words.'},
    'In Love':{file:'love',version:2,caption:'Some feelings never quite left.'}
  };
  const artworkCache=new Map();
  let requestedArtwork='';
  function updateAffinityArtwork(){
    const art=affinityArtwork[draft.rowanFeeling];
    if(!art||requestedArtwork===art.file)return;
    requestedArtwork=art.file;
    let pending=artworkCache.get(art.file);
    if(!pending){const image=new Image();image.src='assets/portraits/rowan-affinity/'+art.file+'-v'+(art.version||1)+'.png';pending=image.decode().then(()=>image);artworkCache.set(art.file,pending);}
    pending.then(image=>{
      if(!root.isConnected||requestedArtwork!==art.file)return;
      const portrait=root.querySelector('.summer-rowan-crop img');
      portrait.classList.add('affinity-illustration');portrait.src=image.src;
      portrait.alt='Rowan — '+draft.rowanFeeling;
      root.querySelector('.summer-rowan-portrait p').textContent=art.caption;
    }).catch(()=>{if(requestedArtwork===art.file)requestedArtwork='';artworkCache.delete(art.file);});
  }
  function update(){
    updateAffinityArtwork();
    const name=draft.name.trim()||'Alex';
    root.querySelector('.ticket-name').textContent=name;
    root.querySelector('#preview-name').textContent=name;
    root.querySelector('#preview-rowan').textContent=`${name}? You really came back.`;
    root.querySelector('#preview-mc').textContent=({'Uncertain':'Hey, Rowan. It’s been a while.','Familiar':'I missed having you around, Ro.','Drawn to You':'I’m glad I get to see you again, Ro.','In Love':'I missed you more than I knew how to say.'})[draft.rowanFeeling];
    root.querySelector('.summer-summary').textContent=summary();
    const portrait=silhouettePreview(draft);
    const img=root.querySelector('.player-silhouette');
    if(img.getAttribute('src')!==portrait.src)img.src=portrait.src;
    img.alt=portrait.label+' against Saint Luis skies';
    root.querySelector('#silhouette-label').textContent=portrait.label;
    draft.portrait='silhouette';
    root.querySelector('.custom-edit').hidden=draft.pronouns!=='custom';
  }
  function populate(){form.elements.name.value=draft.name;for(const k of ['pronouns','rowanFeeling'])form.elements[k].value=draft[k];update();}
  function dismiss(){markStep(step);review.classList.remove('summer-final-review');review.hidden=true;review.innerHTML='';form.inert=false;root.querySelector('.summer-begin').focus();}
  function show(content){form.inert=true;review.hidden=false;review.innerHTML=content;review.querySelector('input,button')?.focus();}
  function custom(){show(`<h2>Your pronouns</h2><p>How should other characters refer to you?</p><form class="custom-pronoun-form">${[['subject','Subject (they)'],['object','Object (them)'],['possessive','Possessive (their)'],['possessivePronoun','Standalone possessive (theirs)'],['reflexive','Reflexive (themself)']].map(([k,l])=>`<label>${l}<input name="${k}" value="${esc(draft.customPronouns[k])}" maxlength="24" required pattern="[\\p{L}\\p{M}’'\\-]+"></label>`).join('')}<label class="agreement"><input type="checkbox" name="plural" ${draft.customPronouns.plural?'checked':''}>Use “are / have” rather than “is / has”</label><button type="submit">Save pronouns</button><button type="button" class="cancel-custom">Cancel</button></form>`);
    review.querySelector('form').onsubmit=e=>{e.preventDefault();const data=new FormData(e.target);draft.customPronouns=Object.fromEntries(['subject','object','possessive','possessivePronoun','reflexive'].map(k=>[k,data.get(k).trim()]));draft.customPronouns.plural=data.has('plural');draft.pronouns='custom';draft.gender='custom';populate();dismiss();};
    review.querySelector('.cancel-custom').onclick=()=>{draft.pronouns=previousPronouns;draft.gender={he:'male',she:'female',they:'non-binary',custom:'custom'}[previousPronouns];populate();dismiss();};
  }
  let previousPronouns=draft.pronouns;
  form.oninput=e=>{if(e.target.name==='name'){draft.name=e.target.value;e.target.setCustomValidity(e.target.value.trim()?'':'Please enter your first name.');}update();};
  form.onchange=e=>{const k=e.target.name;if(['pronouns','rowanFeeling'].includes(k)){if(k==='pronouns'){previousPronouns=draft.pronouns;draft.gender={he:'male',she:'female',they:'non-binary',custom:'custom'}[e.target.value];}draft[k]=e.target.value;if(k==='pronouns'&&draft.pronouns==='custom')custom();update();}};
  root.querySelector('.custom-edit').onclick=()=>{previousPronouns=draft.pronouns;custom();};
  root.querySelector('.summer-back').onclick=()=>{if(step===2){page(1);form.elements.name.focus();}else onBack();};
  root.querySelector('.summer-close').onclick=onBack;
  root.querySelector('.summer-reset').onclick=()=>{draft=defaultProfile();form.elements.name.setCustomValidity('');populate();};
  form.onsubmit=e=>{e.preventDefault();if(!draft.name.trim())return;if(step===1){page(2);form.elements.rowanFeeling[0].focus();return;}const p=pronounForms(draft);markStep(3);review.classList.add('summer-final-review');show(`<div class="review-title"><span class="summer-kicker">A NEW PAGE IN YOUR STORY</span><h2>Your summer is waiting.</h2></div><div class="review-postcard"><aside class="review-illustration"><div class="review-stamp">SAINT LUIS<br>✧<br>WITH LOVE</div><div class="review-letter"></div><p>Some stories find their way home.</p></aside><section class="review-details"><span class="summer-kicker">THIS SUMMER BELONGS TO</span><h3>${esc(draft.name.trim())}</h3><dl><div><dt>Pronouns</dt><dd>${esc(p.subject)}/${esc(p.object)}</dd></div><div><dt>Portrait</dt><dd>${draft.portrait==='none'?'No portrait':'Silhouette'}</dd></div><div class="review-feeling"><dt>Your feelings for Rowan</dt><dd>${esc(draft.rowanFeeling)}</dd></div></dl><p class="review-boundary">Your feelings are a starting point, not an established relationship. You can stay here or move higher, but cannot lower this level after beginning.</p><p class="review-save">${hasSave?'A new summer replaces your autosave. Manual saves stay safe.':'Your summer saves automatically in this browser.'}</p></section></div><div class="summer-actions"><button type="button" class="keep-editing">← Keep editing</button><button type="button" class="confirm-summer">Begin my summer →</button></div>`);review.querySelector('.review-letter').append(keepsake.cloneNode(true));review.querySelector('.keep-editing').onclick=dismiss;review.querySelector('.confirm-summer').onclick=()=>{const result=structuredClone(draft);result.name=result.name.trim();draft=defaultProfile();onBegin(result);};};
  root.addEventListener('keydown',e=>{if(e.key==='Escape'&&!review.hidden){e.preventDefault();e.stopPropagation();if(review.querySelector('.cancel-custom'))review.querySelector('.cancel-custom').click();else dismiss();}});
  page(1);populate();form.elements.name.focus();
}
