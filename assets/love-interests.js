import {cgAt} from '../src/staging.js';

// Only recorded lines/current reading positions grant CGs; never infer from a
// relationship score or completion flag. This does not mutate story saves.
export function galleryUnlocks(story, manifest, states, previous=[]){
  const unlocked=new Set((Array.isArray(previous)?previous:[]).filter(key=>manifest.cgs?.[key]));
  for(const state of states.filter(Boolean)){
    const positions=[{node:state.node,line:state.line}];
    for(const entry of state.history||[]){
      const match=/^([^:]+):(\d+)$/.exec(entry.id);
      if(match)positions.push({node:match[1],line:Number(match[2])});
    }
    for(const position of positions){
      if(!story[position.node])continue;
      const key=cgAt(story,{...state,...position});
      if(key&&manifest.cgs?.[key])unlocked.add(key);
    }
  }
  return [...unlocked].sort();
}

const asset=name=>`assets/gallery/${name}.webp`;
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const sheet=(id,title,src,note='Approved design preview')=>({id,title,src,note});
export function galleryCatalog(manifest,unlocks){
  return {
    rowan:{name:'Rowan',portrait:manifest.portraits.Rowan.neutral,description:'An old friend, a familiar doorstep, and a summer with room to begin again.',
      Outfits:[sheet('seaglass','Sea-glass morning',asset('rowan-seaglass'),'Alternative outfit preview'),sheet('porch','Porch reader',asset('rowan-porch'),'Alternative outfit preview'),sheet('harbor','Harbor afternoon',asset('rowan-harbor'),'Alternative outfit preview'),sheet('original','Original cardigan',manifest.portraits.Rowan.neutral,'Rowan’s familiar dog-and-bone cardigan.'),sheet('summer','Summer wardrobe',asset('rowan-outfits'),'Sea-glass morning · Porch reader · Harbor afternoon. Alternative outfit concepts; viewing does not change his story outfit.')],
      Expressions:[...Object.entries(manifest.portraits.Rowan).map(([id,src])=>sheet(id,({smile:'Happy',playful:'Playful',book:'Reading',concerned:'Concerned'})[id]||id[0].toUpperCase()+id.slice(1),src,'Character sprite preview')),sheet('sheet','Seven expressions',asset('rowan-expressions'),'Neutral · Happy · Annoyed · Embarrassed · Sad · Surprised · Emotionally confused')],
      Artwork:[sheet('summerhouse','Summerhouse afternoon','assets/backgrounds/menu-seaglass.png','Main-menu illustration'),...Object.entries(manifest.cgs||{}).map(([id,cg],index)=>({id,src:cg.src,title:unlocks.includes(id)?`Story artwork ${index+1}`:'Unseen story artwork',note:unlocks.includes(id)?cg.alt:`Unlock by viewing this illustration in Rowan’s story. Some scenes depend on your choices.`,locked:!unlocks.includes(id)}))]},
    sevi:{name:'Sevrine “Sevi” Buenaventura',portrait:asset('sevi-full'),description:'A brilliant academic rival with a precise eye and a competitive streak. Understanding his own feelings is a harder subject.',
      Outfits:[sheet('contrast','Quiet contrast',asset('sevi-contrast'),'Approved Part 2 outfit preview'),sheet('monochrome','Summer monochrome',asset('sevi-monochrome'),'Approved Part 2 outfit preview'),sheet('coastal','Coastal scholar',asset('sevi-full'),'Approved Part 2 design preview'),sheet('summer','Summer wardrobe',asset('sevi-outfits'),'Coastal scholar · Quiet contrast · Summer monochrome')],
      Expressions:[...['neutral','happy','annoyed','embarrassed','sad','surprised','confused'].map(id=>sheet(id,id==='confused'?'Emotionally confused':id[0].toUpperCase()+id.slice(1),asset('sevi-'+id),'Approved Part 2 expression preview')),sheet('expressions','Seven expressions',asset('sevi-expressions'),'Complete approved expression sheet')],
      Artwork:[sheet('teaser','A meeting of minds',asset('sevi-teaser'),'Spoiler-free Part 2 teaser')]
    }
  };
}

