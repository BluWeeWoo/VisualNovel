import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {translate,setLanguage,getLanguage,translateRecorded,languageField} from '../assets/story-language.js';
import {story} from '../src/story.js';
import {freshState} from '../src/engine.js';

test('Legacy language preferences preserve every authored line and choice unchanged',()=>{
 const state=freshState(),before=JSON.stringify(state);
 for(const locale of ['english','taglish']){
  setLanguage(locale);
  for(const node of Object.values(story))for(const text of [...node.lines.map(l=>l.text),...(node.choices||[]).map(c=>c.text)]){
   assert.equal(translate(text,locale),text);
   assert.equal(translateRecorded(text,state),text);
  }
 }
 assert.equal(JSON.stringify(state),before);
 assert.equal(getLanguage(),'english');
 assert.equal(languageField(),'');
});
test('Setup and settings no longer offer a language selector; UI is unchanged',()=>{
 const setup=readFileSync(new URL('../assets/new-summer.js',import.meta.url),'utf8');
 const app=readFileSync(new URL('../src/app.js',import.meta.url),'utf8');
 assert.doesNotMatch(setup,/name="language"|summer-language|Story language/);
 assert.doesNotMatch(app,/languageField|language-setting/);
 for(const text of ['Settings','Save / load','Text speed'])assert.equal(translate(text),text);
});
