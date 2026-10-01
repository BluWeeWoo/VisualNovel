// Approved after-garden chapter ending. Stable node IDs; no changes to earlier lines.
const lines=text=>text.trim().split('\n').filter(Boolean).map(row=>{
 const [body,expression]=row.split('~'),i=body.indexOf('|');
 return {speaker:i<0?'':body.slice(0,i),text:i<0?body:body.slice(i+1),...(expression?{expression}:{})};
});
const scene=(title,text,end={})=>({place:'reunion-porch',time:'day',day:2,dayTwo:true,opening:true,continuation:true,afterGarden:true,rowan:true,music:'catching-up',title,lines:lines(text),...end});
const opt=(text,next,set)=>({text,next,...(set?{set}:{})});
export const afterGarden={
aWater:scene('Cold water',`
We leave our shoes by the back door.
Rowan washes the dirt from his hands. I rinse mine beside him.
After freshening up, Rowan puts his cardigan back on and opens the fridge.~smile
I wait beside the counter while he takes out the cold water.
He fills two glasses and hands one to me. The outside is already cold against my fingers.
Rowan|Careful. You might decide to live in front of the fridge.~playful
You|Don’t give me ideas.
He takes a long drink. I do the same.
For a moment, neither of us says anything.
You|Okay. I needed that.
Rowan|Told you.~smile
We carry our glasses into the living room. Rowan picks up the remote.
Rowan|Want something on?
You|Sure.
`,{place:'living',next:'aNews'}),
aNews:scene('The local news',`
The television takes a second to respond. Then a local news report fills the screen.
Newsreader · TV|Nicolas Sanchez took office as mayor of Saint Luis this morning, following his election earlier this year. His father, the former mayor, attended the ceremony after retiring from public office.
You|Mayor Sanchez retired?
Rowan|Yeah. His son ran in the last election.~neutral
You|I didn’t know he had a son.
Rowan sets his glass on a coaster.
You|I remember the old mayor. People seemed to like him.
Rowan|He came to Lola’s funeral.
I look at him.
You|He did?
Rowan|For a little while.
The report cuts to the new mayor speaking outside the municipal hall.
Rowan|I hope he does a good job.
You|Same. Especially if he can do something about the road near the bus stop.
Rowan|You’ve been back one day and you already have a complaint.~smile
You|I fell on that bus. I’ve earned one.
He passes me the remote.
We settle on a cooking show. Neither of us knows what they’re making, but Rowan becomes convinced he could improve it.
I ask whether he plans to wash the extra dishes. He changes his mind.
`,{place:'living',next:'aPorch'}),
aPorch:scene('On the porch',`
Later, we move outside.
The porch is cooler now that the sun has moved past the roof.
Rowan pulls a chair closer, leaving enough room for me to stretch my legs.
Rowan|Better?~smile
You|Much.
He sits beside me. For a while, we watch someone across the street struggle with a gate.
Rowan|There’s a lot we haven’t caught up on.~neutral
You|Twelve years is a lot.
Rowan|We don’t have to finish today.~smile
He rests his arms on his knees.
Rowan|Anything you want to ask?
`,{next:'aTopics0'}),
aEvening:scene('Leave it there for today',`
You|I think that’s enough catching up for now.
Rowan|Okay.~neutral
He stretches his legs out beside mine.
Rowan|We can just sit.
So we do.
`,{next:'aPassing'}),
aPassing:scene('The rest of the afternoon',`
The rest of the day passes in smaller pieces.
We go inside when the porch gets warm. Find something to eat. Put away the things we left out that morning.
There are quiet stretches where neither of us feels the need to fill the room.
By evening, we’re back on the porch.
`,{place:'living',time:'evening',rowan:false,music:'back-together',next:'aGoodnight'}),
aGoodnight:scene('Across the street',`
You|Gabi na.
Rowan|Yeah.~neutral
He checks the time and lets out a small sigh.
Rowan|I should go. I promised Mama I’d finish a few things at home.
You|Chores, part two?
Rowan|The sequel nobody asked for.~playful
He stands, but stays beside the chair for another moment.
Rowan|I used to wonder what you were doing around this time.~neutral
You|Probably schoolwork.
Rowan|Probably.
He looks at me.
Rowan|It’s nice not having to wonder today.~smile
You|Thanks for staying.
Rowan|Thanks for letting me.
He heads down the steps, then turns back.
Rowan|Message me if you need anything.
You|You’re right across the street.
Rowan|Exactly. Very convenient service.~playful
You|Goodnight, Ro.
Rowan|Goodnight, {name}.~smile
I watch him cross.
At his porch, he turns and waves once more.
I wave back before he goes inside.
`,{place:'d2-porch-night',time:'night',music:'back-together',next:'aBedroom',cgCue:{key:'after-garden-wave',from:'At his porch'}}),
aBedroom:scene('One more goodnight',`
Upstairs, I change and sit on the edge of the bed.
You|Hay. Pagod.
I laugh a little. Apparently, talking can tire me out too.
I plug in my phone and pull the blanket over my legs.
Thought|I wonder what tomorrow will be like.
My phone lights up with one more message.
Rowan · text|Goodnight, sunshine. Welcome back.
I smile at the screen.
`,{place:'d2-bedroom-night',time:'night',rowan:false,music:'back-together',choices:[opt('Reply.','aReply',{porchGoodnight:'reply'}),opt('Put the phone away.','aNoReply',{porchGoodnight:'rest'})]}),
aReply:scene('Glad to be back',`
You · text|Goodnight, Ro. Glad to be back.
Rowan · text|🐶
Thought|Of course.
I put the phone beside the bed.
`,{place:'d2-bedroom-night',time:'night',rowan:false,music:'back-together',next:'aEnd'}),
aNoReply:scene('Tomorrow',`
Thought|I’ll talk to him tomorrow.
I set the phone down. His message will still be there in the morning.
`,{place:'d2-bedroom-night',time:'night',rowan:false,music:'back-together',next:'aEnd'}),
aEnd:scene('Reunion at a Familiar House',`
The familiar fan clicks in the quiet.
Outside, the street grows quieter.
Thought|Goodnight, Saint Luis.
`,{place:'d2-bedroom-night',time:'night',rowan:false,music:null,ending:true,openingEnd:true})
};
const topics={
lola:{label:'Ask about Lola.',nodes:{
start:scene('Ask about Lola',`
You|Ro?
Rowan|Hmm?~neutral
You|Can I ask about Lola?
He turns toward me.
You|My parents told me she died. They barely told me anything else.
You|What happened?
Rowan|I can tell you what I know.~concerned
He pauses.
Rowan|Do you want to talk about it now?
`,{music:'letters',choices:[opt('Yes. I want to know.','yes',{porchLola:'heard'}),opt('Not yet. I thought I was ready.','notYet',{porchLola:'not-yet'})]}),
notYet:scene('Another time',`
You|Not yet. Sorry. I thought I was ready.
Rowan|You don’t have to apologize.~concerned
He settles back in his chair.
Rowan|Another time, then.
`,{music:'letters'}),
yes:scene('What happened',`
You|Yes. Please.
Rowan looks down at his hands.~sad
Rowan|She started getting tired more easily. Sometimes she had to stop halfway through something and sit down.
Rowan|The doctor here was worried about her heart. He wanted her to see a specialist in the city.
You|Did she go?
Rowan|No.
I wait for him to continue.
Rowan|She worried about the cost. About leaving the house. Every time we brought it up, she found another reason to wait.
Rowan|Mama offered to go with her. I offered too.
You|What about my parents?
Rowan|She asked them for help arranging the trip.
My hand tightens around the edge of the chair.
You|She asked them?
Rowan|Yeah.
You|They knew?
Rowan|They knew the doctor wanted her checked.
He speaks carefully.
Rowan|I wasn’t there for every call. I don’t know everything they said.
Rowan|But afterward, she told us she didn’t want to ask them again.
You|Why didn’t she call me?
You|I would’ve tried to help.
Rowan|She tried to reach you through them.~concerned
Rowan|They kept saying you were busy. That she shouldn’t upset you while you were studying.
You|So she stopped?
Rowan|She worried they’d take it out on you.
I look away.
Rowan|I wish we’d found another way.
For a moment, all I hear is a motorbike passing the house.
You|When did this start?
Rowan|A few days after I wrote that yellow letter, she had a bad spell. That was when the doctor asked her to go.
Thought|The letter.
Thought|She was still telling him what to write.
Rowan|There were better days after that. She’d feel stronger, and we’d think we had more time.~sad
Rowan|Then, a few months later, she got much worse. We took her to the hospital here.
He rubs his thumb against his palm.
Rowan|She died there.
You|And nobody told me how sick she was.
Rowan|You should have been told.
`,{music:'letters',choices:[opt('Be angry.','angry',{porchGrief:'angry'}),opt('Let yourself be sad.','sad',{porchGrief:'sad'}),opt('Feel numb.','numb',{porchGrief:'numb'}),opt('Turn the blame inward.','blame',{porchGrief:'blame'})]}),
angry:scene('You can be angry',`
You|They knew, Ro.
You|They watched me worry about exams while they knew she was sick.
I stop, trying to get the rest of the words out.
You|I don’t know what to do with that.
Rowan|You can be angry.~concerned
Rowan|I was too.
`,{music:'letters',next:'quiet'}),
sad:scene('Beside me',`
You|Lola…
My voice gives out. Rowan holds out his hand between our chairs. I take it.
You|I’m sorry.
Rowan|You didn’t know, {name}.~sad
He stays beside me while I cry.
`,{music:'letters',next:'quiet'}),
numb:scene('Too much at once',`
I stare at a crack in the porch floor.
Thought|I heard everything he said. I just don’t know what to do with it yet.
You|I’m too late.
Rowan|I know you wanted to be here.~sad
He doesn’t ask me to say anything else.
`,{music:'letters',next:'quiet'}),
blame:scene('The questions I asked',`
You|Why did I keep believing them?
You|I should’ve asked more questions.
Rowan|You asked where the letters were. You asked to come back.~concerned
You|I could’ve done more.
Rowan|Maybe there are things you wish you’d done differently. I have those too.
Rowan|But they were the ones keeping this from you.
`,{music:'letters',next:'quiet'}),
quiet:scene('A glass within reach',`
A breeze moves through the plants beside the steps.
You|I need a minute.
Rowan|Okay.~concerned
We sit without speaking for a while.
Rowan gets our water from inside.
He sets my glass within reach and sits down again.
After a while, I take a sip.
You|Thank you for telling me.
Rowan|I’m sorry you had to ask.~sad
You|I don’t think I can talk about her anymore today.
Rowan|Then we won’t.
`,{music:'letters',cgCue:{key:'after-garden-quiet',from:'He sets my glass'}})
}},
mayumi:{label:'Ask about Tita Mayumi.',nodes:{start:scene('Tita Mayumi',`
You|How’s Tita Mayumi?
Rowan|Busy. Still insists she isn’t.~neutral
You|That sounds familiar.
Rowan|She’ll be happy you’re back.~smile
You|I’d like to see her.
Rowan|I’ll tell her. Then you’ll have to accept whatever food she decides you haven’t been eating enough of.
You|I can live with that.
He smiles.
You|Where’s she working now?
Rowan|Customer service in the next town. Calls, complaints, helping people with their accounts.
Rowan|Then she comes home and somehow still has energy to ask about my day.
You|Do you help her out?
Rowan|I try. Usually she tells me to finish things here first.
He looks down at his hands.
Rowan|Very unfair. All this strength, and she carries the groceries in before I reach the door.~playful
You|Maybe she’s faster than you.
Rowan|She is. Please don’t tell her I admitted it.
`) }},
school:{label:'Talk about school.',nodes:{
start:scene('School',`
You|School’s been… a lot.
Rowan|Want to tell me about it?~concerned
`,{choices:[opt('Let yourself rant.','rant'),opt('Keep it brief.','brief')]}),
brief:scene('A break from it all',`
You|There’s always something due. And when I get home, it feels like I’m still being graded.
You|I came here because I needed a break from all of it.
Rowan|Okay.~concerned
He glances toward the house.
Rowan|We can leave some things for tomorrow, you know. You don’t have to spend your whole break fixing this place.
You|Even the garden?
Rowan|Especially the garden. It’ll find more weeds without our help.~smile
You|Thanks, Ro.
`),
rant:scene('Always understanding',`
You|I’m tired of being the person who’s supposed to understand everything.
Rowan|What do you mean?~concerned
You|Someone misses their part of a project? I’m supposed to understand.
You|Someone needs a favor? I’m supposed to make time.
You|But if I’m struggling, suddenly I should’ve planned better.
Rowan puts his glass down.
You|I already get enough of that at home.
You|And then there’s Sevrine.
Rowan|Sevrine?~neutral
You|Sevi.
Rowan|Someone from school?
You|Unfortunately.
Rowan|Are you two close?
`,{choices:[opt('Yuck. No.','yuck',{seviDescription:'no'}),opt('He’s fine. Sometimes.','fine',{seviDescription:'fine'}),opt('He’s just an acquaintance.','acquaintance',{seviDescription:'acquaintance'}),opt('He’s… something.','something',{seviDescription:'something'})]}),
yuck:scene('A strong answer',`
You|Yuck. No.
Rowan raises his eyebrows.~surprised
Rowan|Okay. Strong answer.
`,{next:'rival'}),
fine:scene('Sometimes',`
You|He’s fine. Sometimes.
Rowan|But this isn’t about one of those times.~neutral
You|Exactly.
`,{next:'rival'}),
acquaintance:scene('An acquaintance',`
You|He’s just an acquaintance.
I pause.
You|An acquaintance who gets on my nerves.
Rowan|I’m getting that.~smile
`,{next:'rival'}),
something:scene('Something',`
You|He’s… something.
Rowan|That clears it up.~playful
You|You asked.
`,{next:'rival'}),
rival:scene('Dos',`
You|He’s my so-called academic rival.
Rowan|So-called?~neutral
You|Our classmates decided it. Now everything we do gets compared.
You|He calls me “Dos.”
Rowan|As in second?
You|Yeah.
Rowan’s smile fades.~concerned
You|And he’s student council president, so there’s always a reason he can miss something.
You|A meeting. An event. Something important.
You|I know some of it is legitimate. But everyone else has to work around it.
Rowan|And you end up doing more?
You|Sometimes. Or I’m expected to be fine with it.
You|That’s what gets me. He comes back and acts like nothing happened.
You|Calls me Dos. Makes another joke.
I realize I’m gripping my glass. I put it down.
You|He’s part of why I stopped joining orgs.
You|And part of why I—
I stop. Rowan waits.
You|Sorry. I didn’t mean to unload all that on you.
Rowan|You don’t have to apologize for telling me.
You|Can we leave the rest for another time?
Rowan|Of course.
He leans back.
Rowan|Do you want me to say something, or would you rather just leave it there?
You|Leave it there. For now.
Rowan|Okay.
`)
}},
rowan:{label:'Ask how Rowan is doing.',nodes:{start:scene('What comes next',`
You|What about you?
Rowan|Me?~neutral
You|Yeah. How are you?
Rowan|I’m doing okay.~smile
He looks toward the gate. Then back at me.
Rowan|That was a bit automatic.~embarrassed
You|You don’t have to give me the easy answer.
He rubs the back of his neck.
Rowan|There’s a lot I want to tell you. I just don’t know where to start.
You|We don’t have to finish today.
He notices me repeating his words. His smile comes back.~smile
Rowan|Right.
Rowan|For now… I’m glad you’re here.
You|I’m glad too.
Rowan|I’ve been looking after the house. Helping Mama. Working when I can.
He pauses.
Rowan|And thinking about what comes next.~neutral
You|What do you want to do?
Rowan|I’m still figuring out how to say it without talking myself out of it.
You|You can tell me when you’re ready.
Rowan|Thanks.~smile
His knee bumps mine when he shifts. “Sorry,” he says, adjusting his chair.
Rowan|One thing hasn’t changed.
You|What?
Rowan|I still like having you around.
You|Even when I complain this much?
Rowan|I’m choosing to overlook a few things.~playful
I laugh. He looks pleased with himself.
`)}}
};
// Compile finite topic menus, so every topic can be read once in any order.
// The visited-topic mask is part of a stable node ID and survives ordinary saves.
const keys=Object.keys(topics);
for(let mask=0;mask<16;mask++){
 const choices=[];
 for(const [bit,key] of keys.entries())if(!(mask&(1<<bit))){
  const prefix=`aTopic${mask}_${key}_`,topic=topics[key],done=`aTopics${mask|(1<<bit)}`;
  choices.push(opt(topic.label,prefix+'start',{['porchTopic_'+key]:true}));
  for(const [id,node] of Object.entries(topic.nodes))afterGarden[prefix+id]={...node,
   lines:node.lines.map(l=>({...l})),
   ...(node.choices?{choices:node.choices.map(c=>({...c,next:prefix+c.next}))}:{next:node.next?prefix+node.next:done})};
 }
 if(mask)choices.push(opt('Leave it there for today.','aEvening'));
 afterGarden['aTopics'+mask]=scene('On the porch',mask?'We sit together in the shade.\nAlready discussed: '+keys.filter((key,bit)=>mask&(1<<bit)).map(key=>({lola:'Lola',mayumi:'Tita Mayumi',school:'school',rowan:'how Rowan is doing'})[key]).join(', ')+'.':'There’s time to talk.',{choices,music:mask?'back-together':'catching-up',rowan:true});
}
// Preserve the optional garden greeting callback without assuming a romantic route.
for(const node of Object.values(afterGarden))if(node.title==='What comes next'){
 const i=node.lines.findIndex(l=>l.text==='Even when I complain this much?');
 node.lines.splice(i,1,
  ...['whatcha','hey','poke'].map(value=>({speaker:'You',text:'Even when I complain this much?',if:['gardenGreeting',value]})),
  {speaker:'You',text:'Even when I scare you in the garden?',if:['gardenGreeting','scare']});
}
