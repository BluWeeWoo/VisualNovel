import {rowanFeelings,normalizeRowanFeeling} from '../assets/player-identity.js';

export function confirmFeeling(state,chapter,value){
 const current=normalizeRowanFeeling(state.flags.rowanFeeling);
 if(!rowanFeelings.includes(value)||rowanFeelings.indexOf(value)<rowanFeelings.indexOf(current))return false;
 if(state.flags['feelingReflection'+chapter])return false;
 state.flags.rowanFeeling=value;
 state.flags['feelingReflection'+chapter]=true;
 // Completed chapters retain their original dialogue, even in history and saves.
 if(chapter===1){state.flags.feelingsChapter2=true;state.flags.rowanFeelingChapter2=value;}
 return true;
}

export function rememberFeelingLine(state,line){
 if(line.feelingMemory)state.flags[line.feelingMemory]=true;
}

export function installRowanFeelings(story){
 const parse=(text,expression='neutral')=>text.trim().split('\n').map(row=>{
  const i=row.indexOf('|'),speaker=row.slice(0,i);
  return {speaker:speaker==='Thought'?'':speaker,text:row.slice(i+1),kind:speaker==='Thought'?'thought':speaker?'spoken':'narration',expression};
 });
 const insert=(id,anchor,lines)=>{const node=story[id],at=anchor?node.lines.findIndex(l=>l.text===anchor):node.lines.length;if(at<0)throw Error('Missing feelings anchor '+id+': '+anchor);node.lines.splice(at,0,...lines);};
 const variants=(chapter,texts,extra=[])=>texts.flatMap((text,i)=>parse(text,['neutral','smile','embarrassed','relieved'][i]).map(l=>({...l,conditions:[['feelingsChapter'+chapter,true],['rowanFeelingChapter'+chapter,rowanFeelings[i]],...extra]})));
 insert('rHugAsk','He takes two quick steps toward me, then catches himself reaching out.',variants(1,[
`Thought|I didn’t know how seeing him again would feel.
You|Hey, Rowan. It’s been a while.
Rowan|Yeah. Tagal na nga.
|He lets out a breath.
Rowan|It’s good to see you.`,
`|His smile makes it a little easier to breathe.
Thought|There you are.
You|I missed you, Ro.
Rowan|I missed you too. You could’ve warned me, though. I would’ve put the tools away.
You|And miss my grand entrance?
Rowan|Na may kasamang martilyo?`,
`|For a second, I forget the greeting I had ready.
Thought|Okay. That’s new.
You|Hey, Ro.
Rowan|Hey. Okay ka lang?
You|Just getting used to seeing you again.
|His smile turns a little shy.
Rowan|Same here.`,
`Thought|I’ve imagined this so many times. I still don’t know what to say.
You|It’s really good to see you, Ro.
Rowan|Same here.
Rowan|Come here—if you want.`]));
 insert('rBusy',null,variants(1,[
`You|I don’t really know where to start.
Rowan|Pahinga ka muna. Let’s get your bag inside.`,
`You|I missed having you around.
Rowan|Even when I was annoying?
You|’Di ka na annoying?
Rowan|I’m working on it.`,
`You|I thought about you, you know.
|His hand pauses beside the screwdriver.
Rowan|Talaga?
You|Yeah.
Rowan|I’m glad.`,
`You|I missed you. I know I didn’t always act like it.
Rowan|We were kids.
You|We both were.`]));
 const guarded=(text,conditions)=>parse(text,'concerned').map(l=>({...l,conditions}));
 insert('aGoodnight','He heads down the steps, then turns back.',[
 ...guarded(`Rowan|Was I a bit much earlier?
You|When you tried to hug me?
Rowan|Oo, sorry. I got excited.
You|I just needed a second.
Rowan|Maybe two.`,[['feelingsChapter1',true],['reunionBoundary','space']]),
 ...guarded(`Rowan|I was going to play it cool when you got here.
You|That was you playing it cool?
Rowan|Kulang pa sa practice.`,[['feelingsChapter1',true],['reunionBoundary','hug']]),
 ...guarded(`Rowan|Feeling a little better?
You|A little.
Rowan|Okay.`,[['feelingsChapter1',true],['feelingCried',true]]),
 ...variants(1,[
`You|Today was a lot.
Rowan|Yeah. Get some rest, okay?
You|See you tomorrow.
Rowan|Tomorrow.`,
`You|Today felt familiar.
Rowan|In a good way?
You|Mostly. Daldal mo pa rin.
Rowan|You missed it.
You|Maybe.`,
`You|I’m glad I got to spend today with you.
Rowan|Talaga ba?
You|Don’t ruin it.
|He laughs, then looks back at me.
Rowan|I’m glad too.`,
`You|I didn’t want today to end yet.
|His smile settles into something quieter.
Rowan|We still have tomorrow.
You|Yeah.
Rowan|Tulog na, okay?`]).map(l=>({...l,...({'Today was a lot.':{feelingMemory:'goodbyeLot'},'Today felt familiar.':{feelingMemory:'goodbyeFamiliar'},'I didn’t want today to end yet.':{feelingMemory:'goodbyeTomorrow'}}[l.text]||{})}))
 ]);
 story.rCry.lines.at(-1).feelingMemory='feelingCried';
 insert('c2Lunch','I see Rowan setting a bowl of rice on the table.',[
 ...guarded(`Rowan|Yesterday you said it was a lot. Then you had that nightmare…
You|Not exactly the relaxing summer I planned.
Rowan|We don’t have to do much today.`,[['goodbyeLot',true]]),
 ...guarded(`Rowan|Still glad to be back?
You|Ask me after lunch.
Rowan|Fair.`,[['goodbyeFamiliar',true]]),
 ...guarded(`Rowan|Well. We got to tomorrow.
|It takes me a moment to remember what he means.
You|Not how I pictured starting it.
Rowan|Me neither. Lunch might help.`,[['goodbyeTomorrow',true]])
 ]);
 insert('c2LunchMeal','For a while, we just eat.',variants(2,[
`You|It’s strange how much I can’t remember.
Rowan|About the house?
You|About everything. You, too.
Rowan|You can ask me things.
You|I know. I’m figuring out what to ask.`,
`You|I missed this.
Rowan|The food?
You|Sitting around with you.
Rowan|The food can be part of it.
You|Fine. You and the food.`,
`|I catch myself looking at him instead of my plate.
Rowan|What?
You|Nothing.
Rowan|May something ’yang “nothing” mo.
You|Eat your lunch, Ro.
|He smiles before looking down.`,
`Thought|There are things I want to tell him. I’m not ready to say them across a plate of rice.
You|Can we do this again?
Rowan|Have lunch?
You|You know what I mean.
|His smile softens.
Rowan|Yeah. We can.`]).map(l=>({...l,lunchExpression:l.expression==='embarrassed'?'embarrassed':l.expression==='neutral'?'attentive':'relaxed'})));
 // Keep the original version visible for pre-feature saves; no line-position migration needed.
 story.c2KitchenSeeYou.lines.forEach(l=>(l.conditions??=[]).push(['feelingsChapter2',true,true]));
 insert('c2KitchenSeeYou',null,variants(2,[
`You|Yeah. To see you. I want to catch up properly.
Rowan|Even the messy parts?
You|They’re still part of your life.
Rowan|Okay.`,
`You|Yeah. To see you. You’re my friend, Ro.
|He looks down at the cloth.
Rowan|I know. I should’ve said something.`,
`You|Yeah. To see you. I thought I was being pretty obvious.
|He looks up.
Rowan|About wanting to catch up?
You|For now, let’s go with that.
|A little color reaches his cheeks.
Rowan|Okay.`,
`You|Yeah. To see you. I care about how you’re doing, Ro.
Rowan|Even when I’m being difficult?
You|Well, you kind of are right now.
|He lets out a small laugh.
Rowan|Fair.`]));
 insert('c2EndApprenticeship',null,variants(2,[
`You|Thanks for telling me.
Rowan|It was a lot.
You|Yeah. I’m still taking it in.
Rowan|That’s okay.`,
`You|You don’t have to have a good day for me to want you around.
|He looks at me.
Rowan|I’ll try to remember that.`,
`You|You know this hasn’t made me want to spend less time with you, right?
Rowan|I was hoping.
You|Good. Now you know.
|A small smile returns.`,
`Thought|I wish I could make this easier for him. I know I can’t decide it for him.
You|I still want to be here, Ro.
Rowan|Even after all that?
You|Yeah.
|He lets out a slow breath.
Rowan|Okay. Thank you.`]));
 insert('c2EndGlass','I wanted this week to be nice.',[
 ...guarded(`Rowan|Can I tell you something else?
You|Yeah.
Rowan|I’m trying the “actually say it” thing.
You|Okay. I’m listening.`,[['rowanApology','hurt']]),
 ...guarded(`Rowan|I was going to say I’m fine.
|He glances down at the glass.
Rowan|That would’ve been a lie.
You|Then tell me the other answer.`,[['rowanApologyDone',true],['rowanApology','hurt',true]])
 ]);
 const stay=story.c2EndStay.lines,a=stay.findIndex(l=>l.text==='I move a little closer.'),b=stay.findIndex(l=>l.text==='I pick up the next plate.');
 stay.slice(a,b).forEach(l=>(l.conditions??=[]).push(['feelingsChapter2',true,true]));
 insert('c2EndStay','I pick up the next plate.',variants(2,[
`You|I don’t know what happens after summer.
Rowan|Yeah. I know.
You|But I’m not leaving tomorrow. We’ve still got time to catch up.
|He nods.
Rowan|Okay. I’d like that.`,
`You|I missed having you around too.
Rowan|Even when I keep finding things to fix?
You|I could do with fewer repair updates.
|He laughs.
You|But we still have time, Ro.
Rowan|Yeah. We do.`,
`You|You’re making it harder to want to leave.
|He looks at me.
Rowan|Sorry.
You|I didn’t say you should stop.
|His fingers tighten slightly around the cloth.
Rowan|Oh.
You|We still have time.
Rowan|Yeah.`,
`|I move a little closer.
You|I wish I could give you an answer about after summer.
Rowan|You don’t have to promise anything.
You|I know. But I want you to know I’m happy here. With you.
|He holds my gaze for a moment.
Rowan|I’m happy you’re here too.
You|Then let’s make the most of it.
|He smiles.
Rowan|Okay.`]));
 const base=story.c2KitchenAsk;
 const node=(text,next)=>({...base,choices:undefined,lines:parse(text,'weak-smile'),next});
 story.c2FeelingApology=node(`|Rowan folds the cloth between his hands.
Rowan|About earlier. When you asked about the mayor.
You|You said you were tired from carrying groceries.
Rowan|I was. But that wasn’t really why I answered like that.
|He looks at me.
Rowan|Sorry. I didn’t want to talk about him, and I took it out on you.`);
 const responses=[
 ['direct','You could’ve just told me.',`You|You could’ve just told me you didn’t want to talk.
Rowan|Yeah. I should’ve.
You|I would’ve left it alone.
Rowan|I know. Sorry.`],
 ['hurt','It did bother me.',`You|It did bother me. I thought I’d said something wrong.
|His expression falls.
Rowan|You didn’t.
You|Okay.
Rowan|I’ll try to say what I mean next time.`],
 ['understand','I get it. Just tell me next time.',`You|I get it. Just tell me next time.
Rowan|I will.
You|You don’t have to explain everything. Just don’t leave me guessing.
|He nods.`]
 ];
 story.c2FeelingApology.choices=responses.map(([key,text,dialogue])=>{
  const id='c2FeelingApology_'+key;story[id]=node(dialogue,'c2KitchenAsk');
  return {text,next:id,set:{rowanApology:key,rowanApologyDone:true}};
 });
}
