import test from 'node:test';
import assert from 'node:assert/strict';
import {story} from '../src/story.js';
import {freshState,visibleLines,validSave} from '../src/engine.js';
import {phoneCue,hasRowanContact,authoredMessages,phoneBody,phoneIdentity} from '../src/phone-ui.js';
const at=(node,text)=>{const s=freshState('River','they');s.node=node;s.flags.greeting='shocked';s.line=visibleLines(story[node],s).findIndex(l=>l.text===text);assert.ok(s.line>=0);return s;};
test('Authored phone moments open the correct screen without changing story state',()=>{
 for(const [node,text,page] of [['rExchange','I reach for my phone.','contact'],['rBedroom','I kept opening her contact.','lola'],['rReturn','I enter his number.','contact'],['rReturn','It’s Rowan.','messages'],['rReturn','The one who’s still alive.','messages']]){
  const s=at(node,text),before=JSON.stringify(s);assert.equal(phoneCue(story,s).page,page);assert.equal(JSON.stringify(s),before);assert.ok(validSave(s,story));
 }
 assert.equal(phoneCue(story,freshState()),null);
});
test('Seaglass cannot show future messages or unlock free chat',()=>{
 const s=freshState();assert.equal(hasRowanContact(s),false);assert.deepEqual(authoredMessages(s),[]);
 s.history.push({id:'rExchange:4',speaker:'',text:'I reach for my phone.'});assert.equal(hasRowanContact(s),true);
 s.history.push({id:'rReturn:9',speaker:'Rowan · text',text:'It’s Rowan.'});
 const before=JSON.stringify(s);const html=phoneBody('messages',s);
 assert.match(html,/It’s Rowan/);assert.doesNotMatch(html,/The one who|gull was/);assert.equal(JSON.stringify(s),before);assert.ok(!s.phoneUnlocked);
 const copy=JSON.parse(before);assert.deepEqual(authoredMessages(copy),authoredMessages(s));
});
test('Fictional profile, messages and feed are escaped and remain presentation only',()=>{
 const s=freshState();s.history.push({id:'rReturn:9',speaker:'Rowan · text',text:'<img onerror=bad>'});
 for(const page of ['contact','profile','feed','messages','lola']){const html=phoneBody(page,s);assert.doesNotMatch(html,/<img onerror=bad>/);assert.ok(html.includes('data-action="close"'));}
 assert.match(phoneIdentity.number,/555-01\d\d/);assert.match(phoneBody('messages',s,{typing:true}),/Rowan is typing/);
});

test('Present-day Seaglass stays unavailable inside the two-years-earlier flashback',()=>{
 const s=freshState();s.history.push({id:'rExchange:4',speaker:'',text:'I reach for my phone.'});
 for(const node of ['rBedroom','rLanding','rPush','rQuiet','rLetters','rBurning']){s.node=node;assert.equal(hasRowanContact(s),false);}
 s.node='rReturn';assert.equal(hasRowanContact(s),true);
});
