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
  return { version: VERSION, name: name.trim().slice(0, 24) || 'Alex', pronouns,
    node: 'journey', line: 0, flags: {}, history: [], chat: [], chatTurns: 0,
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
  if (choice.state) Object.assign(state, choice.state);
  state.node = choice.next;
  state.line = 0;
  return state;
}
export function validSave(s, story) {
  return !!(s && s.version === VERSION && typeof s.name === 'string' && s.name.length <= 24 &&
    ['they','she','he'].includes(s.pronouns) && story[s.node] && Number.isInteger(s.line) && s.line >= 0 &&
    s.flags && typeof s.flags === 'object' && !Array.isArray(s.flags) &&
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
      const selected=node?.choices?.find(c=>Object.entries(c.set||{}).every(([k,v])=>s.flags[k]===v));
      return selected?{...h,text:interpolate(selected.text,s)}:h;
    }
    const split=h.id.lastIndexOf(':'),id=h.id.slice(0,split),index=Number(h.id.slice(split+1));
    const line=story[id]&&visibleLines(story[id],s)[index];
    return line?{...h,speaker:line.speaker||'',text:interpolate(line.text,s)}:h;
  });
  return s;
}
