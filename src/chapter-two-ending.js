import {approvedChapterTwoCues} from './chapter-two-revision.js';
const lines=t=>t.trim().split('\n').map(r=>{const i=r.indexOf('|');return {speaker:r.slice(0,i),text:r.slice(i+1)};});
const n=(text,next,extra={})=>({title:'Are we starting again or continuing where we left off?',place:'c2-father-kitchen-night',time:'night',day:3,chapter:2,chapterTwo:true,opening:true,continuation:true,rowan:true,music:null,lines:lines(text),...(next?{next}:{}),...extra});
const choice=(text,next,set={})=>({text,next,set});
export function finishChapterTwo(story){
 Object.assign(story,{
 c2EndConfrontation:n(`Thought|Why is he here?
Thought|Why now?
|I’m feeling so many things at once.
|I don’t know whether to feel happy, sad, or angry.
Enrich|Look, I don’t want to take up too much of your time.
Enrich|Rowan, I want you to come with me.
Thought|What? Why now?
Mayumi|You really have some nerve.
Enrich|Mayumi, I know I’ve done some stupid things in the past. But I really want to make things right.
Mayumi|The only mistake here is you coming back into our lives.
Mayumi|Rowan and I have been doing just fine without you.
Enrich|Mayumi… please.
Enrich|Let Rowan come with me. I can help both of you.
Rowan|No.
Rowan|Leave. Now.
Enrich|Son, please.
Rowan|Did you really expect a happy family reunion?
Rowan|And now you want to take me away from my mother and Lola?
Rowan|’Wag ka ngang magpatawa.
Rowan|Just leave.
Enrich|Rowan…
Mayumi|Sinabi na ng anak mo. Leave.
Lola|Utoy, umalis ka na.
Enrich|Babalikan ko kayo.`,'c2FatherPresent',{rowan:false,viewpoint:'Rowan',place:'c2-father-stair-background',cgCue:{key:'c2-end-confrontation',from:'Why is he here?'}}),
 c2EndSupport:n(`Rowan|After that, groceries and other things started arriving at the house.
Rowan|Mama and I knew they were from my father. He was trying to bribe us into going with him.
Rowan|Of course, I didn’t accept any of it. But he kept sending more, and it became too much.
Rowan|Mama confronted him about it, but he still wouldn’t stop.
Rowan|Then came Lola’s funeral.
You|Lola’s funeral? What did he do?
Rowan|He paid for everything. He helped take care of the arrangements, too.`,'c2EndCheckups'),
 c2EndCheckups:n(`Rowan|Lola’s checkups, the funeral… my father paid for all of it.`,'c2EndExpectations'),
 c2EndCheckupsKnown:n(`You|Wait. Lola’s checkups… did your father pay for those too?
Rowan|Yeah. Sorry I didn’t mention that part.`,'c2EndExpectations'),
 c2EndExpectations:n(`Rowan|That was what changed Mama’s mind. She loved Lola so much. I guess seeing him help her made Mama want to give him another chance.
Rowan|I was still on the fence. But after everything he did for Lola, I thought I could give him a chance too.
You|So what happened after that?
Rowan|I went along with what he wanted.
Rowan|He started talking about meetings and people I should know. Then it was what I should wear. What I should say.
|He shakes his head.
Rowan|At first, I put up with it because…
You|Ro, you don’t have to—
Rowan|No. I want you to know.
You|Okay.
Rowan|I saw Mama.
Rowan|Grabe ’yung ngiti niya.
Rowan|She looked so happy talking to him. Parang nakalimutan niya lahat ng sama ng loob niya.
Rowan|I didn’t want to take that happiness away from her.
Rowan|So I tried my best to do everything my father wanted.
|He looks down.
|I think about the nightmare I had this morning and the memories that came with it.
Thought|Rowan’s been feeling this way too.
|He’s changed as he’s grown older.
|But he’s still the Rowan I grew up with.
|He continues.
Rowan|Only a few people know I’m the mayor’s son. Just some people at City Hall.
Rowan|And I like it that way. I want people to treat me as the Rowan they know, not Rowan Sanchez, the mayor’s son.
You|So Manong Nestor and the other vendors don’t know?
Rowan|No. My father wants to keep it private.
Rowan|But over time, his demands got worse. Don’t go to Manong Nestor. Don’t touch a hammer. Gardening doesn’t look good for the mayor’s son. Act more mature. Things like that.
Rowan|Then one day at City Hall, I overheard people comparing me to him. Talking about all the ways I didn’t measure up.
Rowan|I couldn’t handle it. I just wanted to leave. But Mama…
Rowan|She was so happy with him.
Rowan|Ma deserves everything.
You|Ro…`,null,{choices:[choice('Don’t forget about yourself.','c2EndYourself'),choice('That sounds hard.','c2EndHard')]}),
 c2EndYourself:n(`You|Your mother deserves to be happy, but so do you.
You|Tita wouldn’t want you to give up your own happiness for hers.
Rowan|I… don’t know. I don’t want to give her more things to worry about.
You|Ro…
Rowan|Thank you, {name}. For reminding me.
You|Just don’t forget about yourself, Ro.`,'c2EndApprenticeship'),
 c2EndHard:n(`You|That sounds hard, Ro. Have you told Tita how you feel?
Rowan|No. I’m scared.
You|Oh…
Thought|I don’t know what else to say.`,'c2EndApprenticeship'),
 c2EndApprenticeship:n(`You|Is it still like that now?
|He shakes his head slightly.
Rowan|No.
You|What happened?
|Rowan lets out a long breath.
Rowan|The apprenticeship.
You|Oh.
Rowan|I was walking around town when Manong Nestor called me over.
Rowan|He offered me an apprenticeship. That’s when I brought it up with Mama.
Rowan|She was excited, of course. My father wasn’t.
Rowan|He thinks carpentry doesn’t pay enough. That it’s embarrassing for the Sanchez name.
Rowan|But I like it. It’s hard, but I can do it.
|His eyes move toward the tools beside the back door.
Rowan|Manong Nestor let me help with a dining table last month. I kept finding excuses to look at it after we finished.
|I smile.
You|You were proud.
Rowan|Syempre.
|He smiles too, briefly.
Rowan|I want to get good at something I like.
You|So what happened with your father?
Rowan|We had a huge argument.
Rowan|That was the first time I saw Mama argue with him too.
Rowan|Mama wanted to support me, but he wanted me to stop doing carpentry completely. He even threatened to stop me from seeing Manong Nestor.
You|So what did you do?
Rowan|The best thing I could think of. I talked to both of them.
Rowan|I said I’d keep doing the things my father asked me to do, and carpentry would just be a hobby.
You|Then why don’t you tell Manong Nestor that?
Rowan|I told him about the hobby part. I guess he still thinks I have potential.
You|But you still want the apprenticeship, right?
Rowan|Of course.
You|Ro.
Rowan|I know I need to speak up. I just need time.
Rowan|And you’re here now. Can I focus on you for a while?`,'c2EndGlass'),
 c2EndGlass:n(`|He picks up a cloth and dries a glass that is already dry.
Rowan|I wanted this week to be nice.
You|It can still be nice.
Rowan|You had a nightmare this morning. You visited Lola. I didn’t want to add my problems to all that.
You|You can tell me your problems too, Ro.
|He nods, but keeps turning the glass.
You|And you don’t have to spend the whole summer looking after me.
|His hands slow.
Rowan|I like looking after you.
You|I know…
|I wait.
You|But you keep checking whether I’m okay, and you forget about yourself.
|He puts the glass down.
|Neither of us says anything for a moment.
Rowan|It’s fine…
You|Ro, alam kong hindi okay. You can tell me.
You|I care about you.
|He looks at me.
Rowan|I know you said you’re here for the summer.
You|Yeah.`,'c2EndStay',{cgCue:{key:'c2-end-glass',from:'He picks up a cloth',until:'He puts the glass down.'}}),
 c2EndStay:n(`Rowan|I guess I keep hoping you’ll change your mind. Haha.
|My chest tightens.
You|About leaving?
|He nods.
Rowan|Kahit a little longer lang.
You|Ro…
Rowan|You don’t have to answer. I know you’ve got school.
|He rubs the back of his neck.
Rowan|I just got used to you being here really fast.
|I move closer.
You|I missed you too.
|He looks at me.
You|But don’t forget about yourself just because you think you need to look after me.
Rowan|Sure ka?
You|I mean it.
|He glances at me.
Rowan|Thank you, {name}.
You|Anytime, Ro.`,'c2EndGoodbye',{cgCue:{key:'c2-end-stay',from:'I guess I keep hoping'}}),
 c2EndSkip:n(`Thought|I don’t want to make him talk about his past if it’ll only hurt him.
Rowan|{name}?
You|Oh, it’s nothing. Let’s just finish up.
|We finish cleaning without me asking Rowan about it.
|Somehow, he looks disappointed.`,'c2EndGoodbye'),
 c2EndGoodbye:n(`Rowan|Can I see you tomorrow?
|I laugh.
You|Nah. I might have someone coming over.
Rowan|Huh? Who?`,'c2EndLover',{place:'d2-porch-night'}),
 c2EndSevi:n(`You|Sevi.
Rowan|Fin—what?
Rowan|You’re joking, right?
You|Syempre, dumbass.`,'c2EndNight',{place:'d2-porch-night'}),
 c2EndLover:n(`You|My lover.
Rowan|Ha. Ha. Very funny.`,'c2EndNight',{place:'d2-porch-night'}),
 c2EndNight:n(`You|Hahaha. Of course you can come over.
Rowan|All right. See you tomorrow.
You|Night, Ro.
Rowan|Good night, {name}.
|Rowan leaves the house.`,'c2EndQuiet',{place:'d2-porch-night'}),
 c2EndKnown:n(`Thought|He’s the mayor’s son.
Thought|He loves carpentry.
Thought|He’s been trying so hard to meet his father’s expectations.
Thought|He really loves Tita Mayumi.
Thought|And he gives up a lot to look after me.
|There’s still so much we don’t know about each other.
|But I’m happy we finally got to see each other again.`,null,{rowan:false,place:'d2-porch-night',ending:true,openingEnd:true}),
 c2EndQuiet:n(`|When I pictured coming back, I always imagined us younger.
|Sitting on the steps. Arguing over nothing.
|I hadn’t pictured unanswered calls or a workshop needing an answer by Friday.
|There’s still a lot we don’t know about each other.
|At least we’re talking now.`,null,{rowan:false,place:'d2-porch-night',ending:true,openingEnd:true})
 });
 story.c2FatherReveal.next='c2EndConfrontation';
 story.c2FatherPresent.ending=false;story.c2FatherPresent.openingEnd=false;story.c2FatherPresent.next='c2EndSupport';
 story.c2KitchenListen.choices.push(choice('I don’t want to bother him.','c2EndSkip'));
 for(const [id,node] of Object.entries(story))if(id.startsWith('c2End')){
  for(const line of node.lines)if(line.speaker==='Rowan')line.expression=/Syempre|Thank you|Good night|All right/.test(line.text)?'smile':/Goodbye|Sevi|Lover/.test(id)?'playful':id==='c2EndStay'?'embarrassed':'concerned';
  if(node.cgCue)approvedChapterTwoCues[id]=node.cgCue;
 }
}
export function heardRowanHistory(state){return state.node==='c2EndKnown'||state.history?.some(h=>h.id.startsWith('c2EndExpectations:'));}
export function surnameRevealed(state){return !!state&&((state.node==='c2EndKnown'&&state.line>=6)||state.history?.some(h=>h.id==='c2EndKnown:6'));}
