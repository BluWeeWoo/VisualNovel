import {chapterTwoAfternoon} from './chapter-two-afternoon.js';
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

// Presentation metadata only: unlabelled rows narrate; Thought| marks silent MC thought.
// Named rows remain spoken. Written messages retain their existing phone/note presentation.
for (const node of Object.values(story)) for (const line of node.lines) {
  if (line.speaker === 'Thought') { line.speaker = ''; line.kind = 'thought'; }
  else line.kind ??= !line.speaker || / · (text|SG)$|^Phone$|note$/.test(line.speaker) ? 'narration' : 'spoken';
}
