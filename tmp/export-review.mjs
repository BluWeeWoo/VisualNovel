import fs from 'node:fs';
import {story} from '../src/story.js';
import {translate} from '../assets/story-language.js';
import {rowansLetter} from '../src/continuation.js';
import {waveWords} from '../assets/nightmare.js';
import {cgCues} from '../src/staging.js';
const out=new URL('../docs/script-review/',import.meta.url);
const seen=new Set();
function visit(id){if(!id||seen.has(id))return;const n=story[id];if(!n)throw Error('Missing scene '+id);seen.add(id);visit(n.next);for(const c of n.choices||[])visit(c.next);}
visit('journey');
const titles={1:'Reunion at a familiar house',2:'Are we starting again or continuing where we left off?'};
const cell=s=>String(s).replaceAll('|','\\|').replaceAll('\n','<br>');
const speaker=s=>s==='You'?'MC':s.replace(/^You ·/,'MC ·');
function line(l,lang){const t=translate(l.text,lang);return l.kind==='thought'?`*${t}*`:l.speaker?`**${speaker(l.speaker)}:** ${t}`:t;}
const names=['English','Taglish','Bilingual'];
const stats=[];
for(const chapter of [1,2]){
 const nodes=Object.entries(story).filter(([id,n])=>seen.has(id)&&(n.chapter||1)===chapter);
 stats.push({chapter,scenes:nodes.length,lines:nodes.reduce((sum,[,n])=>sum+n.lines.length,0),choices:nodes.reduce((sum,[,n])=>sum+(n.choices?.length||0),0)});
 for(const mode of names){
 const bilingual=mode==='Bilingual',lang=mode.toLowerCase();
 let s=`# Chapter ${chapter} — ${titles[chapter]}\n\n## ${mode} editing copy\n\nExported from the current game on 4 October 2026. ${chapter===2?'**Chapter 2 is the complete currently implemented opening, not a finished full chapter.**':'Includes every branch of the currently playable Chapter 1.'}\n\nThis is an editing copy; changing it does not change the game automatically. Keep scene and line IDs when editing so revisions can be matched reliably. Scene sections follow source order; use the “Next” and choice destinations to follow a particular route. Alternative branches are not all played in a single run.\n\nNarration has no speaker label. MC’s silent thoughts are italicized. Spoken dialogue has a speaker label. Bracketed notes are implementation directions. Placeholders such as {name} remain for player customization. English narration shared by both modes is intentionally repeated. These are the translations currently used by the game, including any existing wording issues or fallback text, rather than a newly rewritten translation.\n\n`;
 for(const [id,n] of nodes){
 s+=`## ${n.title} [${id}]\n\n[Background: ${n.place}; time: ${n.time}${n.day?'; day: '+n.day:''}.]\n\n`;
 if(n.music!==undefined)s+=`[Music: ${n.music===null?'scene default':n.music}.]\n\n`;
 if(n.audio)s+=`[Audio direction: ${JSON.stringify(n.audio)}.]\n\n`;
 if(n.blackout)s+='[Blackout transition.]\n\n';
 if(n.rowan!==undefined)s+=`[Rowan sprite: ${n.rowan?(n.childhood?'childhood':'adult'):'hidden'}; CGs take precedence while visible.]\n\n`;
 const cg=cgCues[id]||n.cgCue;if(cg)s+=`[Existing CG: ${cg.key}. Begins at the line containing “${cg.from}”${cg.until?'; ends at the line containing “'+cg.until+'”':'; ends according to the scene transition'}.]\n\n`;
 if(n.cg)s+=`[Additional CG direction: ${JSON.stringify(n.cg)}.]\n\n`;
 if(n.nightmare)s+=`[Mandatory nightmare mini-game, wave ${n.nightmare}. ${n.nightmare===3?'Release at least three thoughts, then remain until the scripted overwhelm ends.':'Clear all ten thoughts to continue.'} Thought text is in the appendix.]\n\n`;
 if(n.minigame)s+=`[Gardening mini-game: ${JSON.stringify(n.minigame)}. Gameplay continues to the next scene when completed.]\n\n`;
 if(n.letter)s+='[Open Rowan’s letter; full text is in the appendix. Both letter-reading routes use the same letter.]\n\n';
 if(bilingual)s+='| Line / direction | English | Taglish |\n|---|---|---|\n';
 n.lines.forEach((l,i)=>{const note=[l.if?'Only if '+l.if[0]+' = '+JSON.stringify(l.if[1]):'',l.expression?'Expression: '+l.expression:''].filter(Boolean).join('; ');const ref=`${id}:${i}`;
 s+=bilingual?`| ${cell(ref+(note?' — '+note:''))} | ${cell(line(l,'english'))} | ${cell(line(l,'taglish'))} |\n`:`[${ref}${note?' · '+note:''}]\n\n${line(l,lang)}\n\n`;
 });
 if(bilingual)s+='\n';
 if(n.choices?.length){s+='### Player choices\n\n';n.choices.forEach((c,i)=>{s+=`**Choice ${i+1} [${id}:choice:${i}]**\n\n`;s+=bilingual?`- English: ${translate(c.text,'english')}\n- Taglish: ${translate(c.text,'taglish')}\n`:`${translate(c.text,lang)}\n`;s+=`\n[Continue at: ${c.next}.${c.if?' Available if: '+JSON.stringify(c.if)+'.':''}${c.set?' Saved choice / relationship flags: '+JSON.stringify(c.set)+'.':''}${c.state?' State effects: '+JSON.stringify(c.state)+'.':''}]\n\n`;});}
 if(n.next)s+=`**Next:** ${n.next}${n.ending?' (via the chapter-ending flow)':''}.\n\n`;
 if(n.ending||n.openingEnd)s+='[Current chapter/section ending. Future content may not yet be implemented.]\n\n';
 }
 s+='## Appendix — additional story text\n\n';
 const blocks=chapter===1?[['Rowan’s letter',rowansLetter]]:Object.entries(waveWords).map(([wave,words])=>['Nightmare wave '+wave,words]);
 for(const [title,lines]of blocks){s+=`### ${title}\n\n`;if(bilingual)s+='| # | English | Taglish |\n|---|---|---|\n';lines.forEach((text,i)=>{s+=bilingual?`| ${i+1} | ${cell(translate(text,'english'))} | ${cell(translate(text,'taglish'))} |\n`:`[${title}:${i}]\n\n${translate(text,lang)}\n\n`;});s+='\n';}
 fs.writeFileSync(new URL(`Chapter-${chapter}-${mode}.md`,out),s);
 }
}
fs.writeFileSync(new URL('README.md',out),`# Script editing pack\n\nCurrent playable Chapters 1 and 2, exported 4 October 2026. Chapter 2 contains only the implemented opening.\n\nUse **Chapter-1-Bilingual.md** and **Chapter-2-Bilingual.md** to compare both languages. Use the English and Taglish files for a cleaner, single-language editing copy.\n\n${stats.map(s=>`- Chapter ${s.chapter}: ${s.scenes} scene/branch sections, ${s.lines} story rows, ${s.choices} choices.`).join('\n')}\n\nAll ${seen.size} scene nodes reachable from a new summer are included exactly once in each relevant version. Older unreachable drafts retained for legacy saves are excluded. Rowan’s letter and all nightmare thought clouds are included in appendices. Runtime scene IDs and conditions are retained to make applying your edits safer. These files are review copies, not scripts the game loads. No game dialogue has been changed.\n`);
console.log(JSON.stringify(stats));
