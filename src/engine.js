import {gardenAffection,validGarden} from '../assets/garden-game.js';
export const VERSION = 1;
export const milestones = [
  {name:'Reacquainted', unlock:'Authored choices establish boundaries and shared childhood.'},
  {name:'Familiar', unlock:'Optional scenes and personal questions; chapter one offers a four-message texting preview.'},
  {name:'Trusted', unlock:'Short free-text conversations at authored moments in later chapters.'},
  {name:'Close', unlock:'Open late-night conversations between later chapters.'},
  {name:'Committed', unlock:'Explicitly chosen friendship or romance scenes, rituals, and remembered details.'}
];
export const promises = [
  'Watch the sunrise from the old pier.',
  'Perform a song in front of someone.',
  'Tell each other a secret.',
  'Take a trip with no planned destination.',
  'Leave town together someday.'
];
export function freshState(name = 'Alex', pronouns = 'they') {
  return { version: VERSION, storyRevision: 5, name: name.trim().slice(0, 24) || 'Alex', pronouns,
    node: 'journey', line: 0, flags: {letterTiming:'later'}, history: [], chat: [], chatTurns: 0,
    chatDone: false, promiseFound: false, sunrise: 'unstarted', milestone: 'Reacquainted',
    memories: [], completed: false, startedAt: Date.now() };
}
export function interpolate(text, state) {
  const forms = {they: ['they','them','their'], she: ['she','her','her'], he: ['he','him','his']};
  const p = forms[state.pronouns] || forms.they;
  return text.replace(/\{(name|subject|object|possessive|hideout|hideoutPlace|treasure|nickname)\}/g, (_, key) =>
    ({name: state.name, subject:p[0], object:p[1], possessive:p[2],
      hideout: state.flags.hideout || 'the linen cupboard',
      hideoutPlace: state.flags.hideout==='under the kitchen table'?'under the kitchen table':'in '+(state.flags.hideout||'the linen cupboard'),
      treasure: state.flags.treasure || 'a blue marble',
      nickname: state.flags.nickname || 'Captain'})[key]);
}
export function applyChoice(state, choice) {
  Object.assign(state.flags, choice.set || {});
  if(choice.set?.gardenMode==='declined')gardenAffection(state,false);
  if (choice.state) Object.assign(state, choice.state);
  state.node = choice.next;
  state.line = 0;
  return state;
}
export function validSave(s, story) {
  return !!(s && s.version === VERSION && typeof s.name === 'string' && s.name.length <= 24 &&
    ['they','she','he'].includes(s.pronouns) && story[s.node] && Number.isInteger(s.line) && s.line >= 0 &&
    s.flags && typeof s.flags === 'object' && !Array.isArray(s.flags) &&
    (s.garden===undefined||validGarden(s.garden)) &&
    s.line < visibleLines(story[s.node],s).length &&
    Array.isArray(s.history) && Array.isArray(s.chat) && Array.isArray(s.memories) &&
    s.history.every(h=>h && typeof h.id==='string' && typeof h.speaker==='string' && typeof h.text==='string') &&
    s.chat.every(m=>m && ['player','rowan'].includes(m.role) && typeof m.text==='string') &&
    s.memories.length<=8 && s.memories.every(m => m && m.key==='player-approved note' && typeof m.value === 'string' && m.value.length<=120) &&
    Number.isInteger(s.chatTurns) && s.chatTurns >= 0 && s.chatTurns <= 4);
}
export function visibleLines(node, state) {
  return node.lines.filter(line => !line.if || state.flags[line.if[0]] === line.if[1]);
}
export function chatContext(s) {
  return {chapter: 1, milestone: s.milestone, name: s.name, pronouns:s.pronouns,
    choices: Object.fromEntries(['boundary','hideout','treasure','nickname','outlook','support','ritual','relationship'].filter(k => s.flags[k]).map(k=>[k,s.flags[k]])),
    memories:s.memories.slice(0,8), messages:s.chat.slice(-10), turns:s.chatTurns};
}
// Re-render authored history from stable IDs so existing saves pick up canon edits.
// Preserve all free-text messages, memories, choices, and the exact reading position.
export function refreshAuthoredHistory(s,story){
  s.history=s.history.map(h=>{
    if(h.id.startsWith('choice:')){
      const node=story[h.id.slice(7)];
      const selected=node?.choices?.find(c=>{
        const entries=Object.entries(c.set||{});
        return entries.length?entries.every(([k,v])=>s.flags[k]===v):h.text===interpolate(c.text,s);
      });
      return selected?{...h,text:interpolate(selected.text,s)}:h;
    }
    const split=h.id.lastIndexOf(':'),id=h.id.slice(0,split),index=Number(h.id.slice(split+1));
    const line=story[id]&&visibleLines(story[id],s)[index];
    return line?{...h,speaker:line.speaker||'',text:interpolate(line.text,s)}:h;
  });
  return s;
}

