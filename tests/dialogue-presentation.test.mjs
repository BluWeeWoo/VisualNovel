import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {story} from '../src/story.js';

test('Every story line has an explicit presentation kind without changing its speaker',()=>{
 for(const node of Object.values(story))for(const line of node.lines){
  assert.ok(['narration','thought','spoken'].includes(line.kind));
  if(line.kind==='thought')assert.equal(line.speaker,'');
  if(line.kind==='spoken')assert.ok(line.speaker);
  assert.notEqual(line.speaker,'Thought');
 }
});
test('Silent thoughts, physical actions and spoken MC lines remain distinct',()=>{
 const find=text=>Object.values(story).flatMap(n=>n.lines).find(l=>l.text===text);
 assert.equal(find('What am I going to say if I see Rowan?').kind,'thought');
 assert.equal(find('I reach for my bag.').kind,'narration');
 assert.equal(find('Aray!').kind,'spoken');
 assert.equal(find('Aray!').speaker,'You');
 assert.equal(find('Shit. Bakit ngayon pa?').kind,'thought');
 assert.equal(find('He wraps his arms around me.').kind,'narration');
 for(const name of ['Rowan','You','Lola (off-screen)','Mom','Dad','Driver','Conductor'])
  assert.ok(Object.values(story).some(n=>n.lines.some(l=>l.speaker===name&&l.kind==='spoken')));
});
test('The same dialogue panel keeps empty silent nameplates and italicizes only thoughts',()=>{
 const app=readFileSync(new URL('../src/app.js',import.meta.url),'utf8');
 assert.ok(!app.includes("line.kind==='thought'?state.name:"));
 assert.ok(app.includes('last&&node.choices?'));
 assert.ok(!app.includes('choices-reserved'));
 const css=readFileSync(new URL('../styles.css',import.meta.url),'utf8');
 assert.ok(css.includes('.speaker-name:empty::before'));
 assert.ok(!css.includes('top:-44px'));
 assert.match(css,/\.dialogue-card\.thought \.dialogue-copy\s*\{ font-style:italic;/);
 assert.match(css,/\.dialogue-card\.spoken \.dialogue-copy,\s*\.dialogue-card\.narration \.dialogue-copy\s*\{ font-style:normal;/);
});
