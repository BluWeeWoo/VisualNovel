import {opening} from './opening.js';
// Authored story only. No AI output can change this graph or its relationship flags.
const lines = text => text.trim().split('\n').filter(Boolean).map(row => {
  const i = row.indexOf('|');
  return {speaker:i < 0 ? '' : row.slice(0,i), text:i < 0 ? row : row.slice(i+1)};
});
const scene = (place, time, title, text, end = {}) => ({place,time,title,lines:lines(text),...end});
const choice = (text, next, set, state) => ({text,next,set,state});
export const story = {
arrival: scene('exterior','day','01 / The house with the blue door', `
The bus leaves you with a warm suitcase handle, a mouthful of salt air, and the uncomfortable suspicion that you have arrived on the wrong day of your own life.
The timetable at the stop has changed. The sea has not. Beyond the rooftops, it keeps folding and unfolding itself, utterly occupied.
At twenty-three, you expected returning to feel more like an arrival. Instead you stand outside the gate, looking for somewhere to put your hands. Eight years since you moved away at fifteen; the latch still sits at the same height.
Summerhouse. Your grandmother painted the name herself, then complained for seventeen years about the spacing of the letters.
Someone has recently oiled the gate. It opens without the long, theatrical squeal you were preparing for. Somehow this is the first thing that hurts.
There are six weeks until the handover. Six weeks to sort a house into things to keep, things to give away, things you cannot bear to decide about yet. Your return ticket waits in your email.
Rowan|If you’re selling something, we already have a very good collection of things.
Rowan stands on the porch with a screwdriver in one hand and half a door latch in the other. There is a pale crescent of sawdust on his sleeve.
You knew he still lived next door. You had imagined this encounter on the bus, and again at the station. In none of those versions was he holding part of your door.
Rowan|Hello, {name}.
He says it carefully. As though your name is a glass he has just found at the back of a cupboard.
You|Hello, Rowan.
At twenty-three, he has the same uncertain smile and a different way of standing: one shoulder braced toward a job that needs doing.
Rowan|I was going to have this fixed before you got here. As a welcoming gesture. It’s become more of a hostage situation.
You set your case down. The two of you make the same half-step forward, then stop.
Rowan|What are we doing? Hug? Handshake? Formal inspection of the latch?
`, {choices:[choice('“Come here.” Offer him a hug.','hug',{boundary:'warm'}),choice('“Let’s start with the latch.” Give him a smile.','latch',{boundary:'slow'}),choice('“I’m glad you’re here. I need a minute first.”','space',{boundary:'space'})]}),
hug: scene('exterior','day','A familiar distance', `
Rowan puts the screwdriver down first. The tiny care of it catches you off guard.
His embrace is warm and a little sideways, both of you negotiating your changed heights and the years between you. His shirt smells of clean laundry and wood shavings.
Rowan|You made it.
You|The bus driver tried quite hard to prevent that.
Rowan laughs against your shoulder. Then he steps back, letting you be the one to end it.
For a second the porch seems much smaller than it used to. Or perhaps you no longer need as much room to stand in it together.
`,{next:'entry'}),
latch: scene('exterior','day','A familiar distance', `
Rowan|Excellent. A shared enemy.
He turns the latch so you can see a tiny spring sticking out at an accusatory angle.
You|Is that supposed to be outside it?
Rowan|In a philosophical sense, who can say?
You|In the door sense.
Rowan|No.
The laugh comes out of you before you can organize it. Rowan’s shoulders lower a fraction. He doesn’t try for the hug again.
`,{next:'entry'}),
space: scene('exterior','day','A familiar distance', `
Rowan|Of course. Gate’s open. No timetable.
He sits on the porch step and begins fitting the spring into the latch. It gives you something to look at that isn’t his face.
You stand under the jasmine until the smell stops feeling like a memory and starts being a smell again.
You|Okay. I think I can come in now.
Rowan|Good. I was about to ask you to hold this screw. Very demanding reunion, honestly.
He puts it in your palm. One small, manageable thing.
`,{next:'entry'}),
entry: scene('living','day','The shape of a welcome', `
The hall is cool. Linen curtains lift at the open window and settle against the sill with a sound like someone turning a page.
Your grandmother’s weather station still hangs beside the door: a pine cone suspended from string. Beneath it, her label reads EXTREMELY ADVANCED EQUIPMENT.
You|Does it work?
Rowan|Better than my phone. Less advertising.
Your suitcase catches on the same raised floorboard. You apologize to it automatically.
Rowan|She kept meaning to get that fixed.
You look down. There is a neat pencil mark beside the board, and a date from last autumn.
Rowan|I kept meaning to fix it.
He takes your case upstairs before you can think of an answer. You listen to his footsteps: he knows which stairs complain.
On the kitchen counter there are three labeled tins. TEA. BISCUITS. NOT BISCUITS. The last contains screws.
You|A deeply unfair system.
Rowan|It was more of a warning than I usually got.
He returns with an empty tray and begins opening cupboards. His ease here is useful. His ease here is also something you weren’t ready to see.
Rowan|I can show you where things ended up. Or leave you to it. I took today off, but that doesn’t make me part of the inventory.
You|You took a day off?
Rowan|The chandlery will survive without me selling someone the wrong size washer for one afternoon.
There is room in the offer for you to refuse it. You are grateful for that room.
`,{choices:[choice('“Stay. I could use someone who knows where to start.”','sort',{outlook:'company'}),choice('“Stay, but I get to be useless for the first hour.”','sort',{outlook:'humor'}),choice('“I want to do some of this myself. One room together?”','sort',{outlook:'independent'})]}),
sort: scene('bedroom','day','02 / Things worth keeping', `
You agree on the little room facing the sea. It used to be yours in the summers, then a storeroom, then apparently a battlefield between bed linen and cardboard boxes.
Rowan opens a window. His brown hair is tied in the same low bun, a loose strand catching on his earring. Somewhere below, a neighbor is trying to persuade a dog to surrender a gardening glove.
Rowan|We need a system.
You|Keep, donate, and deeply mysterious?
Rowan|You’ve done this before.
The first box contains travel adapters, a broken egg timer, and eleven postcards from the same woman in Norwich. None mentions Norwich.
You read one aloud. It describes an exceptional pear.
Rowan|Good for her.
Rowan lifts an old illustrated book from the box, holding it open while you inspect its penciled captions. Under it is the guest register. Your grandmother’s handwriting narrows on busy weekends, then grows enormous whenever she is annoyed.
One entry says: LOVELY FAMILY. CHILD PUT SOAP IN PIANO. DISCUSS.
You|Was that us?
Rowan|I would remember being a lovely family.
You spend a while making separate piles. Rowan asks before moving anything from yours. Even the dead batteries.
Behind the spare blankets, you find a faded beach towel. A corner is stitched with crooked green thread. You remember hiding here during thunderstorms, making rooms inside rooms.
Rowan|What did we call our headquarters? I remember having to knock. Even though it was a towel.
You can almost hear your younger voice issuing instructions. The exact place comes back with it.
`,{choices:[choice('The linen cupboard: a very exclusive ship.','hideout',{hideout:'the linen cupboard'}),choice('Under the kitchen table: our secret radio station.','hideout',{hideout:'under the kitchen table'}),choice('The garden shed: headquarters for lost things.','hideout',{hideout:'the garden shed'})]}),
hideout: scene('bedroom','day','An unreliable archive', `
You|It was {hideout}. We took the security arrangements very seriously.
Rowan|Right. And your grandmother would announce herself as a delivery of emergency toast.
You|She knew the password.
Rowan|She invented the password. It was “toast.”
You both laugh. Outside, the dog has apparently won. A person says, with considerable feeling, “Fine. Keep it.”
Rowan folds the towel instead of putting it in either pile.
Rowan|I remember it being quieter. In there, I mean. Even with you doing all the voices.
You|I did excellent voices.
Rowan|You did one voice. It was a mayor.
The towel goes on the bed. You let the quieter part of what he said remain beside it, without pulling at the thread.
In the desk drawer you find a tin pencil case. It rattles. There is a small blank label on top, waiting for a name.
Rowan|What was the thing you kept in there? The thing nobody was allowed to touch without filling out a form?
`,{choices:[choice('A blue marble that “predicted” the weather.','treasure',{treasure:'a blue marble'}),choice('A bus ticket from our first solo trip into town.','treasure',{treasure:'an old bus ticket'}),choice('A shell shaped, approximately, like a dragon.','treasure',{treasure:'a dragon-shaped shell'})]}),
treasure: scene('bedroom','day','A small museum', `
You|It was {treasure}. Obviously priceless.
Rowan|Obviously. Shall we call a museum or just the police?
Inside the pencil case is exactly that. Smaller than you remember. An empire’s worth of importance, fitting in your palm.
For a little while you tell Rowan why it mattered. Your story takes a turn you didn’t expect: you remember wanting something ordinary to be proof that an extraordinary day had happened.
Rowan doesn’t laugh at that part.
Rowan|I think it worked.
You set it on the windowsill. Light moves through the old glass, wavering over your hand.
Under the drawer liner is a photograph of two sunburned children standing beside a sandcastle that seems to consist entirely of a moat.
You|A bold architectural direction.
Rowan|We ran out of castle.
On the back, your grandmother has written: {name} says {subject} should be in charge. Rowan has requested a recount.
There is another word underneath, in your own enormous handwriting. Your self-appointed title, used for one entire summer.
`,{choices:[choice('“Captain.” I was responsible for navigation. Badly.','list',{nickname:'Captain'}),choice('“Professor.” I knew several facts about crabs.','list',{nickname:'Professor'}),choice('“Trouble.” Grandmother made that one official.','list',{nickname:'Trouble'})]}),
list: scene('bedroom','day','Five things, in green ink', `
Rowan|{nickname}. That’s right. I had to put that on your birthday card.
You|You could have applied for a promotion.
Rowan|I preferred being someone the coastguard couldn’t prosecute.
When you lift the photograph, a folded sheet slips out behind it. Green ink shows through the paper. You recognize the color before the words.
You used to fight over that pen. It smelled of apples, theoretically. Mostly it smelled of a pen someone had put near an apple.
The heading says BEFORE WE GET BORING. You were both twelve when you wrote it. Beneath it, in two competing styles of handwriting, is a list.
You|Watch the sunrise from the old pier.
Rowan|Perform a song in front of someone.
You|Tell each other a secret. Take a trip with no planned destination.
Neither of you reads the last line immediately.
Leave town together someday.
The final word is underlined twice. One line is yours. One is his.
You remember packing for the city. You remember intending to call from the station. You remember that there were always other things you were about to do.
Rowan smooths one corner of the paper with his thumb.
Rowan|We really thought growing up would be mostly transport.
You|And public performance, apparently.
Rowan|A terrible combination. Bus karaoke.
The joke gives you both somewhere to stand. But Rowan leaves his thumb on the last line.
`,{enter:{promiseFound:true},choices:[choice('“I wish we’d done more of it before I left.”','regret',{past:'regret'}),choice('“Do you still want any of these?”','want',{past:'curious'}),choice('“We don’t owe our younger selves everything.”','disagree',{past:'honest'})]}),
regret: scene('bedroom','day','What remains', `
Rowan|Me too.
He says it without a smile, and without trying to make you feel worse. It is an answer, not a verdict.
You|I kept thinking there would be another summer.
Rowan|There usually was. Until there wasn’t.
For a moment you expect him to mention the calls you missed, or the funeral, when everyone spoke to you as if your train home were already arriving.
Instead he moves a glass away from the paper so it won’t leave a ring.
Rowan|We don’t have to repair all of that this afternoon.
You nod. It is a kindness, but not an eraser. You find you prefer it that way.
`,{next:'break'}),
want: scene('bedroom','day','What remains', `
Rowan|Some of them.
He looks out of the window. Across the lane, a line of washing shifts as though everyone inside the clothes has taken one careful step.
Rowan|I still want to go somewhere I haven’t already given directions to.
You|That sounds achievable.
Rowan|Yes. I’m very good at wanting achievable things for an unreasonable amount of time.
You don’t know yet whether you’re allowed to ask why. Rowan taps the first line before you decide.
Rowan|This one’s local. Terrible hours, though.
`,{next:'break'}),
disagree: scene('bedroom','day','What remains', `
Rowan looks up, a little quickly.
Rowan|No. I suppose we don’t.
You|I don’t mean it didn’t matter. I mean we get to choose now, too.
He thinks about that. You resist the urge to fill the pause with an easier answer.
Rowan|That’s fair. I was about to make this into homework, wasn’t I?
You|You always did like a checklist.
Rowan|I like knowing what happens next. Different problem.
His smile is brief, but it reaches you. The paper lies between you, still important and no longer an instruction.
`,{next:'break'}),
break: scene('bedroom','day','The lunch committee', `
Your stomach makes a noise so decisive it seems to conclude the discussion.
Rowan|Motion to adjourn.
You|Seconded.
You tuck the list into the guest register for safekeeping. In the corner, a box labeled KITCHEN contains only lampshades. You decide this can remain tomorrow’s problem.
Rowan finds your keys on the bed and holds them out, then pauses.
Rowan|The little brass one sticks. Turn it back a bit before you pull.
You know this. You used to know this. You take the keys without saying either thing.
Outside, the afternoon has brightened. The lane smells of warm stone and somebody’s laundry powder.
Rowan|There’s still the chip shop. New owner. Same argument about whether vinegar counts as a vegetable.
You|It doesn’t.
Rowan|You’ve changed.
`,{next:'street',enter:{milestone:'Familiar'}}),
street: scene('street','day','03 / Superior air support', `
The high street is both shorter and longer than you remember. Shorter between shops. Longer in all the places where a shop has gone.
The old newsagent is a pottery studio now. A bowl in the window costs more than your childhood bicycle.
Rowan|Before you ask, I don’t understand the bowls either.
At the chip shop, Rowan orders and then stops before ordering for you.
Rowan|Same as before? Or has adulthood changed your position on peas?
You|I’d like to retain the right to evolve.
Rowan|Brave. Expensive. They charge extra for peas.
You take your paper parcels to the sea wall. The stone is warm through your clothes. Out in the harbor, a boat turns so slowly it seems to be changing its mind.
Rowan digs wooden forks from a pocket, along with a washer, a receipt, and a pencil worn almost to nothing.
You|Do you have an entire workshop in there?
Rowan|Only the portable department.
A gull lands three feet away. It has the look of a regular customer disappointed by the service.
You|Absolutely not.
Rowan|Don’t establish eye contact. It’ll think you’re management.
You try eating while looking professionally unavailable. The gull advances.
`,{choices:[choice('“We stand together. Guard the chips.”','gull',{play:'team'}),choice('“Your noble sacrifice will be remembered.” Protect your own lunch.','gull',{play:'tease'}),choice('Move the parcels under cover. “I believe in diplomacy.”','gull',{play:'practical'})]}),
gull: scene('street','day','A tactical retreat', `
For a glorious second, your strategy works. Then a second gull arrives from a direction neither of you has been monitoring.
Rowan makes a noise that you have never heard from a person repairing a door.
One chip is taken. No lives are lost. Your dignity remains unaccounted for.
You relocate beneath the shelter, laughing too hard to be discreet. Rowan shakes vinegar from his wrist.
Rowan|We used to be better at this.
You|We used to have adult supervision.
Rowan|We are the adult supervision.
You consider that in silence.
You|Someone should be told.
The laughter fades comfortably. Rowan offers you the crispiest chip from his parcel, with the solemnity of a treaty.
His hands have small marks you don’t remember. A scar at one knuckle. A line of blue paint beside a thumbnail.
You|What do you do when you aren’t fighting doors?
Rowan|Sometimes I fight boats. For money.
You wait. He looks sideways at you, then relents.
Rowan|I’ve been trying to build a guitar. There’s a course up north. Instrument making. Proper benches. People who know what they’re doing.
You|Have you applied?
Rowan|I’ve developed a very sophisticated relationship with the application page.
He folds the empty corner of his chip paper into a tiny square.
Rowan|It’s a year away. Next intake. There’s time.
There is the smallest defensive edge to it. You recognize someone putting a thing back on a shelf where it can’t be broken.
`,{choices:[choice('“You sound like you really want it.”','ambition',{support:'listen'}),choice('“Time can turn into a very comfortable excuse.”','challenge',{support:'challenge'}),choice('“Want company while you look at the application?”','offer',{support:'practical'})]}),
ambition: scene('street','day','Something of his own', `
Rowan|I do.
His answer is unexpectedly plain.
Rowan|I want to make something that doesn’t need me after I’m done. Something a person can take somewhere else and use to make a ridiculous amount of noise.
You|That’s a good want.
Rowan|I think so. It still feels a bit extravagant when I say it out loud.
You finish your lunch without asking him for a plan. Eventually he tells you about tonewoods, and then apologizes for telling you about tonewoods.
You|I asked.
Rowan|Dangerous precedent, {nickname}.
`,{next:'optional'}),
challenge: scene('street','day','A useful disagreement', `
Rowan’s paper stops moving.
Rowan|It’s not only an excuse. There are things here that need doing.
You|I know. I’m not saying it’s easy. I just heard myself say “there’s time” for years.
Wind lifts a receipt between your shoes. Rowan catches it before it reaches the road.
Rowan|I don’t like that you might have a point.
You|You don’t have to like it right away.
He looks at you again. This time his smile is less defensive.
Rowan|All right. Ask me about the application again. Another day. I might still be annoying about it.
You|I have experience.
`,{next:'optional'}),
offer: scene('street','day','A useful kind of help', `
Rowan|Maybe. Not if it turns into you doing it for me.
You|I was imagining sitting nearby and criticizing the website.
Rowan|There is a lot to criticize.
You|Then I am qualified.
He unfolds the square of paper he was making, smoothing it against his knee.
Rowan|Thank you. Let me ask when I’m ready.
You agree. It feels good to offer something with a handle he can choose to take.
`,{next:'optional'}),
optional: scene('street','day','The long way home', `
At the corner, the lane back to Summerhouse slopes inland. The promenade bends the other way toward the old pier.
Rowan|We could check whether the pier is still standing. For planning purposes. Or go back. You did travel today.
Your feet are tired, but the afternoon has become the kind you used to resent being called indoors from.
`,{choices:[choice('Take the longer walk. Ask about his music.','pier',{detour:true}),choice('Head home together. Enough adventures for one afternoon.','homeward',{detour:false})]}),
pier: scene('pier','day','An optional detour', `
The pier is still there. Narrow, stubborn, and only slightly less straight than the horizon. Fresh boards interrupt the old ones like patches on a favorite coat.
Rowan puts a hand on the railing. You notice that he tests it before leaning.
You|Do you still play?
Rowan|Guitar? Yes. Badly, but with considerable persistence.
You|You used to know three chords.
Rowan|Four now. I don’t want success to change me.
Below you, water clicks against the pilings. A loose rope taps a mast in the harbor, almost keeping time.
Rowan|She used to ask me to play in the kitchen. Your grandmother. While she did the accounts.
You|I didn’t know that.
Rowan|Mostly to stop me trying to fix her calculator. It wasn’t broken. She just didn’t believe it.
He looks out at a marker buoy. The small smile stays, even as something else arrives beside it.
Rowan|I liked having an audience who would tell me when I was terrible.
You stand together until the wind begins to get through your sleeves. Rowan points to the eastern breakwater, where the sun will come up.
Rowan|Best seat in town. If you ignore the complete absence of a seat.
On the way back, he matches your pace without making a thing of it.
`,{next:'kitchen'}),
homeward: scene('street','day','A shorter way is still a way', `
Rowan|Good call. I was trying to look more energetic than I feel.
You|We can both retire from that immediately.
You stop at the little grocery for bread. Rowan remembers the milk only when you reach the till and returns with two kinds, so you can choose.
The walk uphill is companionable. No one tries to make it an event.
At the gate Rowan takes the heavier bag. You let him. Then you hold the door while he negotiates the repaired latch.
It is possible, you think, to be looked after without surrendering the whole day.
`,{next:'kitchen'}),
kitchen: scene('living','evening','04 / The third cup', `
In the kitchen, evening light reaches halfway across the table. You open a bread bin and find a recipe card tucked under the lid.
LEMON CAKE. Your grandmother’s handwriting. Then, underneath: MORE LEMON THAN THAT.
You|Very precise.
Rowan looks over your shoulder.
Rowan|I made it once. Used the amount she told me. She said I’d been timid.
You|Did you make it again?
Rowan|Yes. She said it was aggressive.
The kettle begins its low grumble. Rowan takes cups from the cupboard, setting them out without looking.
One by the window. One near you. One at the head of the table.
His hand stops over the third cup.
It is the yellow one. A crack runs through the glaze under its handle. You used to turn it away from her because you were afraid it would break.
The kettle clicks off. The refrigerator keeps humming. Somewhere upstairs a door moves against its latch.
Rowan|Sorry.
You|You don’t have to—
You stop. You don’t know which of the many things you mean should finish the sentence.
Rowan turns the cup once, keeping both hands around it. His thumbnail finds the crack.
`,{choices:[choice('Sit with him. Let the cup stay for now.','cupstay',{grief:'quiet'}),choice('“Tell me about the last time you made her cake.”','cake',{grief:'story'}),choice('“Could we put it away? Just for tonight.”','cupaway',{grief:'space'})]}),
cupstay: scene('living','evening','Room at the table', `
You sit down. After a moment Rowan sits too. The third cup remains where it is, receiving a small square of sunset.
There isn’t a good thing to say. You stop trying to find one.
Rowan|She would hate the tea getting cold.
You|She’d put it in the microwave and deny it.
Rowan lets out a laugh that doesn’t quite decide what it is. You pour the tea. Only two cups.
For a little while, the ordinary work of passing milk and finding spoons is enough to keep you both at the table.
`,{next:'absence'}),
cake: scene('living','evening','Enough lemon', `
Rowan|She made me take half of it home. Claimed she’d gone off cake.
You|She hadn’t.
Rowan|Absolutely not. I came back the next day and she asked where the rest was.
You laugh, then cover your mouth for no reason you can name.
Rowan|It’s all right.
He doesn’t say what is all right. Laughing, maybe. Or not knowing what to do with your hands.
You put the recipe card between you. There is a thumbprint of flour in one corner. Neither of you brushes it away.
`,{next:'absence'}),
cupaway: scene('living','evening','A gentler amount', `
Rowan|Yes. Of course.
He returns the cup to the cupboard, carefully enough that it makes no sound.
You|I’m not trying to pretend.
Rowan|I know. It’s a lot all at once.
He closes the cupboard and leaves his hand on the knob for a second. You pour his tea while he’s turned away.
When he sits down, you slide it toward him. He nods, accepting the small exchange.
The place at the head of the table is empty. Tonight, that is enough to be looking at.
`,{next:'absence'}),
absence: scene('living','evening','Different versions of the same house', `
Rowan|I used to come over after closing. Check the gutters, move the bins. She paid me in food I hadn’t asked for.
You|She told me everything was fine.
Rowan|She liked having good news for you.
You look at the pencil mark on the floorboard. From this side of the room, you can see a second mark, half rubbed away.
You|I thought she meant it.
Rowan|Sometimes she did.
He turns his spoon over. For a moment you think he will stop there.
Rowan|Sometimes she was tired. Sometimes I was. I should have told you more.
You|I could have asked better questions.
Neither statement cancels the other. The tea is strong. You drink it anyway.
Rowan|This was the place I could come when next door was… loud. She never made me explain before she fed me.
You remember your grandmother putting another potato in the pan. You thought she simply liked making too much.
Rowan|Sorry. That makes it sound like every day was awful. It wasn’t. I had good things, too.
You|You don’t have to make it one kind of story.
He looks at you then. Properly, for a second.
Rowan|Neither do you.
Your phone is in your pocket. On it is a voice message from your grandmother, saved in February. Twenty-three seconds. You have not been able to press play since the funeral.
You don't play it now. Having the option is already more than you can hold alongside this kitchen.
Instead, you wash the cups. Rowan dries. You find you still know how to pass him things without looking.
`,{next:'plan'}),
plan: scene('living','evening','A very early beginning', `
Afterward you bring the promise list down. The green ink has faded most where the paper was folded.
You|What time would we have to leave? For the first one.
Rowan|Four forty. If we want the whole thing.
You|There’s a four forty in the morning?
Rowan|An administrative error. Unfortunately they kept it.
You rest the paper on the table. The first line feels different from the last. Small enough to put a real time beside.
Rowan|We can aim for tomorrow. And if you don’t sleep, we can aim for another day. A promise isn’t a trap.
You|Bring a flask?
Rowan|Already mentally bringing a flask.
`,{choices:[choice('“Tea. Strong enough to negotiate with the morning.”','numbers',{ritual:'tea'},{sunrise:'planned'}),choice('“Coffee. I need an unfair advantage.”','numbers',{ritual:'coffee'},{sunrise:'planned'}),choice('“Cocoa. We’re allowed one childish decision.”','numbers',{ritual:'cocoa'},{sunrise:'planned'})]}),
numbers: scene('exterior','twilight','A way to reach each other', `
Rowan checks the latch once more before leaving. It closes with a reassuring little click.
Rowan|There. Civilized.
At the gate, neither of you moves immediately. The streetlamps have come on, gold against the blue hour.
You|Is your number still the one ending in nineteen?
Rowan|That phone went into the harbor. Along with a very good sandwich.
You exchange phones. Rowan types with one finger, concentrating as if your contact list is delicate machinery.
He hands yours back. His name is followed by a tiny anchor.
Rowan|For identification. In case you meet other Rowans before morning.
You send a single wave. His pocket lights up.
Rowan|Got you.
The words are ordinary. You carry them a little way anyway.
`,{choices:[choice('“I’d like this to be a friendship we keep choosing.”','friends',{relationship:'friendship'}),choice('“I’m glad it’s you I’ll see in the morning.” Let the warmth show.','warm',{relationship:'open'}),choice('“One day at a time?”','oneday',{relationship:'undecided'})]}),
friends: scene('exterior','twilight','Chosen company', `
Rowan’s smile settles into something unguarded.
Rowan|I’d like that too. The keeping part especially.
You|No legally binding chip protection clause, though.
Rowan|Then what are we even doing?
He lifts a hand as he crosses into the next garden. You don’t feel as if you have closed a door. You feel as if you have told him which one to use.
`,{next:'night'}),
warm: scene('exterior','twilight','A little room for possibility', `
Rowan looks down at the phone, although there is nothing new on it.
Rowan|Well. Wait until you’ve seen my four-forty face before making statements like that.
You|I’ll reserve a small amount of judgment.
Rowan|Sensible.
He is smiling when he says it. You don’t decide what it means yet. It is enough to notice.
`,{next:'night'}),
oneday: scene('exterior','twilight','A manageable distance', `
Rowan|One day at a time.
You|Starting at a frankly unnecessary hour.
Rowan|We can file a complaint with the sun.
The agreement feels easy because it is small. Neither of you has to promise a version of yourself you haven’t met yet.
Rowan raises a hand from the next gate. You raise yours back.
`,{next:'night'}),
night: scene('bedroom','night','05 / Across the fence', `
Upstairs, your room has become a room again. Boxes line one wall. The towel is folded on a chair. Your small treasure, {treasure}, sits on the windowsill.
You put the photograph beside it. {nickname}, with an ambitious moat and no idea what comes next.
Through the open window you can see a rectangle of light in Rowan’s house. Every so often a shadow crosses it.
Your phone vibrates.
Rowan|Important clarification: the gull was not representative of the local hospitality industry.
You laugh into a house that doesn’t quite know the sound of you yet.
There is a little time before sleep. Enough for a few messages. Not enough to explain the years. You find that you don’t need it to be.
`,{next:'texting',enter:{phoneUnlocked:true}}),
texting: scene('bedroom','night','A short goodnight', `
Rowan is a garden fence away. Your screen is warm in your hand.
`,{phone:true,next:'afterchat'}),
afterchat: scene('bedroom','night','What a promise can look like', `
You set the alarm and turn your phone face down. Tomorrow has acquired a time, a place, and someone bringing a flask.
The house makes a settling sound. You used to think it was breathing. Tonight you let yourself think that again.
Before bed, you go looking for a spare pillowcase. The bottom drawer catches on something. You ease it open rather than pulling.
Inside is an exercise book, swollen at the corners. On its cover, in Rowan’s handwriting: THINGS WORTH TELLING {name}.
You remember now. Not one of the five big promises. A small one made {hideoutPlace}, on the last night before you moved away.
You had been afraid you would stop knowing the place. That everyone would continue without you and you would return as a visitor.
Rowan had said, “I’ll save you a bit.” You thought he meant a shell, perhaps. A photograph. You had said you’d do the same.
The first page describes a dog stealing a whole baguette. There is an unconvincing drawing of the dog.
The next page has a bus ticket taped to it. Then a pressed flower. Then a note about the newsagent closing, with its final sweet wrapper tucked beneath.
Years of entries. Not every day. Sometimes months apart. Enough to show that after a gap, he began again.
Near the end, you find: She laughed at the aggressive lemon cake. Properly laughed. Wanted to tell you while I still remembered the sound.
You sit on the floor with the drawer open against your knee.
He hadn’t stopped living while you were away. He had kept a place where he could tell you about it.
Between the final two pages is a loose note in your grandmother’s hand. Rowan said to keep this here. In case you came home when he was out.
You hold the book closed for a moment. Outside, Rowan’s light goes dark.
The list downstairs contains five things unfinished. Up here is a promise that has been quietly happening all along.
`,{choices:[choice('Leave the book by the window. Tomorrow, thank him in person.','end',{hook:'inperson'}),choice('Write a note: “I’d like to start saving you a bit, too.”','end',{hook:'reciprocity'})]}),
end: scene('pier','dawn','The first light is still ahead', `
4:40 waits on the other side of sleep.
For once, leaving is not the next thing you have to do.
`,{ending:true,enter:{completed:true}})
};

