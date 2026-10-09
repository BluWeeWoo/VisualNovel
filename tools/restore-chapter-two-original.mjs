// Editorial source: user's uploaded Chapter Two. Grammar, spelling and punctuation only.
// Run once to publish the restored text into the existing stable story graph.
import fs from 'node:fs';
import {story} from '../src/story.js';
const nodes=structuredClone(Object.fromEntries(Object.entries(story).filter(([id])=>id.startsWith('c2'))));
const parse=text=>text.trim().split('\n').filter(Boolean).map(row=>{
 const [body,expression]=row.split('~'),i=body.indexOf('|');
 return {speaker:i<0?'':body.slice(0,i),text:i<0?body:body.slice(i+1),...(expression?{expression}:{})};
});
const set=(id,text)=>{nodes[id].lines=parse(text);if(nodes[id].cgCue){nodes[id].cgCue.from=nodes[id].lines[0].text;delete nodes[id].cgCue.until;}};
const add=(id,text,conditions,index=nodes[id].lines.length)=>nodes[id].lines.splice(index,0,...parse(text).map(line=>({...line,conditions})));
set('c2Start',`The fan turns in the dark. Somewhere beyond it, traffic replaces the sound of the sea.
The door looks farther away than it should.
Mom|Yes, {name} can attend. Gusto rin naman niyang sumama.
You|Attend what?
A phone call ends.
Mom|Oh, I already told them yes.
You|What? No!
I try to get up.
The edge of the bed stays just beyond my feet.
Dad|Hayaan mo na, anak.
You|I didn’t ask you to say yes for me.
Dad|Isang araw lang naman.
You|It’s never just—
Mom|Don’t embarrass us.
The door is closed. Their voices are beside me.
Thought|I already explained this.
Whisper|Disappointing.
Thought|I explained it properly.
Whisper|Not enough.
You|Can you listen for a second?
The next whisper sounds almost like my own voice.
Whisper|Useless.
The bedroom door becomes a classroom door.`);
set('c2Classroom',`Fluorescent lights hum. Papers slide across desks.
Teacher|{name}, do you know where Sevi is?
Thought|Why are you asking me?
You|Sorry, miss. I don’t know po.
Teacher|You’re in the same organizations, aren’t you?
I open my mouth. Someone behind me laughs.
Student|Uy, {name}. BFF ni Sevi. Dapat alam mo ’yon. Hahaha.
Another student|Hahaha! ’Di mo alam ang schedule ng BFF mo?
You|Haha. Pwede ko siyang i-chat. Hahaha.
Thought|Can we talk about something else?
Student|Sevi’s shadow.
Thought|Shut the hell up.`);
set('c2Corridor',`The bell rings, but nobody is in the corridor.
Thought|I guess they’re all in the room na. I have to catch up.
Sevi stands a few steps from our classroom. His headphones rest around his neck.
Sevi|Oy, Dos. Pasabi kay miss, I need to be excused. The dean told me to attend a meeting regarding next week’s event.
You|Again?
Sevi|Sudden changes, eh. Pasabi na lang.
You|You should probably tell her yourself.
Sevi|I sent her a message. I’m asking in case she hasn’t seen it.
He glances toward the classroom, then back at me.
Sevi|You don’t have to explain anything. Just tell her nasa meeting ako.
Thought|Just pass on a message.
Thought|It should be a normal favor.
You|You’re out of class more than anyone, and somehow you still get the highest score.
He pauses.
Sevi|It can’t be helped. The org needs me to attend.
You|I know that.
Sevi|Then—
You|I’m there for every lecture. I do the readings. I study until I can’t stand looking at the page.
I lower my voice as someone passes us.
You|Then the results come out, and I always get compared to you.
Sevi takes his hand out of his pocket, as if he has thought of something to do with it.
Sevi|What are you saying?
Sevi|I don’t ask them to compare us. Plus, you should know that you shouldn’t mind them.
You|…
Sevi|Look, is something wrong?
Thought|As if he didn’t know what was going on.
Sevi|Look, I don’t really know what’s got you worked up, but after the meetings, I’ll continue my work. I don’t even ask anything of you.
You|You make it look easy.
I mumble it.
Thought|Is he really oblivious?
Sevi|Huh?
You|Just go.
Sevi|Whatever, Dos. So, will you tell miss?`);
nodes.c2Corridor.choices[0].text='I’ll tell her.';
nodes.c2Corridor.choices[1].text='Please ask someone else this time.';
nodes.c2Corridor.choices[2].text='Do you ever get tired of being the person everyone expects to win?';
set('c2Notes',`Sevi|Good. I’ll just send you a reviewer, pambawi. My notes have more than three headings.
You|Then I’m expecting great things.
Sevi|I’ll send them tonight.`);
set('c2Boundary',`Sevi|All right.
He checks the time, then puts his phone away.
Sevi|Puntahan ko na nga lang si miss.
You|See? You can do it yourself. Go. I’m not trying to make you late.
Sevi|I know. I asked you for a favor. You can say no.`);
set('c2Pressure',`Sevi looks at me for a moment longer than usual.
Sevi|Yes.
The answer arrives without any polish.
You|Really?
Sevi|You’re being nosy. I’m not sure who I could say it to without sounding ungrateful.
You|Yeah, sorry.
Sevi|It’s fine. I’ll just tell ma’am I can make it.
You|Okay.`);
set('c2CorridorAfter',`A chair scrapes inside the classroom.
Sevi|Oh, may pa-activity ata sa room.
You|Shet, I need to go.
Sevi|Sige. Kaya mo na ’yan, Dos.
You|Yeah. Goodbye, Sevi.`);
add('c2CorridorAfter',`As Sevi turns to go to the meeting, he looks back and hesitates.
Sevi|Will you be in the library later?
You|Probably.
Sevi|Then… perhaps I’ll see you.
For someone who can speak in front of an entire room, he makes that sound surprisingly difficult.`,[['seviDescription','something']]);
add('c2CorridorAfter',`Sevi|Good luck with whatever’s happening. Just update me.
You|Yeah, yeah. Just go. I don’t want to be blamed for making you late.
Sevi|Sure, sure. Tell ma’am, ah.`,[['seviDescription','something',true]]);
add('c2CorridorAfter',`You|Yeah. I’ll tell her.
Sevi|Thank you.`,[['seviCorridorResponse','cooperate']]);
add('c2CorridorAfter','He turns toward the classroom to speak to the teacher himself.',[['seviCorridorResponse','cooperate',true]]);
nodes.c2CorridorAfter.lines.push(...parse('The bell rings again.\nIt should have stopped by now.'));
// The attachment gives an overthinking direction here, rather than finished lines.
// Retain only its stated subjects; do not introduce new memories or conversations.
set('c2CloudIntro',`Thought|My parents didn’t even ask me where I wanted to go.
Thought|The teachers and students keep comparing me to Sevi.
Thought|He casually misses classes and still gets high grades.
Thought|I’m there for every lecture. Why can’t I keep up?
The voices keep drifting closer.`);
set('c2Wave1After','The dream continues.');
add('c2Wave1After',`Thought|Just forget everything. Out of sight, out of mind.
I fall asleep.`,[['nightmareOutcome1','clear']],0);
add('c2Wave1After',`Thought|Why do they keep deciding things for me?
Thought|Why am I still being compared to him?
Thought|I can’t keep up.
I cover my face. I can’t stop thinking about it.`,[['nightmareOutcome1','overwhelmed']],0);
add('c2Wave1After','The voices drift into another memory.',[['nightmareOutcome1','bypass']],0);
set('c2Committee',`A chair scrapes across the floor.
Empty chairs surround me, but a conversation is already underway.
Sevi|Oy, Dos. Ikaw na sa committee, ha? In charge.
You|Huh? Bakit ako?
Thought|Tangina naman. Ako na naman?
Sevi|Mataas ang incentive nito. And I know you can do it.
You|May iba bang pwede?
Sevi|You handle being in charge of the committee really well, eh. May tiwala naman ako sa ’yo.
He slides a folder toward me, containing a schedule and details about the upcoming event.
The folder is already waiting for an answer.
Thought|I really don’t want to.
You|Eh… haha. If no one else wants to do it.
Sevi|Great. I’ll add you na sa GC, ah.
He turns toward someone else.
I am still looking at the folder.
Thought|That wasn’t a yes.
Thought|It sounded like one.
Pages turn faster than anyone could read them.
Distorted voice|You can do it.
Distorted voice|Tiwala naman ako sa ’yo.
Distorted voice|I’ll add you na sa GC.
Thought|And if I can’t meet their expectations?`);
set('c2Wave2After','The voices follow me into the meeting room.');
add('c2Wave2After','For a moment, the thoughts quiet down.',[['nightmareOutcome2','clear']],0);
add('c2Wave2After','The voices keep repeating their expectations.',[['nightmareOutcome2','overwhelmed']],0);
add('c2Wave2After','The dream moves on.',[['nightmareOutcome2','bypass']],0);
set('c2Confrontation',`Just a few moments earlier, Sevi called me to the meeting room.
Inside, the meeting room is empty except for Sevi.
The chairs are pushed in. Afternoon light stretches across the table.
Sevi|Why did you back out?
You|Ah, I haven’t. I said I wanted to talk about it. Hahaha.
Sevi|Huwag ka ngang tumawa. Your message said you couldn’t be the committee lead. What does this mean?
You|Because I don’t think I can.
Sevi|Huh? Anong ibig mong sabihin? You did really well last time. What’s making it difficult this time?
Thought|I really don’t want to answer.
You|I just got bored, really. Hahaha. Plus, I don’t really think I’m fit for it anymore.
Sevi|Talaga ba?
You|Yeah. Hahaha.
Thought|Comparisons. Expectations. Jealousy.
Thought|All I know is I’m not going to get the credit. It’s always going to be him.
Sevi|Sure na ba ’yan?
You|Yeah, sorry. Just give it to someone else.
Sevi|You’re right. I’ll just give it to someone else.
Sevi|But why do you look like you really want the part?
Thought|I thought I’d want the incentives and the credit, but all I know is Sevi’s going to get all the credit.
You|I said yes because everyone was looking at me.
Sevi|Oh. I guess that’s my bad, then.
You|Also, you told me the incentives were good. That was very tempting.
Sevi|I mean, yeah.
Sevi|Are you really sure you don’t want the part?
You|Yeah, I’m sure.
Thought|I hope he buys that.`);
set('c2MeetingAfter',`You|Can I ask you something?
Sevi|What?
The chairs remain empty around us.
You|Why do you really want me to be a committee lead?
Sevi|I wanted to work with you.
You|You could’ve said that before mentioning the incentives.
Sevi|And I was really impressed by your work last time. That’s why.
You|Really? Thank you. I still won’t join.
Sevi|Haha. I tried.
I chuckle.
Thought|“I wanted to work with you.” What a load of BS.`);
add('c2MeetingAfter',`You|So, I guess you’re pretty busy again.
He looks up.
Sevi|Yeah. Don’t worry, I won’t forget the exam.
The answer is immediate. Whatever he means to add takes longer.
Sevi|I still have to be Top 1.
You|Ugh, whatever.
The corner of his mouth moves. He chuckles.
Sevi|Hahaha. Good luck, Dos.`,[['seviDescription','something']]);
add('c2MeetingAfter',`You|Good luck, Sevi. Sorry again.
Sevi|It’s fine.
You|I’m still trying to beat your next exam score.
Sevi|Lol. Good luck.
He’s reassuring me, but I can’t feel satisfied.`,[['seviDescription','something',true]]);
nodes.c2MeetingAfter.lines.push(...parse(`For a moment, the room feels ordinary.
Sevi|It’s fine.
Thought|I answered him.
Thought|I know I answered him.
The sentence repeats anyway.
The empty chairs become an audience.
Thought|Did I ask for too much?
Thought|What is everyone going to think of me now?
Thought|If I stay, what happens when I can’t do it?
Sevi’s mouth moves, but someone else speaks next.
Dad’s voice|Why are you making this difficult?
Mom’s voice|People are counting on you.
Thought|I already told you.
Thought|Why doesn’t saying it make it stop?`));
set('c2Hall','The voices follow me into the hall.');
set('c2Calling',`Thought|I can’t—
You|Stop.
The voices soften.
You|Stop. Please.
Rowan — distant|{name}?
You|Stop—
Rowan — distant|{name}. Hey.
Warm daylight appears at the edges of the room.
Rowan — distant|{name}!`);
set('c2Wake',`I wake with a breath that catches in my throat.
The ceiling is wrong. The light is wrong.
You|Rowan?
Rowan|Hey, hey. It’s me.
My shirt sticks to my back.
I push myself upright. Rowan moves closer, then stops beside the bed.
Rowan|You good?
The blue edge of the curtain comes into focus. The wardrobe. My bag beside it.
You|I… yeah.
Rowan|Sorry I barged in, but it’s past noon. I knocked, and then I heard you calling out.
He glances toward the open door.
Rowan|You were sweating. I called your name, and you weren’t waking up.
You|I was dreaming.
Rowan|Mukha nga.
His hand is still curled around the back of the desk chair.
He notices and lets go.`);
nodes.c2Wake.cgCue.from='Rowan?';
set('c2WakeChoice','Rowan|I’ll stay if you want, okay?~concerned');
nodes.c2WakeChoice.choices[0].text='Sure, I’m okay now. Just catching my breath.';
nodes.c2WakeChoice.choices[2].text='I need space, please.';
set('c2Okay',`You|I’m okay now. Just catching my breath.
This time, I mean it.
The dream is still unpleasantly close, but the room stays where it should.
Rowan|Okay. Want some water?~concerned
You|Please.
He moves to the desk and returns with a glass.
I take a small sip. Then another.
Thought|I came here to rest.
Thought|Apparently, that doesn’t happen just because I changed addresses.
You|Thanks for checking on me, Ro.
Rowan|You scared me a little.
You|Sorry.
Rowan|You don’t have to apologize. I just didn’t know what to do.
He draws the chair closer after I nod.
For a few minutes, I listen to the fan and drink my water.
I set the glass down. Rowan waits without finding something else to ask.`);
nodes.c2Okay.cgCue.from='I set the glass down.';
set('c2Fine',`You|I’m fine.
The words arrive before I decide whether they’re true.
Rowan|Really?~concerned
Rowan looks at me, very worried.
Rowan|Do you want me to stay a minute?
You|You don’t have to.
Rowan|You know I will.
His voice catches slightly. He clears his throat.
Rowan|You don’t have to tell me about it.`);
set('c2Explain',`You|It was about home. And school.
Rowan|Okay.~concerned
You|Everything was happening at once. My parents agreeing to things for me. People asking about Sevi.
I turn the glass between my hands.
You|He put me in charge of a committee once. I tried to get out of it, but…
Rowan|But?
You|I laughed. Said I’d do it if nobody else wanted to.
Rowan pulls the desk chair closer.
Rowan|Can I sit?
You|Yeah.
I set the glass down as he sits.
You|I keep doing that. Saying something is fine, then getting angry because I couldn’t keep up with what people expected of me.
Rowan|You did ask if someone else could do it.
You|Not very convincingly.
Rowan|Still asked.
I look down.
You|And the comparisons… I know I’ll never reach his level, but…
You|Sometimes I see him, and I feel inferior and useless.
Rowan|That sounds exhausting.
You|It is.
He rests his elbows on his knees.
For a moment, he looks as though he wants to say several things at once.
Rowan|I don’t like that they kept putting you in that position.
You|Which part?
Rowan|The committee. The comparisons.`);
nodes.c2Explain.cgCue.from='I set the glass down';
set('c2Joke',`Rowan|Takte. I had a more impressive speech ready in my head. Hahaha.~embarrassed
You|Oh?
Rowan|If I’d been there, I’d have told that Sevi guy to carry his own folder for once.~annoyed
A small laugh escapes me. Rowan looks up.
You|You’d probably have volunteered to help me.
Rowan|Of course I would.~playful
You|See?
The laugh leaves my chest feeling a little less tight.
Rowan|Feel a little better?~smile
You|A little. Thank you.`);
set('c2Company',`You|Thanks. I’d rather not explain.
Rowan|Okay.~concerned
You|Could you just stay for a bit?
Rowan|Yeah.
He sits in the desk chair.
Outside, someone calls to a neighbor. A motorbike passes, then fades down the hill.
I finish half the glass before either of us speaks again, then set it down.
You|Thank you, Rowan.
Rowan|You’re welcome.`);
nodes.c2Company.cgCue.from='You’re welcome.';
set('c2Alone',`You|Could I have a little time alone?
Rowan|Of course.~concerned
He moves the glass within easy reach.
Rowan|I’ll be downstairs.
You|Thanks. I just need to get myself together.
Rowan|Take your time.
He steps into the doorway.`);
set('c2Silent',`My mouth opens, but I don’t know which words to use.
Rowan shifts his weight.
Rowan|Okay. I understand.~concerned
He takes the glass from the desk and sets it beside me.
Rowan|I’ll wait downstairs.
You|Thank you.
He nods.
At the doorway, his shoulders loosen a little when I reach for the water.`);
set('c2Food',`Rowan pauses at the doorway.
Rowan|Have you eaten anything?~concerned
You|I just woke up.
Rowan|Right. Lutang lang.~embarrassed
You|A little.
Rowan|I’ll see what’s downstairs. There should be eggs.
You|Should be?
Rowan|I haven’t checked yet. I’m trying not to promise things.
I manage a small smile.
Rowan|Come down when you’re ready.~smile
You|Okay, Ro.`);
set('c2SmallStep',`His footsteps retreat down the stairs. After a pause, a cupboard opens.
I sit for another moment.
My hands have stopped shaking.
The glass leaves a damp circle on the bedside table.
You|Ugh. What a start.
I put my feet on the floor. The tiles are cool.
From downstairs comes the unmistakable sound of a cupboard refusing to close.
Rowan — downstairs|Seriously?
I look toward the door.`);
set('c2Curtains',`I draw them apart.
The sea is painfully bright. Someone has hung washing across the neighboring balcony.
I stand there until my eyes adjust.`);
set('c2Wash',`I fix the bed.
In the mirror, I look tired.
Thought|I need to relax.`);
set('c2Sit',`I stay on the edge of the bed.
Downstairs, a pan touches the stove.
There is no reason I have to stand up this second.`);
set('c2End',`Thought|Okay, Saint Luis.
Thought|Let’s see what the rest of today looks like.
After fixing my hair and changing, I head downstairs.`);
nodes.c2End.cgCue={key:'c2-rest',from:'Okay, Saint Luis.'};