// Map old reading positions across approved insertions without changing player choices.
const revisionOnePositions={"arrival":{"indices":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"conditions":[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null]},"list":{"indices":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17],"conditions":[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null]},"journey":{"indices":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39],"conditions":[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null]},"otherDoor":{"indices":[0,1,2,4,5,6,7,8,9,10,11,12,13],"conditions":[null,null,null,null,null,null,null,null,null,null,null,null,null]},"neighborVisit":{"indices":[0,1,2,3,4,5,6,7,8,9,10,11,12],"conditions":[null,null,null,null,null,null,null,null,null,null,null,null,null]},"neighborWait":{"indices":[0,1,2,3,4,5],"conditions":[null,null,null,null,null,null]},"rNormal":{"indices":[0,1,2,3],"conditions":[null,null,null,null]},"rExcited":{"indices":[0,1,2,3],"conditions":[null,null,null,null]},"rShocked":{"indices":[0,1,2,3,4],"conditions":[null,null,null,null,null]},"rOblivious":{"indices":[0,1,2,3,4,5,6],"conditions":[null,null,null,null,null,null,null]},"rHugAsk":{"indices":[0,1,2,3,4,5,6],"conditions":[null,null,null,null,null,null,null]},"rHug":{"indices":[0,1,2,3,4,5,10,11],"conditions":[null,null,null,null,null,null,null,null]},"rSpace":{"indices":[0,1,2,3,4,8,9,10],"conditions":[null,null,null,null,null,null,null,null]},"rCatchup":{"indices":[0,1,2,3,4,5,6,7,8,9,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27],"conditions":[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null]},"rContact":{"indices":[0,1,2,3,4,5,6,7],"conditions":[null,null,null,null,null,null,null,null]},"rBusy":{"indices":[0,1,2,3,4,5],"conditions":[null,null,null,null,null,null]},"rNumber":{"indices":[0,1,2,3,4],"conditions":[null,null,null,null,null]},"rLater":{"indices":[0,1,2,3],"conditions":[null,null,null,null]},"rExchange":{"indices":[0,1,2,3,5,6,7,8,9,10],"conditions":[null,null,null,null,null,null,null,null,null,null]},"rLetters":{"indices":[0,1,2,3,4,5,6,7,8,9,10,11,12,17,18,19,20,22,24,25,26,27,28,29,30,31],"conditions":[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null]},"rBurning":{"indices":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21],"conditions":[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null]},"rReturn":{"indices":[0,1,2,3,4,5,6,7,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27],"conditions":[null,null,null,null,null,null,null,null,null,null,["greeting","shocked"],["greeting","oblivious"],["greeting","excited"],["greeting","normal"],null,null,null,null,null,null,null,null,null,null,null,null,null]},"rHelpBags":{"indices":[0,1,2,3,4,5,6,7],"conditions":[null,null,null,null,null,null,null,null]}};
function migrateRevisionTwo(s,story){
 if(!s || s.version!==VERSION || s.storyRevision>=2 || !story[s.node] || !Array.isArray(s.history) || !s.flags)return s;
 const position=(node,index)=>{
  const map=revisionOnePositions[node];if(!map || !Number.isInteger(index))return index;
  const oldVisible=map.conditions.map((condition,i)=>({condition,i})).filter(x=>!x.condition||s.flags[x.condition[0]]===x.condition[1]);
  const raw=oldVisible[index]?.i;if(raw===undefined)return index;
  const target=map.indices[raw];
  return Math.max(0,story[node].lines.slice(0,target+1).filter(l=>!l.if||s.flags[l.if[0]]===l.if[1]).length-1);
 };
 s.line=position(s.node,s.line);
 s.history=s.history.map(h=>{
  if(h.id.startsWith('choice:'))return h;
  const split=h.id.lastIndexOf(':'),node=h.id.slice(0,split),index=Number(h.id.slice(split+1));
  return {...h,id:node+':'+position(node,index)};
 });
 s.history=s.history.filter((h,i,all)=>all.findIndex(x=>x.id===h.id)===i);
 s.storyRevision=2;return refreshAuthoredHistory(s,story);
}

