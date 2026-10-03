// Approved bedroom-to-garden continuation. Stable IDs keep older saves resumable.
const scene=(place,title,text,end={})=>({place,title,time:'day',day:2,opening:true,continuation:true,dayTwo:true,rowan:false,music:'back-together',
 lines:text.trim().split('\n').filter(Boolean).map(row=>{const [body,expression]=row.split('~');const i=body.indexOf('|');return {speaker:i<0?'':body.slice(0,i),text:i<0?body:body.slice(i+1),...(expression?{expression}:{})};}),...end});
const option=(text,next,set)=>({text,next,set});
const evening=(title,text,end={})=>scene('d2-bedroom-evening',title,text,{day:1,time:'evening',...end});
const morning=(title,text,end={})=>scene('d2-bedroom-morning',title,text,end);
const garden=(title,text,end={})=>scene('d2-garden-approach',title,text,end);
export const dayTwo={
d2Settling:evening('The room I remember',`
The last of my clothes goes into the drawer.
It still catches halfway. I lift it a little, then push.
Thought|There. Apparently, my hands remember this house better than I thought.
I sit on the edge of the bed.
For the first time all day, there’s nothing I have to do immediately.
Downstairs, something scrapes against the floor.
Then Rowan’s voice, too low for me to make out the words.
Thought|He’s still here.
`,{choices:[option('Call out to Rowan.','d2Call',{eveningChoice:'call'}),option('Just go to sleep.','d2SleepEarly',{eveningChoice:'sleep'})]}),
d2Call:evening('One more thing',`
You|Rowan?
Footsteps cross the room below. He appears in the doorway, slightly out of breath.~concerned
Rowan|What happened?
You|Nothing. Did you run?
Rowan|You called.
You|That usually works at walking speed.
He looks back toward the stairs.~embarrassed
Rowan|Right.
His hand stays on the doorframe.
Rowan|What did you need?
`,{rowan:true,choices:[option('“Stay a little?”','d2StayCompany',{bedroomAffection:'company'}),option('“I missed you.”','d2Missed',{bedroomAffection:'words'}),option('Open my arms.','d2Hug',{bedroomAffection:'hug'}),option('“Where does Lola keep the extra bedding?”','d2Bedding',{bedroomAffection:'bedding'})]}),
d2StayCompany:evening('Stay a little',`
You|Stay a little?
Rowan|Yeah.~smile
He answers quickly, then points to the chair beside the desk.
Rowan|Here?
I nod. He moves a stack of folded towels before sitting.
Rowan|Good. I was losing an argument with the downstairs cupboard.~playful
You|Does it still refuse to close?
Rowan|Only when someone’s watching.
For a while, we talk about the house.
It is easier than deciding where to begin with everything else.
`,{rowan:true,next:'d2Goodnight'}),
d2Hug:evening('A familiar embrace',`
I stand and open my arms.
Rowan steps toward me, then stops.~concerned
Rowan|Are you sure?
You|Ro.
He crosses the room. His arms close around me.
The hug is firmer than I expected. My heels nearly leave the floor.
You|Still need those.
He sets me down immediately.~embarrassed
Rowan|Sorry.
You|You’re a little taller than eleven-year-old you.
Rowan|You noticed.~smile
My laugh catches halfway. Neither of us moves.
`,{rowan:true,choices:[option('Hold him a little longer.','d2HugLonger'),option('Step back with a smile.','d2HugRelease')]}),
d2HugLonger:evening('A little longer',`
I hold him a little longer. His breathing slows against my shoulder.
When I loosen my arms, he lets me go.
You|Thanks, Ro.
Rowan|Yeah. Anytime.~smile
`,{rowan:true,next:'d2Goodnight'}),
d2HugRelease:evening('A familiar smile',`
I step back with a smile. He lets me go immediately.
Rowan brushes a crease from his sleeve.~embarrassed
You|Better than your old headlocks.
Rowan|I’ve been practicing my manners.~playful
`,{rowan:true,next:'d2Goodnight'}),
d2Missed:evening('I missed you',`
You|I missed you.
He looks down at the floor between us.~sad
Rowan|I missed you too.
His thumb catches a loose thread on his sleeve.
Rowan|I was angry for a while.
You|With me?
Rowan|Sometimes.
He looks up.
Rowan|I didn’t know what had happened. I kept making up answers.
`,{rowan:true,choices:[option('“I want to tell you. Just not all tonight.”','d2NotTonight'),option('“You can ask me something.”','d2AskSomething')]}),
d2NotTonight:evening('Not all tonight',`
You|I want to tell you. Just not all tonight.
Rowan|Okay.~concerned
He takes a breath.
Rowan|I’ll probably ask badly when I do.
You|I might answer badly.
A small smile returns.~smile
Rowan|We’ve done that before.
`,{rowan:true,next:'d2Goodnight'}),
d2AskSomething:evening('One question',`
You|You can ask me something.
Rowan|Did you ever want to come back?~concerned
You|Yes.
He nods, still watching me.
You|That part was never the problem.
Rowan|Okay.~smile
This time, he sounds like he believes it.
`,{rowan:true,next:'d2Goodnight'}),
d2Bedding:evening('Very reliable service',`
You|Where does Lola keep the extra bedding?
Rowan|Top of the wardrobe. Left side.~neutral
He glances at the open drawer.
Rowan|Unless I put it on the right.
You|Very reliable service.
Rowan|You get what you pay for.~playful
He brings me a blanket.
You|Thanks. I think I’ll unpack a little more.
Rowan|I’ll be downstairs.~smile
He leaves the door as he found it.
`,{rowan:true,next:'d2FallingAsleep'}),
d2Goodnight:evening('Good night, sunshine',`
I cover my mouth as a yawn interrupts the silence.~smile
Rowan|Okay. That’s my cue.
You|Sorry.
Rowan|For being tired?
You|It’s been a long day.
Rowan|Then get some sleep. We can talk tomorrow.
He moves toward the door.
Rowan|I’ll lock up downstairs before I head home.
You|Thanks, Row.
At the doorway, he looks back.
Rowan|Good night, {name}. See you tomorrow, sunshine.
You|You still call me that?
Rowan|Unless you’ve got a complaint.~playful
You|…No complaint.
His smile widens.
Rowan|Good night.
His footsteps retreat down the stairs.
Thought|Sunshine. I haven’t heard him say that in so long.
`,{rowan:true,next:'d2FallingAsleep'}),
d2SleepEarly:evening('Bukas na lang',`
I glance toward the door. There are things I want to tell him.
But my head feels heavy, and even unpacking has somehow exhausted me.
You|Bukas na lang.
I pull the pillow closer.
Thought|I want to be awake enough to mean what I say.
`,{next:'d2FallingAsleep'}),
d2FallingAsleep:scene('d2-bedroom-night','Peace and quiet',`
I lie back. The fan turns with a faint, uneven click.
Outside, someone calls a child home. A gate closes.
Thought|Ordinary sounds. I missed them.
You|Nandito talaga ako.
Thought|Saint Luis. My old room.
Thought|Rowan just downstairs—or maybe already walking home.
Thought|Everything is familiar. It’s me I’m still trying to get used to.
I close my eyes.
Thought|Lord, kahit ngayong gabi lang. Pahinga muna sa kakaisip.
Thought|Tomorrow can have the questions.
For now, I pull the blanket over my waist and turn toward the breeze.
Thought|Peace. Quiet.
The fan clicks once more. I don’t hear the next one.
`,{day:1,time:'night',music:null,next:'d2Morning'}),
d2Morning:morning('A Saint Luis morning',`
A rooster announces the morning like nobody asked him to keep it down.
Another one joins in.
You|Oo na. Gising na.
I stretch beneath the blanket. The Saint Luis heat has already found me.
In Manila, I’d be complaining by now. Here, I stay still for another moment.
A breeze slips through the window. Leaves rustle outside.
Somewhere beyond the fence, two neighbors are discussing someone else’s business at a perfectly unreasonable volume.
You|May morning briefing na ang mga marites.
I smile into my pillow. Some things never change.
Eventually, my stomach convinces me to sit up. Maybe I can make breakfast.
I reach for my phone to check the time. My smile disappears.
Notifications fill the screen. Mom. Dad. Again. And again. Even on SG.
You|Paano nila nahanap ’to?
I stare at the account names. One person comes to mind almost immediately.
Thought|Sevi. He knows this account.
That doesn’t prove anything. Still, my jaw tightens.
`,{choices:[option('Put my phone away.','d2PhoneAway',{morningMessages:'skip'}),option('Open the messages.','d2PhoneOpen',{morningMessages:'read'})]}),
d2PhoneAway:morning('Breakfast first',`
My thumb hovers over the screen.
Thought|I already know how quickly one message can turn into an entire morning.
You|Hindi muna.
I silence the notifications and place the phone facedown.
For a moment, I keep looking at it anyway. Then I stand.
Thought|Breakfast first.
`,{next:'d2GetUp'}),
d2PhoneOpen:morning('Too many notifications',`
Thought|Maybe one of them just wants to know if I arrived safely.
I hate how quickly I reach for that possibility. But I open the notifications anyway.
Phone|Dad — 60 missed calls. Mom — 34 missed calls.
I check the numbers twice. As if they might change.
Then I open Mom’s messages.
Mom · SG|Nasaan ka na?
Mom · SG|Sagutin mo ang tawag namin.
Mom · SG|Akala mo hindi namin alam kung saan ka pupunta?
Mom · SG|You are in big trouble.
Mom · SG|Bakit hindi ka na lang makinig sa amin?
Mom · SG|How could you do something so stupid?
There are more. I scroll. Then stop.
Dad’s messages aren’t much different.
Dad · SG|Answer your mother.
Dad · SG|Umuwi ka. Pag-uusapan natin ito.
Dad · SG|Hindi puwedeng basta ka na lang umaalis kapag ayaw mo ang sinasabi namin.
I press my lips together. So much for hoping.
A different name appears below theirs. Sevrine Buenaventura.
Thought|Four messages. Of course.
Sevi · SG|Hey, Dos. Where are you?
Sevi · SG|Your parents keep asking if you told me anything.
Sevi · SG|Ayoko namang makialam sa problema ninyo.
Sevi · SG|Kausapin mo na lang sila, okay? Bye, Dos.
I read the third message again. Ayaw niyang makialam. Convenient.
You|Hanggang dito ba naman.
Nothing in his messages tells me whether he gave them my account.
Thought|But he’s talking as if nothing happened between us. As if he wasn’t part of the reason I finally left.
My fingers tighten around the phone. For a second, I consider replying.
Then I close the conversation. Not this morning.
I silence the notifications and put the phone down.
`,{music:'lost-contact',next:'d2GetUp'}),
d2GetUp:morning('Getting up',`
The neighbors are still talking outside. The fan still clicks.
I take a breath and look around the room. I’m here.
I pull on fresh clothes and smooth the blanket once, mostly to give my hands something to do.
`,{choices:[option('Stay in my room a little longer.','d2Stay',{morningRoute:'window'}),option('Go downstairs.','d2Down',{morningRoute:'stairs'})]}),
d2Stay:morning('Lola’s gardening hat',`
I sit back on the bed. Five more minutes won’t hurt.
Outside, something scrapes softly beneath the window.
Then comes a rustle that doesn’t quite match the breeze.
You|Hm?
I lean toward the window.
A wide gardening hat moves between the plants below. I know that hat.
Lola used to leave it hanging by the back door.
The brim dips. A familiar hand reaches up to push it out of the way.
You|Rowan?
What’s he doing? I’m on my feet before my five minutes are up.
I head downstairs and pause at the kitchen doorway.
`,{next:'d2Breakfast'}),
d2Down:morning('Something familiar',`
You|Ano kayang ginagawa ni Rowan?
I head downstairs, following a smell that becomes more familiar with every step.
Garlic rice. Something sweet and savory in a hot pan.
I stop at the kitchen doorway.
`,{next:'d2Breakfast'}),
d2Breakfast:scene('d2-breakfast','Breakfast, already made',`
Tapa. Sinangag. Eggs with crisp, golden edges.
You|Tapsilog?
I lean a little closer. It smells like Lola’s.
Beside the plates is a yellow note.
Rowan’s note|Nasa garden lang ako. Tawagin mo ’ko kapag kakain na tayo. :3 — Row
I stare at the little face. Then laugh.
You|May pa-“:3” ka pa.
Thought|Two plates. He’s waiting to eat with me.
I set the note down and walk toward the back door.
`,{next:'d2Garden'}),
d2Garden:garden('Behind the house',`
The back door is already open.
Rowan is crouched beside a row of pots, concentrating on something near the soil.
Lola’s hat sits a little crooked on his head.
I step onto the path. He hasn’t noticed me yet.
`,{choices:[option('“Whatcha doing?”','d2Whatcha',{gardenGreeting:'whatcha'}),option('“Hey.”','d2Hey',{gardenGreeting:'hey'}),option('Poke the brim of his hat.','d2Poke',{gardenGreeting:'poke'}),option('Scare him.','d2Scare',{gardenGreeting:'scare'})]}),
d2Whatcha:garden('Whatcha doing?',`
You|Whatcha doing?
Rowan|Trying to figure out which ones are weeds.
He starts turning toward me.
Rowan|Your lola would have opinions.
`,{next:'d2Reveal'}),
d2Hey:garden('Hey',`
You|Hey.
He looks back over his shoulder. The moment he sees me, he smiles.
Rowan|Hey. Sleep okay?
You|Yeah. I just—
`,{next:'d2Reveal'}),
d2Poke:garden('An innocent hat',`
I reach out and tap the back of the brim. The hat tips forward.
Rowan goes still. Then slowly looks over his shoulder.
Rowan|…Did my hat do something to you?
I bite back a laugh.
You|It was looking at me funny.
`,{next:'d2Reveal'}),
d2Scare:garden('A peaceful morning',`
I take one careful step closer. Then—
You|AHH!
Rowan|AH—!
He jerks upright, catching his hat before it falls.
I burst out laughing. He stares at me.
Rowan|Good morning to you, too!
You|Sorry—your face—
Rowan|I was having a peaceful morning.
`,{next:'d2Reveal'}),
d2Reveal:garden('In the morning light',`
He turns fully toward me, brushing dirt from his fingers.
The brim of Lola’s hat slips forward. He pushes it back with his wrist.
`,{choices:[option('He looks different without the cardigan.','gNotice',{gardenNotice:'appearance'}),option('That hat is too big for him.','gHat',{gardenNotice:'hat'}),option('He’s been taking care of the garden, too.','gCare',{gardenNotice:'care'})]})
};

