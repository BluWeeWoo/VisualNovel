export const affinityLevels=['Reacquainted','Familiar','Trusted','Close','Committed'];
export const chapterTitles=['Reunion at a familiar house','Are we starting again or continuing where we left off?','Fixated memories can be difficult','An Eye for an Eye to Hope','Will We meet again?'];
export function chapterComplete(state,story){
  const end=story.aEnd;
  return Boolean(state&&end&&(state.flags?.chapterOneComplete||(state.node==='aEnd'&&state.line===end.lines.length-1)||state.history?.some(h=>h.id===`aEnd:${end.lines.length-1}`)));
}
export function affinityView(state){
  const label=affinityLevels.includes(state?.milestone)?state.milestone:'Reacquainted';
  // Commitment can also describe friendship in the existing engine. Never imply romance from that alone.
  const romantic=state?.flags?.relationship==='romance';
  return {label,pose:label==='Committed'&&!romantic?2:affinityLevels.indexOf(label)};
}
function art(source,box,alt,cls=''){
  return `<svg class="${cls}" viewBox="${box.join(' ')}" preserveAspectRatio="xMidYMid slice" role="img" aria-label="${alt}" overflow="hidden"><image href="${source}" width="${source.includes('affinity')?1536:1672}" height="${source.includes('affinity')?1024:941}"/></svg>`;
}
export function chapterMenu(state,complete){
  const affinity=affinityView(state),xs=[35,335,635,935,1230];
  const pictures=[[382,210,268,174],[710,218,283,171],[1043,215,258,174],[531,569,282,167],[873,568,300,168]];
  const inTwo=Boolean(state?.node?.startsWith('c2'));
  const cards=chapterTitles.map((title,i)=>{
    const unlocked=i===0||(i===1&&complete);
    let control;
    if(i===0)control=`<span class="chapter-status">${complete?'✿ Completed':state?'In progress':'Ready to begin'}</span><button data-action="${state?'chapter-resume':'new'}">${complete?'Revisit chapter':state?'Continue chapter':'Begin chapter'} →</button>`;
    else if(unlocked)control=`<span class="chapter-status">${state?.node==='c2End'?'Opening read':inTwo?'In progress':'Opening available'}</span><button data-action="chapter-two">${inTwo?'Continue chapter':'Begin chapter'} →</button><small>Chapter opening · More to come</small>`;
    else control=`<button disabled aria-label="Chapter ${i+1} locked">Locked</button><small>${i===1?'Complete Chapter 1 to begin':'Coming in a future update'}</small>`;
    const picture=i===1&&complete?'<img class="chapter-thumb" src="assets/cg/chapter-two/nightmare.webp" alt="A restless sleep" style="width:100%;height:100%;object-fit:cover">':art('assets/chapters/chapter-reference.png',pictures[i],'','chapter-thumb');
    return `<article class="chapter-card ${unlocked?'is-current':'is-locked'}"><div class="chapter-picture">${picture}</div><h3>Chapter ${i+1}</h3><p>${title}</p>${control}</article>`;
  }).join('');
  return `<header class="chapters-heading"><p>Our Summer, Unfinished</p><span>${inTwo?'CHAPTER 2 · THE STORY CONTINUES':complete?'CHAPTER 1 COMPLETE':'YOUR SUMMER SO FAR'}</span><h2 id="modal-title">Chapters of our summer</h2><button class="close" data-action="close" aria-label="Close chapter menu">×</button></header>
  <div class="chapters-layout"><aside class="chapter-companion" aria-label="Rowan affinity: ${affinity.label}">${art('assets/chapters/affinity-sheet.png',[xs[affinity.pose],132,270,435],`Rowan, ${affinity.label}`,'affinity-art')}<span>Rowan · Affinity</span><strong>${affinity.label}</strong><p>Every shared moment stays with you.</p></aside><section class="chapter-cards" aria-label="Chapters">${cards}</section></div>
  <footer class="chapters-footer"><span>More of our summer is still to come.</span><button data-action="new">Start a new summer</button><button data-action="saves">Save / Load</button><button data-action="title">Back to main menu</button></footer>`;
}
