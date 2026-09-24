// Approved continuation. New IDs preserve every earlier saved reading position.
const scene=(place,title,text,end={})=>({place,time:'day',opening:true,continuation:true,title,
 lines:text.trim().split('\n').filter(Boolean).map(row=>{const [body,expression]=row.split('~');const i=body.indexOf('|');return {speaker:i<0?'':body.slice(0,i),text:i<0?body:body.slice(i+1),...(expression?{expression}: {})};}),...end});
const opt=(text,next,set)=>({text,next,set});
const porch=(title,text,end={})=>scene('reunion-porch',title,text,{music:'reunion',rowan:true,...end});
const flash=(place,title,text,end={})=>scene(place,title,text,{time:'night',music:'rainy-night',rowan:false,...end});
export const continuation={
rGreeting:porch('He’s here',`
He’s here.~surprised
For the whole trip, I wondered what I’d say if I saw him.
Now I can’t remember any of it.
`,{choices:[opt('Greet him normally.','rNormal',{greeting:'normal'}),opt('Let your excitement show.','rExcited',{greeting:'excited'}),opt('Blurt out the first thing that comes to mind.','rShocked',{greeting:'shocked'}),opt('Pretend you don’t recognize him.','rOblivious',{greeting:'oblivious'})]}),
rNormal:porch('A familiar voice',`
You|Hey, Rowan. It’s good to see you.
I manage a smile.~smile
Rowan|Hey.
Rowan|You’re— Sorry. Hi.
He smiles, then lets out a breath. He looks as lost for words as I feel.
`,{next:'rHugAsk'}),
rExcited:porch('A familiar voice',`
You|Rowan! I missed you.
That comes out much more easily than I expected.~smile
His face lights up.
Rowan|I missed you too.
Rowan|You could’ve warned me. I would’ve—
He glances at the tools.
Rowan|Put the hammer away, at least.~playful
`,{next:'rHugAsk'}),
rShocked:porch('A familiar voice',`
You|Rowan? You’re still alive?
There were so many better things I could have said.~playful
He looks down at himself.
Rowan|Were you expecting a ghost?
You|Good. That’s... good.
Rowan|I’m choosing to take that as “nice to see you.”
`,{next:'rHugAsk'}),
rOblivious:porch('A familiar voice',`
You|Sorry. Who are you?~surprised
I know it’s him. I just need another second.
His smile falters.~concerned
Rowan|It’s Rowan.
You|I know. Sorry. That was a terrible joke.
He watches me for a moment.~neutral
Rowan|Don’t do that. I nearly believed you.
His smile comes back.~smile
Rowan|Let me give you a proper hello.
`,{next:'rHugAsk'}),
rHugAsk:porch('Room to choose',`
He sets the hammer down and gets to his feet.~smile
He’s taller than I remember.
Of course he is. We were eleven the last time I saw him.
Rowan|You really came back.
You|Yeah.
He takes two quick steps toward me, then catches himself reaching out.~embarrassed
Rowan|Can I?
`,{choices:[opt('Hug him.','rHugFirst',{reunionBoundary:'hug',hugApproach:'first'}),opt('Let him come to you.','rHugWait',{reunionBoundary:'hug',hugApproach:'wait'}),opt('Ask for a moment.','rSpace',{reunionBoundary:'space'})]}),
rHugFirst:porch('Welcome back',`
I step forward before he finishes asking.~smile
`,{next:'rHug'}),
rHugWait:porch('Welcome back',`
I nod.~smile
He closes the space between us.
`,{next:'rHug'}),
rHug:porch('Welcome back',`
He wraps his arms around me.~smile
For a moment, I stand there with my bag still hanging from one hand.
Then I hug him back.
Rowan|I missed you.
His voice is deeper now.
The way he holds me is familiar.
He rocks us gently once, then laughs under his breath.
Rowan|Sorry. I’ve wanted to do that for a while.
You|Hug me?
Rowan|See you. The hug too.
I thought he might be angry. I had answers ready for that.
I wasn’t ready for this.
`,{next:'rEmotion'}),
rSpace:porch('Room to breathe',`
You|Give me a second?
Rowan|Of course.~neutral
He lowers his arms and gives me some room.
He stays beside me without trying again.
Rowan|I missed you.~smile
Rowan|I have about twenty questions.
You|Only twenty?
Rowan|I’m cutting it down. They can wait.~playful
I look down at the porch.
I thought he might be angry. I had answers ready for that.
I wasn’t ready for him to be patient.
`,{next:'rEmotion'}),
rEmotion:porch('A little too much',`
My eyes start to sting.~concerned
Not now.
`,{choices:[opt('Let yourself cry.','rCry',{reunionTears:true}),opt('Hold back your tears.','rHold',{reunionTears:false})]}),
rCry:porch('Take your time',`
Shit. Bakit ngayon pa?~concerned
I wipe at my face, but that only makes it more obvious.
Rowan|Hey.
You|Sorry. I didn’t mean to—
Rowan|It’s okay.
I try to answer. Nothing comes out.
He waits.
I don’t have to explain it right away.
For once, nobody is asking me to pull myself together.
After a while, I take a steadier breath.
You|Thanks.
Rowan|Take your time.~smile
`,{next:'rCatchup'}),
rHold:porch('Take your time',`
I look past his shoulder and take a slow breath.~concerned
Then another.
Rowan|Long trip?
You|Very.
He glances at my face. For a second, I think he’s going to ask more.
Rowan|We should get you inside soon.~neutral
I’m grateful he leaves it there.
`,{next:'rCatchup'}),
rCatchup:porch('Twelve years to catch up on',`
You|So. Long time no see.~smile
Rowan|Yeah. Just a little.
You|Twelve years, Ro.
Rowan|I was trying to be polite.~playful
I laugh.
It helps.
Rowan|How long are you staying?~neutral
You|For the summer.
His eyebrows lift.~surprised
Rowan|The whole summer?
You|You seem pleased.
Rowan|I’m being very normal about it.~playful
I’m glad he isn’t.
You|That’s the plan. I needed a break from college.
I look toward the open door.~smile
You|And I thought I’d clean the house. See what needs fixing.
Rowan|There’s a list.
You|Of course there is.
Rowan|You don’t have to start today.
You|Good. Today I’d like to sit down.
Rowan|Very ambitious.~playful
For a few minutes, talking to him feels easy.
He asks about the trip. I tell him about the crowded bus and my missing wallet.
Rowan|Someone took it?~concerned
You|I think so. My cards were in my bag, at least.
Rowan|Do you need anything?
You|I’m okay for now. The driver helped me get here.
He nods, though he still looks concerned.
`,{music:'catching-up',next:'rContact'}),
rContact:porch('The question',`
Then there’s a pause.~neutral
Rowan looks down at the hammer beside the door.
Rowan|Can I ask you something?
I think I know what’s coming.
You|Yeah?
Rowan|Why didn’t you contact me?~concerned
My hand tightens around my bag strap.
There it is.
`,{music:'lost-contact',choices:[opt('I didn’t really get the chance.','rBusy',{contactAnswer:'busy'}),opt('I didn’t have your new number.','rNumber',{contactAnswer:'number'}),opt('Can we talk about it another time?','rLater',{contactAnswer:'later'})]}),
rBusy:porch('What to say',`
You|I didn’t really get the chance. Things at home were... complicated.~concerned
Rowan|Oh. I didn’t know.
You|There’s a lot I haven’t told you.
Rowan|You can tell me when you’re ready.
He looks down at the phone in his hand.
Rowan|I just missed hearing from you.~sad
`,{music:'lost-contact',next:'rExchange'}),
rNumber:porch('What to say',`
You|I didn’t have your new number. Sorry.~neutral
Rowan|Oh. I gave it to your parents.
You|They didn’t pass it on.
He looks down for a moment.~sad
Rowan|Oh. Okay. We can fix that.~neutral
`,{music:'lost-contact',next:'rExchange'}),
rLater:porch('What to say',`
You|Can we talk about that later? I’ve had a long day.~concerned
Rowan|Yeah. We can.
There’s a short pause.
Rowan|You’ve only just got here. We have time.~smile
`,{music:'lost-contact',next:'rExchange'}),
rExchange:porch('A yellow envelope',`
He takes out his phone.~neutral
Rowan|Do you want my number now?
You|Yeah.
Rowan|I’ll give you my SG account too.
Rowan|If one doesn’t work, try the other.~playful
I reach for my phone.
His number. His account.
He’s offering them like staying in touch should be simple.
It should have been.
I remember a yellow envelope.
My name on the front.
A little boat drawn beside his.
`,{music:'lost-contact',next:'rLetterPromise'}),
rLetterPromise:scene('reunion-porch','Before I left Saint Luis',`
I was eleven. We were leaving at the end of the week.~neutral
Rowan sits on Lola’s porch steps, watching a patch of sunlight slip between the railings.~sad
Usually, he makes room before I reach him. Today, it takes him a moment.
Rowan|You’re really leaving?~concerned
You|Soon.
Rowan|Before summer’s over.
He rubs his thumb along a seam in his shorts.
Rowan|I thought we still had more time.~sad
Lola (off-screen)|More time for what, Rowan?
Rowan|Everything.
The word comes out smaller than he seems to mean it.
Lola (off-screen)|You could write to each other.
Rowan|Actual letters?~surprised
You|Couldn’t we just use our parents’ phones?
Lola (off-screen)|Of course. When they’re free, you can ask to call.
Rowan|So… we can still talk?~concerned
Lola (off-screen)|Yes. Letters can be something you do as well.
You|But a call would be faster.
Lola (off-screen)|It would. But a letter can stay with you after the conversation is over. You can fold it up, keep it somewhere safe, and read it again.
Rowan|Even years later?
Lola (off-screen)|If you take care of it.
You|You could put drawings in them, too.
Rowan|You’d keep my drawings?~surprised
You|If you tell me what they’re supposed to be.
A small smile tugs at his mouth.~smile
Rowan|My drawings aren’t that bad.~playful
Lola (off-screen)|And you can write about things you forget to mention on the phone. Something funny. Something you noticed on the way home.
Rowan|What if nothing happens?~neutral
Lola (off-screen)|Then tell each other that. You don’t need a grand adventure to fill a page.
You|How would we send them?
Lola (off-screen)|Give them to your parents. They can carry them when they visit, or help with the addresses and post them for you. I’ll speak with them so everyone knows where to send the replies.
Rowan|So we write them, and they help get them there?
Lola (off-screen)|Exactly.
You|And we can still call while we’re waiting?
Lola (off-screen)|Of course.
Rowan|But don’t tell me everything in your letter on the phone.~playful
You|Why?
Rowan|I want something to find out when I open it.~smile
He looks up toward the doorway.~neutral
Rowan|Do you have envelopes?
Lola (off-screen)|A few kinds. Let me bring them out.
`,{time:'evening',music:'letters',rowan:true,childhood:true,next:'rPorchEnvelopes'}),
rPorchEnvelopes:scene('reunion-porch','A little sunshine',`
Lola’s footsteps approach from inside the house.~neutral
Lola sets a small box on the porch table. Inside are cream envelopes, pale blue ones, and a bright yellow stack.
Lola (off-screen)|Go on. Choose.
Rowan|The yellow ones.~smile
Lola (off-screen)|That was quick.
Rowan|They look like here.~neutral
You|Here?
Rowan|Saint Luis. When the sun’s on the steps.
He glances at the light beside his shoes, then back at the envelopes.
Rowan|Like when we stay outside all afternoon and you say it’s too hot.~smile
Rowan|If it’s cold where you are… maybe these can look warm.
Lola (off-screen)|I’m afraid the post office won’t let you mail the sunshine.
Rowan|Just a little.~playful
He chooses a yellow envelope and holds it carefully by the edges.~smile
Rowan|And you’ll know it’s mine. Before you even read my name.
`,{time:'evening',music:'letters',rowan:true,childhood:true,choices:[opt('I’ll look for the yellow ones.','rYellowLook'),opt('You still have to put your name on it.','rYellowName'),opt('I might not always know what to write back.','rYellowWords')]}),
rYellowLook:scene('reunion-porch','The yellow ones',`
You|I’ll look for the yellow ones.
Rowan|Then I’ll keep using them.~smile
`,{time:'evening',music:'letters',rowan:true,childhood:true,next:'rYellowPromise'}),
rYellowName:scene('reunion-porch','An extra clue',`
You|You still have to put your name on it.
Rowan|I will. The yellow is the extra clue.~playful
`,{time:'evening',music:'letters',rowan:true,childhood:true,next:'rYellowPromise'}),
rYellowWords:scene('reunion-porch','Something small',`
You|I might not always know what to write back.
Rowan|That’s okay. You can tell me one thing. Even something small.~smile
`,{time:'evening',music:'letters',rowan:true,childhood:true,next:'rYellowPromise'}),
rYellowPromise:scene('reunion-porch','I’ll write first',`
Lola (off-screen)|You can take your time with a letter. That’s one of the nice things about them.
Rowan|I’ll write first.~smile
He looks at me as he says it, smiling over the yellow envelope.
Rowan|So you’ll know where to start.
He writes his name in big, uneven letters and draws a tiny boat underneath it.
You|Is that a shoe?
Rowan|It’s a boat!~surprised
You|Oh. Obviously.
Rowan|You’d better recognize it next time.~playful
Lola laughs from beside the porch table.
You|You’ll get a letter too, Lola.
Lola (off-screen)|I’ll look forward to it.
Rowan|We can still do both. Calls and letters.~smile
I thought we’d always have things to tell each other.
`,{time:'evening',music:'letters',rowan:true,childhood:true,next:'rLetterYears'}),
rLetterYears:porch('The letters we kept',`
Messages were quick. Letters were the things we wanted to keep.~neutral
I gave mine to my parents whenever they went back to Saint Luis.
At first, they brought envelopes home for me too.
Then fewer came. Then none.
Mom kept saying there weren’t any.
Eventually, I stopped asking.~sad
Two years ago, I found out why.
`,{music:'lost-contact',next:'rBedroom'}),
rBedroom:flash('manila-bedroom','Two years earlier',`
Lola had died a few days earlier.
I was in my room, staring at my phone.
I kept opening her contact.
There was no reason to. I knew she wouldn’t answer.
Downstairs, my parents were talking.
They sounded normal.
I knew people didn’t have to cry all the time to be grieving.
Still, I couldn’t understand how they could sound so normal.
I wanted to go back to Saint Luis.
Even if I was already too late for the funeral.
I stood up before I could talk myself out of asking.
`,{next:'rLanding'}),
rLanding:flash('manila-landing','What they kept from me',`
Dad|What are we doing with the house?
Mom|Not much we can do until someone checks the repairs.
Dad|Could rent it out.
Mom|With what money? The roof alone will cost us.
I stop near the stairs.
Mom|Rowan’s been looking after it. Let him handle it for now.
Dad|After the way he spoke to us?
Mom|He was upset.
Dad|He kept asking why we hadn’t brought {name}. Like we owed him an explanation.
I take another step down.
Mom|And he asked about his number again.
Dad|You didn’t give it to {name}, did you?
Mom|No.
For a second, I can only hear the rain.
You|Why not?
They both look up.
Mom|How long have you been standing there?
`,{choices:[opt('Push for an answer.','rPush',{familyResponse:'push'}),opt('Struggle to speak.','rQuiet',{familyResponse:'quiet'})]}),
rPush:flash('manila-service','Trying to be heard',`
You|Rowan gave you his number?
Mom|You had exams. You needed to focus.
You|You could have let me decide.
Dad|We weren’t going to let you throw everything aside.
You|I wanted to go to a funeral. I wasn’t dropping out.
My voice is getting louder.
You|I’ve done everything you asked. My grades are good. Why wasn’t that enough?
Dad|Lower your voice.
I try to answer, but Mom gets up and leaves the room.
`,{next:'rLetters'}),
rQuiet:flash('manila-service','Trying to be heard',`
You|I heard you talking.
Dad|You should be in your room.
I look at Mom.
I want to ask what Rowan said. When he called. How many times.
You|Why didn’t you tell me?
Mom|We’ve been over this. You needed to focus.
She gets up and leaves the room.
I stay where I am.
`,{next:'rLetters'}),
rLetters:flash('manila-service','The letters',`
Mom comes back carrying a box.
She puts it on the table beside the open service-area door.
Beyond it, a few coals are still glowing in the small brazier.
You|What’s that?
Mom|Letters.
I lift the lid.
Some envelopes are still white. Others have yellowed at the edges.
I recognize Lola’s handwriting.
Underneath it, Rowan’s.
You|These are for me?
Neither of them answers.
I pick up a yellow envelope.
To {name}. From Rowan.
The little boat was still there. His handwriting was neater now.
You|You said there weren’t any.
You|Did you give them mine? The letters I gave you?
Mom|That’s enough.
You|How long have you had these?
Mom|Put it back.
I look through the box.
Different dates. Different envelopes.
Some dates matched visits I remembered.
They kept writing.
They hadn’t forgotten me.
You|Why didn’t you give them to me?
Dad|Your mother asked you to put it back.
You|They’re mine.
Mom pulls the box toward her.
For a moment, I think she’s going to take it upstairs.
Instead, she carries it out to the covered service area.
Then she tips the letters into the brazier.
You|Wait!
`,{music:'letters',next:'rBurning'}),
rBurning:flash('manila-service','What was lost',`
Paper slides onto the coals.
I step forward, but the nearest envelopes have already caught.
Lola’s handwriting disappears into a curl of black paper.
You|Why would you do that?
Mom|We’re not having this argument again.
I’m still holding Rowan’s envelope.
I fold my hand around it.
Dad|Go to your room.
I don’t move.
Mom comes over and puts an arm around my shoulders.
I go stiff.
Mom|We’re trying to help you.
I look at the fire.
You|Please don’t.
Her arm falls away.
Mom|Go upstairs, {name}.
This time, I do.
I take the yellow envelope with me.
After that, whenever I thought about contacting Rowan, I remembered the box.
I was still living with my parents. I was afraid of what else they might take away.
And I didn’t know how to explain what had happened.
So I kept putting it off.
`,{music:'letters',next:'rReturn'}),
rReturn:porch('Back on the porch',`
Rowan|{name}?~concerned
I blink.
He’s holding his phone out.
Rowan|You okay?
You|Yeah. Sorry.
I enter his number.~neutral
My hands are steady now.
Mostly.
This time, I have his number myself.
Rowan|I’ll send you a message so you have mine.
Rowan · text|It’s Rowan.
I let out a small laugh.~playful
You|Thanks for clearing that up.
He slips his phone into his pocket.~smile
I glance at the tools beside the door.
You|So. What were you doing to the lock?
Rowan|Fixing it. It kept sticking.~neutral
You|Oh.
I look at the hammer, then back at him.
You|Sorry I shouted at you.
Rowan|You saw a stranger messing with the door. Fair enough.~smile
You|You’re not a stranger.
His smile softens.
Rowan|No.
`,{music:'back-together',choices:[opt('Thanks for fixing it.','rThanks',{repairResponse:'thanks'}),opt('Have you been looking after the house?','rCaretaker',{repairResponse:'ask'}),opt('Want a hand?','rTools',{repairResponse:'help'})]}),
rThanks:porch('The little repairs',`
You|Thanks for fixing it.~smile
Rowan|No problem. Try it later. You shouldn’t have to fight it anymore.
`,{music:'back-together',next:'rBags'}),
rCaretaker:porch('The little repairs',`
You|Have you been looking after this place?~neutral
Rowan|Yeah. Your lola used to ask me to help with little things.~sad
He gathers a few loose screws into his palm.
Rowan|I kept checking in after.
You|You’ve been doing that all this time?
Rowan|When I can. I live right there.~neutral
He nods toward his house.
Like that explains all of it.
`,{music:'back-together',next:'rBags'}),
rTools:porch('The little repairs',`
You|Want a hand?~smile
Rowan|I’m nearly done. You could hold this, though.
He passes me a small tin.
I hold it while he drops the screws inside.
You|Very technical work.
Rowan|You’re doing well.~playful
`,{music:'back-together',next:'rBags'}),
rBags:porch('An extra pair of hands',`
He puts the tools away.~neutral
Then he notices me shifting my bag to the other shoulder.
Rowan|Want help carrying those in?~smile
`,{music:'back-together',choices:[opt('Thanks, but I’ve got them.','rOwnBags',{bagHelp:false}),opt('Yeah. Could you take this one?','rHelpBags',{bagHelp:true})]}),
rOwnBags:porch('An extra pair of hands',`
You|Thanks, but I’ve got them.~smile
Rowan|Okay. I’ll get the door.
He picks up his tools and steps aside.
`,{music:'back-together',next:'rInside'}),
rHelpBags:porch('An extra pair of hands',`
You|Yeah. Could you take this one?~smile
Rowan|Absolutely.
He takes the bag I offer him.
You|Careful. It’s heavy.
Rowan|What did you pack?~playful
You|Apparently everything.
He adjusts his grip.
Rowan|I noticed.
`,{music:'back-together',next:'rInside'}),
rInside:scene('living','Familiar, and different',`
Rowan pushes the door open.
It moves without catching.
I follow him in, then stop.
I thought I knew what I’d find.
The same furniture. The same curtains.
Dust, probably.
But someone has been taking care of this place.
I look around.
Everything is familiar.
And I can’t remember it ever looking quite like this.
`,{music:'back-together',rowan:false,ending:true,openingEnd:true})
};
// Branch-specific gestures preserve consent and avoid a hug on the space route.
const conditional=(text,flag,value)=>({speaker:'',text,if:[flag,value]});
continuation.rCry.lines.splice(3,0,conditional('He loosens his arms so I can move away if I want.','reunionBoundary','hug'));
const comfort=continuation.rCry.lines.findIndex(l=>l.text.startsWith('After a while'));
continuation.rCry.lines.splice(comfort,0,conditional('I lean against him again. He holds me without saying anything else.','reunionBoundary','hug'),conditional('He stays close, leaving enough room between us.','reunionBoundary','space'));
continuation.rHold.lines.splice(2,0,conditional('He lets go, but stays nearby.','reunionBoundary','hug'));
const textIndex=continuation.rReturn.lines.findIndex(l=>l.speaker==='Rowan · text')+1;
for(const greeting of ['normal','excited','oblivious','shocked'])continuation.rReturn.lines.splice(textIndex,0,{speaker:'Rowan · text',text:greeting==='shocked'?'The one who’s still alive.':'The one standing in front of you.',if:['greeting',greeting]});
