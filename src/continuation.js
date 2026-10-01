// Approved continuation. New IDs preserve every earlier saved reading position.
const scene=(place,title,text,end={})=>({place,time:'day',opening:true,continuation:true,title,
 lines:text.trim().split('\n').filter(Boolean).map(row=>{const [body,expression]=row.split('~');const i=body.indexOf('|');return {speaker:i<0?'':body.slice(0,i),text:i<0?body:body.slice(i+1),...(expression?{expression}: {})};}),...end});
const opt=(text,next,set)=>({text,next,set});
const porch=(title,text,end={})=>scene('reunion-porch',title,text,{music:'reunion',rowan:true,...end});
const flash=(place,title,text,end={})=>scene(place,title,text,{time:'night',music:'rainy-night',rowan:false,...end});
export const continuation={
rGreeting:porch('He’s here',`
Thought|He’s here.~surprised
For the whole trip, I wondered what I’d say if I saw him.
Thought|Now I can’t remember any of it.
`,{choices:[opt('Greet him normally.','rNormal',{greeting:'normal'}),opt('Let your excitement show.','rExcited',{greeting:'excited'}),opt('Blurt out the first thing that comes to mind.','rShocked',{greeting:'shocked'}),opt('Pretend you don’t recognize him.','rOblivious',{greeting:'oblivious'})]}),
rNormal:porch('A familiar voice',`
You|Hey, Rowan. It’s good to see you.
I manage a smile.~smile
Rowan|Hey. You’re—
He lets out a breath.
Rowan|Sorry. Hi.
Rowan|It’s really good to see you.
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
Thought|There were so many better things I could have said.~playful
He looks down at himself.
Rowan|Were you expecting a ghost?
You|No. I don’t know why I said that.
Rowan|I’m choosing to take that as “nice to see you.”
`,{next:'rHugAsk'}),
rOblivious:porch('A familiar voice',`
You|Sorry. Who are you?~surprised
Thought|I know it’s him. I just need another second.
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
Thought|Of course he is. We were eleven the last time I saw him.
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
Thought|I thought he might be angry. I had answers ready for that.
Thought|I wasn’t ready for this.
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
Thought|I thought he might be angry. I had answers ready for that.
Thought|I wasn’t ready for him to be patient.
`,{next:'rEmotion'}),
rEmotion:porch('A little too much',`
My eyes start to sting.~concerned
Thought|Not now.
`,{choices:[opt('Let yourself cry.','rCry',{reunionTears:true}),opt('Hold back your tears.','rHold',{reunionTears:false})]}),
rCry:porch('Take your time',`
Thought|Shit. Bakit ngayon pa?~concerned
I wipe at my face, but that only makes it more obvious.
Rowan|Hey.
You|Sorry. I didn’t mean to—
Rowan|You don’t have to be sorry.
Rowan|It’s okay.
I try to answer. Nothing comes out.
He waits.
Thought|I don’t have to explain it right away.
Thought|For once, nobody is asking me to pull myself together.
After a while, I take a steadier breath.
You|Thanks, Ro.
Rowan|Yeah.~smile
`,{next:'rCatchup'}),
rHold:porch('Take your time',`
I look past his shoulder and take a slow breath.~concerned
Then another.
Rowan|We’ll get you sitting down in a minute.~neutral
You|Please.
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
You|That’s the plan.
You|You seem pleased.
Rowan|I’m being very normal about it.~playful
Thought|I’m glad he isn’t.
You|I needed a break from college.
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
Rowan|If that changes, tell me.
He nods, though he still looks concerned.
`,{music:'catching-up',next:'rContact'}),
rContact:porch('The question',`
He gathers the loose tools, then pauses.~neutral
Rowan turns a screwdriver in his hand.
Rowan|Can I ask you something?
You|Yeah?
Rowan|Why didn’t you contact me?~concerned
My hand tightens around my bag strap.
Rowan|I tried the old number. Then the account I had for you disappeared.
Rowan|I left my number with your parents when they came back.
Rowan|After a while, I thought you didn’t want to hear from me.~sad
Thought|That’s the part I was afraid of.
`,{music:'lost-contact',choices:[opt('I didn’t really get the chance.','rBusy',{contactAnswer:'busy'}),opt('I didn’t have your new number.','rNumber',{contactAnswer:'number'}),opt('Can we talk about it another time?','rLater',{contactAnswer:'later'})]}),
rBusy:porch('What to say',`
You|I didn’t really get the chance. Things at home were... complicated.~concerned
Rowan|Oh.
You|There’s a lot I haven’t told you.
He puts the screwdriver down.
Rowan|I wish I’d known.
You|I know.
Rowan|You don’t have to explain all of it now.
His voice softens.~sad
Rowan|I just missed you.
`,{music:'lost-contact',next:'rExchange'}),
rNumber:porch('What to say',`
You|I didn’t have your new number.~neutral
You|My parents didn’t give it to me.
Rowan|I wondered.~sad
You|I’m sorry.
Rowan|I wasn’t asking you to apologize. I wanted to know what happened.
You|I don’t think I can tell you all of it at once.
Rowan|Okay.~concerned
`,{music:'lost-contact',next:'rExchange'}),
rLater:porch('What to say',`
You|Can we talk about that another time, please?~concerned
He pauses.
Rowan|Yeah.
You|I’m not trying to ignore you.
Rowan|I know.
He sets the tools down.~neutral
Rowan|Another time.
`,{music:'lost-contact',next:'rExchange'}),
rExchange:porch('A yellow envelope',`
He takes out his phone.~neutral
Rowan|Do you want my number now?
You|Yeah.
Rowan|And my SG account. Backup plan.~smile
I reach for my phone.
We used to have a backup plan for calls, too.
Letters.
I remember the yellow envelopes.
`,{music:'lost-contact',next:'rLetterPromise'}),
rLetterPromise:scene('reunion-porch','Before I left Saint Luis',`
I was eleven. We were leaving at the end of the week.~neutral
Rowan sits beside me on Lola’s porch steps.
Rowan|Before summer’s over?~concerned
You|Yeah.
He picks at a loose thread on his shorts.
Rowan|I thought we had more time.~sad
Lola (off-screen)|You can still call when your parents are free. And you can write.
Rowan|Actual letters?~surprised
Lola (off-screen)|I have paper and pens. Your parents can carry them when they visit. I’ll help you send yours, Rowan.
You|Calling would be faster.
Lola (off-screen)|It is.
She shows us a drawing I gave her. The corners are folded from being kept in her bag.
Lola (off-screen)|But I like having this, too.
Rowan|What if nothing happens?~neutral
You|Tell me what you had for lunch.
Rowan|That sounds boring.~playful
You|Depends on the lunch.
He almost smiles.~smile
Rowan|Do you have envelopes?
Lola (off-screen)|Let me get them.
`,{time:'evening',music:'letters',rowan:true,childhood:true,next:'rPorchEnvelopes'}),
rPorchEnvelopes:scene('reunion-porch','A little sunshine',`
Lola’s footsteps approach from inside the house.~neutral
Lola sets a small box on the porch table. Cream envelopes, pale blue ones, and a yellow stack.
Rowan|These.~smile
You|Why yellow?
He chooses a yellow envelope and holds it up beside the sunlight on the steps.
Rowan|Looks like here.
He hands it to me.
Rowan|You’ll know it’s mine.
`,{time:'evening',music:'letters',rowan:true,childhood:true,choices:[opt('I’ll look for the yellow ones.','rYellowLook',{yellowPromise:'look'}),opt('You still have to put your name on it.','rYellowName',{yellowPromise:'name'}),opt('I might not always know what to write back.','rYellowWords',{yellowPromise:'words'})]}),
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
He picks up a pen.~neutral
Rowan|I’ll write first.~smile
He smiles at me over the yellow envelope.
I hold it steady for him.
He writes his name in big, uneven letters and draws a little boat below it.
You|Is that a shoe?
Rowan|It’s a boat!~surprised
You|Oh. Obviously.
Lola laughs.
Lola (off-screen)|Do I get a letter?
You|Of course.
Rowan|We all have to reply.~smile
Lola (off-screen)|Agreed.
You|Promise, Ro.
We leave the envelope on the table while the ink dries.
`,{time:'evening',music:'letters',rowan:true,childhood:true,next:'rLetterYears'}),
rLetterYears:porch('The letters we kept',`
At first, we did both. Calls and letters.~neutral
My parents carried our envelopes when they visited Saint Luis.
Then the calls got shorter.
“Not now.” “Maybe next weekend.”
By the time I had my own phone, the number I knew didn’t work.
I asked my parents. They said they’d find out.
I believed them for longer than I should have.
The letters stopped coming, too.
I thought Rowan had stopped writing.~sad
`,{music:'lost-contact',next:'rReturn'}),
rBedroom:flash('manila-bedroom','Two years earlier',`
Lola had died a few days earlier.
I was in my room, staring at my phone.
I kept opening her contact.
There was no reason to. I knew she wouldn’t answer.
Downstairs, my parents were talking.
They sounded normal.
I knew people didn’t have to cry all the time to be grieving.
Thought|Still, I couldn’t understand how they could sound so normal.
Thought|I wanted to go back to Saint Luis.
Thought|Even if I was already too late for the funeral.
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
You|Rowan was trying to reach me?
Mom|You had exams. You needed to focus.
You|You could have given me his number.
Dad|We knew you’d want to leave.
You|For a funeral. I wasn’t dropping out.
My voice gets louder.
You|I’ve done everything you asked. Why isn’t that enough?
Dad|Lower your voice.
I stop, but the question is still there.
`,{next:'rLetters'}),
rQuiet:flash('manila-service','Trying to be heard',`
Dad|What are you doing here?
You|I heard you.
I look at Mom.
You|How many times?
Mom|What?
You|Did he ask?
She looks away.
Mom|You needed to focus on school.
I grip the railing until I can get the next words out.
`,{next:'rLetters'}),
rLetters:flash('manila-service','The letters',`
You|Were there letters too?
Neither of them answers.
You|You kept telling me there weren’t any.
Mom|I put some things aside.
You|Where?
She stays seated.
You|Please. Let me see them.
Mom gets up. When she returns, she’s carrying a box.
She puts it on the table beside the open service-area door.
Mom|I was going to give these to you after things settled down.
I lift the lid.
Some envelopes are white. Others have yellowed at the edges.
I recognize Lola’s handwriting. Underneath it, Rowan’s.
You|Some of these are years old.
Mom folds her arms.
I pick up a yellow envelope.
To {name}. From Rowan.
The little boat is still there. His handwriting is neater now.
You|Did you give them mine?
Mom|Not tonight.
You|The letters I gave you. Did you deliver them?
Dad|Your mother kept those things aside because you couldn’t settle here.
You|I was a kid. I missed them.
Mom|Every call ended with you wanting to go back.
You|That didn’t mean you could hide this.
I reach for the others.
Mom pulls the box toward her.
You|Leave it. They’re mine.
Mom|And now you’ve seen them, you’re doing exactly what we were trying to avoid.
She lifts the box.
You|I’m calling him.
She stops.
Through the open door, I can see the coals left from dinner in the small brazier.
She carries the box outside.
Then she tips the letters into the brazier.
You|Wait!
`,{music:'letters',next:'rBurning'}),
rBurning:flash('manila-service','What was lost',`
Paper slides onto the coals.
I step forward, but the nearest envelopes have already caught.
Lola’s handwriting disappears into a curl of black paper.
You|Why would you do that?
Mom|Enough. We’re done with this.
I hold Rowan’s envelope against my chest.
Dad stands up.
Mom comes over and puts an arm around my shoulders.
I go stiff.
Mom|You have a life here. You need to stop doing this to yourself.
You|Don’t.
She looks at me.
You|Please don’t touch me.
Her arm falls away.
I leave before either of them can say anything else.
I take the yellow envelope with me.
`,{music:'letters',next:'rEnvelope'}),
rEnvelope:flash('manila-bedroom','The yellow envelope',`
I close my bedroom door.
For a while, I stand with my hand on the handle.
Then I look down.
The envelope is bent where I’ve been gripping it.
Yellow paper. My name.
A little boat beneath his.
I sit on the bed and turn it over.
It’s still sealed.
`,{music:'letters',choices:[opt('Open it now.','rReadNow',{letterTiming:'now'}),opt('Keep it sealed for now.','rKeepSealed',{letterTiming:'later'})]}),
rReadNow:flash('manila-bedroom','What did you want to tell me?',`
You|What did you want to tell me, Ro?
I ease a finger under the flap.
The paper tears a little at the corner.
I stop, then try more carefully.
Inside are two folded pages.
`,{music:'letters',next:'rLetterNow'}),
rKeepSealed:flash('manila-bedroom','Not tonight',`
I put my finger under the edge of the flap.
Then pull it away.
Thought|I want to read it.
Thought|I just can’t do it while I can still smell the smoke on my clothes.
You|Not tonight.
I tuck the envelope inside a notebook and slide it into my bag.
Thought|They aren’t taking this one.
I keep it.
Through the next semester. Through changing bags. Through every time I think about finding him.
After a while, opening it feels like another thing I’ve waited too long to do.
But when I pack for Saint Luis, I bring it.
`,{music:'letters',next:'rAfterEnvelope'}),
rReadNowAfter:flash('manila-bedroom','A few months ago',`
I look at the date again.
Thought|A few months ago.
Thought|Lola was still making pancit.
Thought|Still asking him to reach things.
Thought|Still sending reminders through someone else’s letter.
I read the part about her twice.
Then I fold the pages along the same creases.
Thought|He was waiting for an answer.
Thought|They both were.
You|I missed you too.
There’s nobody here to hear it.
I put the letter back in its envelope and keep it beside me that night.
`,{music:'letters',next:'rAfterEnvelope'}),
rAfterEnvelope:flash('manila-bedroom','What I carried',`
After that, whenever I thought about contacting Rowan, I remembered the box.
I was still living with my parents. I was afraid of what else they might take away.
And I didn’t know how to explain what had happened.
So I kept putting it off.
`,{music:'letters',next:'rWater'}),
rReturn:porch('Back on the porch',`
Rowan|{name}?~neutral
I look up from my phone.
Rowan|Ready?
You|Yeah.
I enter his number.
Rowan|I’ll send you a message so you have mine.~smile
Rowan · text|It’s Rowan.
I let out a small laugh.~playful
You|Thanks for clearing that up.
He slips his phone into his pocket.~smile
Thought|This time, the number is mine to keep.
I glance at the tools beside the door.
You|So. What were you doing to the lock?
Rowan|Fixing it. It kept sticking.~neutral
You|Sorry I shouted at you. I thought someone was messing with the door.
Rowan|Fair enough.~smile
You|You’re not just someone.
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
Thought|Like that explains all of it.
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
He takes the bag I offer him, then adjusts his grip.
Rowan|Did you pack your whole room?~playful
You|Only the important parts.
Rowan|Apparently the walls were important.
`,{music:'back-together',next:'rInside'}),
rInside:scene('living','Familiar, and different',`
Rowan pushes the door open.
It moves without catching.
I follow him in.
The curtains are clean. The table has been wiped down.
Lola’s old chair is still by the window.
There’s a new piece of wood beneath one armrest. It’s lighter than the rest.
You|You fixed her chair.
Rowan|It was coming loose.
I run my thumb over the edge. He’s sanded it smooth.
Rowan|I’ll get some water.
He heads toward the kitchen.
I set my bag beside the chair and open the inside pocket.
My cards are still there.
So is the envelope I brought with me.
Yellow, though not as bright as it used to be.
I hadn’t planned to take it out yet.
The last time I held it like this, I was standing in my room in Manila.
`,{music:'back-together',rowan:false,next:'rBedroom'})
};
// Branch-specific gestures preserve consent and avoid a hug on the space route.
const conditional=(text,flag,value)=>({speaker:'',text,if:[flag,value]});
continuation.rCry.lines.splice(3,0,conditional('He loosens his arms so I can move away if I want.','reunionBoundary','hug'));
const comfort=continuation.rCry.lines.findIndex(l=>l.text.startsWith('After a while'));
continuation.rCry.lines.splice(comfort,0,conditional('I lean against him again. He holds me without saying anything else.','reunionBoundary','hug'),conditional('He stays close, leaving enough room between us.','reunionBoundary','space'));
continuation.rHold.lines.splice(2,0,conditional('He lets go, but stays nearby.','reunionBoundary','hug'));
const textIndex=continuation.rReturn.lines.findIndex(l=>l.speaker==='Rowan · text')+1;
for(const greeting of ['normal','excited','oblivious','shocked'])continuation.rReturn.lines.splice(textIndex,0,{speaker:'Rowan · text',text:greeting==='shocked'?'The one who’s still alive.':'The one standing in front of you.',if:['greeting',greeting]});


continuation.rEmotion.lines.unshift(
 conditional('He takes a closer look at my face.','griefResponse','cry'),
 {speaker:'Rowan',text:'Rough walk up?',if:['griefResponse','cry'],expression:'concerned'},
 {speaker:'You',text:'Something like that.',if:['griefResponse','cry']},
 conditional('He nods without asking me to explain.','griefResponse','cry'));
const callbackIndex=continuation.rReturn.lines.findIndex(l=>l.text==='He slips his phone into his pocket.');
continuation.rReturn.lines.splice(callbackIndex,0,
 conditional('No waiting for someone to bring it home.','yellowPromise','look'),
 conditional('His name is right above the message. No extra clue needed.','yellowPromise','name'),
 {speaker:'You · text',text:'Made it here.',if:['yellowPromise','words']},
 conditional('One small thing. Just like he said.','yellowPromise','words'));
const envelopeIndex=continuation.rLetters.lines.findIndex(l=>l.text.startsWith('The little boat'))+1;
continuation.rLetters.lines.splice(envelopeIndex,0,
 conditional('I looked for yellow envelopes after every visit.','yellowPromise','look'),
 conditional('His name. The yellow paper. Both clues were there. Neither reached me.','yellowPromise','name'),
 conditional('One small thing would have been enough. There’s a whole box here.','yellowPromise','words'));

// One authored letter, shared by both reading routes. No chat-generated history.
export const rowansLetter=[
 'Hey, {name}.',
 'I turned twenty-one last week.',
 'Lola made pancit. She said the extra serving was for you, then told me to finish it before it went cold.',
 'I did. Sorry.',
 'I’m still not sure whether these letters are getting to you. Your parents said you’ve been busy with school.',
 'I hope it’s going okay.',
 'A few updates from here:',
 'I’m taller now. Properly taller. Lola asks me to get things from the top shelf instead of dragging a chair over.',
 'She still tells me to be careful, though. Apparently reaching for a jar is dangerous work.',
 'And my hair’s long.',
 'I meant to get it cut a while ago, but I kept putting it off. Now I can tie it back.',
 'Lola says it’s fine as long as I keep it out of the food.',
 'You’d probably have something to say about it.',
 'I’ve been helping her around the house. Mostly little repairs. I fixed a cupboard door last week, and it only took two tries.',
 'She made sure to tell your mom about the first try.',
 'Some things here haven’t changed much.',
 'Your seat at the table still wobbles.',
 'The hill still feels worse going up.',
 'I still look over when someone stops outside the gate.',
 'I miss you.',
 'I was going to write something less awkward, but that’s what I wanted to say.',
 'Sometimes something happens and I think, “I need to tell {name}.”',
 'Then I remember I can’t just go next door and find you.',
 'You don’t have to explain everything if you write back.',
 'Tell me what you had for lunch. Tell me something annoying that happened in class.',
 'One small thing is enough.',
 'I’d just like to hear from you.',
 'Lola says to eat properly and stop staying up so late.',
 'That last part might have been for both of us.',
 'Take care, okay?',
 'Ro',
 'P.S. The drawing is still a boat.'
];
const letterScene=(place,time,next)=>scene(place,'Rowan’s letter',
 'The date is a few months before Lola died. Just after Rowan’s twenty-first birthday.',
 {time,music:'letters',rowan:false,letter:true,next});
continuation.rLetterNow=letterScene('manila-bedroom','night','rReadNowAfter');
continuation.rLetterLater=letterScene('bedroom','evening','rLetterLaterAfter');
continuation.rWater=scene('living','A glass of water',`
The sound of a glass on the table brings me back.
Rowan|Here.~neutral
He sets a glass of water beside me.
His eyes move to the envelope, then back to me.~surprised
Rowan|You still have that?
You|Yeah.
He recognizes the little boat.~neutral
Rowan|I remember that one. Just after my twenty-first birthday.
He sits across from me.
Rowan|I wrote again after, but I never finished it. Lola got sick, and…~sad
He looks toward her chair.
Rowan|Then everything happened.
`,{music:'back-together',rowan:true,next:'rWaterReply'});
const readingLine=(speaker,text,timing,expression)=>({speaker,text,if:['letterTiming',timing],...(expression?{expression}:{})});
continuation.rWaterReply=scene('living','What I want to tell you','', {music:'back-together',rowan:true,next:'rSettled'});
continuation.rWaterReply.lines=[
 readingLine('','I glance at the envelope. The pancit. The cupboard door. Her reminder to eat.','now'),
 readingLine('','That was the last letter he sent while she was still here.','now'),
 readingLine('You','She told you to make sure I was eating.','now'),
 readingLine('Rowan','Yeah. She worried.','now','smile'),
 readingLine('You','You wrote it down.','now'),
 readingLine('Rowan','She asked me twice.','now'),
 readingLine('','I look down before he can see my face change.','now'),
 readingLine('','His eyes settle briefly on the flap.','later','neutral'),
 readingLine('You','I haven’t opened it.','later'),
 readingLine('Rowan','Oh.','later','concerned'),
 readingLine('You','I wanted to. I just…','later'),
 readingLine('','I stop. He nods, though I’m not sure how much he understands.','later'),
 readingLine('Rowan','You don’t have to read it in front of me.','later'),
 readingLine('You','I think I’d like to read it upstairs.','later'),
 readingLine('Rowan','Okay.','later','neutral'),
 readingLine('','He leaves the envelope where it is.','later'),
 {speaker:'You',text:'There’s something I need to tell you.'},
 {speaker:'',text:'He waits.'},
 {speaker:'You',text:'Not yet. But I want to.'},
 {speaker:'Rowan',text:'Okay.',expression:'neutral'},
 {speaker:'',text:'He nudges the water closer.'},
 {speaker:'Rowan',text:'Start with that.'},
 {speaker:'',text:'I take a drink. For now, I sit with him.'}
];
continuation.rSettled=scene('bedroom','After getting settled',`
My bag is beside the bed.
Rowan has gone downstairs to put away the last of his tools.
For the first time since I arrived, I’m alone.
I take the envelope out.
`,{time:'evening',music:'letters',rowan:false,next:'rLetterLater'});
continuation.rLetterLater.lines=[
 ...['He wrote this just after turning twenty-one. Before Lola died.','The last one he finished while she was still here.','I sit by the window.','Okay, Ro.','This time, I open it.'].map((text,i)=>readingLine(i===3?'You':'',text,'later')),
 readingLine('','I unfold the pages I first read in Manila. I want to read them here, too.','now')
];
continuation.rLetterLaterAfter=scene('bedroom','This time, he’s downstairs',`
I glance toward the window.
Thought|I saw his long hair today. How tall he’s gotten.
Thought|The things he was trying to tell me two years ago.
My eyes return to the part about Lola.
Thought|In this letter, she’s still in the kitchen. Still telling him what to write.
Thought|I know what happened a few months later.
Thought|He didn’t. Not when he wrote this.
I rest the pages on my lap.
For a while, I listen to the house.
Then I fold them carefully and put them back.
You|I missed you too.
Thought|This time, he’s downstairs.
Thought|I don’t have to put it in a letter.
`,{time:'evening',music:'letters',rowan:false,ending:true,openingEnd:true});
