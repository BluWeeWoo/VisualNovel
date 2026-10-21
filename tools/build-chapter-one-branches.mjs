// Compile the approved editorial passages into ordinary authored story data.
// Run manually after reviewing the draft; the game never reads draft files.
import fs from 'node:fs';
import {story} from '../src/story.js';
const doc=fs.readFileSync(new URL('../drafts/Chapter-1-Relationship-Revision-Editable.md',import.meta.url),'utf8');
const norm=s=>s.replace(/[‘’]/g,"'").replace(/[“”]/g,'"');
const cut=(s,a,b)=>{const i=norm(s).indexOf(norm(a));if(i<0)throw Error(a);const end=b?norm(s).indexOf(norm(b),i+a.length):s.length;if(end<0)throw Error(b);return s.slice(i+a.length,end);};
const rows=s=>s.split(/\r?\n/).map(s=>s.trim()).filter(s=>s&&!s.startsWith('—')&&!s.startsWith('[')&&!s.startsWith('#')&&!s.startsWith('**Choice')&&!s.startsWith('**Both')&&!s.startsWith('---')).map(s=>{
 const m=s.match(/^\*\*([^*]+):\*\*\s*(.*)$/);const thought=!m&&s.startsWith('*')&&!s.startsWith('**');
 return {speaker:m?m[1].replace(/^MC/,'You'):'',text:(m?m[2]:thought?s.slice(1,-1):s).replaceAll('[MC]','{name}'),kind:thought?'thought':m?'spoken':'narration',...(m?.[1]==='Rowan'?{expression:'smile'}:{})};
});
const defs={};
const choice=(text,next,set={})=>({text,next,set});
function add(id,base,text,next,choices,extra={}){defs[id]={base,lines:rows(text),...(next?{next}:{}),...(choices?{choices}:{}),...extra};}
function copy(id,base,next,extra={}){defs[id]={base,lines:structuredClone(story[base].lines),...(next?{next}:{}),...extra};}
const opening=cut(doc,'## Going to Saint Luis','## 1. Lock-repair reunion');
const levels=['Uncertain','Familiar','Drawn to You','In Love'];
const keys=['uncertain','familiar','drawn','love'];
for(let i=0;i<4;i++){
 const part=cut(opening,'### '+levels[i],i<3?'### '+levels[i+1]:'### Shared convergence');
 const prefix=story.journey.lines.slice(0,8);
 const family=story.journey.lines.slice(story.journey.lines.findIndex(l=>l.text.startsWith('Two years ago')),story.journey.lines.findIndex(l=>l.text==='Lola’s house needs cleaning. A few things probably need fixing.')+1);
 const tail=story.journey.lines.slice(story.journey.lines.findIndex(l=>l.speaker==='Conductor'));
 add('rbJourney_'+keys[i],'journey','', 'busBump',null,{audioSource:'journey',continuation:false});
 defs['rbJourney_'+keys[i]].lines=[...prefix,...rows(cut(part,'#### Bus window','#### Before the conductor')), {speaker:'',text:'Then I remember the last time I asked to make this trip.',kind:'narration'},...family,...rows(cut(part,'#### Before the conductor calls','#### On the hill')),...tail];
 const hill=story.hill.lines;
 add('rbHill_'+keys[i],'hill','',null,story.hill.choices,{audioSource:'hill',continuation:false});
 defs['rbHill_'+keys[i]].lines=[...hill.slice(0,2),...rows(cut(part,'#### On the hill','#### Passing')),...hill.slice(hill.findIndex(l=>l.text==='I can’t remember the last thing I said to her.'))];
 const pass=cut(part,i===0?'#### Passing the neighboring houses':'#### Passing Rowan’s house');
 add('rbPass_'+keys[i],'otherDoor',pass.split('[Do not')[0].split('[No knock')[0].split('[At recognition')[0],'doorRepair',null,{audioSource:'otherDoor',continuation:false});
}
const reunion=cut(doc,'## 1. Lock-repair reunion','## 2. Contact');
for(let i=0;i<4;i++){
 const part=cut(reunion,'### '+levels[i],i<3?'### '+levels[i+1]:'### Practical catch-up');
 if(i<2)add('rbReunion_'+keys[i],'rNormal',part,'rbPractical');
 else{
  add('rbReunion_'+keys[i],'rNormal',part.split('**Choice A')[0],null,[choice(i===2?'Come here.':'Step into his arms.','rbHug_'+keys[i],{reunionBoundary:'hug'}),choice('Give me a second to put my bags down.','rbSpace_'+keys[i],{reunionBoundary:'space'})]);
  add('rbHug_'+keys[i],'rHug',cut(part,'**Choice A', '**Choice B').split('**').slice(1).join('**'),'rbCatch_'+keys[i]);
  add('rbSpace_'+keys[i],'rSpace',cut(part,'**Choice B','**Both choices rejoin:**').split('**').slice(1).join('**'),'rbCatch_'+keys[i]);
  add('rbCatch_'+keys[i],'rCatchup',cut(part,'**Both choices rejoin:**'),'rbPractical');
 }
}
add('rbPractical','rCatchup',cut(reunion,'### Practical catch-up — shared'),'rContact');
const contact=cut(doc,'## 2. Contact','## 3. Entering');
add('rbContactLow','rExchange',cut(contact,'### Uncertain / Familiar — brief exchange','### Drawn'), 'rLetterPromise');
add('rbContactReturn','rReturn',cut(contact,'### Shared return to the present'),'rbStay');
add('rbContactPresent','rReturn',"I enter his number. My phone lights up.\n\n**Rowan · text:** It's Rowan.\n\n**MC:** Got it. Thanks.",'rbLowBags');
// Source metadata supplies backgrounds/music, but obsolete CG cues are not inherited.
const inside=cut(doc,'## 3. Entering','## 4. Manila');
add('rbLetterBrief','rInside',cut(inside,'### Uncertain — brief letter conversation before leaving','### Uncertain / Familiar'),'rbLeave',null,{rowan:true,time:'day',music:'lost-contact'});
add('rbStay','rBags',`**Rowan:** Want some company while you settle in?`,null,[choice('Stay a little.','rBags',{rbStayed:true}),choice('I need to rest first.','rbLeave',{rbStayed:false})]);
add('rbLowBags','rBags','**Rowan:** Want help getting your bags inside?',null,[choice('Yeah. Could you take this one?','rbBagHelp',{bagHelp:true,rbStayed:false}),choice("I’ve got them, thanks.",'rbBagOwn',{bagHelp:false,rbStayed:false})]);
add('rbBagHelp','rInside','He carries the bag I offer to the spot I point out.\n\n**MC:** Thanks.\n\n**Rowan:** No problem.','rbLowInside');
add('rbBagOwn','rInside',"**Rowan:** Okay. I’ll hold the door.",'rbLowInside');
add('rbLowInside','rInside',cut(inside,'**Both choices rejoin:**','**Uncertain departure:**'),'rbLeave');
add('rbLeave','rInside','**Rowan:** I’ll head home. Let you settle in.\n\n**MC:** Okay. Thanks again.\n\n**Rowan:** See you around.\n\nHe takes his tools and leaves.','rbEnvelopeSolo');
add('rbEnvelopeSolo','rInside','I set my bag beside Lola’s chair and check the inside pocket.\n\nMy cards are still there.\n\nSo is the yellow envelope.\n\nI take it out. The last time I held it like this, I was standing in my room in Manila.','rBedroom',null,{rowan:false});
add('rbWaterSolo','rWater',cut(doc,'### Rowan has already left — any state','### Rowan stayed — Drawn'),'rLetterLater',null,{rowan:false});
copy('rbLetterAfter','rLetterLaterAfter','d2Settling',{rowan:false});
defs.rbLetterAfter.lines=defs.rbLetterAfter.lines.filter(l=>!l.text.startsWith('This time, he’s downstairs')&&!l.text.startsWith('I don’t have to put'));
defs.rbLetterAfter.lines.push({speaker:'',text:'This time, I know where to find him. When I’m ready.',kind:'thought'});
const evening=cut(doc,'## 6. First evening','## 7. Next morning');
add('rbEveningSolo','d2Settling',cut(evening,'### Uncertain / Familiar / any route where Rowan left','**Choice A'),null,[choice('Send a brief message.','rbEveningText'),choice('Put the phone away.','rbSleep')],{rowan:false});
add('rbEveningText','d2Settling',cut(evening,'**Choice A — Send a brief message.**','**Choice B'),'rbSleep',null,{rowan:false});
add('rbSleep','d2FallingAsleep','I lie back. The fan turns with a faint, uneven click.\n\nOutside, someone calls a child home. A gate closes.\n\n*Ordinary sounds. I missed them.*\n\n**MC:** I’m really here.\n\n*Saint Luis. My old room.*\n\nEverything is familiar. It’s me I’m still trying to get used to.\n\nI pull the blanket over my waist and turn toward the breeze.\n\n*Tomorrow can have the questions.*','d2Morning',{},{rowan:false});
delete defs.rbSleep.choices;
add('rbGoodnightDrawn','d2Goodnight','I yawn before I can finish my sentence.\n\n**Rowan:** Okay. You need sleep.\n\n**MC:** Apparently.\n\n**Rowan:** I’ll lock up before I head home.\n\n**MC:** Thanks, Ro.\n\n**Rowan:** It was good seeing you today.\n\n**MC:** You too.\n\nHe lingers for a second, then smiles and steps away.','rbSleep');
add('rbGoodnightLove','d2Goodnight','**Rowan:** I’ll lock up before I head home. Goodnight, sunshine.\n\n**MC:** Still calling me that?\n\n**Rowan:** If you still like it.',null,[choice('I do.','rbNicknameYes',{rbNickname:true}),choice('Just {name} tonight.','rbNicknameNo',{rbNickname:false})]);
add('rbNicknameYes','d2Goodnight','**Rowan:** Good. Sleep well.\n\nHis footsteps retreat down the stairs.','rbSleep');
add('rbNicknameNo','d2Goodnight','**Rowan:** Okay. Goodnight, {name}.\n\nHis footsteps retreat down the stairs.','rbSleep');
const uncertain=cut(doc,'## 8. Second visit — Uncertain','## 9. Second visit');
add('rbVisit_uncertain','rNormal','I get dressed and head downstairs.\n\nA few minutes later, someone knocks.\n\n'+uncertain.split('### Choice A')[0],null,[choice('Want to stay and catch up?','rbVisitShort',{rbVisitAccepted:true,rbGroceries:true}),choice('Thanks. I’ll see you around.','rbVisitLeave',{rbGroceries:true,rbVisitAccepted:false})],{day:2,dayTwo:true});
add('rbVisitShort','aWater',cut(uncertain,'### Choice A — “Want to stay and catch up?”','### Choice B'),'rbSolo');
add('rbVisitLeave','rNormal',cut(uncertain,'### Choice B — “Thanks. I’ll see you around.”'),'rbSolo',{},{day:2,dayTwo:true});delete defs.rbVisitLeave.choices;
const familiar=cut(doc,'## 9. Second visit — Familiar','## 10. Second visit');
add('rbVisit_familiar','rNormal','A knock comes from the front door.\n\n'+familiar.split('### Choice A')[0],null,[choice('Sure. You take that side.','rbWaterPlants',{rbGroceries:true,rbVisitAccepted:true}),choice('I’ve got it, but thanks.','rbFamiliarLeave',{rbGroceries:true,rbVisitAccepted:false})],{day:2,dayTwo:true});
add('rbWaterPlants','gCare',cut(familiar,'### Choice A — “Sure. You take that side.”','### Choice B'),'rbBreak');
add('rbFamiliarLeave','rNormal',cut(familiar,'### Choice B — “I’ve got it, but thanks.”','### Optional'),'rbSolo',null,{day:2,dayTwo:true});
add('rbBreak','aWater',cut(familiar,'### Optional short break — after watering','**Choice A'),null,[choice('Want some water before you go?','rbBriefTalk',{rbApprenticeship:true}),choice('Okay. See you around.','rbVisitLeave')]);
add('rbBriefTalk','aWater',cut(familiar,'**Choice A — “Want some water before you go?”**','**Choice B'),'rbSolo');
const close=cut(doc,'## 10. Second visit — Drawn','## 11. Afternoon');
add('rbVisit_drawn','rNormal','A knock comes from the front door.\n\n'+cut(close,'[Proposed adjustment: Rowan knocks before entering. This keeps breakfast and gardening without assuming house-entry permission.]','**Choice A'),null,[choice('Yeah. Come in.','rbCook',{rbVisitAccepted:true,rbGroceries:true}),choice('Thanks, but I need the morning to myself.','rbMorningLeave',{rbVisitAccepted:false,rbGroceries:true})],{day:2,dayTwo:true});
defs.rbVisit_love=structuredClone(defs.rbVisit_drawn);
add('rbMorningLeave','rNormal',cut(close,'**Choice B — “Thanks, but I need the morning to myself.”**','### Breakfast preparation'),'rbSolo',null,{day:2,dayTwo:true});
add('rbCook','gBreakfastTogether',cut(close,'### Breakfast preparation','[Keep the current garden greeting'),'d2Garden');
add('rbBreakfastInvite','gBreakfastInvite','**MC:** Breakfast’s ready.\n\n**Rowan:** Right. I got distracted.\n\n**MC:** By weeds?\n\n**Rowan:** I was checking the labels.\n\nHe brushes his hands off and follows me inside.','rbBreakfast');
copy('rbBreakfast','gBreakfastTogether','rbBreakfastBeat');defs.rbBreakfast.lines=defs.rbBreakfast.lines.slice(defs.rbBreakfast.lines.findIndex(l=>l.text.startsWith('I try the rice first')));
add('rbBreakfastBeat_drawn','gBreakfastTogether',cut(close,'### Additional breakfast beat — Drawn to You','### Additional breakfast beat — eligible'),'gRemember');
add('rbBreakfastBeat_love','gBreakfastTogether',cut(close,'### Additional breakfast beat — eligible In Love','### Gardening'),'gRemember');
add('rbGardenDecline','gDecline',cut(close,'### Replacement for declining the rematch','### Comfort choice'),'gAfter');
const afternoon=cut(doc,'## 11. Afternoon routes','## 12. Evening goodbye');
add('rbSolo','aPassing','I put the groceries away.\n\nThere’s still a lot to do, but I choose one small thing: clearing the table.\n\nWhen I finish, I turn on the television.','rbSoloNews',null,{rowan:false,time:'day'});
add('rbSoloNews','aNews',`**Newsreader · TV:** Nicolas Sanchez took office as mayor of Saint Luis this morning, following his election earlier this year. His father, the former mayor, attended the ceremony after retiring from public office.\n\n**MC:** Mayor Sanchez retired?\n\nI remember the older mayor. I don’t recognize his son.`,'rbSoloRest',null,{rowan:false});
add('rbSoloRest','aPassing','I lower the volume.\n\nThere’s dust behind the picture frames. A drawer full of old receipts. A window that takes two tries to close.\n\nI stop when I get tired.\n\n*We don’t have to fit twelve years into one visit.*',null,[choice('Ask about the workshop.','rbWorkshopText',{rbApprenticeship:true}),choice('Ask about talking another time.','rbLolaText'),choice('Leave the phone alone.','rbBedroom')],{rowan:false});
add('rbWorkshopText','aBedroom',cut(afternoon,'**MC · text:** How’s the work at Mang Nestor’s going?','**Choice B'),'rbBedroom',null,{rowan:false,place:'living',time:'day',title:'An afternoon message'});
defs.rbWorkshopText.lines.unshift(...rows('**MC · text:** How’s the work at Mang Nestor’s going?'));
add('rbLolaText','aBedroom',cut(afternoon,'**Choice B — Ask about talking another time.**','**Choice C'),'rbBedroom',null,{rowan:false,place:'living',time:'day',title:'An afternoon message'});
add('rbAfternoonInvite','aEvening','**Rowan:** I should probably check the time. Do you want some space?',null,[choice('You can stay a bit longer.','aEvening',{rbSharedDay:true}),choice('Yeah. I think I need a quiet afternoon.','rbAfternoonLeave',{rbSharedDay:false})]);
add('rbAfternoonLeave','aEvening',cut(afternoon,'**Choice B — “Yeah. I think I need a quiet afternoon.”**'),'rbSolo');
const goodbye=cut(doc,'## 12. Evening goodbye','## 13. Bedroom');
add('rbGoodbye_drawn','aGoodnight',cut(goodbye,'### Drawn to You','### In Love'),'rbBedroom');
const love=cut(goodbye,'### In Love — mutual feelings established');
add('rbGoodbye_love','aGoodnight',love.split('**Choice A')[0],null,[choice('Take his hand for a moment.','rbGoodbyeHand'),choice('Go on. I’ll see you later.','rbGoodbyeWave')]);
add('rbGoodbyeHand','aGoodnight',cut(love,'**Choice A — Take his hand for a moment.**','**Choice B'),'rbBedroom');
add('rbGoodbyeWave','aGoodnight',cut(love,'**Choice B — “Go on. I’ll see you later.”**'),'rbBedroom');
add('rbBedroom','aBedroom','Upstairs, I change and sit on the edge of the bed.\n\n**MC:** Hay. Pagod.\n\nI plug in my phone and pull the blanket over my legs.','rbNightMessage',null,{rowan:false});
for(const [k,t] of Object.entries({uncertain:'Hope you got settled okay. Goodnight.',familiar:'Good catching up today. Sleep well.',drawn:'Glad we got today. Goodnight, {name}.',love:'Goodnight, {name}. Miss you already.',solo:'Hope you had a restful day. Goodnight, {name}.'})){
 add('rbMessage_'+k,'aBedroom','**Rowan · text:** '+t,null,[choice('Reply.','rbReply_'+k),choice('Put the phone away.','rbTomorrow')],{rowan:false});
 add('rbReply_'+k,'aReply','**MC · text:** '+(k==='love'?'You’re across the street. But yeah. Me too.':k==='drawn'?'Glad we got today too. Goodnight, Ro.':'Thanks. Goodnight, Rowan.'),'rbTomorrow',null,{rowan:false});
}
add('rbNightQuiet','aBedroom','The screen stays dark. I set my phone beside the bed.','rbTomorrow',null,{rowan:false});
add('rbTomorrow','aTomorrowChoice','The fan clicks above me.\n\nFor the first time since arriving, I try to picture tomorrow.',null,[choice('There are things I still want to ask him.','rbTomorrowQuestions',{tomorrowHope:'questions'}),choice('I’d like to spend some time together.','rbTomorrowTogether',{tomorrowHope:'together'}),choice('Tomorrow, I need a little time for myself.','aTomorrowAlone',{tomorrowHope:'myself'})],{rowan:false});
add('rbTomorrowQuestions','aTomorrowQuestions','There’s a lot I don’t know about the life he built while I was gone.\n\nI don’t have to ask everything at once.','aEnd',null,{rowan:false});
add('rbTomorrowTogether','aTomorrowTogether','Maybe we could spend a little time together. See where it goes.','aEnd',null,{rowan:false});
// The later approved Uncertain edit supersedes only that route's shared passages.
const uncertainRevision=fs.readFileSync(new URL('../drafts/Chapter-1-Uncertain-Approved.md',import.meta.url),'utf8');
const revised=Object.fromEntries([...uncertainRevision.matchAll(/^## (\w+)\r?\n([\s\S]*?)(?=^## |$(?![\s\S]))/gm)].map(m=>[m[1],rows(m[2])]));
for(const id of ['rbMorningPauseUncertain','rbMorningDownUncertain'])defs[id]={base:'d2GetUp',lines:[],next:'rbVisit_uncertain',rowan:false};
defs.rbDuskUncertain={base:'aPassing',lines:[],next:'rbBedroom',rowan:false,time:'evening'};
const clones={rbPracticalUncertain:'rbPractical',rbContactUncertain:'rbContactLow',rbInsideUncertain:'rbLowInside',rbLeaveUncertain:'rbLeave',rbEveningUncertain:'rbEveningSolo',rbEveningTextUncertain:'rbEveningText',rbVisitLeaveUncertain:'rbVisitLeave',rbSoloUncertain:'rbSolo',rbRestUncertain:'rbSoloRest'};
for(const [id,base] of Object.entries(clones))defs[id]=structuredClone(defs[base]);
for(const [id,lines] of Object.entries(revised))if(defs[id])defs[id].lines=lines;
const journey=defs.rbJourney_uncertain.lines;
defs.rbJourney_uncertain.lines=[...revised.journeyStart,...journey.slice(journey.findIndex(l=>l.text==='Then I remember the last time I asked to make this trip.'),journey.findIndex(l=>l.text==='I check the pocket where I put the house key.')),...revised.journeyEnd,...journey.slice(journey.findIndex(l=>l.speaker==='Conductor'))];
defs.rbInsideUncertain.next='rbLetterBrief';
defs.rbRestUncertain.time='day';
defs.rbInsideUncertain.rowan=true;
defs.rbInsideUncertain.time='day';
defs.rbInsideUncertain.music='back-together';
defs.rbLeaveUncertain.rowan=true;
defs.rbLeaveUncertain.next='rbEveningUncertain';
for(const id of ['rbPracticalUncertain','rbContactUncertain','rbInsideUncertain','rbLetterBrief','rbLeaveUncertain'])defs[id].lines=defs[id].lines.map(l=>l.speaker==='Rowan'?{...l,expression:'neutral'}:l);
fs.writeFileSync(new URL('../src/chapter-one-branch-data.js',import.meta.url),'// Authored from the approved Chapter 1 proposal and Uncertain revision.\nexport const branchData='+JSON.stringify(defs,null,2)+';\n');
console.log('Compiled '+Object.keys(defs).length+' Chapter 1 passages.');