// Display approved reference illustrations as clipped artwork, with real controls
// layered separately. Story sprites and original concept sheets stay untouched.
const reference=(character,title,crop)=>({title,src:`assets/gallery/${character}-showcase-reference.png`,crop});
let illustrationId=0;
function illustration(art,alt=''){
  if(!art.crop)return `<span class="li-image"><img src="${art.src}" alt="${esc(alt)}"></span>`;
  const [x,y,w,h]=art.crop;
  const clip=`li-art-${++illustrationId}`;
  return `<span class="li-image li-crop"><svg viewBox="${x} ${y} ${w} ${h}" width="${w}" height="${h}" role="img" aria-label="${esc(alt)}" preserveAspectRatio="xMidYMid meet"><defs><clipPath id="${clip}"><rect x="${x}" y="${y}" width="${w}" height="${h}"/></clipPath></defs><image href="${art.src}" width="1672" height="941" clip-path="url(#${clip})"/></svg></span>`;
}
export function mountGallery(root,{manifest,unlocks,onClose}){
  const catalog=galleryCatalog(manifest,unlocks);
  const scenic=[[824,263,223,303],[1070,263,222,303],[1314,263,221,303]];
  catalog.rowan.Outfits.slice(0,3).forEach((item,i)=>Object.assign(item,reference('rowan',item.title,scenic[i])));
  Object.assign(catalog.rowan.Artwork[0],reference('rowan','Summerhouse afternoon',[824,624,711,209]));
  Object.assign(catalog.sevi.Artwork[0],reference('sevi','A meeting of minds',[767,529,810,274]));
  const expressionCrops={neutral:[767,257,239,217],happy:[1034,258,238,216],confused:[1303,257,238,217]};
  for(const item of catalog.sevi.Expressions)if(expressionCrops[item.id])Object.assign(item,reference('sevi',item.title,expressionCrops[item.id]));
  const confused=catalog.sevi.Expressions.findIndex(item=>item.id==='confused');
  catalog.sevi.Expressions.splice(2,0,...catalog.sevi.Expressions.splice(confused,1));
  const heroes={rowan:reference('rowan','Rowan',[308,30,493,911]),sevi:reference('sevi','Sevi',[290,20,429,909])};
  let character='rowan',tab='Outfits',index=0,viewer=false,featuredViewer=false;
  const content=document.createElement('div');content.className='li-content';root.append(content);
  function render(focus){
    const person=catalog[character],items=person[tab],item=items[index],feature=person.Artwork[0];
    const shown=featuredViewer?feature:item,page=Math.floor(index/3)*3;
    content.dataset.character=character;content.dataset.category=tab;content.classList.toggle('is-viewing',viewer);
    content.innerHTML=`<aside class="li-sidebar"><p class="li-sidebar-title">Characters</p><div class="li-ornament" aria-hidden="true">◇</div>${['rowan','sevi'].map(key=>`<button class="li-character" data-character="${key}" aria-pressed="${character===key}"><span>${key==='rowan'?'Rowan':'Sevi'}</span><span aria-hidden="true">${key==='rowan'?'✧':'❧'}</span></button>${key==='sevi'?'<small>Coming in Part 2</small>':''}`).join('')}<p class="li-aside-note">Some stories take<br>longer to find<br>their way home.</p></aside>
      <div class="li-portrait" aria-hidden="true">${illustration(heroes[character])}</div>
      <section class="li-main" aria-label="Character gallery"><header class="li-heading"><h3>${character==='sevi'?'Sevrine Buenaventura':'Rowan'}</h3>${character==='sevi'?'<div class="li-subtitle"><i>Sevi</i><span class="li-ornament" aria-hidden="true">◇</span><span class="li-badge">Coming in Part 2</span></div>':'<div class="li-ornament" aria-hidden="true">◇</div>'}<p class="li-description">${person.description}</p></header>
      ${viewer?`<div class="li-viewer"><button data-command="shrink">← Back to gallery</button>${illustration(shown,shown.title)}<h4>${esc(shown.title)}</h4><p>${esc(shown.note||'Approved character illustration')}</p></div>`:`<div class="li-tabs" role="tablist" aria-label="Gallery categories">${['Artwork','Outfits','Expressions'].map(label=>`<button role="tab" id="li-tab-${label}" aria-selected="${tab===label}" aria-controls="li-panel" tabindex="${tab===label?'0':'-1'}" data-tab="${label}">${label}</button>`).join('')}</div>
      <div id="li-panel" role="tabpanel" aria-labelledby="li-tab-${tab}"><div class="li-cards">${items.slice(page,page+3).map((art,offset)=>{const i=page+offset;return `<button class="li-card ${art.locked?'li-locked':''} ${art.crop?'li-scenic':''} ${art.src.includes('/rowan-upgraded/')?'li-rowan-sprite':''}" data-item="${i}" aria-label="${esc(art.title)}${art.locked?' — locked':' — view larger'}" aria-pressed="${index===i}">${art.locked?'<span class="li-silhouette" aria-hidden="true"></span>':illustration(art)}<span class="li-card-title">${esc(art.title)}</span>${art.locked?'<small>Locked · View the story scene</small>':''}</button>`;}).join('')}</div>
      <p class="li-selection" aria-live="polite">${item.locked?esc(item.note):'Select an artwork to view it larger.'}</p></div>
      <button class="li-feature" data-command="feature" aria-label="View ${esc(feature.title)} larger">${illustration(feature)}<span>${esc(feature.title)}</span></button>`}
      <footer class="li-controls"><div class="li-pagination"><button data-command="previous" ${(index===0||featuredViewer)?'disabled':''} aria-label="Previous artwork">← Previous</button><span>${featuredViewer?"Featured artwork":`${index+1} / ${items.length}`}</span><button data-command="next" ${(index===items.length-1||featuredViewer)?'disabled':''} aria-label="Next artwork">Next →</button></div><button data-command="back">${viewer?'Back to gallery':'Back to menu'}</button></footer>
      ${character==='sevi'?'<p class="li-future" title="Rowan romance keeps Sevi a friend and rival. Friendship allows an optional romance in Part 2; undecided feelings require clear player choices and confirmation. No overlapping romances.">Character preview only · Story not yet playable</p>':''}
      </section>`;
    if(focus)content.querySelector(focus)?.focus({preventScroll:true});
  }
  content.addEventListener('click',event=>{
    const button=event.target.closest('button');if(!button||button.disabled)return;
    let focus;
    if(button.dataset.character){character=button.dataset.character;tab=character==='sevi'?'Expressions':'Outfits';index=0;viewer=false;featuredViewer=false;focus=`[data-character="${character}"]`;}
    else if(button.dataset.tab){tab=button.dataset.tab;index=0;viewer=false;featuredViewer=false;focus=`[data-tab="${tab}"]`;}
    else if(button.dataset.item!==undefined){index=Number(button.dataset.item);featuredViewer=false;viewer=!catalog[character][tab][index].locked;focus=viewer?'[data-command="shrink"]':`[data-item="${index}"]`;}
    else {
      const items=catalog[character][tab];
      switch(button.dataset.command){
        case 'previous':index=Math.max(0,index-1);featuredViewer=false;focus='[data-command="next"]';break;
        case 'next':index=Math.min(items.length-1,index+1);featuredViewer=false;focus='[data-command="previous"]';break;
        case 'feature':featuredViewer=true;viewer=true;focus='[data-command="shrink"]';break;
        case 'shrink':viewer=false;focus=featuredViewer?'[data-command="feature"]':`[data-item="${index}"]`;featuredViewer=false;break;
        case 'back':if(!viewer){onClose();return;}viewer=false;focus=featuredViewer?'[data-command="feature"]':`[data-item="${index}"]`;featuredViewer=false;break;
        default:return;
      }
      if(!featuredViewer&&items[index].locked)viewer=false;
    }
    render(focus);
  });
  root.addEventListener('keydown',event=>{
    if(event.key==='Escape'&&viewer){event.preventDefault();event.stopPropagation();viewer=false;const focus=featuredViewer?'[data-command="feature"]':`[data-item="${index}"]`;featuredViewer=false;render(focus);}
    const current=event.target.closest('[data-tab]');
    if(current&&['ArrowLeft','ArrowRight','Home','End'].includes(event.key)){
      event.preventDefault();const tabs=['Artwork','Outfits','Expressions'];
      let next=tabs.indexOf(tab)+(event.key==='ArrowLeft'?-1:1);
      if(event.key==='Home')next=0;if(event.key==='End')next=2;
      tab=tabs[(next+3)%3];index=0;render(`[data-tab="${tab}"]`);
    }
  });
  render();
}