// Callbacks stay inside the authored graph, never in provider-generated content.
story.sort.lines.unshift(
  {speaker:'Rowan',text:'One room together. And you get the final say. It’s your house to sort.',if:['outlook','independent']},
  {speaker:'Rowan',text:'Uselessness approved. I’ll put it on the rota.',if:['outlook','humor']},
  {speaker:'Rowan',text:'Then I’ll stay. We can start with something small.',if:['outlook','company']}
);
story.gull.lines.unshift(
  {speaker:'',text:'You and Rowan close ranks around the parcels, a united and faintly greasy front.',if:['play','team']},
  {speaker:'Rowan',text:'Betrayal. In front of witnesses. Feathered witnesses.',if:['play','tease']},
  {speaker:'',text:'You tuck both parcels beneath the shelter. Rowan salutes your commitment to conflict resolution.',if:['play','practical']}
);
story.night.lines.push(
  {speaker:'',text:'You remember how he matched your pace on the pier. The small things came back before the large ones.',if:['detour',true]},
  {speaker:'',text:'The groceries are put away downstairs. Bread, milk, an ordinary tomorrow. Coming home early was the right amount of day.',if:['detour',false]}
);
story.afterchat.lines.unshift(
  {speaker:'',text:'You decide to save your words for daylight. The number is there when you want it; tonight doesn’t have to contain everything.',if:['skippedChat',true]}
);
story.end.lines.unshift(
  {speaker:'',text:'You leave the book beside your small treasure, open to the first page. Some things deserve to be said with a person in the room.',if:['hook','inperson']},
  {speaker:'',text:'On a clean sheet you write: “I’d like to start saving you a bit, too.” Beneath it, your first entry: Today, Rowan lost a chip and found a fourth chord.',if:['hook','reciprocity']}
);
// Keep legacy IDs intact for saved games, but new games use the approved PDF opening.
Object.assign(story, opening);