// The approved porch revision expands one childhood scene into several nodes.
// Translate old positions/history without resetting relationship or player data.
const oldPorchPositions=[
 ['rLetterPromise',0],['rLetterPromise',1],['rLetterPromise',15],['rLetterPromise',16],['rLetterPromise',7],
 ['rLetterPromise',11],['rLetterPromise',13],['rLetterPromise',18],['rLetterPromise',18],['rLetterPromise',18],
 ['rLetterPromise',19],['rLetterPromise',22],['rLetterPromise',23],['rLetterPromise',25],
 ['rPorchEnvelopes',1],['rLetterPromise',30],['rLetterPromise',26],['rLetterPromise',26],['rLetterPromise',27],['rLetterPromise',28],['rLetterPromise',37],
 ['rYellowPromise',11],['rYellowPromise',10],['rYellowPromise',1],['rYellowPromise',3],['rYellowPromise',11],
 ['rPorchEnvelopes',13],['rYellowPromise',4],['rYellowPromise',5],['rYellowPromise',6],['rYellowPromise',7],['rYellowPromise',8],['rYellowPromise',9],['rYellowPromise',12],['rYellowPromise',12],['rYellowPromise',2],['rYellowPromise',13]
];
function migrateRevisionThree(s,story){
 if(!s || s.version!==VERSION || !story[s.node] || !Array.isArray(s.history) || !s.flags)return s;
 if(!(s.storyRevision>=2))migrateRevisionTwo(s,story);
 if(s.storyRevision>=3)return s;
 const position=(node,line)=>node==='rLetterPromise'?(oldPorchPositions[line]||[node,line]):[node,line];
 [s.node,s.line]=position(s.node,s.line);
 s.history=s.history.map(h=>{
  if(h.id.startsWith('choice:'))return h;
  const split=h.id.lastIndexOf(':'),node=h.id.slice(0,split),line=Number(h.id.slice(split+1));
  if(node!=='rLetterPromise')return h;
  const [next,index]=position(node,line);return {...h,id:`${next}:${index}`};
 });
 s.history=s.history.filter((h,i,all)=>all.findIndex(x=>x.id===h.id)===i);
 s.storyRevision=3;return refreshAuthoredHistory(s,story);
}

