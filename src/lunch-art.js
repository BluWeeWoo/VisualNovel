import {lineVisible} from './line-visibility.js';

// Presentation only: authored anchors also work when restoring a saved position.
const cues={
 c2LunchMeal:{from:'He sits across from me.',changes:[
  ['You spent a lot of time with her, huh?','attentive'],
  ['She’d feed me whether I helped or not.','relaxed'],
  ['She used to ask what you’d want to eat when you came ba—','wistful'],
  ['He notices.','worried'],['Hey, Ro?','attentive'],
  ['Yeah. Of course.','relaxed'],
  ['But I need to run to the market first. Is that okay? We can go after.','attentive']
 ]},
 c2Wait:{until:'After lunch, he picks up the shopping bags.',changes:[
  ['Right.','embarrassed'],['He shakes his head, smiling.','relaxed']
 ]},
 c2Market:{until:'We clean up and prepare to go to the market.',changes:[
  ['Another lutang moment. Haha. Sorry.','embarrassed'],
  ['He smiles and reaches for his glass.','relaxed'],['We can skip that.','attentive']
 ]},
 c2AloneGrave:{initial:'worried',until:'He reaches for the shopping bags.',changes:[
  ['No, no. It’s okay. I understand.','relaxed'],
  ['Well, I really wanted to come.','wistful'],['He gives me a small smile.','relaxed'],
  ['Do you still remember the cemetery?','attentive'],['Oh… yeah.','embarrassed']
 ]}
};
export const lunchCGKeys=['summer-lunch',...['attentive','wistful','worried','embarrassed'].map(e=>'summer-lunch-'+e)];
export function lunchCG(story,state){
 const cue=cues[state.node];if(!cue)return undefined;
 const lines=story[state.node].lines.filter(l=>lineVisible(l,state.flags));
 const start=cue.from?lines.findIndex(l=>l.text===cue.from):0;
 const end=cue.until?lines.findIndex(l=>l.text===cue.until):lines.length;
 if(start<0||end<0||state.line<start||state.line>=end)return null;
 let expression=cue.initial||'relaxed';
 for(const [anchor,next] of cue.changes){
  const index=lines.findIndex(l=>l.text===anchor);
  if(index>=start&&index<=state.line)expression=next;
 }
 return expression==='relaxed'?'summer-lunch':'summer-lunch-'+expression;
}