set('c2Lunch',`I see Rowan setting a bowl of rice on the table.
Fried tilapia sits between our plates, with a small bowl of sliced kamatis and itlog na pula beside it.
You|I thought we were having normal eggs.
He looks at the fish and the itlog na pula.
Rowan|I think this will taste better.~smile
You|You made all this?
Rowan|No, I invited my lover over while you were upstairs.~playful
Rowan|I’m joking.
You|Really?
Rowan|I swear I don’t have a lover yet.~embarrassed`);
nodes.c2Lunch.choices[0].text='Keep teasing him.';
nodes.c2Lunch.choices[1].text='Let it go.';
set('c2LunchTease',`You|No crushes these past years? I doubt that.
Thought|This is kind of fun.
Rowan|I swear I don’t have any crushes.~embarrassed
Rowan|Sure, I receive a confession here and there, but I never accept them.
You|Hmm? Why is that?
Rowan|I think we both know why.
Thought|Ohhh…
Rowan is blushing, almost as red as a tomato or itlog na pula.`);
set('c2LunchLetGo','You|Hmm. All right.');
set('c2LunchMeal',`He pulls out a chair with his foot.
Rowan|Come on. Kain na tayo.~smile
I sit and taste Rowan’s cooking.
He tries not to watch me taste it.
Tries.
You|Lola really did teach you. First the tapa, now this. You’re on a roll, Ro.
Rowan|Talaga?
You|Yes, Ro. It’s good.
Rowan|Okay. Just checking.
He sits across from me.
Rowan|When Mama started working longer hours, I had to learn something.
You|You could’ve survived on noodles or just bought food from a nearby carinderia.
Rowan|I tried. But, uh, Lola found out.
You|Oh, you were done.
Rowan|She came over with groceries.
I laugh.
You|Of course she did.
For a while, we just eat.
The tomatoes taste the way I remember.
You|You spent a lot of time with her, huh?
Rowan|Yeah. I’d always come over after I finished helping Manong Nestor, then help with whatever she needed.
He picks a bone out of his fish.
Rowan|She’d feed me whether I helped or not.
You|That really sounds like her.
Rowan|She used to ask what you’d want to eat when you came ba—~sad
My spoon stops.
He notices.
Rowan|Sorry.
You|No. It’s fine.
I look down at my plate.
I’ve been walking around her house, sleeping in her room, eating at her table.
I still haven’t visited her grave.
You|Hey, Ro?
Rowan|Hmm?
You|Tara kaya kay Lola today?
He puts his spoon down.
You|Her grave. I haven’t been there since I came back.
Rowan|Yeah. Of course.~concerned
Rowan|But I need to run to the market first. Is that okay? We can go after.
You|What do you need?
Rowan|Well, Mama asked me to pick up a few things, and probably groceries na rin.
He takes another bite.
Rowan|And I should probably stop at the workshop.
Rowan|To see how Manong Nestor is doing.`);
nodes.c2LunchMeal.choices[0].text='Sure. I’ll wait for you.';
set('c2Wait',`Rowan|Okay. I won’t be long.~smile
He reaches for a dish.
You|Ubusin mo muna ’yan.
Rowan|I am.
You|You just tried to clear the table.
He looks at the dish in his hand, then sets it back down.
Rowan|Right.~embarrassed
You|Take your time.
Rowan|Okay.
I take another spoonful of rice.
You|I’ll find something to do.
Rowan|Please don’t reorganize the kitchen.
You|Why would I do that?
Rowan|Yeah, right. Lutang lang.
You|That sounds like something you’d do, not me.
He shakes his head, smiling.
After lunch, he picks up the shopping bags.
Rowan|Will you be okay?~concerned
You|Ro. I’m staying in my lola’s house.
Rowan|I know.
You|I’ll call if I need anything.
Rowan|Okay. See you in a bit.~smile
He starts down the steps, then checks his pocket for his phone.
I watch until he reaches the road.
Rowan|Bye! Call me if you need anything, okay!
You|Haha. Just go. Ingat.
Then he heads downhill.
Thought|Now what?`);
set('c2WaitGarden',`I find the watering can beside the steps.
The soil in a few pots is dry, so I start with those.
You|Seems like the weeds are growing back.
Thought|Well, I can do it myself, even without Rowan.`);
set('c2GardenAfter',`You|All done.
Thought|Grabe, I’m good at pulling weeds.
Thought|I’ll just be a gardener. Hahaha. Mom and Dad will freak out.
After I finish gardening, I clean myself up and go back inside.
You|Rowan is still not back.
Thought|Should I do something else?`);
set('c2Clothes',`Thought|Maybe I’ll find something to wear to visit Lola.
I walk upstairs and open my maleta.
Thought|Damn. I really am never coming back, huh?
Thought|This could work.
Thought|Uhh, there’s a tear.
Thought|Let’s see. I know Lola has some needles and thread in these cabinets.
As I open the cabinets, one catches my eye.
You|Huh? What’s this yarn doing here?
Thought|The fabric looks like Ro’s.
Thought|Now I realize why Rowan wears his cardigan when it’s hot.
Thought|I remember he always complains about how hot it is.
Thought|Uhh, forget it. I’ll just ask him another time.
Thought|Let’s look at some different clothes in my bag.`);
nodes.c2Clothes.choices[0].text='Choose something appropriate.';
nodes.c2Clothes.choices[1].text='Choose something casual.';
nodes.c2Clothes.choices[2].text='Choose pambahay.';
set('c2ClothesDone',`Thought|This could work.
After I finish choosing what to wear, I head downstairs.
You|Rowan is still not back.
Thought|Should I do something else?`);
add('c2ClothesDone','Thought|I’m visiting Lola. I should wear something nice.',[['c2Clothing','nice']],0);
add('c2ClothesDone','Thought|I guess I’ll just go casual.',[['c2Clothing','casual']],0);
add('c2ClothesDone','Thought|Pambahay lang? Well, it’s hot. I’m sorry, Lola. Please understand.',[['c2Clothing','home']],0);
set('c2WaitRest',`I sit on the porch.
Thought|It’s peaceful.
Thought|Too peaceful.
I hear the rustling of the leaves. The sound of vehicles.
You|I wish it could just be like this.
I straighten in the chair.
You|So this is what Lola felt every day.
Thought|Peaceful.
Thought|And if she needed anything, Rowan was just one call away.
Thought|Hahaha. Lucky her.
You|Rowan is sure taking his time.`);
set('c2WaitTV',`You|Well, I should probably just watch some TV while waiting for him.
I find the remote beside the television.
It takes two presses before the screen lights up.
A local news report is on. People are standing outside a health center while someone cuts a ribbon.
I almost change the channel.`);
set('c2TVNews',`Reporter|The center will now open on Saturdays, with additional staff assigned to the morning clinic.
An older woman appears on screen.
Resident|Malaking tulong. Before, I had to miss work just to get a checkup.
The report cuts to a man speaking with the staff.
The caption reads: MAYOR SANCHEZ — SAINT LUIS.
Mayor Sanchez|We’ve had people asking for weekend hours for a while. We finally have the staff for it.
Reporter|Will the same schedule be introduced in other barangays?
Mayor Sanchez|That’s the plan. We’ll see how this first month goes.
I settle back into the sofa.
Saturday appointments would’ve made things easier for a lot of people I know.
You|That sounds convenient.
Footsteps sound on the porch.
A moment later, Rowan comes through the door carrying the groceries.
Rowan|Hey, I’m back.
You|Hey. Need a hand?
Rowan|Nah, I’ve got it.
He puts the bags on the table.
On the television, the mayor is walking through the clinic.
You|Your “new” mayor seems pretty good.
Rowan looks at the screen.
His hand stops inside one of the bags.
Rowan|Oh. What’s he done this time?
You|They’re opening the health center on Saturdays now. More staff, too.
Rowan|Ah.
You|That’s useful. People won’t have to take a whole day off just to see someone.
He takes out a carton of eggs and sets it down carefully.
Rowan|Yeah. That should help.
You|Did he already have these plans?
Rowan|Yeah, I guess.
You|You don’t sound very impressed.
He glances at me.
Rowan|I just got back from carrying groceries uphill. Give me a minute.
You|Right. Sorry.
A small smile appears.
Rowan|Thanks.
He picks up the bags again.
You|So, did you stop at the workshop?
Rowan|Yeah.
You|Did you talk to Mang Nestor?
Rowan|Yup. We just chatted a bit. I don’t really want to bother him that much.
You|Well, Saint Luis is pretty small. He’s probably very busy.
Rowan|Yeah. He really is one of the carpenters people look up to.
He looks toward the television. Then back at me.
You|Something wrong?
Rowan|Oh, nothing.
The news moves on to the weather.
I turn the volume down.
You|Want to sit for a bit before we go?
Rowan|Yeah. Sure. I need a rest after that uphill exercise.
You|At least you got some cardio. Haha.`);
set('c2Ready','We get ready to visit Lola.');
add('c2Ready',`Rowan|You really dressed the part to see Lola.~smile
You|Of course. I don’t want her favorite apo to look like shit while visiting her, if you know what I mean.
Rowan|Hahaha. I do. You look good.
You|Thanks.`,[['c2Clothing','nice']]);
add('c2Ready',`Rowan|You all set? Or do you need more time to prepare?
You|Nah, I’m good. We can go.
Rowan|All right. Let’s go.`,[['c2Clothing','casual']]);
add('c2Ready',`Rowan|You sure about your clothes?~playful
You|Yeah. What’s wrong?
Rowan|Nothing. It’s very relatable. Lola will laugh at you. Hahaha.
You|That’s the plan. I hope Lola understands that it’s very hot in the Philippines.`,[['c2Clothing','home']]);
set('c2Market',`Rowan|Of course. If you want to.~smile
You|I’m asking, aren’t I?
Rowan|Another lutang moment. Haha. Sorry.~embarrassed
You|You’re on a roll, Ro.
He smiles and reaches for his glass.
Rowan|Oh, we can get flowers while we’re there.
You|Okay. And pay a visit to Manong Nestor at the workshop.
Rowan|We can skip that.
You|Why?
Rowan|It might take a while.
You|That’s fine.
Rowan|You sure?
You|Ro.
Rowan|Okay, okay.
Rowan|Let’s clean up before leaving.
You|Yeah, yeah. You clean the table, and ako na ang magliligpit.
Rowan|All right.
We clean up and prepare to go to the market.
You|Make sure to lock the door, ah.
Rowan|Yes po, Ma.~playful
He says it teasingly.`);
set('c2Tricycle',`As we head downhill, we wait at the stop for a tricycle to take us to the market.
You|Now I’m scared of going uphill.
Rowan|Hahaha. I know, right?~smile
You|There’s a trike.
Rowan reaches out with his hand to signal the tricycle driver.
Rowan|Bayan po.
The tricycle driver nods.
Rowan|Okay, let’s go.`);
nodes.c2Tricycle.choices[0].text='Likod.';
nodes.c2Tricycle.choices[1].text='Join Rowan.';
set('c2TricycleBack',`You|I’ll ride sa likod.
Rowan|Oh, all right. I’ll be here inside.`);
set('c2TricycleTogether',`You|Tabi tayo?
Rowan|Hahaha. It’s going to be a squeeze.~smile
You|Do you mind?
Rowan|Never. Come on.`);
set('c2MarketWalk',`At the market, almost every stall already knows Rowan.
Thought|He really is a Saint Luis boy.
Vendor 1|Hey, Rowan! Bibili ka na ba? Our lanzones are sweet this time.
Rowan|Haha. Are you sure po, Tita?~playful
Vendor 1|Of course. So, ilang kilo?
Rowan|Not today po, Tita. Next time, I’ll bring Mama as well.
Vendor 1|Sure ’yan, ah. I’ll be waiting.
Vendor 2|Rowan! Rowan! Help!
Rowan|Oh… Tito, what’s wrong?~surprised
Vendor 2|My table is loose. Can you check it?
Rowan|Sure.
Rowan|I’m just going to check on it, okay?
He reassures me.
You|Sure. It’s no problem.
He crouches to inspect it.
Rowan|The joint’s coming loose.~neutral
Vendor 2|Can you fix it?
Rowan|Yeah. Probably tomorrow? I’m kind of in the middle of something.
The vendor nods as Rowan lets him know we aren’t going to take long.
Vendor 2|Okay, okay.
As Rowan gets up, the vendor shifts his attention to me.
Vendor 2|Wait. Are you {name}?
You|Yeah.
Vendor 2|Ohhh. No wonder Rowan’s been busy at your lola’s house. The infamous {name} is back.
You|Rowan’s said things about me?
Vendor 2|Lots. His day wouldn’t be complete if he hadn’t talked about you.
You|Ohhh.
Thought|So he tells the people here about me.
Rowan|Tito… Ahem. We should be going.~embarrassed
Vendor 2|You’re right. Ingat kayo. Have fun on your date.
Rowan|Tito…
As the vendor laughs at us, I glance at Rowan.
You|Do you get through here without picking up work?
Rowan|Sometimes I take the other entrance.
You|So… what did you tell people about me? Hmm?
Rowan|It’s nothing, really.
You|Really?
We stop by a few shops to finish Rowan’s errands. We buy tilapia, some fruit, and chicken.
Thought|I wonder if Tita and Rowan will be having a feast.
After that, it’s time to head to the workshop.
Rowan|Tara. It’s time to visit Manong Nestor.~smile`);
set('c2Workshop',`As we get close to the workshop, the smell of sawdust overwhelms us.
Mang Nestor looks up from a table he’s sanding.
Mang Nestor|Uy, Rowan. Going to need more things fixed, or are you going to fix them yourself? Hahaha.
The middle-aged man greets Rowan and shifts his attention toward me.
Without missing a beat, Rowan introduces me.
Rowan|Manong, this is {name}.
Mang Nestor|Yeah, I figured. It’s nice to meet you, {name}.
You|Nice to meet you too, Manong Nestor.
Mang Nestor|So, did Rowan ever mention his very handsome guro to you?
You|He might have. Hahaha.
Mang Nestor|Might? Grabe. Meanwhile, Rowan won’t stop complimenting you left and right. Hahaha.
Rowan|Manong!
Rowan blushes.
Mang Nestor|Hahaha! Biro lang. By the way, Rowan?
Mang Nestor|Napag-isipan mo na?
Rowan shifts the shopping bag to his other hand.
Rowan|Ohh. Not yet.
Mang Nestor|Let me know by Friday, ha? I need to sort out the schedule. It’ll be a big opportunity for you and Mayumi.
Rowan|I will. Thank you, Manong.
Mang Nestor greets me one last time and asks how long I’m staying.
Mang Nestor|Sige, go na kayo. Ang dami ko lang gagawin.
Rowan|Need help, Manong?
Mang Nestor|’Di na, ’di na. I don’t want to disturb you guys. Go enjoy the day.
You|Thank you po, Manong.
Rowan|Thank you. Stay healthy, ah.
Mang Nestor|Of course, of course.
Mang Nestor|Oy, {name}! Alagaan mo ang baby boy namin, ah! Hahaha!
One last time, Rowan blushes before rushing outside.
I smile at Manong.`);
set('c2WorkshopAfter','Thought|So, Friday, huh? I wonder what they’re talking about.');
nodes.c2WorkshopAfter.choices[0].text='Ask him about it.';
nodes.c2WorkshopAfter.choices[1].text='Don’t ask him.';
set('c2FridayAsk',`You|By the way, Friday, huh?
Rowan|Yeah.~neutral
You|Want to tell me about it?
Rowan|Umm, you see…`);
set('c2FridayLeave','Thought|It might be personal. Better if I don’t ask him.');
set('c2Call',`His phone rings.
He checks it.
For a second, he just stands there.
Then he silences the call.
You|What’s up? Do you need a moment?
Rowan|No. I’ll call back.~neutral
He puts the phone away.
Rowan|Come on. We should be heading to Lola now.
You|What about flowers?
Rowan|There’s a stall selling some near the graveyard.
You|Oh, all right.`);
set('c2AloneGrave',`Rowan pauses.
Rowan|Oh.~concerned
You|Sorry. I know I just asked you to come.
Rowan|No, no. It’s okay. I understand.
He sets his glass down.
You|It’s just… I think I need a minute with her. By myself.
Rowan|Yeah. I get it.
You|You don’t mind?
Rowan|Well, I really wanted to come.
He gives me a small smile.
Rowan|But we can go together another day.~smile
You|All right.
Rowan|Do you still remember the cemetery?
You|Not really.
Rowan|Hang on.
As Rowan tries to sketch directions, I speak up.
You|What’s the name of the cemetery? I’ll just look it up on the map.
Rowan|Oh… yeah.~embarrassed
He crumples the paper.
Thought|I appreciate the effort, though.
Rowan|Eternal Leaves Cemetery.
You|Got it.
Rowan|There’s a flower stall across the road.
You|Thanks, Ro.
Rowan|Yeah.
He reaches for the shopping bags.
Rowan|Well, I’ll go see Mang Nestor, then.
You|Ingat.
Rowan smiles at me before leaving.~smile`);
set('c2Flowers','I look at the different flowers at the stall.');
['Thought|These are traditional, so I guess Lola will appreciate them.','Thought|These are very respectful. She deserves them.','Thought|One of Lola’s favorite flowers.','Thought|Let’s try something different and pretty.'].forEach((text,i)=>set('c2Flower'+i,text));
['Very traditional, just like Lola. Hahaha.','A very respectful choice.','She’ll be happy you brought her favorites.','Trying something different, huh? She’d love those.'].forEach((text,i)=>add('c2Flower'+i,'Rowan|'+text,[['graveTogether',true]]));
set('c2GraveTogether',`I recognize her name before I’m ready to stop walking.
For a moment, I just stand there.
Then I crouch and set down the flowers.
You|Hi, Lola.
My voice comes out smaller than I expected.
You|I’m back.`);
set('c2GraveChoice',`He stands beside me for a little while.
Then he leans closer.
Rowan|Want some time?~concerned`);
nodes.c2GraveChoice.choices[0].text='Nod.';
nodes.c2GraveChoice.choices[1].text='Please stay.';
set('c2GraveSpace',`I nod.
You|Please.
Rowan|I’ll be over there.~concerned
He walks toward a tree beside the path.`);
set('c2GraveStay','Rowan|Always.~concerned');
set('c2Grave',`You|Lola, I’m so sorry I’m late.
You|I’m so sorry I’m not strong enough.
You|I’m sorry I didn’t try.
You|I’m sorry I’m not strong enough.
I can’t hold back my tears.`);
add('c2Grave',`I feel an arm around my shoulders.
Rowan is comforting me.
He isn’t saying anything.
He’s just here for me.
He always has been.
Rowan|It’s okay to cry.
You|Thank you for everything, Rowan.
Rowan|I’ll never get tired of it.`,[['graveTogether',true],['c2GraveStay',true]]);
nodes.c2Grave.lines.push(...parse(`I adjust the flowers.
Then adjust them again.
You|Sorry I took so long.
A little dirt sits on the edge of the stone. I brush it away with my fingers.
You|The house is okay.
I swallow.
You|Ro’s been looking after it.`));
add('c2Grave',`Rowan|Yeah, until someone starts breaking things again.
You|Hahaha. Shut up.
I chuckle.`,[['graveTogether',true],['c2GraveStay',true]]);
nodes.c2Grave.lines.push(...parse(`A breeze moves through the leaves.
You|He cooked for me today. Tilapia.
I let out a small laugh.
You|It was good. You taught him properly.
For a while, I can’t say anything else.
Then:
You|I wish you were here.
You|I wish I could hug you.
You|I wish I could hear you scolding me. Haha.
I look down at my hands.
You|Things have been…
I stop trying to finish the sentence.
You|I just miss you.
Time passes.`));
set('c2GraveLeave','You|It’s hapon already.');
add('c2GraveLeave',`You|I need to get back.`,[['graveTogether',true,true]]);
add('c2GraveLeave',`Rowan|Ready?
You|Yeah. Thanks, Ro.
Rowan|Yeah, time flies fast here, huh?
You|Yeah, I know, right? We should head back.`,[['graveTogether',true]]);
set('c2Groceries',`Thought|Wait a minute.
You|Don’t you have shopping bags?
Rowan|Yeah.~neutral
You|Bro.
Rowan|Bakit?
You|The chicken and tilapia, tanga.
Rowan|Huh? Oh! Oh, shet!~surprised
When Rowan opens the shopping bags, the foul smell of tilapia and raw chicken escapes.
Rowan|Shet. Mom’s going to kill me.~embarrassed
You|Why didn’t you tell me? We could’ve left earlier.
Rowan|I didn’t want to interrupt your moment. I’m sorry.
I let out a chuckle.
Then a laugh.
You|Hahahaha! Lola must be laughing at us right now.
Rowan|Yeah. Sorry, Lola. Hahaha. What a night.~smile`);
set('c2Mayumi','As I head home, a woman in her forties is standing on the porch of Lola’s house, carrying a bag.');
add('c2Mayumi',`Rowan is still worried about the tilapia and chicken.
You|Ohh, cheer up, Rowan. Tita will understand.
Rowan|She will, but I’m going to hear an earful from her.
You|Are we sure we’re just going to throw it in the trash?
Rowan|I guess. Hopefully, the evidence is gone by now.`,[['afternoonRoute','market']],0);
nodes.c2Mayumi.lines.push(...parse(`Then a familiar voice comes through.
Mayumi|Tao po!
I stop walking.`));
add('c2Mayumi',`You|Tita?
Rowan|Ma?
Rowan looks confused and surprised.
She turns.
Mayumi|Ay, anak. And—`,[['graveTogether',true]]);
nodes.c2Mayumi.lines.push(...parse(`There’s a short pause.
Mayumi|Baby ng anak ko! {name}!
Thought|Baby?
Nonetheless, she’s still as welcoming as ever.
Mayumi|Come here. Can I hug you?
I step forward.
She holds me tightly for a moment.
Mayumi|Welcome back. It’s good to see you.
You|You too po.
She draws back, still holding my arms.
Mayumi|Look at you. Ang laki mo na.`));
// The source's gwapo/ganda alternative follows the player's existing pronouns.
nodes.c2Mayumi.lines.push(...parse('Mayumi|{appearancePraise}')); 
nodes.c2Mayumi.lines.push(...parse('Mayumi|My son is going to be smitten once again.'));
add('c2Mayumi','Rowan|Ma!',[['graveTogether',true]]);
add('c2Mayumi','Thought|Hahaha. Almost everyone is teasing Rowan today.',[['afternoonRoute','market']]);
nodes.c2Mayumi.lines.push(...parse(`You|Hahaha. Thank you po. It’s been a while.
Mayumi|Too long.`));
add('c2Mayumi',`You|Rowan still isn’t home?
Mayumi|Yes, anak. He must be doing some extra work with his teacher.
You|Let’s go in.
Mayumi|Yeah. Oh, I brought bread as well.`,[['graveTogether',true,true]]);
add('c2Mayumi',`Rowan|By the way, what are you doing here, Ma?
Mayumi|Well, I wouldn’t miss {name} coming back. Haha.
Rowan|But don’t you need to rest?
Tita Mayumi looks at Rowan to assure him she’s fine.
Mayumi|Anak, please.
Rowan|All right.
Rowan|Let’s go in.
Mayumi|Yeah. Oh, I brought bread as well.`,[['graveTogether',true]]);
set('c2FamilyArrival','Rowan and I begin to prepare the bread and other food.');
add('c2FamilyArrival',`As we get inside, Mayumi makes herself comfortable.
Mayumi|Hay, na-miss ko ’to.
You|You never come inside Lola’s house.
Mayumi|Ikaw, anak. I missed you.
You|Oh… thanks?
As I try to set the table, I hear someone on the porch.
Rowan|{name}, I’m back. Sorry, napatagal.
Mayumi|Ay, anak. You’re here.
Rowan|What are you doing here anyway, Ma?
Mayumi|Well, I wouldn’t miss {name} coming back. Haha.
Rowan|But don’t you need to rest?
Mayumi|Anak, please.
Tita Mayumi looks at Rowan to assure him she’s fine.
Mayumi|Oh, I brought bread as well. {name} is preparing it.
Rowan|Oh. I’ll help.`,[['graveTogether',true,true]],0);
nodes.c2FamilyArrival.lines.push(...parse(`You|It’s very surprising that Tita’s here.
Rowan|I know. I really wish she’d rest.
Rowan still looks worried.
You|Sooo, Tita. You brought a lot of bread, ha.
Mayumi|Of course. I know how much you missed Saint Luis.
Thought|She’s not wrong.
We sit down at the dinner table, and Mayumi starts chatting with me.
Mayumi|So, how are you?`));
set('c2TalkTrip',`You|The trip here to Saint Luis was as memorable as I remember.
Mayumi|Really? What happened?
You|My wallet got stolen.
Mayumi|What? Grabe naman ang mga tao.
Mayumi|Are you okay, though?
You|Yeah, I’m fine. The wallet only had a little extra cash, so I guess it’s fine.
Mayumi|Thank goodness. Ingat ka lagi, okay? The world is a very dangerous place.`);
set('c2TalkHouse',`You|The house looks better, and it’s clean.
Mayumi|’Di ba? My son has been on top of his game ever since he started going to Nestor’s workshop.`);
set('c2TalkVisit','You|I visited Lola’s grave today.');
add('c2TalkVisit','Rowan|Yup. I joined {name}, and we brought flowers for Lola.',[['graveTogether',true]]);
nodes.c2TalkVisit.lines.push(...parse('Mayumi|Really? That’s nice. Let’s all visit her together if we get the chance.'));
add('c2TalkVisit',`Mayumi|Wait a minute, anak. If you were with {name}, who did the errands?
Rowan blushes.
I let out a chuckle.
Mayumi|Rowan…
Her voice is firm.
Rowan|Uhh, the chicken and tilapia…
Mayumi|Hmm?
Rowan|Napanis, so we threw them away.
Mayumi|Ay, susmaryosep. Food is very expensive these days, Rowan.
Rowan|Sorry, Ma.
Mayumi|It’s—umm, I’m just going to deduct it from your allowance.
Rowan|Nooo… but I understand.
Mayumi|Hahaha.`,[['afternoonRoute','market']]);
set('c2TalkHome',`You|Home is…
Mayumi|It’s okay, anak.
Thought|She knows. I’m glad she doesn’t ask anything else.`);
set('c2Family',`Mayumi|So, what are you eating here?
You|Rowan’s cooking.
Mayumi|Good. What did he make?
You|Tilapia. And tapsilog.
Mayumi|Oh, his safest choices. Probably his signature dishes.
Rowan|You really liked them, though, Ma.
Mayumi|Did I say they were bad?
He looks at me.
Rowan|See what I deal with?
For a little while, the conversation stays easy.`);
set('c2NewEnding',`Then Mayumi turns toward him.
Mayumi|Ro. Your father called.
He stops reaching for the bread.
Rowan|Yeah. He called me too.`);
nodes.c2NewEnding.cgCue.from='Ro. Your father called.';

