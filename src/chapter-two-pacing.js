// Approved pacing pass: English-led dialogue with light Taglish.
export function paceChapterTwo(story){
 const parse=text=>text.trim().split('\n').map(row=>{const at=row.indexOf('|');return {speaker:row.slice(0,at),text:row.slice(at+1),pacingAdded:true};});

 const journey=(text,next)=>({
  title:'On the way to Lola',place:'c2-painted-cemetery-road',time:'day',day:3,chapter:2,chapterTwo:true,
  opening:true,continuation:true,afternoon:true,rowan:false,music:'letters',lines:parse(text),next
 });
 story.c2FlowerDeparture=journey(`|The seller wraps the stems and passes the flowers to me.
You|Thank you po.
|I shift them into the crook of my arm, careful not to crush the petals.
|Outside the stall, I stop to get my bearings.
|It takes a moment to leave the noise of the market behind.`,'c2CemeteryWalkAlone');
 story.c2FlowerDeparture.place='summer-flowers';
 story.c2CemeteryWalkTogether=journey(`|Rowan leads us along the road. We move aside as a tricycle passes.
|The flower wrapping rustles against my arm.
You|Do you come here often?
Rowan|To see Lola?
You|Yeah. Do you look after her grave too?
Rowan|When I can. I clear the leaves, pull out the weeds. Bring flowers sometimes.
You|By yourself?
Rowan|Usually. Sometimes Mama comes with me.
|I look down at the flowers.
You|I’m glad someone’s been there.
Rowan|I like visiting her.
You|Do you talk to her?
|He gives me a small, almost embarrassed smile.
Rowan|Sometimes.
You|About what?
Rowan|Whatever happened that week. Work. Mama.
|He glances at me.
Rowan|You, sometimes.
You|Me?
Rowan|Nothing bad. Mostly.
You|Ro.
|He laughs softly.
Rowan|I told her you were coming home.
|For a few steps, all I hear is our footsteps.
You|Thanks for telling her.
|He nods.
|We keep walking. The shops grow farther apart, and the traffic sounds quieter behind us.
You|Are we close?
Rowan|Yeah. Just a little farther.
|My grip tightens around the flowers.
|Rowan notices and slows his pace.
Rowan|We don’t have to rush.
You|Okay.
|By the time we reach the cemetery, neither of us is talking.
|I follow him along the path between the graves.`,'c2GraveTogether');
 story.c2CemeteryWalkTogether.rowan=true;
 story.c2CemeteryWalkTogether.lines.forEach(l=>{if(l.speaker==='Rowan')l.expression='neutral';});
 story.c2CemeteryWalkAlone=journey(`|I check the map on my phone before putting it away.
|The flowers rest against my arm as I follow the road.
|A tricycle passes. I wait for it to go before crossing.
|Gradually, the stalls thin out and the traffic grows quieter.
Thought|I wonder how often Rowan comes to see her.
|He’d known the cemetery’s name without having to think.
|I make a note to ask him later.
|At the entrance, I stop and adjust the wrapping around the stems.
|There’s no need to hurry now.
|I take a breath and follow the path inside.`,'c2GraveTogether');
 for(let i=0;i<4;i++)story['c2Flower'+i].next='c2FlowerDeparture';
 const prepare=id=>{const n=story[id];if(!n.pacingRevised){n.lines.forEach((l,i)=>l.pacingOriginalIndex=i);n.pacingRevised=true;}return n;};
 const add=(id,anchor,text,before=false)=>{
  const n=prepare(id),i=n.lines.findIndex(l=>l.text===anchor);
  if(i<0)throw new Error('Missing pacing anchor: '+id+' / '+anchor);
  const rows=parse(text),conditions=n.lines[i].conditions;
  if(conditions)rows.forEach(l=>l.conditions=conditions);
  n.lines.splice(i+(before?0:1),0,...rows);
 };
 const replace=(id,old,text)=>{const n=prepare(id),l=n.lines.find(l=>l.text===old);if(!l)throw new Error(old);l.text=text;};
 add('c2Tricycle','Hahaha. I know, right?',`You|You walk up this hill every day?
Rowan|Pretty much.
You|That explains why you weren’t dying earlier.
Rowan|I was. I just wasn’t complaining as much as you.
|I laugh. A motorcycle passes, and we move farther from the road.
|Rowan checks his phone, then slips it into his pocket.
You|Are we late?
Rowan|No. Just checking.
|We wait beneath the shade. Across the road, a vendor drags a chair closer to their stall.`);
 add('c2Tricycle','Okay, let’s go.',`|He steps aside to let me climb in first.
|The engine rattles beneath us as the houses give way to busier streets.
|By the time we reach the market, I can hear vendors calling over one another.`);
 add('c2MarketWalk','Really?',`|Rowan takes a shopping bag from the vendor.
Rowan|Come on. We still need a few things.
You|Changing the subject?
Rowan|Do you want dinner or not?
You|Fine. Lead the way.`);
 add('c2MarketWalk','I wonder if Tita and Rowan will be having a feast.',`|I reach for one of his bags.
Rowan|It’s okay. I can carry it.
You|I know. Give me one anyway.
|He hands me the lighter one.
You|Really? You don’t trust me with the heavy one?
Rowan|You can carry both uphill later.
You|Actually, this one’s perfect.
|He laughs as we step aside to let someone pass.
|He knows where to go, who to greet, and which gaps we can squeeze through.
Thought|There’s a whole routine here that I was never part of.`);
 add('c2Workshop','I smile at Manong.',`|Outside, Rowan switches the bag to his other hand. The sanding starts again behind us.
You|So… Friday?
Rowan|You heard that?
You|Ro. I was standing right there.
Rowan|Right. Sorry.
|He laughs a little.
You|Sounds important.
Rowan|Yeah. I just haven’t decided yet.
|I wait, but he looks toward the road.
Rowan|Flowers first?
You|Okay.
|I leave it there. He’s quieter as we start walking.`);
 add('c2GraveLeave','I need to get back.',`|I brush the dirt from my fingers, but stay beside her grave a little longer.
You|Bye, Lola.
|I take one last look at the flowers before turning toward the path.`);
 add('c2GroceriesAfter','But it feels good to laugh with him.',`|Our laughter fades as we keep walking.
|Rowan slows when I do, matching my pace.
You|Thanks for staying with me.
Rowan|Of course.
|I look back once before we turn toward home.`);
 add('c2FamilyArrival','So, how are you?',`|Rowan goes back for another glass.
Mayumi|Ro, sit down muna. What else do you need?
Rowan|Water, Ma.
Mayumi|And after that, sit.
Rowan|Opo.
|He sets the glass down and takes his seat.
|Tita opens the bread bag while I pull my chair closer.`,true);
 add('c2NewEnding','Then Mayumi turns toward him.',`|Rowan nudges the bread toward me.
Rowan|Last one. You want it?
You|We can split it.
|He reaches for it while Mayumi watches him.`,true);
 add('c2FatherDinner','Did Lola know?',`|I look down at the bread between us.
|There are several things I could ask. I don’t know where to start.
|Rowan glances at me. I give him a small nod.
Thought|I can ask him later.`);
 add('c2FatherPressure','She takes a sip of water before changing the subject.',`|Rowan tears a small piece from his bread but doesn’t eat it.
|I look at him, then back at my plate.`);
 add('c2MayumiLeaves','No need. Just help {name}.',`|He looks as though he might argue. She touches his arm.
Mayumi|I’ll be fine. You get some rest too.
|He nods reluctantly.`);
 add('c2KitchenAsk','You’d just got here. I didn’t want to burden you with my problems.',`|I set the plate I’m holding on the counter.`);
 add('c2KitchenHonesty','I want to know the Rowan standing in front of me now.',`|He looks at me properly.
|I give him a moment before continuing.`);
 replace('c2KitchenHonesty','Ro, I want to know you again. So please don’t hide things from me.','You can talk to me, Ro. I want to know how you’ve been.');
 add('c2KitchenHonesty','I met my father on my eighteenth birthday.',`|He rests his hand against the counter.
|For a moment, he seems to be deciding where to begin.`,true);
 add('c2EndSupport','He paid for everything. He helped take care of the arrangements, too.',`|I put the dishcloth down.
Thought|I wasn’t there.
|For a moment, I can’t get past that thought.`);
 add('c2EndExpectations','That was what changed Mama’s mind. She loved Lola so much. I guess seeing him help her made Mama want to give him another chance.',`You|I didn’t know he was involved.
Rowan|Yeah.
|He waits until I look at him again before continuing.`,true);
 add('c2EndExpectations','I didn’t want to take that happiness away from her.',`|I almost answer, but he’s still trying to find the words.
|I let him finish.`);
 replace('c2EndApprenticeship','No.','Not exactly. Mama started backing me up.');
 replace('c2EndApprenticeship','What happened?','What changed?');
 add('c2EndApprenticeship','I know I need to speak up. I just need time.',`You|Okay. I’m not rushing you.
|His shoulders loosen a little.`);
 add('c2EndStay','But don’t forget about yourself just because you think you need to look after me.',`Rowan|Even if I can’t be here all the time?
You|Of course. You don’t have to take care of everything for me.`);
 add('c2EndStay','Anytime, Ro.',`|We finish the last few dishes.
|I dry a plate and hand it to Rowan. When he puts it away, the cabinet swings open again.
|He stares at it.
You|Leave it for tomorrow.
|He laughs under his breath.
Rowan|Yeah. Tomorrow.`);
 add('c2EndGoodbye','Can I see you tomorrow?',`|Rowan checks the time.
Rowan|It’s getting late. I should head home.
You|Okay. I’ll walk you out.
|We step onto the porch. The air is cooler outside.
|He pauses by the steps while I stay near the doorway.
|Neither of us says goodbye immediately.`,true);
 story.c2EndStay.cgCue.until='We finish the last few dishes.';
 // Keep the seven original closing positions stable for completion and gallery saves.
 const closing=[
 'I watch until he reaches the road.',
 'Earlier, I’d looked at him and searched for the boy I remembered.',
 'Tonight, he told me about the years I wasn’t here.',
 'The things he wanted. The things he was afraid to disappoint.',
 'There’s still so much we don’t know about each other.',
 'But we can keep getting to know each other.',
 'I stay by the doorway a little longer, then head inside.'
 ];
 prepare('c2EndKnown').lines.forEach((l,i)=>{l.text=closing[i];l.speaker=i===5?'Thought':'';});
 add('c2EndQuiet','At least we’re talking now.',`|I stay by the doorway a little longer, then head inside.`);
}