const outside=(title,text,end={})=>scene('garden-rematch',title,text,{...end});
Object.assign(dayTwo,{
gNotice:outside('Caught looking',`
His sleeves sit a little higher as he raises his arm.
Thought|Oh. I hadn’t really noticed his shoulders yesterday.
Thought|Or maybe I’d had too much else to think about.
Rowan|Something on my shirt?
I look up.
You|No.
Rowan|Okay.
He’s smiling now.
You|I came to get you for breakfast.
Rowan|Right. Breakfast.
`,{next:'gBreakfastInvite'}),
gHat:outside('An unhelpful hat',`
You|Can you actually see under that?
Rowan|Most of the garden.
You|Very reassuring.
The brim drops again. He looks at me from underneath it.
Rowan|Don’t.
I’m already laughing.
`,{next:'gBreakfastInvite'}),
gCare:outside('A little at a time',`
Some pots have been moved into the shade. A watering can sits beside the path.
You|You’ve been doing all this?
Rowan|A little at a time.
He looks down at the weeds.
Rowan|Some parts more successfully than others.
You|It looks cared for.
His hand rests on the watering can.
Rowan|Thanks.
`,{next:'gBreakfastInvite'}),
gBreakfastInvite:outside('Breakfast first',`
You|I found your note.
Rowan|You saw breakfast?
You|I smelled it first.
Rowan|Good. I was starting to get hungry.
You|Then why are we still standing here?
He puts down the little hand fork.
Rowan|Excellent question.
`,{next:'gBreakfastTogether'}),
gBreakfastTogether:scene('living','Two plates',`
Rowan washes his hands while I pull out a chair.~smile
Two plates. Two glasses.
I move his note away from the food.
You|You still put little faces on things.
Rowan|Would you prefer a formal letter?~playful
You|For breakfast?
Rowan|Dear {name}. Please find your eggs attached.
A laugh slips out before I can stop it.
You|Sit down, Ro.
He does.
I try the rice first. Garlic. A little salt. The crisp bits from the bottom of the pan.
I take another bite.
You|This tastes like hers.
Rowan|She showed me.~smile
You|Did she give you measurements?
Rowan|She said I’d know when it was enough.
You|Helpful.
Rowan|Extremely.~playful
He nudges the serving plate toward me.
Rowan|There’s more.
For a while, we just eat.
He asks whether the fan in my room still clicks. I tell him it does.
Apparently, he tightened it last week.
You|It didn’t work.
Rowan|I gathered that.
You|Maybe it likes making noise.
Rowan|Then it’s doing very well.
By the time we finish, I’ve stopped watching my phone.
Rowan carries the plates to the sink. I bring the glasses.
Through the open back door, I can see the patch he was working on.
You|Still trying to figure out which ones are weeds?
Rowan|I checked the labels. We’re safe now.~smile
You|We?
He looks back at me.
Rowan|That depends.~playful
`,{rowan:true,next:'gRemember'}),
gRemember:outside('We used to do this',`
Rowan puts the hat back on.
There are two empty buckets beside the step. He picks one up.
You|Lola used to send us out here after breakfast.
Rowan|You always said you needed another five minutes.
You|I was digesting.
Rowan|For an hour?
He places the bucket beside the weeds.
I remember one just like it sitting between us.
Back then, it reached nearly to my knees.
`,{next:'gChildhood'}),
gChildhood:scene('garden-bed','Before I left · age eleven',`
Lola (off-screen)|Weeds lang, ha. Leave my plants alone.~neutral
Rowan crouches beside the bucket.
Rowan|Whoever gets more wins!~smile
You|You already started!
Rowan|Then hurry up.~playful
Lola (off-screen)|Basta matapos ninyo.
We each grab a handful.
A moment later, Rowan leans over my bucket.~concerned
You|What?
Rowan|That’s one weed.
You|It has three stems.
Rowan|Still one.~playful
You|You’re making up rules.
From the doorway, Lola laughs.~smile
`,{rowan:true,childhood:true,next:'gChallenge'}),
gChallenge:outside('A rematch',`
You|She didn’t even care who won.
Rowan|I know.
You|We argued about it for ages.
Rowan|You counted the stems.
You|You remember that?
Rowan|I had a difficult opponent.
He offers me the second bucket.
Rowan|Rematch?
`,{choices:[option('You’re on.','gTimed',{gardenMode:'timed'}),option('I’ll help, but no timer.','gUntimed',{gardenMode:'untimed'}),option('I’ll pass this time.','gDecline',{gardenMode:'declined'})]}),
gTimed:outside('You’re on',`
You|You’re on.
His smile comes quickly.
Rowan|Okay. This half is yours.
You|Already picked the easy side?
Rowan|We can swap.
You|Now I don’t trust either side.
`,{next:'gPlay'}),
gUntimed:outside('At our own pace',`
You|I’ll help, but no timer.
Rowan|Deal.
He puts the bucket beside me.
Rowan|I’m still counting.
You|Of course you are.
`,{next:'gPlay'}),
gDecline:outside('Another time',`
You|I’ll pass this time.
His hand pauses around the bucket handle.
Rowan|Oh. Okay.
He puts the spare bucket back beside the step.
Rowan|I’ll finish this bit, then.
You|You don’t mind?
Rowan|You don’t have to.
He crouches beside the plants again.
I hadn’t realized how much he wanted a rematch until he stopped smiling.
`,{next:'gAfter'}),
gPlay:outside('One More Weed','A bucket each. One rematch.',{minigame:true,next:'gResult'}),
gResult:outside('The final count','',{next:'gTogether'}),
gTogether:outside('A little differently',`
Rowan looks at the cleared patch.
Rowan|That was quicker with you.
I brush the dirt from my hands.
You|Even with the arguing?
Rowan|That was part of it.
He takes his bucket. I pick up mine.
Thought|For once, remembering something hasn’t made me wish I could go back.
Thought|We’ve just done it again. A little differently.
`,{next:'gAfter'}),
gAfter:outside('After the garden','',{ending:true,openingEnd:true})
});
const branch=(text,key,value)=>text.trim().split('\n').map(row=>{const i=row.indexOf('|');return {speaker:i<0?'':row.slice(0,i),text:i<0?row:row.slice(i+1),if:[key,value]};});
dayTwo.gResult.lines=[
 ...branch('Rowan looks between the buckets.\nRowan|Wait.\nHe checks mine again.\nYou|Roots and all.\nRowan|I can see that.\nYou|Say it.\nRowan|You won.\nYou|Thank you.\nHis smile gives him away.\nRowan|I’ll ask for a rematch when you’re less awake.','gardenResult','win'),
 ...branch('He holds up his bucket. Just enough to be annoying.\nYou|You’ve had twelve years to practice.\nRowan|So you admit it was skill.\nYou|I admit you’ve spent a lot of time pulling weeds.\nHe laughs.\nRowan|I’ll take it.','gardenResult','loss'),
 ...branch('We count again. The same number.\nYou|Well?\nRowan|I think we have to accept it.\nYou|That sounded painful.\nRowan|I’m being mature.','gardenResult','tie')];
dayTwo.gAfter.lines=[
 ...branch('When Rowan finishes, he carries his bucket to the garden waste pile.\nI move the watering can out of his way.\nRowan|Thanks.\nYou|No problem.','gardenMode','declined'),
 ...['timed','untimed'].flatMap(mode=>branch('We leave the buckets beside the garden waste pile.\nRowan reaches for the watering can.\nYou|You need a hand with that too?\nRowan|Careful. I might say yes.','gardenMode',mode)),
 ...branch('He hangs Lola’s hat beside the back door.\nThere’s a pale mark on the wall where it has rested for years.\nRowan|Water?\nYou|Please.\nWe go back inside.','gardenWrap',true).map(({if:condition,...line})=>line)];
