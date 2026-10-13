import {reviseCasualChapterTwo} from './chapter-two-casual.js';
import {paceChapterTwo} from './chapter-two-pacing.js';
import {chapterTwoAfternoon} from './chapter-two-afternoon.js';
import {reviseChapterTwo} from './chapter-two-revision.js';
import {extendChapterTwo} from './chapter-two-father.js';
import {finishChapterTwo} from './chapter-two-ending.js';
import {repairedDoor,apprenticeshipConversation} from './carpentry-setup.js';
import {chapterTwo} from './chapter-two.js';
import {afterGarden} from './after-garden.js';
import {continuation} from './continuation.js';
import {dayTwo} from './day-two.js';
import {opening} from './opening.js';
import {legacyStory} from '../assets/legacy-story.js';
// Current route starts at journey; historical IDs remain loadable.
export const story={...legacyStory};
// Keep legacy IDs intact for saved games, but new games use the approved PDF opening.
Object.assign(story, opening);

Object.assign(story, continuation);
Object.assign(story, dayTwo);
delete story.rLetterLaterAfter.ending;
delete story.rLetterLaterAfter.openingEnd;
story.rLetterLaterAfter.next='d2Settling';
// Resume old recognition saves into the newly approved continuation.
delete story.recognition.ending; delete story.recognition.openingEnd; story.recognition.next='rGreeting';

Object.assign(story, afterGarden);
delete story.gAfter.ending; delete story.gAfter.openingEnd; story.gAfter.next='aWater';

Object.assign(story, chapterTwo, chapterTwoAfternoon);
story.rCatchup.lines.push(...repairedDoor);
for(const [id,node] of Object.entries(story))if(/^aTopic\d+_rowan_start$/.test(id))node.lines=apprenticeshipConversation.map(l=>({...l}));
// Chapter menu handles the transition; preserve Chapter One's ending and old saves.
story.aEnd.next='c2Start';
reviseChapterTwo(story);
extendChapterTwo(story);
finishChapterTwo(story);
paceChapterTwo(story);
reviseCasualChapterTwo(story);
// Authored puzzled reactions; these are questions, rather than distress.
for(const [id,text] of [
 ['c2KitchenAsk','About my dad?'],
 ['c2EndGoodbye','Huh? Who?']
]){
 const line=story[id].lines.find(l=>l.speaker==='Rowan'&&l.text===text);
 if(line)line.expression='confused';
}


// Adult Rowan's authored emotional beats. Keep dialogue and saved line positions intact.
for(const [id,text,expression] of [
 ['rNormal','It’s really good to see you.','relieved'],
 ['rOblivious','His smile comes back.','relieved'],
 ['rBusy','I wish I’d known.','downcast'],
 ['rBusy','I just missed you.','weak-smile'],
 ['rCry','Yeah.','relieved'],
 ['c2FatherPressure','He doesn’t answer.','downcast'],
 ['c2FatherPressure','Plus, {name}’s here. I want to make sure everything’s comfortable.','weak-smile'],
 ['c2FatherPressure','May choice pa ba ako, Ma?','downcast'],
 ['c2FatherPressure','His voice is quieter now.','downcast'],
 ['c2FatherPressure','I know that feeling.','downcast'],
 ['c2FatherPressure','Thank you. Sorry, Ma.','relieved'],
 ['c2KitchenAsk','You’d just got here. I didn’t want to burden you with my problems.','weak-smile'],
 ['c2EndSupport','Then came Lola’s funeral.','downcast'],
 ['c2EndSupport','He paid for everything. He helped take care of the arrangements, too.','downcast'],
 ['c2EndYourself','I… don’t know. I don’t want to give her more things to worry about.','downcast'],
 ['c2EndYourself','Thank you, {name}. For reminding me.','relieved'],
 ['c2EndSkip','Somehow, he looks disappointed.','downcast']
]){
 const line=story[id].lines.find(l=>l.text===text);
 if(line)line.expression=expression;
}

// Presentation metadata only: unlabelled rows narrate; Thought| marks silent MC thought.
// Named rows remain spoken. Written messages retain their existing phone/note presentation.
for (const node of Object.values(story)) for (const line of node.lines) {
  if (line.speaker === 'Thought') { line.speaker = ''; line.kind = 'thought'; }
  else line.kind ??= !line.speaker || / · (text|SG)$|^Phone$|note$/.test(line.speaker) ? 'narration' : 'spoken';
}
