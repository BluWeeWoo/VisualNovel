import test from 'node:test';
import assert from 'node:assert/strict';
import {translate,setLanguage,getLanguage,normalizeLanguage,translateRecorded,languageField} from '../assets/story-language.js';
import {english,taglish} from '../assets/story-translations.js';
import {story} from '../src/story.js';
import {freshState,visibleLines,interpolate} from '../src/engine.js';
import {cgAt} from '../src/staging.js';
import {phoneBody} from '../src/phone-ui.js';
import {morningPhone} from '../src/morning-phone.js';
import {rowansLetter} from '../src/continuation.js';
import {waveWords,nightmareProgress} from '../assets/nightmare.js';

test('English and Taglish selection changes presentation, not state or artwork cues',()=>{
 const s=freshState('Mika','she');s.node='c2Wake';s.line=3;
 s.flags.nightmareSkip=false;nightmareProgress(s,1).cleared=[0,1];
 const before=JSON.stringify(s),model=JSON.stringify(story),cg=cgAt(story,s);
 setLanguage('english');assert.equal(translate('Yeah. It’s me.'),'Yeah. It’s me.');
 setLanguage('taglish');assert.equal(translate('Yeah. It’s me.'),'Yeah. Ako ’to.');
 assert.equal(cgAt(story,s),cg);assert.equal(JSON.stringify(s),before);assert.equal(JSON.stringify(story),model);
 setLanguage('english');assert.equal(normalizeLanguage('invalid'),'english');
 assert.equal(getLanguage(),'english');assert.match(languageField(),/value="english" selected/);
});
test('All playable branches and choices remain printable in either language',()=>{
 const s=freshState();
 for(const locale of ['english','taglish'])for(const n of Object.values(story)){
  for(const text of [...n.lines.map(l=>l.text),...(n.choices||[]).map(c=>c.text)]){
   const result=translate(text,locale);assert.equal(typeof result,'string');assert.ok(result.length);
   assert.deepEqual(result.match(/\{\w+\}/g)||[],text.match(/\{\w+\}/g)||[]);
   assert.doesNotMatch(interpolate(result,s),/\{\w+\}/);
  }
 }
 for(const values of [english,taglish])for(const [source,target] of Object.entries(values)){
  assert.ok(source&&target);assert.doesNotMatch(target,/undefined|\|\|\|/);
 }
});
test('English removes Filipino clauses; Taglish keeps shared narration in English',()=>{
 assert.equal(translate('Dadaan po ba kayo sa Santiago Street?','english'),'Will you be passing through Santiago Street?');
 assert.equal(translate('Tama na. Please.','english'),'Enough. Please.');
 assert.equal(translate('The corridor disappears.','taglish'),'The corridor disappears.');
 assert.equal(translate('“I need some space, please.”','taglish'),'“Kailangan ko muna ng space, please.”');
});
test('Letters, history, phones and nightmare words follow selected language',()=>{
 const s=freshState('Mika','they');setLanguage('taglish');
 assert.ok(rowansLetter.filter(t=>translate(t)!==t).length>25);
 assert.equal(translateRecorded('Goodnight, Ro. Glad to be back.',s),'Goodnight, Ro. Buti bumalik ako.');
 assert.equal(translateRecorded('Good night, Mika. See you tomorrow, sunshine.',s),'Good night, Mika. Kita tayo bukas, sunshine.');
 s.history=[{id:'rReturn:2',speaker:'Rowan · text',text:'The one standing in front of you.'}];
 assert.match(phoneBody('messages',s),/’Yung nasa harap mo/);
 setLanguage('english');s.node='d2PhoneOpen';s.line=story.d2PhoneOpen.lines.findIndex(l=>l.text==='Nasaan ka na?');
 assert.match(morningPhone(story.d2PhoneOpen,s),/Where are you/);
 for(const words of Object.values(waveWords))for(const word of words)assert.notEqual(translate(word,'taglish'),word);
 setLanguage('english');
});
