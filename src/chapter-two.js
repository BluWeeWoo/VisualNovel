// Chapter Two opening: approved review script. Stable IDs preserve saves.
const scene=(title,text,end={})=>({title,place:'c2-city',time:'day',day:3,chapter:2,chapterTwo:true,opening:true,continuation:true,rowan:false,music:'lost-contact',lines:text.trim().split('\n').filter(Boolean).map(row=>{const [body,expression]=row.split('~'),i=body.indexOf('|');return {speaker:i<0?'':body.slice(0,i),text:i<0?body:body.slice(i+1),...(expression?{expression}:{})};}),...end});
const opt=(text,next,set)=>({text,next,...(set?{set}:{})});
const room=(title,text,end={})=>scene(title,text,{place:'d2-bedroom-morning',music:null,...end});
const illustrated=(key,place)=>(title,text,end={})=>scene(title,text,{place,cgCue:{key,from:text.trim().split('\n')[0].split('|').at(-1)},...end});
const corridor=illustrated('c2-sevi-confrontation','c2-confrontation');
const meeting=illustrated('c2-sevi-meeting','c2-meeting');
export const chapterTwo={
c2Start:scene('The things that follow',`
The fan turns in the dark. Somewhere beyond it, traffic replaces the sound of the sea.
The door looks farther away than it should.
Mom|Yes, {name} can attend. Gusto rin naman niyang sumama.
You|Attend what?
A phone call ends.
Mom|I already told them yes, anak.
You|Ma, you didn’t even ask me.
I try to get up.
The edge of the bed stays just beyond my feet.
Dad|Hayaan mo na, anak. Isang araw lang naman.
You|I didn’t ask you to say yes for me.
Mom|We’ve already made arrangements.
You|You haven’t even told me where I’m going.
Dad|Pag-usapan na lang natin mamaya.
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
The bedroom door becomes a classroom door.
`,{next:'c2Classroom',cgCue:{key:'c2-nightmare',from:'The fan'}}),
c2Classroom:scene('Everyone is looking',`
Fluorescent lights hum. Papers slide across desks.
Teacher|{name}, do you know where Sevi is?
Thought|Why are you asking me?
You|Sorry, Ma’am. I don't know.
Teacher|You’re in the same organizations, aren’t you?
You|Opo, pero—
Someone behind me laughs.
Student|Hey, Sevi's BFF. you should know where he is.
Another student|Hindi mo alam ’yung schedule ng BFF mo?
You|Haha. don't worry i'll chat him.
Thought|Can we talk about something else?
Student|Sevi’s shadow.
The words are quiet enough that the teacher keeps sorting her papers.
Loud enough for me.
Thought|Shut the hell up.
I look down at my phone.
There is no message to open.
Only my reflection in the screen.
I look up from my phone.
I’m outside the classroom now.
The lesson hasn’t started—or I’m late again. I can’t tell.
`,{place:'c2-school',next:'c2Corridor',cgCue:{key:'c2-classroom',from:'Fluorescent'}}),
c2Corridor:corridor('Another favor',`
The bell rings. The corridor is almost empty.
Thought|They’re all inside na. I need to catch up.
Sevi stands a few steps from our classroom.
Sevi|Oy, Dos. Pasabi kay Ma’am, I need to be excused. The dean called a meeting about next week’s event.
You|Again?
Sevi|May changes daw sa plans. Pakisabi na lang.
You|You should probably tell her yourself.
Sevi|I sent her a message. I’m asking in case she hasn’t seen it.
He glances toward the classroom, then back at me.
Sevi|You don’t have to explain everything. Just tell her nasa meeting ako.
Thought|Just pass on a message.
Thought|It should be a normal favor.
You|You miss so many classes, and you still get the highest score.
He pauses.
Sevi|Required ’yung meeting. Hindi ko naman pinili ’yung oras.
You|I know that.
Sevi|Then—
You|I’m there for every lecture. I do the readings. I study until nothing’s going in anymore.
I lower my voice as someone passes us.
You|Then the results come out, and ako na naman ’yung kinukumpara.
Sevi shifts the notebook against his side.
Sevi|Wait. Are you upset about the message, or—
You|Never mind.
Sevi|I don’t ask them to compare us.
You|I didn’t say you did.
Sevi|Then don’t listen to them.
You|Madaling sabihin.
His gaze drops briefly to the notebook in his hand.
Sevi|Okay. That came out wrong.
I wait.
Sevi|Hindi ko alam na ganito pala kabigat sa ’yo. I thought you were upset about passing on the message.
Thought|As if this started with a message.
Sevi|After the meeting, kailangan ko ring habulin ’yung work ko. Hindi rin naman automatic ’yung grades.
You|You make it look easy.
It comes out barely louder than a whisper.
Sevi|What?
You|Just go. Baka ma-late ka.
He checks the time, but stays where he is.
Sevi|Okay. But before I go—can you tell Ma’am, or should I stop by?
`,{choices:[opt('“I’ll tell her.”','c2Notes',{seviCorridorResponse:'cooperate'}),opt('“Please ask someone else this time.”','c2Boundary',{seviCorridorResponse:'boundary'}),opt('“Do you ever get tired of being the person everyone expects to win?”','c2Pressure',{seviCorridorResponse:'recognition'})]}),
c2Notes:corridor('Useful notes',`
Sevi|Thanks. I’ll send you my reviewer tonight. Pambawi.
You|Complete dapat.
Sevi|It is.
You|Then I’m expecting great things.
Sevi|Tonight. Promise.
`,{next:'c2CorridorAfter'}),
c2Boundary:corridor('A favor',`
Sevi|All right. Puntahan ko na lang si Ma’am.
You|I’m not trying to make you late.
Sevi|I know. I asked you for a favor. You can say no.
His answer is so straightforward that I don’t know what to do with the argument I had ready.
`,{next:'c2CorridorAfter'}),
c2Pressure:corridor('Expectations',`
Sevi looks at me for a moment longer than usual.
Sevi|That’s… a personal question.
You|Sorry. Forget it.
Sevi|No. I mean—yes.
He adjusts his glasses.
Sevi|I get tired. Hindi ko lang alam kung paano sabihin without sounding ungrateful.
You|Really?
Sevi|Really.
The answer arrives without a smile.
You|Yeah. I think I get that.
Sevi glances toward the classroom.
Sevi|I’ll tell Ma’am myself that I need to miss class.
`,{next:'c2CorridorAfter'}),
c2CorridorAfter:corridor('Something I missed',`
A chair scrapes inside the classroom.
Sevi|May activity na yata.
You|Shet. I need to go.
Sevi|Kaya mo ’yan, Dos.
You|Yeah. See you, Sevi.
@interest|He turns to leave, then looks back.
@interest|Sevi|Will you be in the library later?
@interest|You|Probably.
@interest|Sevi|Okay. Baka… doon na lang tayo magkita.
@interest|Thought|For someone who can speak in front of an entire room, he makes that sound surprisingly difficult.
@ordinary|Sevi|Good luck sa activity.
@ordinary|You|Ikaw rin. Good luck sa meeting mo.
@ordinary|Sevi|I’ll need it.
@cooperate|Sevi|Pakisabi kay Ma’am, ha?
@cooperate|You|Yeah. I’ll tell her.
@cooperate|Sevi|Thank you.
@cooperate|He heads toward the stairs.
@boundary|He steps into the classroom to speak to the teacher himself.
@recognition|He steps into the classroom to speak to the teacher himself.
The bell rings again.
It should have stopped by now.
`,{next:'c2CloudIntro'}),
c2CloudIntro:corridor('A restless sleep',`
The bell stretches into a low, uneven ringing.
The classroom door blurs. Sevi’s footsteps fade, but the things people said stay behind.
Words begin gathering where he was standing.
Thought|They already said yes.
Thought|I don’t even know where they’re sending me.
Mom’s voice|Gusto rin naman niyang sumama.
Thought|Then why didn’t you ask?
The classroom laughter slips between her words.
Student’s voice|Sevi’s shadow.
Thought|I have my own name.
Teacher’s voice|Do you know where Sevi is?
Thought|Why does everyone think I should?
A doorway opens. Sevi walks through it.
The room keeps his place for him.
Thought|He can leave.
Thought|He can miss things.
Thought|Then he comes back and gets the highest score anyway.
Thought|I know he works.
Thought|Why does that make me feel worse?
The voices keep drifting closer.
`,{next:'c2Wave1'}),
c2Wave1:scene('A restless sleep',`The voices keep drifting closer.`,{place:'c2-confrontation',nightmare:1,next:'c2Wave1After'}),
c2Committee:scene('You can do it',`
When I look down, there is a table in front of me.
A folder slides across it.
I can hear the other committee members around the table, but their faces won’t stay clear.
Sevi|Oy, Dos. Ikaw na ’yung committee lead, ha?
You|Huh? Bakit ako?
Thought|Tangina naman. Ako na naman?
Sevi|Malaki ’yung incentive dito. And I know you can do it.
You|May iba bang puwede?
Sevi|You handled it really well last time. May tiwala naman ako sa ’yo.
He taps the folder. Inside are a schedule and details about the upcoming event.
The folder is already waiting for an answer.
Thought|I really don’t want to.
You|Eh… haha. If no one else wants to do it.
Sevi|Great. I’ll add you sa GC, ha.
He turns toward someone else.
I am still looking at the folder.
Thought|That wasn’t a yes.
Thought|It sounded like one.
Pages turn faster than anyone could read them.
Distorted voice|You can do it.
Distorted voice|May tiwala naman ako sa ’yo.
Distorted voice|I’ll add you sa GC.
Thought|And if I can’t meet their expectations?
The lines on the schedule stop making sense.
Every unfinished task becomes another sentence, lifting from the page until I can barely see the table.
`,{place:'c2-assignment',next:'c2Wave2',cgCue:{key:'c2-sevi-assignment',from:'When I look down'}}),
c2Wave2:scene('Already agreed',`The words gather again.`,{place:'c2-assignment',nightmare:2,next:'c2Wave2After'}),
c2Confrontation:meeting('In charge',`
A moment later—or another day—Sevi calls me into the meeting room.
Inside, it is empty except for him.
The chairs are pushed in. Afternoon light stretches across the table.
Sevi|Why did you back out?
You|Ah, I haven’t yet. I said I wanted to talk about it. Haha.
Sevi|Wait. Seryoso ka ba? Hindi ko alam kung nagbibiro ka.
You|I’m serious.
Sevi|Your message said you couldn’t be the committee lead. What happened?
You|I don’t think I can do it right now.
Sevi|You did really well last time. What’s making it difficult ngayon?
Thought|I really don’t want to answer.
You|Got bored, I guess. Haha. I just don’t think I’m the right person anymore.
Sevi|Talaga ba?
You|Yeah.
Thought|Comparisons.
Thought|Expectations.
Thought|Jealousy.
Thought|I can already hear them thanking him.
Thought|I haven’t even started, and I’m angry about who gets the credit.
Sevi|If you don’t want the role, I can ask someone else.
You|Yeah. Sorry. Please do.
He rests his notebook against the table.
Sevi|Okay.
I wait for the rest.
It doesn’t come.
Sevi|You don’t look relieved.
You|What am I supposed to look like?
Sevi|I don’t know. That’s why I’m asking.
Thought|I wanted the incentives.
Thought|I wanted to do something people would notice.
Thought|I just didn’t want it to become another reason to put our names beside each other.
You|I said yes because everyone was looking at me.
His fingers go still against the notebook.
Sevi|Oh.
You|And you kept saying I could do it.
Sevi|I thought that would help.
You|That just made it harder to say no.
Sevi|Okay. My bad.
He looks toward the empty chair beside me.
Sevi|I should’ve asked you first.
You|The incentives were tempting too.
Sevi|They are.
You|Doesn’t mean I should take it.
Sevi|No. It doesn’t.
For a moment, he looks as though he wants to argue anyway.
Sevi|We could split the work differently—
He stops.
Sevi|Sorry. You’ve already answered.
You|Yeah. I’m sure.
Thought|I hope he believes that.
Thought|I wish I sounded as sure inside my own head.
`,{next:'c2MeetingAfter'}),
c2MeetingAfter:meeting('Asking',`
You|Can I ask you something?
Sevi|What?
The chairs remain empty around us.
You|Why did you want me to be committee lead, anyway?
Sevi|I wanted to work with you.
You|You could’ve said that before mentioning the incentives.
Sevi|I should have. You did good work last time. We actually kept to your schedule.
You|Really?
Sevi|Yes. You checked with people before assigning them things.
He glances at the folder.
Sevi|Which I apparently should’ve remembered.
I let out a small breath.
You|Thanks. I’m still not joining, though.
Sevi|I know.
A reluctant smile touches his mouth.
Sevi|Noted.
I chuckle.
Thought|I wanted to work with you.
Thought|What a load of BS.
The thought arrives before I can stop it.
Thought|Maybe he means it.
Thought|I don’t know why I can’t let that be enough.
@interest|You|So you’re busy again. What about the exam?
@interest|He looks up.
@interest|Sevi|Yeah. Don’t worry. Hindi ko makakalimutan ’yung exam.
@interest|You|Of course you won’t.
@interest|Sevi|May humahabol sa ’kin.
@interest|The corner of his mouth moves.
@interest|You|Ugh. Whatever.
@interest|Sevi|Good luck, Dos.
@interest|He lingers beside the table.
@interest|Sevi|You can still sit with me sa library. Kahit wala ka na sa committee.
@interest|You|I’ll think about it.
@ordinary|You|Good luck, Sevi. Sorry again.
@ordinary|Sevi|It’s fine.
@ordinary|You|I’m still trying to beat your next exam score.
@ordinary|Sevi|I’d be disappointed if you stopped.
@ordinary|You|Don’t make it weird.
@ordinary|Sevi|Ikaw naman ’yung nag-bring up ng exam.
For a moment, the room feels ordinary.
Sevi|We’re okay.
He says it without making me ask.
Thought|He’s trying to reassure me.
Thought|Why can’t I feel better?
`,{next:'c2Hall'}),
c2Hall:scene('The voices follow',`
I step into the corridor.
His voice follows me.
Sevi’s voice|We’re okay.
Then it repeats.
And repeats.
Thought|I answered him.
Thought|I know I answered him.
The corridor stretches ahead.
Thought|Did I ask for too much?
Thought|What is everyone going to think about me now?
Thought|Did I leave him with everything?
Thought|If I stayed, what would happen when I couldn’t do it?
The next voice belongs to someone else.
Dad’s voice|Why are you making this difficult?
Mom’s voice|People are counting on you.
Thought|I already told you.
Thought|Why doesn’t saying it make it stop?
`,{place:'c2-empty-hallway',next:'c2Wave3'}),
c2Wave1After:scene('A moment between dreams',`
@wave1-clear|The last words dissolve before I can read them again.
@wave1-clear|Thought|Just forget it.
@wave1-clear|Thought|Out of sight, out of mind.
@wave1-clear|For a moment, the voices recede.
@wave1-clear|Somewhere beyond the corridor, I hear a fan.
@wave1-clear|I try to follow the sound, but the ringing swallows it.
@wave1-overwhelmed|The words grow until they overlap.
@wave1-overwhelmed|Thought|I’m trying.
@wave1-overwhelmed|Thought|I go to class. I do the work.
@wave1-overwhelmed|Thought|What else am I supposed to do?
@wave1-overwhelmed|I press my hands over my ears.
@wave1-overwhelmed|It makes no difference.
@wave1-overwhelmed|You|Tama na. Please.
@wave1-overwhelmed|The words blur into a shape I can no longer read.
@wave1-bypass|The voices fold into one another.
@wave1-bypass|I cannot catch the end of any sentence.
@wave1-bypass|Then, briefly, there is quiet.
The ringing fades into the scrape of a chair.
The corridor blurs around me.
`,{place:'c2-confrontation',next:'c2Committee'}),
c2Wave2After:scene('A message to send',`
@wave2-clear|The folder is still in front of me.
@wave2-clear|For a moment, it is only paper.
@wave2-clear|Thought|I can still talk to him.
@wave2-clear|Thought|Saying yes once doesn’t mean I can never change my mind.
@wave2-clear|I reach for my phone.
@wave2-overwhelmed|Every page becomes another thing I haven’t finished.
@wave2-overwhelmed|Thought|The schedule. The messages. The people waiting for me to decide.
@wave2-overwhelmed|Thought|And if it goes well, they’ll say Sevi organized everything.
@wave2-overwhelmed|Thought|If it goes badly—
@wave2-overwhelmed|You|I can’t do this.
@wave2-overwhelmed|The sentence sounds louder than I intended.
@wave2-overwhelmed|I reach for my phone before I can take it back.
@wave2-bypass|The pages settle.
@wave2-bypass|My phone lights up beside the folder.
@wave2-bypass|There is a message I need to send.
I type: “Can we talk? I don’t think I can be committee lead.”
His reply appears before I remember pressing send.
`,{place:'c2-assignment',next:'c2Confrontation'}),
c2Wave3:scene('No room to answer',`The voices crowd together.`,{place:'c2-empty-hallway',nightmare:3,next:'c2Calling'}),
c2Calling:scene('A voice outside the dream',`
Thought|I can’t—
You|Stop.
The voices soften.
The corridor tilts.
You|Stop. Please.
I reach for the railing, but my fingers close around fabric.
Rowan — distant|{name}?
You|Stop—
Rowan — distant|{name}. Hey.
The bell thins into the steady hum of a fan.
The corridor disappears.
Rowan — distant|{name}!
`,{place:'c2-empty-hallway',music:null,next:'c2Blackout'}),
c2Blackout:scene('Between sleeping and waking',`
For a moment, there is only darkness and the sound of my breathing.
`,{place:'c2-empty-hallway',blackout:true,music:null,next:'c2Wake'}),
c2Wake:room('Past noon',`
I open my eyes with a breath that catches in my throat.
The ceiling is wrong. The light is wrong.
You|Rowan?
Rowan|Yeah. It’s me.~concerned
My shirt sticks to my back.
I push myself upright. Rowan moves closer, then stops beside the bed.
Rowan|You okay?
The blue edge of the curtain comes into focus. The wardrobe. My bag beside it.
You|I… yeah.
Rowan|Sorry I came in. It’s past noon. I knocked, but then I heard you calling out.
He glances toward the open door.
Rowan|You were sweating. I kept calling your name, but you weren’t waking up.
You|I was dreaming.
Rowan|I thought so.
His hand is still curled around the back of the desk chair.
He notices and lets go.
Rowan|You’re in Saint Luis. You’re awake.
I press my palm against the sheet.
It stays beneath my hand.
`,{next:'c2WakeChoice',cgCue:{key:'c2-waking',from:'Rowan?'}}),
c2WakeChoice:room('A minute',`
Rowan|I can stay for a bit. Is that okay?~concerned
`,{rowan:true,choices:[opt('“Sure. I’m okay now. Just catching my breath.”','c2Okay',{nightmareResponse:'okay'}),opt('“I’m fine.” — I’m not ready to explain.','c2Fine',{nightmareResponse:'guarded'}),opt('“I need some space, please.”','c2Silent',{nightmareResponse:'space'})]}),
c2Okay:room('Catching my breath',`
You|I’m okay now. Just catching my breath.
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
Rowan|No, don’t apologize. I just didn’t know what to do.
He draws the chair closer after I nod, then sits.
For a few minutes, I listen to the fan and drink my water.
I set the glass down. Rowan stays beside me without asking any more questions.
After a while, he rises quietly and heads toward the doorway.
`,{rowan:true,music:'letters',next:'c2Food',cgCue:{key:'c2-company',from:'I set the glass down.',until:'After a while'}}),
c2Fine:room('I’m fine',`
You|I’m fine.
The words arrive before I decide whether they’re true.
Rowan looks at me, then at the glass on the desk.
Rowan|Okay.~concerned
He offers me the glass.
I take it with both hands.
Rowan|Do you want me to stay a minute?
You|You don’t have to.
Rowan|I can.
His voice catches slightly. He clears his throat.
Rowan|You don’t have to talk about it.
`,{rowan:true,choices:[opt('Tell him what I can.','c2Explain',{nightmareSupport:'talk'}),opt('“Thanks. I’d rather not explain.”','c2Company',{nightmareSupport:'company'}),opt('“Could I have a little time alone?”','c2Alone',{nightmareSupport:'privacy'})]}),
c2Explain:room('What I can tell him',`
You|It was about home. And school.
Rowan|Okay.~concerned
You|Everything was happening at once. My parents signing me up for things. People asking about Sevi.
I turn the glass between my hands.
You|He put me in charge of a committee once. I didn’t want to say yes, but everyone was there.
Rowan|So you said yes?
You|I laughed. Said I’d do it if nobody else wanted to.
Rowan pulls the desk chair closer.
Rowan|Can I sit?
You|Yeah.
I set the glass down as he sits.
You|I did tell him later that I wanted out. He said okay.
Rowan|But you were still worried?
You|Yeah. About what everyone would think. Whether he actually meant it.
Rowan|Yeah. Knowing you needed to stop doesn’t make it easy.
I look down at my hands.
You|I kept waiting for him to get angry.
Rowan|Did he?
You|No.
Saying it aloud makes me uncomfortable.
You|He tried to talk me into staying. Then he listened.
Rowan|Okay.
You|And the comparisons… I know he’s not telling people to say those things.
You|But sometimes I see him and I’m already angry.
Rowan|That sounds exhausting.
You|It is.
He rests his elbows on his knees.
For a moment, he looks as though he wants to say several things at once.
Rowan|I wish they’d notice what you do without bringing him into it.
My throat tightens again.
For a different reason this time.
You|Yeah.
`,{rowan:true,music:'letters',next:'c2Joke',cgCue:{key:'c2-company',from:'I set the glass'}}),
c2Joke:room('After the speech',`
Rowan|That sounded better in my head.~embarrassed
You|Oh?
Rowan|I had a whole speech about people asking before signing you up for things.~annoyed
You|With hand gestures?
Rowan|Several.
A small laugh escapes me. Rowan looks up.
You|You’d probably have volunteered to help me.
Rowan|After asking.~playful
You|After asking.
Rowan|And after the speech.
The laugh leaves my chest feeling a little less tight.
Rowan|A little better?~smile
You|A little. Thank you.
He gives me a small nod, then gets up and walks toward the door.
`,{rowan:true,music:'letters',next:'c2Food'}),
c2Company:room('Just stay',`
You|Thanks. I’d rather not explain.
Rowan|Okay.~concerned
You|Could you just stay for a bit?
Rowan|Yeah.
He sits in the desk chair.
Outside, someone calls to a neighbor. A motorbike passes, then fades down the hill.
I finish half the glass before either of us speaks again, then set it down.
You|Thank you, Rowan.
Rowan|Anytime.
When my breathing settles, he stands and makes his way to the door.
`,{rowan:true,music:'letters',next:'c2Food',cgCue:{key:'c2-company',from:'Anytime.',until:'When my breathing settles'}}),
c2Alone:room('A little time alone',`
You|Could I have a little time alone?
Rowan|Of course.~concerned
I set the glass beside me.
He leaves the chair where it is.
Rowan|I’ll be downstairs.
You|Thanks. I just need a minute.
Rowan|Take your time.
He steps into the doorway.
`,{rowan:true,next:'c2Food'}),
c2Silent:room('I need some space',`
You|I need some space, please.
It comes out quieter than I intended.
Rowan|Okay. I understand.~concerned
He takes the glass from the desk and sets it within my reach.
Rowan|I’ll be downstairs.
You|Thank you.
He nods.
At the doorway, his shoulders loosen a little when I reach for the water.
`,{rowan:true,next:'c2Food'}),
c2Food:room('Something to eat',`
Rowan pauses at the doorway.
Rowan|Have you eaten anything?~concerned
You|I just woke up, Ro.
Rowan|Right. Not my smartest question.~embarrassed
You|A little.
Rowan|I’ll see what’s downstairs. There should be eggs.
You|Should be?
Rowan|I haven’t checked. Don’t hold me to the eggs yet.
I manage a small smile.
Rowan|Come down when you’re ready.~smile
You|Okay, Ro.
`,{rowan:true,next:'c2SmallStep'}),
c2SmallStep:room('A small first step',`
His footsteps retreat down the stairs. After a pause, a cupboard opens.
I sit for another moment.
My hands have stopped shaking.
I take a sip of water and put the glass down. It leaves a damp circle on the bedside table.
You|Ugh. What a start.
I put my feet on the floor. The tiles are cool.
From downstairs comes the unmistakable sound of a cupboard refusing to close.
Rowan — downstairs|Seriously?
I look toward the door.
`,{music:'back-together',choices:[opt('Open the curtains.','c2Curtains',{morningStep:'curtains'}),opt('Fix the bed.','c2Wash',{morningStep:'bed'}),opt('Sit a little longer.','c2Sit',{morningStep:'sit'})]}),
c2Curtains:room('Daylight',`
I pull the curtain farther aside.
The sea is painfully bright. Someone has hung washing across the neighboring balcony.
I stand there until my eyes adjust.
`,{music:'back-together',next:'c2End'}),
c2Wash:room('One thing at a time',`
I straighten the sheet and pull the blanket into place.
I catch my reflection in the mirror. I look tired.
Thought|One thing at a time.
`,{music:'back-together',next:'c2End'}),
c2Sit:room('Another moment',`
I stay on the edge of the bed.
Downstairs, a pan touches the stove.
There is no reason I have to stand up this second.
`,{music:'back-together',next:'c2End'}),
c2End:room('The rest of today',`
Thought|Okay, Saint Luis.
Thought|Let’s see what the rest of today looks like.
`,{place:'c2-rest',music:'back-together',ending:true,openingEnd:true,cgCue:{key:'c2-rest',from:'Okay, Saint Luis.'}})
};

// Conditional dialogue follows earlier authored choices; it never awards attraction.
for(const node of Object.values(chapterTwo))node.lines=node.lines.flatMap(line=>{
 if(!line.speaker.startsWith('@'))return [line];
 const tag=line.speaker.slice(1),i=line.text.indexOf('|');
 const clean={...line,speaker:i<0?'':line.text.slice(0,i),text:i<0?line.text:line.text.slice(i+1)};
 if(tag.startsWith('wave')){const [wave,outcome]=tag.slice(4).split('-');return [{...clean,if:['nightmareOutcome'+wave,outcome]}];}
 if(tag==='interest')return [{...clean,if:['seviDescription','something']}];
 if(tag==='ordinary')return [undefined,'no','fine','acquaintance'].map(value=>({...clean,if:['seviDescription',value]}));
 return [{...clean,if:['seviCorridorResponse',tag]}];
});
