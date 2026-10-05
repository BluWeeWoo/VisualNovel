import {lineVisible} from './line-visibility.js';
import {chapterTwoAfternoon} from './chapter-two-afternoon.js';
import {chapterTwo} from './chapter-two.js';
import {afterGarden} from './after-garden.js';
// Authored direction: no keyword-based expression guessing.
export const expressions=['neutral','smile','playful','embarrassed','concerned','sad','surprised','annoyed'];
// Event illustrations are presentation only: no story, save or relationship mutations.
export const cgCues={
 d2Hug:{key:'d2-bedroom-hug',from:'He crosses the room'},
 d2Missed:{key:'d2-bedroom-missed-you',from:'I missed you too.'},
 d2Stay:{key:'d2-window-garden',from:'I lean toward the window',until:'I head downstairs'},
 d2Breakfast:{key:'d2-breakfast',from:'Tapa.'},
 d2Garden:{key:'d2-garden-approach',from:'The back door'},
 d2Whatcha:{key:'d2-garden-whatcha',from:'He starts turning'},
 d2Hey:{key:'d2-garden-reveal',from:'He looks back'},
 d2Poke:{key:'d2-garden-hat-poke',from:'Rowan goes still'},
 d2Scare:{key:'d2-garden-startled',from:'AH—!'},
 d2Reveal:{key:'d2-garden-reveal',from:'He turns fully'},
 rLetterPromise:{key:'porch-before-letters',from:'I was eleven.'},
 rYellowPromise:{key:'yellow-envelope-promise',from:'I’ll write first.',until:'He writes his name'},
 rGreeting:{key:'familiar-door',from:'He’s here'},
 rHug:{key:'reunion-hug',from:'He wraps'},
 rLetters:{key:'hidden-letters',from:'I lift the lid',until:'Mom pulls'},
 rBurning:{key:'burning-letters',from:'Paper slides',until:'Why would you'},
 journey:{key:'way-back',from:'The sea appears',until:'SAINT LUIS!'},
 hill:{key:'hill-houses',from:'I can see his house'},
 hillCry:{key:'hill-houses',from:'I put my bag down'},
 hillHold:{key:'hill-houses',from:'I look down at my shoes'},
 recognition:{key:'familiar-door',from:'Brown hair'},
 arrival:{key:'reunion',from:'Rowan stands on the porch',until:'What are we doing?'},
 list:{key:'promises',from:'The heading says'},
 gull:{key:'laughter',from:'You relocate',until:'His hands have small marks'},
 kitchen:{key:'third-cup',from:'His hand stops'},
 plan:{key:'beginning',from:'We can aim'}
};
for(const [id,node] of Object.entries({...afterGarden,...chapterTwo,...chapterTwoAfternoon}))if(node.cgCue)cgCues[id]=node.cgCue;
export function cgAt(story,state){
 const cue=story[state.node]?.cgCue||cgCues[state.node];if(!cue)return null;
 const lines=story[state.node].lines.filter(l=>lineVisible(l,state.flags));
 const start=lines.findIndex(l=>l.text.includes(cue.from));
 const end=cue.until?lines.findIndex(l=>l.text.includes(cue.until)):lines.length;
 return start>=0&&state.line>=start&&state.line<end?cue.key:null;
}
const defaults={arrival:'neutral',hug:'smile',latch:'playful',space:'concerned',entry:'neutral',sort:'neutral',hideout:'smile',treasure:'smile',list:'neutral',regret:'sad',want:'concerned',disagree:'concerned',break:'playful',street:'playful',gull:'playful',ambition:'embarrassed',challenge:'concerned',offer:'neutral',optional:'smile',pier:'neutral',homeward:'smile',kitchen:'neutral',cupstay:'sad',cake:'sad',cupaway:'concerned',absence:'sad',plan:'neutral',numbers:'neutral',friends:'smile',warm:'embarrassed',oneday:'smile'};
export const directions={
 arrival:[['If you’re selling','playful'],['Hello, {name}.','neutral'],['I was going to have','embarrassed'],['What are we doing?','concerned']],
 entry:[['I kept meaning','sad'],['A deeply unfair','playful'],['I can show you','concerned']],
 sort:[['Rowan lifts an old illustrated book','smile','book'],['Behind the spare blankets','neutral','ordinary']],
 hideout:[['I remember it being quieter','sad'],['You did one voice','playful']],
 treasure:[['Rowan doesn’t laugh','smile']],
 list:[['When you lift the photograph','surprised'],['The heading says','smile'],['Neither of you reads','sad'],['A terrible combination','playful']],
 disagree:[['Rowan looks up','surprised'],['He thinks about that','concerned'],['His smile','smile']],
 gull:[['Then a second gull','surprised'],['One chip is taken','embarrassed'],['You relocate','playful'],['I’ve been trying','embarrassed']],
 challenge:[['I don’t like that','smile']],
 offer:[['Thank you. Let me ask','smile']],
 pier:[['Four now.','playful'],['She used to ask','sad'],['Best seat in town','smile']],
 kitchen:[['She said it was aggressive','playful'],['His hand stops','sad']],
 cupstay:[['She’d put it in the microwave','smile']],
 cake:[['she asked where the rest was','smile'],['You laugh, then cover','concerned']],
 cupaway:[['You pour his tea','sad']],
 absence:[['Neither do you.','concerned']],
 plan:[['An administrative error','playful'],['We can aim','smile']],
 numbers:[['That phone went','embarrassed'],['For identification','playful'],['Got you.','smile']],
 friends:[['Then what are we even doing','playful']]
};
export function spriteAt(story,state){
 const node=story[state.node];
 if(node.continuation){
  if(!node.rowan)return null;
  const lines=node.lines.filter(l=>lineVisible(l,state.flags));
  let expression='neutral';
  for(let i=0;i<=state.line;i++)if(lines[i]?.expression)expression=lines[i].expression;
  return {expression,pose:'ordinary',key:expression,...(node.childhood?{character:'RowanChild'}:{})};
 }
 if(!(state.node in defaults))return null;
 const lines=node.lines.filter(l=>lineVisible(l,state.flags));
 if(state.node==='arrival' && state.line<6)return null;
 let expression=defaults[state.node],pose='ordinary';
 for(let i=0;i<=state.line;i++)for(const [fragment,next,nextPose] of directions[state.node]||[]){if(lines[i]?.text.includes(fragment)){expression=next;if(nextPose)pose=nextPose;}}
 // The original reference pose is intentionally confined to the room-sorting book.
 return {expression,pose,key:pose==='book'?'book':expression};
}
