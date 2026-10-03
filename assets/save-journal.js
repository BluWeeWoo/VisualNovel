const escape=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const journalPageSize=4;
export function journalPages(keys,page){
  const count=Math.max(1,Math.ceil(keys.length/journalPageSize));
  const current=Math.max(0,Math.min(count-1,Number.isFinite(Number(page))?Math.trunc(Number(page)):0));
  return {page:current,count,keys:keys.slice(current*journalPageSize,(current+1)*journalPageSize)};
}
const emptyPhoto='<span class="journal-empty-photo" aria-hidden="true"><span>☼</span><i>A little room<br>for what comes next.</i></span>';

export function saveJournal({entries,page,mode,selected,canSave,confirmKey}){
  const pagination=journalPages(entries.filter(e=>e.key!=='-auto').map(e=>e.key),page);
  const current=entries.find(e=>e.key===selected)||entries.find(e=>e.key===pagination.keys[0]);
  const auto=entries.find(e=>e.key==='-auto');
  const save=mode==='save';
  const actionDisabled=save?(!canSave||current.key==='-auto'):!current.valid;
  const confirming=save&&confirmKey===current.key;
  const entry=e=>`<button type="button" class="journal-entry ${e.valid?'':'is-empty'}" data-save-select="${e.key}" aria-pressed="${e.key===current.key}" aria-label="Select ${escape(e.label)}${e.valid?': '+escape(e.title):e.exists?', unavailable save':', empty'}">
    <span class="journal-slot-number">${escape(e.number)}</span><span class="journal-thumb" aria-hidden="true">${e.valid?e.preview:emptyPhoto}</span>
    <span class="journal-entry-copy"><span class="journal-entry-label">${e.valid?'Chapter '+(e.chapter||1)+' · '+escape(e.name):escape(e.label)}</span><strong>${e.valid?escape(e.title):e.exists?'An unreadable moment':'An unwritten moment'}</strong><small>${e.valid?escape(e.date):e.exists?'This save cannot be loaded':'A page waiting for you'}</small></span><span class="journal-entry-mark" aria-hidden="true">${e.key===current.key?'✦':''}</span>
  </button>`;
  return `<div class="summer-journal">
    <span class="journal-spine" aria-hidden="true"></span>
    <div class="journal-margin-note journal-note-left" aria-hidden="true">Same people.<br>Same sea.<br>Still<br>unfinished.</div>
    <div class="journal-margin-note journal-note-right" aria-hidden="true"><svg viewBox="0 0 80 70" fill="none"><path d="M41 5v48M37 12 14 47h23ZM46 23l19 24H46ZM8 54h62L57 64H23ZM4 68q9-5 18 0t18 0 18 0 18 0"/></svg>Same sea.<br>Different days.<br>That’s enough.</div>
    <header class="journal-heading"><div><h2 id="modal-title">Saved moments</h2><p>Our Summer, Unfinished</p></div>
      <div class="journal-modes" role="group" aria-label="Save or load"><button type="button" data-save-mode="save" aria-pressed="${save}" ${!canSave?'disabled title="Begin or load a summer to save your progress"':''}>Save</button><button type="button" data-save-mode="load" aria-pressed="${!save}">Load</button></div>
      <span class="journal-heading-note" aria-hidden="true">CHAPTERS, TIDE MARKS,<br>AND THINGS LEFT UNSAID.</span>
      <button type="button" class="close journal-close" data-action="close" aria-label="Close saved moments">×</button>
    </header>
    <div class="journal-spread">
      <section class="journal-left" aria-label="Saved memory slots">
        <div class="journal-entries">${pagination.keys.map(key=>entry(entries.find(e=>e.key===key))).join('')}</div>
        <button type="button" class="journal-autosave" data-save-select="-auto" aria-pressed="${current.key==='-auto'}" ${save?'disabled':''} aria-label="Select Autosave${auto.valid?': '+escape(auto.title):', empty'}"><span aria-hidden="true">↺</span><span><strong>Autosave</strong><small>${auto.valid?escape(auto.title):'Your latest place will be kept here'}</small></span><span class="journal-auto-note">${auto.valid?'Latest place':'Automatically kept'}</span></button>
        <footer class="journal-list-footer"><span role="status">Moments ${pagination.page*journalPageSize+1}–${Math.min((pagination.page+1)*journalPageSize,entries.length-1)} of ${entries.length-1}</span><i>Every return is a beginning.</i></footer>
      </section>
      <section class="journal-right" aria-label="Selected memory">
        <div class="journal-photo-area"><span class="journal-postmark" aria-hidden="true">SUMMERHOUSE<span>☼</span>SUMMER MEMORIES</span><figure class="journal-photo">${current.valid?current.preview:emptyPhoto}<figcaption>${current.valid?'a moment to come back to':'the rest is still unwritten'}</figcaption></figure></div>
        <div class="journal-memory"><div class="journal-memory-meta"><span>${current.valid?'CHAPTER 1':escape(current.label).toUpperCase()}</span><time>${current.valid?escape(current.date):'A little space for your summer'}</time></div><h3>${current.valid?escape(current.title):current.exists?'This moment cannot be opened':'Something to remember'}</h3>
          <p class="journal-excerpt">${current.valid?escape(current.excerpt):current.exists?'This save is incompatible with the current story. You can choose another moment.':save?'Keep your current place on this page. It will be here whenever you want to return.':'There is no memory on this page yet. Save a moment during your story to fill it.'}</p>
          <span class="journal-memory-signature">${current.valid?escape(current.name)+' · '+escape(current.label):'Some stories take their time.'}</span>
        </div>
        <div class="journal-action-area">${confirming?`<div class="journal-confirm" role="group" aria-label="Confirm replacement"><p>Replace ${escape(current.label)} with your current place?</p><div><button type="button" class="journal-cancel" data-save-cancel>Keep this memory</button><button type="button" class="journal-primary" data-save-confirm="${current.key}">Replace moment</button></div></div>`:`<div class="journal-action-copy"><span>${save?'Keep this part of your story.':'Pick up where you left off.'}</span><small>${save?'Saved on this device':'Your other moments stay safe'}</small></div><button type="button" class="journal-primary" ${save?'data-save':'data-load'}="${current.key}" ${actionDisabled?'disabled':''}>${save?(current.exists?'Replace moment':'Save moment'):'Load moment'}<span aria-hidden="true">→</span></button>`}</div>
      </section>
    </div>
    <footer class="journal-footer"><span class="journal-footer-note">A summer, unfinished. <i>Yours to return to.</i></span><nav class="save-pagination" aria-label="Saved moment pages"><button type="button" data-save-page="${pagination.page-1}" aria-label="Previous page" ${pagination.page===0?'disabled':''}>‹</button>${Array.from({length:pagination.count},(_,i)=>`<button type="button" data-save-page="${i}" aria-label="Page ${i+1}" aria-current="${i===pagination.page?'page':'false'}">${i+1}</button>`).join('')}<button type="button" data-save-page="${pagination.page+1}" aria-label="Next page" ${pagination.page===pagination.count-1?'disabled':''}>›</button></nav><span class="journal-folio">${String(pagination.page*2+1).padStart(2,'0')} — ${String(pagination.page*2+2).padStart(2,'0')}</span></footer>
  </div>`;
}