// Keep every saved node and the same choices/route flags. Replace the activity
// copies too, so no order of activities can expose the discarded rewrite.
for(const [id,node] of Object.entries(nodes)){
 const match=/^(c2WaitGarden|c2SoloGarden|c2GardenAfter|c2Clothes|c2ClothesDone|c2WaitRest)Activity\d+$/.exec(id);
 if(match){node.lines=structuredClone(nodes[match[1]].lines);if(node.choices)node.choices.forEach((c,i)=>c.text=nodes[match[1]].choices[i].text);}
}
// Preserve the source's instruction to choose at least one activity before TV.
nodes.c2Activities0.choices=nodes.c2Activities0.choices.filter(c=>c.next!=='c2WaitTV');
for(const [id,node] of Object.entries(nodes))if(/^c2Activities\d+$/.test(id)){
 node.lines=parse(id==='c2Activities0'?'Thought|Now what?':'Thought|Should I do something else?');
 for(const c of node.choices)if(c.next==='c2WaitTV')c.text='Watch some TV while waiting for him.';
}
// Migrate transitional saved locations without resurrecting the superseded dialogue.
for(const id of ['c2GardenReturn','c2PorchReturn','c2ActivityReturn'])set(id,'You|Rowan is still not back.');
// No scene direction or unfilled placeholder is presented as spoken dialogue.
const runtime=`// Chapter Two: original user script, grammar-corrected. Stable IDs preserve saves.\n// Source: docs/chapter-two-user-original.txt. See docs/chapter-two-restoration.md.\nexport const approvedChapterTwoCues={};\nconst nodes=${JSON.stringify(nodes,null,2)};\nexport function reviseChapterTwo(story){\n Object.assign(story,structuredClone(nodes));\n for(const [id,node] of Object.entries(nodes))if(node.cgCue)approvedChapterTwoCues[id]=node.cgCue;\n // Keep the user's separate request: Lola's house has steps, not a gate.\n for(const node of Object.values(story))for(const line of node.lines)line.text=line.text.replace('He looks toward the gate. Then back at me.','He looks toward the steps. Then back at me.');\n}\n`;
fs.writeFileSync('src/chapter-two-revision.js',runtime);
const doc=['# Chapter Two — Original script, grammar corrected','', 'Runtime scene IDs are included to make branches easy to find. Mayumi’s sprite and existing CG assets are retained.',''];
const emitted=new Set();
function writeNode(id){if(emitted.has(id)||!nodes[id])return;emitted.add(id);const n=nodes[id];doc.push('## '+n.title+' ('+id+')','');for(const l of n.lines){const rule=l.conditions?.map(([k,v,negate])=>`${k} ${negate?'is not':'is'} ${v}`).join('; ')||(l.if?`${l.if[0]} is ${l.if[1]}`:'');doc.push((rule?'['+rule+'] ':'')+(l.speaker==='Thought'?'*'+l.text+'*':l.speaker?'**'+(l.speaker==='You'?'MC':l.speaker)+':** '+l.text:l.text),'');}if(n.choices){doc.push('**Choices:**','',...n.choices.map(c=>'- '+c.text+' → '+c.next),'');}if(n.next)doc.push('Continue → '+n.next,'');for(const c of n.choices||[])writeNode(c.next);if(n.next)writeNode(n.next);}
writeNode('c2Start');writeNode('c2Groceries');
fs.writeFileSync('docs/chapter-two-grammar-corrected.md',doc.join('\n'));
console.log('Restored original Chapter Two dialogue across '+Object.keys(nodes).length+' existing/new scene locations.');
