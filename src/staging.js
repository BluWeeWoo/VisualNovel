import {lineVisible} from './line-visibility.js';
import {lunchCG} from './lunch-art.js';
import {graveArt,reviewedCG} from './approved-scene-art.js';
import {approvedChapterTwoCues} from './chapter-two-revision.js';
import {chapterTwoAfternoon} from './chapter-two-afternoon.js';
import {chapterTwo} from './chapter-two.js';
import {afterGarden} from './after-garden.js';
// Authored direction: no keyword-based expression guessing.
export const expressions=['neutral','smile','playful','embarrassed','concerned','sad','surprised','annoyed'];
// Event illustrations are presentation only: no story, save or relationship mutations.
const baseCues={
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
for(const [id,node] of Object.entries({...afterGarden,...chapterTwo,...chapterTwoAfternoon}))if(node.cgCue)baseCues[id]=node.cgCue;
// Chapter Two fills this shared registry during story assembly, in either import order.
export const cgCues=approvedChapterTwoCues;
for(const [id,cue] of Object.entries(baseCues))if(!id.startsWith('c2'))cgCues[id]=cue;
export function cgAt(story,state){
 const lunch=lunchCG(story,state);
 if(lunch!==undefined)return lunch;
 const reviewed=reviewedCG(story,state);
 if(reviewed!==undefined)return reviewed;
 const node=story[state.node];
 const cue=Object.hasOwn(node,'cgCue')?node.cgCue:cgCues[state.node];if(!cue)return null;
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
 if(node.character==='Mayumi'){
  const lines=node.lines.filter(l=>lineVisible(l,state.flags));
  let expression='neutral';
  for(let i=0;i<=state.line;i++)if(mayumiExpressions[lines[i]?.text])expression=mayumiExpressions[lines[i].text];
  return {character:'Mayumi',expression,pose:'ordinary',key:expression};
 }
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

export function spritesAt(story,state){
 const node=story[state.node],lines=node.lines.filter(l=>lineVisible(l,state.flags));
 const rowan=expression=>({character:'Rowan',expression,pose:'ordinary',key:expression});
 if(node.cast==='family'){
  const expression=lines.slice(0,state.line+1).reverse().find(l=>l.expression)?.expression||'concerned';
  return [{...rowan(expression),slot:'left'},{character:'Mayumi',expression:'concerned',pose:'ordinary',key:'concerned',slot:'right'}];
 }
 if(state.node==='c2Workshop')return [rowan(state.line>=11&&state.line<=13||state.line>=27?'embarrassed':'smile')];
 if(['c2GraveTogether','c2GraveChoice','c2GraveStay','c2GraveSpace','c2Grave'].includes(state.node)){
  const present=state.flags.graveTogether===true&&state.node!=='c2GraveSpace'&&(state.node!=='c2Grave'||state.flags.c2GraveStay===true);
  return present?[rowan('concerned')]:[];
 }
 const primary=spriteAt(story,state);
 if(node.character!=='Mayumi')return primary?[primary]:[];
 if(state.node==='c2Mayumi'){
  const porch=lines.findIndex(l=>l.text.startsWith('As I head home,'));
  if(state.line<porch)return state.flags.graveTogether===true?[rowan('concerned')]:[];
 }
 let present=state.flags.graveTogether===true;
 if(state.node==='c2FamilyArrival')present ||= lines.slice(0,state.line+1).some(l=>l.text.includes('I’m back. Sorry'));
 else if(state.node!=='c2Mayumi')present=true;
 let expression=state.node==='c2Mayumi'?'surprised':'neutral';
 const reactions={'Ma!':'embarrassed','But don’t you need to rest?':'concerned','I know. I really wish she’d rest.':'concerned','Oh. I’ll help.':'smile'};
 for(const line of lines.slice(0,state.line+1))if(line.speaker==='Rowan')expression=reactions[line.text]||line.expression||expression;
 return present?[{...rowan(expression),slot:'left'},{...primary,slot:'right'}]:[primary];
}

// Presentation-only cues: authored words, route flags and saved positions stay intact.
const mayumiExpressions={
 'Tao po!':'neutral','Ay, anak. And—':'surprised',
 'Baby ng anak ko! {name}!':'warm-smile','Come here. Can I hug you?':'warm-smile',
 'Welcome back. It’s good to see you.':'warm-smile','My son is going to be smitten once again.':'teasing',
 'Too long.':'sad','Yes, anak. He must be doing some extra work with his teacher.':'neutral',
 'Well, I wouldn’t miss {name} coming back. Haha.':'warm-smile','Anak, please.':'serious',
 'Yeah. Oh, I brought bread as well.':'warm-smile','Hay, na-miss ko ’to.':'warm-smile',
 'Ikaw, anak. I missed you.':'teasing','So, how are you?':'neutral',
 'Really? What happened?':'neutral','What? Grabe naman ang mga tao.':'surprised',
 'Are you okay, though?':'concerned','Thank goodness. Ingat ka lagi, okay? The world is a very dangerous place.':'concerned',
 '’Di ba? My son has been on top of his game ever since he started going to Nestor’s workshop.':'warm-smile',
 'Really? That’s nice. Let’s all visit her together if we get the chance.':'warm-smile',
 'Wait a minute, anak. If you were with {name}, who did the errands?':'concerned',
 'Rowan…':'serious','Hmm?':'serious','Ay, susmaryosep. Food is very expensive these days, Rowan.':'serious',
 'It’s—umm, I’m just going to deduct it from your allowance.':'serious','Hahaha.':'warm-smile',
 'It’s okay, anak.':'concerned','Oh, his safest choices. Probably his signature dishes.':'teasing',
 'Did I say they were bad?':'teasing'
};
export function sceneAt(story,state){
 const node=story[state.node],id=state.node;
 const lines=node.lines.filter(l=>lineVisible(l,state.flags));
 const painted=(name,time)=>({...node,place:'c2-painted-'+name,time});
 if(['c2Tricycle','c2TricycleBack','c2TricycleTogether'].includes(id))return painted('tricycle-stop','day');
 if(id==='c2Workshop')return painted('review-workshop-empty','day');
 if(['c2GraveTogether','c2GraveChoice','c2GraveSpace','c2GraveStay','c2Grave'].includes(id))return painted('review-'+graveArt('grave-alone',state),'evening');
 if(['c2MarketWalk','c2WorkshopAfter','c2FridayAsk','c2FridayLeave','c2Call'].includes(id))return painted('saint-luis-palengke','day');
 if(id==='c2GraveLeave')return painted(state.line===0?'grave-late-afternoon':'grave-sunset','evening');
 if(id==='c2Groceries')return painted(state.line<2?'hill-early-evening':'hill-houses-night',state.line<2?'twilight':'night');
 if(id==='c2Mayumi'){
  const atPorch=lines.findIndex(l=>l.text.startsWith('As I head home,'));
  if(state.flags.afternoonRoute==='market'&&state.line<atPorch)return painted('hill-houses-night','night');
  if(state.flags.afternoonRoute!=='market'&&state.line===0)return painted('hill-early-evening','twilight');
  if(state.flags.afternoonRoute!=='market'&&state.line===1)return painted('hill-houses-night','night');
  return painted('porch-night','night');
 }
 if(['c2FamilyArrival','c2TalkTrip','c2TalkHouse','c2TalkVisit','c2TalkHome','c2Family','c2NewEnding'].includes(id))return painted('living-night','night');
 return node;
}
