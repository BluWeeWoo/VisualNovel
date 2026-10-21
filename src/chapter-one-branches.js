import {branchData} from './chapter-one-branch-data.js';
import {normalizeRowanFeeling} from '../assets/player-identity.js';

const keys={'Uncertain':'uncertain','Familiar':'familiar','Drawn to You':'drawn','In Love':'love'};
function snapshot(state,scene,interior=false){
 const flag='rbScene_'+scene;
 if(!state.flags[flag]){
  let level=normalizeRowanFeeling(state.flags.rowanFeeling);
  // Starting feelings, friendship commitment, and comforting touch are not reciprocation.
  if(!interior&&level==='In Love'&&state.flags.relationship!=='romance')level='Drawn to You';
  state.flags[flag]=keys[level];
 }
 return state.flags[flag];
}
export function chapterOneTarget(target,state){
 if(!state.flags.chapterOneBranches)return target;
 const f=state.flags;
 const reunionVariants={rbPractical:'rbPracticalUncertain',rbContactLow:'rbContactUncertain',rbLowInside:'rbInsideUncertain',rbLeave:'rbLeaveUncertain',rbEveningSolo:'rbEveningUncertain',rbEveningText:'rbEveningTextUncertain'};
 const visitVariants={rbVisitLeave:'rbVisitLeaveUncertain',rbSolo:'rbSoloUncertain',rbSoloRest:'rbRestUncertain'};
 if(reunionVariants[target]&&snapshot(state,'reunion')==='uncertain')return reunionVariants[target];
 if(visitVariants[target]&&snapshot(state,'visit')==='uncertain')return visitVariants[target];
 if(target==='journey')return 'rbJourney_'+snapshot(state,'journey',true);
 if(target==='hill')return 'rbHill_'+snapshot(state,'journey',true);
 if(target==='otherDoor')return 'rbPass_'+snapshot(state,'journey',true);
 if(target==='rGreeting')return 'rbReunion_'+snapshot(state,'reunion');
 if(target==='rContact'&&snapshot(state,'reunion')==='uncertain')return 'rbContactUncertain';
 if(target==='rContact'&&snapshot(state,'reunion')==='familiar')return 'rbContactLow';
 if(target==='rLetterPromise'&&snapshot(state,'reunion')==='uncertain')return 'rbContactPresent';
 if(target==='rbLeave'&&state.node==='rbLowInside'&&snapshot(state,'reunion')==='uncertain')return 'rbLetterBrief';
 if(target==='rCatchup')return 'rbPractical';
 if(target==='rReturn')return 'rbContactReturn';
 if(target==='rbStay'&&['uncertain','familiar'].includes(snapshot(state,'reunion')))return 'rbLowBags';
 if(target==='rbLeave'&&snapshot(state,'reunion')==='familiar')return 'rbLeave_familiar';
 if(['rbEveningText','rbEveningTextUncertain','rbWorkshopText','rbLolaText'].includes(state.node))f.rbSentMessage=true;
 if(target==='rWater'&&!f.rbStayed)return 'rbWaterSolo';
 if(target==='rLetterLaterAfter'&&!f.rbStayed)return 'rbLetterAfter';
 if(target==='d2Settling'&&!f.rbStayed)return 'rbEveningSolo';
 if(target==='d2Goodnight')return snapshot(state,'reunion')==='love'?'rbGoodnightLove':'rbGoodnightDrawn';
 if(target==='d2FallingAsleep')return 'rbSleep';
 if(target==='d2Stay'||target==='d2Down'){
  const level=snapshot(state,'visit');
  if(level==='uncertain')return target==='d2Stay'?'rbMorningPauseUncertain':'rbMorningDownUncertain';
  return 'rbVisit_'+level;
 }
 if(target==='rbBedroom'&&state.node!=='rbDuskUncertain'&&snapshot(state,'visit')==='uncertain')return 'rbDuskUncertain';
 if(target==='gBreakfastInvite')return 'rbBreakfastInvite';
 if(target==='rbBreakfastBeat')return 'rbBreakfastBeat_'+snapshot(state,'visit');
 if(target==='gDecline')return 'rbGardenDecline';
 if(target==='gPlay')f.rbGardenPlayed=true;
 if(target==='aPorchQuestions')f.rbNewsTogether=true;
 if(/^aTopics\d+$/.test(target))return 'rbTopics'+target.slice(7);
 if(target==='aEvening'&&state.node!=='rbAfternoonInvite')return 'rbAfternoonInvite';
 if(target==='aGoodnight')return 'rbGoodbye_'+snapshot(state,'visit');
 if(target==='aBedroom')return 'rbBedroom';
 if(target==='rbSoloNews'&&f.rbNewsTogether)return 'rbSoloRest';
 if(target==='rbSoloRest'&&f.rbApprenticeship&&state.node!=='rbSoloKnown')return 'rbSoloKnown';
 if(target==='rbNightMessage'){
  const k=snapshot(state,'visit');
  if(k==='uncertain'&&!f.rbVisitAccepted&&!f.rbSentMessage)return 'rbNightQuiet';
  if(!f.rbVisitAccepted)return 'rbMessage_solo';
  if(['drawn','love'].includes(k)&&!f.rbSharedDay)return 'rbMessage_solo';
  return k==='love'&&f.rbNickname?'rbMessage_loveNickname':'rbMessage_'+k;
 }
 // Consent and knowledge changes live in new nodes; old saves keep their authored positions.
 if(/^aTopic\d+_lola_sad$/.test(target))return 'rbSad_'+target;
 if(/^aTopic\d+_lola_hand$/.test(target))return 'rbHand_'+target;
 if(/^aTopic\d+_lola_blame$/.test(target))return 'rbBlame_'+target;
 return target;
}

