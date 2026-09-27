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
There. Apparently, my hands remember this house better than I thought.
I sit on the edge of the bed.
For the first time all day, there’s nothing I have to do immediately.
Downstairs, something scrapes against the floor.
Then Rowan’s voice, too low for me to make out the words.
He’s still here.
`,{choices:[option('Call out to Rowan.','d2Call',{eveningChoice:'call'}),option('Just go to sleep.','d2SleepEarly',{eveningChoice:'sleep'})]}),
d2Call:evening('One more thing',`
You|Rowan!
Footsteps cross the floor below. Then the stairs. Quickly.
Rowan appears in the doorway, one hand against the frame.~concerned
Rowan|Yeah? Everything okay?
You|Yeah. Everything’s fine.
He catches his breath.
You|Did you run?
Rowan|You shouted.
You|I called your name.
Rowan|Loudly.~playful
A smile slips out before I can stop it.
He’s still watching me, waiting to find out what I need.
For once, I don’t want to pretend I called him over for something else.
`,{rowan:true,choices:[option('Open my arms.','d2Hug',{bedroomAffection:'hug'}),option('“I missed you.”','d2Missed',{bedroomAffection:'words'})]}),
d2Hug:evening('A familiar embrace',`
I stand and open my arms.
For a second, Rowan just looks at me. Then his expression softens.
You|I missed you. Sobra.
He crosses the room. His arms close around me.
Then my feet leave the floor.
You|Rowan—!
He laughs, surprised at himself, and sets me down again.
Rowan|Sorry.
You|Since when could you do that?
Rowan|Since you started packing your entire life into one bag.
You|So you’re complaining?
Rowan|Didn’t say that.
He’s still holding me. I let myself settle against him.
Earlier, on the porch, I kept thinking about what I should say. What he might ask. How much I could explain.
Right now, I can feel his breathing slow. Mine follows.
I’m here. Really here.
When I lean back, his eyes are wet.
He gives a small, embarrassed laugh.
Rowan|I had so many things I wanted to ask you.
My stomach tightens.
You|Rowan, I—
Rowan|Hey. They can wait.
He loosens his arms.
Rowan|I’m glad you’re here, {name}.
That makes it harder to look at him.
There’s so much I wish had happened differently. So much he still doesn’t know.
You|I don’t know where to start.
Rowan|You don’t have to start tonight.
He lets me go, his hands falling to his sides.
Rowan|Whenever you feel ready.
`,{next:'d2Goodnight'}),
d2Missed:evening('I missed you',`
You|I missed you.
It comes out quieter than I intended.
Rowan’s smile fades for a moment. More like he wants to be sure he heard me.
You|I know I haven’t really said it properly.
Rowan|You just did.
Rowan|I missed you, too.
I look down, smiling at the floor.
After everything I practiced on the way here, that was all it took.
Four words. The room feels a little less unfamiliar.
`,{next:'d2Goodnight'}),
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
Sunshine. I haven’t heard him say that in so long.
`,{rowan:true,next:'d2FallingAsleep'}),
d2SleepEarly:evening('Bukas na lang',`
I glance toward the door. There are things I want to tell him.
But my head feels heavy, and even unpacking has somehow exhausted me.
You|Bukas na lang.
I pull the pillow closer.
I want to be awake enough to mean what I say.
`,{next:'d2FallingAsleep'}),
d2FallingAsleep:scene('d2-bedroom-night','Peace and quiet',`
I lie back. The fan turns with a faint, uneven click.
Outside, someone calls a child home. A gate closes.
Ordinary sounds. I missed them.
You|Nandito talaga ako.
Saint Luis. My old room.
Rowan just downstairs—or maybe already walking home.
Everything is familiar. It’s me I’m still trying to get used to.
I close my eyes.
Lord, kahit ngayong gabi lang. Pahinga muna sa kakaisip.
Tomorrow can have the questions.
For now, I pull the blanket over my waist and turn toward the breeze.
Peace. Quiet.
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
Sevi. He knows this account.
That doesn’t prove anything. Still, my jaw tightens.
`,{choices:[option('Put my phone away.','d2PhoneAway',{morningMessages:'skip'}),option('Open the messages.','d2PhoneOpen',{morningMessages:'read'})]}),
d2PhoneAway:morning('Breakfast first',`
My thumb hovers over the screen.
I already know how quickly one message can turn into an entire morning.
You|Hindi muna.
I silence the notifications and place the phone facedown.
For a moment, I keep looking at it anyway. Then I stand.
Breakfast first.
`,{next:'d2GetUp'}),
d2PhoneOpen:morning('Too many notifications',`
Maybe one of them just wants to know if I arrived safely.
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
Four messages. Of course.
Sevi · SG|Hey, Dos. Where are you?
Sevi · SG|Your parents keep asking if you told me anything.
Sevi · SG|Ayoko namang makialam sa problema ninyo.
Sevi · SG|Kausapin mo na lang sila, okay? Bye, Dos.
I read the third message again. Ayaw niyang makialam. Convenient.
You|Hanggang dito ba naman.
Nothing in his messages tells me whether he gave them my account.
But he’s talking as if nothing happened between us. As if he wasn’t part of the reason I finally left.
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
Two plates. He’s waiting to eat with me.
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
d2Reveal:garden('Oh. There you are.',`
He turns fully toward me, brushing dirt from his fingers.
You|Hey, I just—
Oh.
Without the cardigan, it’s a little harder to miss. His shoulders. His arms.
When did that happen?
A bead of sweat slips down his temple. His T-shirt catches the morning light.
Then he notices me staring.
Rowan|Oh, {name}. Dito ka pala.
His mouth curves.
Rowan|Were you looking for me?
I look up a fraction too late.
You|Breakfast.
A pause.
You|I was looking for you because of breakfast.
He glances toward the house. Then back at me.
Rowan|Right.
That smile is getting suspicious.
Rowan|Breakfast.
`,{ending:true,openingEnd:true})
};
