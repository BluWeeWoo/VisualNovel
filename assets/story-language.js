// Presentation only: canonical story text remains unchanged for saves and CG cues.
import {english,taglish} from './story-translations.js';
let language='english';
export const normalizeLanguage=value=>value==='taglish'?'taglish':'english';
export function setLanguage(value){language=normalizeLanguage(value);}
export function getLanguage(){return language;}
export function translate(text,locale=language){
 const catalog=normalizeLanguage(locale)==='taglish'?taglish:english;
 if(Object.hasOwn(catalog,text))return catalog[text];
 // Quoted dialogue choices use the same approved wording as their spoken line.
 const match=/^“([^”]+)”(.*)$/.exec(text);
 if(match&&Object.hasOwn(catalog,match[1]))return `“${catalog[match[1]]}”${match[2]}`;
 return text;
}
export function translateRecorded(text,state){
 const direct=translate(text);
 if(direct!==text||!state?.name)return direct;
 const catalog=language==='taglish'?taglish:english;
 for(const source of Object.keys(catalog))if(source.includes('{name}')&&source.replaceAll('{name}',state.name)===text)return catalog[source].replaceAll('{name}',state.name);
 return text;
}
export function languageField(id='language'){
 return `<label for="${id}">Story language</label><select id="${id}" name="language"><option value="english" ${language==='english'?'selected':''}>English</option><option value="taglish" ${language==='taglish'?'selected':''}>Taglish</option></select><p class="small-note">English: English dialogue and narration, with cultural terms retained.<br>Taglish: natural English–Filipino dialogue with English narration.<br>Change anytime in Settings. Your place and choices stay the same.</p>`;
}
// Used only on mini-game text, never the story model or player-entered content.
export function localizeGameText(root){
 const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
 while(walker.nextNode()){
  const node=walker.currentNode,raw=node.nodeValue,trim=raw.trim();
  if(trim)node.nodeValue=raw.replace(trim,translate(trim));
 }
 for(const node of root.querySelectorAll('[aria-label]'))node.setAttribute('aria-label',translate(node.getAttribute('aria-label')));
}
