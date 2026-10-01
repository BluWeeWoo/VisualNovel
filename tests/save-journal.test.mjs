import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
import {journalPages,saveJournal} from '../assets/save-journal.js';

const keys=Array.from({length:19},(_,i)=>`-slot${i+1}`);
const entries=['-auto',...keys].map((key,i)=>({key,number:String(i).padStart(2,'0'),label:i?`Moment ${String(i).padStart(2,'0')}`:'Autosave',valid:false,exists:false}));
const render=options=>saveJournal({entries,page:0,mode:'load',selected:'-slot1',canSave:false,...options});

test('All nineteen existing manual saves are reachable exactly once, with autosave separate',()=>{
  const pages=Array.from({length:5},(_,page)=>journalPages(keys,page));
  assert.deepEqual(pages.flatMap(p=>p.keys),keys);
  assert.equal(pages[4].keys.length,3);
  assert.equal(journalPages(keys,-1).page,0);
  assert.equal(journalPages(keys,99).page,4);
  assert.equal(journalPages(keys,NaN).page,0);
  const html=render({page:4,selected:'-slot19'});
  assert.match(html,/Moments 17–19 of 19/);
  assert.match(html,/data-save-select="-auto"/);
  assert.match(html,/data-save-select="-slot19" aria-pressed="true"/);
  assert.doesNotMatch(html,/data-save-select="-slot20"/);
});

test('Empty saves cannot load, and title-screen saves cannot overwrite progress',()=>{
  assert.match(render(),/data-load="-slot1" disabled/);
  assert.match(render(),/data-save-mode="save"[^>]*disabled/);
  assert.match(render({mode:'save'}),/data-save="-slot1" disabled/);
  assert.match(render({mode:'save',canSave:true,selected:'-auto'}),/data-save="-auto" disabled/);
  assert.doesNotMatch(render({mode:'save',canSave:true}),/data-save="-slot1" disabled/);
});

test('A selected memory renders its actual details safely and only enables the matching action',()=>{
  const saved=entries.map(e=>e.key==='-slot2'?{...e,valid:true,exists:true,title:'A <summer>',name:'Alex & Ro',excerpt:'"Come home."',date:'Oct 1, 2026',preview:'<span class="save-preview"></span>'}:e);
  const html=render({entries:saved,selected:'-slot2'});
  assert.match(html,/data-load="-slot2" >Load moment/);
  assert.match(html,/A &lt;summer&gt;/);
  assert.match(html,/Alex &amp; Ro/);
  assert.match(html,/&quot;Come home\.&quot;/);
  assert.equal((html.match(/id="modal-title"/g)||[]).length,1);
  const confirmation=render({entries:saved,selected:'-slot2',mode:'save',canSave:true,confirmKey:'-slot2'});
  assert.match(confirmation,/data-save-confirm="-slot2"/);
  assert.match(confirmation,/data-save-cancel/);
  assert.doesNotMatch(confirmation,/data-load=/);
});

test('Replacing a save requires confirmation and a failed write never reports success',()=>{
  const source=readFileSync(new URL('../src/app.js',import.meta.url),'utf8');
  const fn=source.slice(source.indexOf('function saveMoment('),source.indexOf('function drawModal('));
  const writes=[],toasts=[];
  const context={state:{node:'journey'},screen:'game',manualSaveKeys:keys,read:()=>({state:{node:'arrival'}}),
    write:(key,data)=>{writes.push({key,data});return true;},redrawSaveJournal:()=>{},toast:value=>toasts.push(value)};
  runInNewContext(fn+"\nsaveMoment('-slot1');",context);
  assert.equal(writes.length,0);
  assert.equal(context.saveConfirmKey,'-slot1');
  runInNewContext("saveMoment('-slot1',true);",context);
  assert.equal(writes.length,1);
  assert.equal(writes[0].key,'-slot1');
  assert.equal(writes[0].data.state,context.state);
  assert.deepEqual(toasts,['Moment saved.']);
  context.write=()=>false;
  runInNewContext("saveMoment('-slot1',true);saveMoment('-auto',true);",context);
  assert.equal(toasts.length,1);
});