export function installChapterOneBranches(story){
 for(const [id,{base,...data}] of Object.entries(branchData)){
  const {choices,next,ending,openingEnd,cg,cgCue,letter,minigame,...visuals}=story[base];
  story[id]={...visuals,...structuredClone(data)};
  // These placeholders are resolved at entry, but explicit edges remain graph-valid.
 }
 story.rbCatch_drawn.next='rbEmotion';
 story.rbCatch_love.next='rbEmotion';
 story.rbEmotion={...story.rEmotion,choices:story.rEmotion.choices.map(c=>({...c,next:c.next==='rCry'?'rbCry':'rbHold'}))};
 story.rbCry={...story.rCry,next:'rbPractical',lines:story.rCry.lines.filter(l=>l.if?.[0]!=='reunionBoundary')};
 story.rbHold={...story.rHold,next:'rbPractical',lines:story.rHold.lines.filter(l=>l.if?.[0]!=='reunionBoundary')};
 story.rbReunion_uncertain.lines.unshift({speaker:'',text:'I hadn’t expected to find him here.',kind:'thought'});
 story.rbLowInside.rowan=true;
 story.rbLeave.rowan=true;
 story.rbLeave_familiar={...story.rbLeave,lines:[{speaker:'Rowan',text:'I should get going. It was good catching up.',expression:'smile'},{speaker:'You',text:'Yeah. Thanks for helping.'},{speaker:'Rowan',text:'Anytime. Get some rest.'},{speaker:'',text:'He takes his tools and leaves.'}]};
 for(const id of ['rbReunion_uncertain','rbContactLow','rbVisit_uncertain'])story[id].lines=story[id].lines.map(l=>l.speaker==='Rowan'?{...l,expression:/good to see|Good timing/i.test(l.text)?'weak-smile':'neutral'}:l);
 story.rbMessage_loveNickname={...story.rbMessage_love,lines:[{speaker:'Rowan · text',text:'Goodnight, sunshine. Miss you already.',kind:'narration'}]};
 story.rbCook.place='living';
 story.rbLowInside.time='day';
 story.rbLowInside.music='back-together';
 story.rbVisitShort.lines=story.rbVisitShort.lines.map(l=>l.speaker==='Rowan'&&/head|stay|catch/i.test(l.text)?{...l,expression:'neutral'}:l);
 story.rbSoloKnown={...story.rbSoloRest,choices:story.rbSoloRest.choices.filter(c=>c.next!=='rbWorkshopText')};
 // Give the closer routes a deliberate exit after any porch topic.
 for(const [id,n] of Object.entries(story))if(/^aTopics\d+$/.test(id)){
  story['rbTopics'+id.slice(7)]={...n,choices:[...n.choices,{text:'I need a little time to myself.',next:'rbAfternoonLeave',set:{rbSharedDay:false}}]};
 }
 // Placeholder edges also remain valid for static tooling and malformed/old saves.
 story.rbBreakfastBeat={...story.rbBreakfastBeat_drawn};
 story.rbNightMessage={...story.rbNightQuiet};
 // Keep all historical optional topics; only remove automatic present-day touch.
 for(const [id,node] of Object.entries(story)){
  if(/^aTopic\d+_lola_sad$/.test(id)){
   story['rbSad_'+id]={...node,lines:[{speaker:'You',text:'Lola…'},{speaker:'',text:'My voice gives out. Rowan stays beside me.'},{speaker:'Rowan',text:'Want my hand?',expression:'concerned'}],choices:[{text:'Take it.',next:'rbComfort_'+id},{text:'Shake my head.',next:'rbNoTouch_'+id}]};
   delete story['rbSad_'+id].next;
   story['rbComfort_'+id]={...node,lines:[{speaker:'',text:'He holds my hand while I collect myself.'},{speaker:'Rowan',text:'You didn’t know, {name}.',expression:'concerned'}]};
   story['rbNoTouch_'+id]={...node,lines:[{speaker:'',text:'He nods and stays close without touching me.'},{speaker:'Rowan',text:'You didn’t know, {name}.',expression:'concerned'}]};
  }
  if(/^aTopic\d+_lola_hand$/.test(id))story['rbHand_'+id]={...node,lines:[{speaker:'',text:'I hold out my hand.'},{speaker:'You',text:'Is this okay?'},{speaker:'',text:'He nods and takes it. We sit quietly for a while.'}]};
  if(/^aTopic\d+_lola_blame$/.test(id))story['rbBlame_'+id]={...node,lines:node.lines.map(l=>l.text.startsWith('You asked where the letters')?{...l,text:'They should have told you how sick she was.'}:l)};
 }
 // The player has not necessarily gardened or heard about the apprenticeship.
 // Gate only the new-run versions so existing histories retain their line positions.
 for(const [id,node] of Object.entries(story)){
  if(!id.startsWith('c2'))continue;
  for(let i=0;i<node.lines.length;i++){
   const l=node.lines[i];
   if(l.text==='The patch we worked on yesterday looks better. I crouch beside the next one and push a leaf out of the way.'){
    l.conditions=[...(l.conditions||[]),['chapterOneBranches',true,true]];
    node.lines.splice(++i,0,{...l,conditions:[['chapterOneBranches',true],['rbGardenPlayed',true]],text:l.text},{...l,conditions:[['chapterOneBranches',true],['rbGardenPlayed',true,true]],text:'There are weeds along the far side of the garden. I crouch beside a pot and push a leaf out of the way.'});i++;
   }
   if(l.text==='Lola really did teach you. First the tapa, now this. You’re on a roll, Ro.'){
    l.conditions=[...(l.conditions||[]),['chapterOneBranches',true,true]];
    node.lines.splice(++i,0,{...l,conditions:[['chapterOneBranches',true]],text:'This is really good, Ro.'});
   }
  }
 }
}