// Revision four adds the letter-reading choice and continues beyond the old ending.
function migrateRevisionFour(s,story){
 if(!s || s.version!==VERSION || !story[s.node] || !Array.isArray(s.history) || !s.flags)return s;
 if(!(s.storyRevision>=3))migrateRevisionThree(s,story);
 if(s.storyRevision>=4)return s;
 if(!['now','later'].includes(s.flags.letterTiming))s.flags.letterTiming='later';
 if(s.node==='rBurning'&&s.line>=18){s.node='rAfterEnvelope';s.line=Math.min(s.line-18,3);}
 s.history=s.history.map(h=>{
  const match=/^rBurning:(\d+)$/.exec(h.id);
  return match&&Number(match[1])>=18?{...h,id:'rAfterEnvelope:'+Math.min(Number(match[1])-18,3)}:h;
 });
 if(s.node==='rInside')s.completed=false;
 s.storyRevision=4;return refreshAuthoredHistory(s,story);
}

// Old saves keep their route through the flashback they already entered.
export function nextStoryNode(story,state){
 if(state.flags.legacyReunionOrder){
  if(state.node==='rAfterEnvelope')return 'rReturn';
  if(state.node==='rInside')return 'rWater';
 }
 return story[state.node].next;
}
const revisionFourPositions={"journey":{"indices":[0,1,2,3,4,5,6,7,8,9,10,12,13,14,15,16,16,17,22,19,20,21,22,23,24,25,32,27,28,28,30,31,32,33,34,35,36,37,38,39],"conditions":[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null]},"driver":{"indices":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,25],"conditions":[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null]},"neighborVisit":{"indices":[0,1,2,3,4,5,6,7,8,9,10,11,12],"conditions":[null,null,null,null,null,null,null,null,null,null,null,null,null]},"rNormal":{"indices":[0,1,2,4,5],"conditions":[null,null,null,null,null]},"rShocked":{"indices":[0,1,2,3,4,5],"conditions":[null,null,null,null,null,null]},"rEmotion":{"indices":[4,5],"conditions":[null,null]},"rCry":{"indices":[0,1,2,3,4,6,7,8,9,10,11,12,13,14,15],"conditions":[null,null,null,["reunionBoundary","hug"],null,null,null,null,null,null,["reunionBoundary","hug"],["reunionBoundary","space"],null,null,null]},"rHold":{"indices":[0,1,2,2,3,4,3,5],"conditions":[null,null,["reunionBoundary","hug"],null,null,null,null,null]},"rCatchup":{"indices":[0,1,2,3,4,5,6,7,8,9,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,29],"conditions":[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null]},"rContact":{"indices":[0,1,2,4,3,4,5,9],"conditions":[null,null,null,null,null,null,null,null]},"rBusy":{"indices":[0,4,2,4,6,8],"conditions":[null,null,null,null,null,null]},"rNumber":{"indices":[0,1,1,4,6],"conditions":[null,null,null,null,null]},"rLater":{"indices":[0,2,1,5],"conditions":[null,null,null,null]},"rExchange":{"indices":[0,1,2,3,3,4,4,5,5,7,7,7],"conditions":[null,null,null,null,null,null,null,null,null,null,null,null]},"rLetterPromise":{"indices":[0,1,1,1,2,2,4,5,4,4,5,5,7,6,7,7,8,9,9,9,5,12,11,14,12,12,13,13,14,18,8,15,16,6,17,17,18,18,19,18,19],"conditions":[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null]},"rPorchEnvelopes":{"indices":[0,1,1,3,2,5,3,4,4,5,5,6,6,4,7],"conditions":[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null]},"rYellowPromise":{"indices":[0,1,2,3,4,5,6,7,9,10,9,1,13,14],"conditions":[null,null,null,null,null,null,null,null,null,null,null,null,null,null]},"rLetterYears":{"indices":[0,1,3,4,5,7,8],"conditions":[null,null,null,null,null,null,null]},"rPush":{"indices":[2,1,2,3,4,5,6,7,8],"conditions":[null,null,null,null,null,null,null,null,null]},"rQuiet":{"indices":[1,1,2,3,4,7,7,8],"conditions":[null,null,null,null,null,null,null,null]},"rLetters":{"indices":[7,8,35,4,5,10,11,12,12,11,1,15,16,17,2,21,20,21,22,32,24,26,27,28,21,24,30,29,34,8,37,38],"conditions":[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null]},"rBurning":{"indices":[0,1,2,3,4,5,5,6,12,7,8,10,11,12,13,13,14,15],"conditions":[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null]},"rReturn":{"indices":[0,1,17,3,3,4,6,7,18,5,6,7,8,9,10,11,12,17,19,20,21,3,21,22,23,24,25,26],"conditions":[null,null,null,null,null,null,null,null,null,null,null,["greeting","shocked"],["greeting","oblivious"],["greeting","excited"],["greeting","normal"],null,null,null,null,null,null,null,null,null,null,null,null,null]},"rHelpBags":{"indices":[0,1,2,2,3,5,2,5],"conditions":[null,null,null,null,null,null,null,null]},"rInside":{"indices":[0,1,2,5,7,8,10,12,14,15],"conditions":[null,null,null,null,null,null,null,null,null,null]},"rWater":{"indices":[0,1,3,2,1,2,3,4,5,6,7,8,9,10,11],"conditions":[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null]}};
export function migrateStorySave(s,story){
 if(!s || s.version!==VERSION || !story[s.node] || !Array.isArray(s.history) || !s.flags)return s;
 // The former ending is now a normal scene; preserve its exact reading position.
 if(s.node==='rLetterLaterAfter'&&story[s.node].next)s.completed=false;
 if(s.node==='d2Reveal'){s.line=Math.min(s.line,story.d2Reveal.lines.length-1);s.completed=false;}
 if(s.storyRevision>=5)return s;
 const currentText=s.history.find(h=>h.id===`${s.node}:${s.line}`)?.text;
 if(!(s.storyRevision>=4))migrateRevisionFour(s,story);
 const oldOrder=['rBedroom','rLanding','rPush','rQuiet','rLetters','rBurning','rEnvelope','rReadNow','rLetterNow','rReadNowAfter','rKeepSealed','rAfterEnvelope','rReturn','rThanks','rCaretaker','rTools','rBags','rOwnBags','rHelpBags','rInside'];
 if(oldOrder.includes(s.node))s.flags.legacyReunionOrder=true;
 if(!s.flags.yellowPromise){
  for(const [node,value] of [['rYellowLook','look'],['rYellowName','name'],['rYellowWords','words']]){
   if(s.node===node||s.history.some(h=>h.id.startsWith(node+':')))s.flags.yellowPromise=value;
  }
 }
 const position=(node,index)=>{
  const map=revisionFourPositions[node];
  if(!map)return Math.max(0,Math.min(index,visibleLines(story[node],s).length-1));
  const previous=map.conditions.map((condition,i)=>({condition,i})).filter(x=>!x.condition||s.flags[x.condition[0]]===x.condition[1]);
  const raw=previous[Math.min(index,previous.length-1)]?.i;
  const target=map.indices[raw]??0;
  return Math.max(0,story[node].lines.slice(0,target+1).filter(l=>!l.if||s.flags[l.if[0]]===l.if[1]).length-1);
 };
 s.line=position(s.node,s.line);
 const exact=currentText?visibleLines(story[s.node],s).findIndex(l=>interpolate(l.text,s)===currentText):-1;
 if(exact>=0)s.line=exact;
 s.history=s.history.map(h=>{
  if(h.id.startsWith('choice:')||h.id.startsWith('letter:'))return h;
  const split=h.id.lastIndexOf(':'),node=h.id.slice(0,split),index=Number(h.id.slice(split+1));
  return story[node]&&Number.isInteger(index)?{...h,id:node+':'+position(node,index)}:h;
 }).filter((h,i,all)=>all.findIndex(x=>x.id===h.id)===i);
 s.storyRevision=5;
 return refreshAuthoredHistory(s,story);
}
