// Approved PDF adaptation. This route stops at Rowan's first recognition.
// Legacy chapter nodes remain available to existing saves in story.js.
const scene = (place, title, text, end = {}) => ({place, time:'day', title,
  opening:true, lines:text.trim().split('\n').filter(Boolean).map(row=>{
    const i=row.indexOf('|'); return {speaker:i<0?'':row.slice(0,i),text:i<0?row:row.slice(i+1)};
  }), ...end});
const option=(text,next,set)=>({text,next,set});
export const opening = {
journey:scene('bus','01 / The road back',`
Eight hours on a bus, including a stopover, and I’ve run out of comfortable ways to sit.
I shift my knee away from the seat in front of me. The window rattles beside my head.
Every summer, we used to take this road.
Then one summer, I didn’t.
After that, it became easier to say “next year.”
More than four years of next year.
The sea appears between two buildings. I lean toward the window before I mean to.
There. Saint Luis.
Small fishing boats crowd the bay. Along the water, the baywalk bends out of sight.
Lola used to take us there in the afternoons. Me on one side. Rowan on the other.
Usually arguing about something that mattered enormously for about ten minutes.
You|Hay. I wonder how he’s been.
I’m smiling. It takes me a moment to notice.
Then another thought catches up.
He was probably at the funeral.
Two years ago. Lola died during finals week.
I stayed in the city. Took my exams. Told myself I couldn’t afford to miss them.
I still don’t know how to explain that without hearing what it sounds like.
Her grandchild didn’t come.
I press my thumb against the seam of my bag.
My family had spent years telling me how much depended on doing well.
When they made me leave Saint Luis with them, I hadn’t wanted to go. I wanted to stay here. With her.
And they left too.
The thought comes quickly. Meanly. It doesn’t make me feel any better.
Now I’m finally taking a summer for myself, and somehow that’s wrong too.
You|Can I do one thing without—
I stop. The wind lifts the hair from my forehead.
I came here because I was tired.
Of college. Of the last few weeks. Of having the same argument in my head long after everyone else had finished talking.
Lola’s house needs cleaning. Probably repairs. Things I can actually do something about.
Sweep a floor. Fix a window. Sleep.
That was the plan.
I look back toward the baywalk.
What would I even say to Rowan?
Sorry I disappeared? Sorry I didn’t call?
Sorry about—
Conductor|SAINT LUIS! SAINT LUIS!
I jerk upright. Across the aisle, a sleeping passenger does the same.
You|Grabe.
At least I wasn’t the only one.
`,{next:'busBump',audio:'bus'}),
busBump:scene('bus','A very good start',`
Everyone seems to stand at once. After eight hours, I understand the urgency.
I reach for my bag.
A shoulder hits mine. My hand slips off the seat.
You|Aray!
For a second, all I can do is sit in the aisle and stare at the strap still looped around my wrist.
Stranger|Sorry! Sorry. My son’s already getting off.
He glances toward the front.
Stranger|I need to catch him.
`,{audio:'bus',choices:[option('“It’s fine. Go.”','bumpKind',{strangerResponse:'kind'}),option('Glare at him.','bumpGlare',{strangerResponse:'glare'}),option('“Watch where you’re going!”','bumpAngry',{strangerResponse:'angry'}),option('Say nothing.','bumpSilent',{strangerResponse:'silent'})]}),
bumpKind:scene('bus','A very good start',`
You|It’s fine. Go.
It isn’t fine, exactly. My hip hurts. But he’s already looking past me.
Stranger|Thank you. Sorry again.
He squeezes down the aisle.
`,{audio:'bus',next:'wallet'}),
bumpGlare:scene('bus','A very good start',`
I look up at him. Then down at myself, still on the floor.
He shifts awkwardly.
Stranger|Sorry.
He leaves before I decide whether I have anything to add.
`,{audio:'bus',next:'wallet'}),
bumpAngry:scene('bus','A very good start',`
You|Watch where you’re going!
It comes out louder than I intended. The man flinches.
Stranger|Sorry, sorry.
He turns toward the exit.
`,{audio:'bus',next:'wallet'}),
bumpSilent:scene('bus','A very good start',`
I reach for the seat and pull myself up.
Stranger|Sorry.
I don’t answer. After a moment, he moves on.
`,{audio:'bus',next:'wallet'}),
wallet:scene('bus','A very good start',`
I brush my clothes down.
You|Great start.
Bag. Phone—
My hand goes to my back pocket. Then the other one.
Nothing.
I check the seat. Under it. The aisle.
You|No. Come on.
My wallet is gone.
I look toward the exit. The man is gone too.
Was there even a child?
You|Shit.
My cards and IDs are in my bag. I check them twice anyway.
The wallet only had cash.
Only the cash I was going to use to get home.
Through the windshield, I can see the road toward town.
The nearest place to withdraw money is back that way. Lola’s house is in the other direction.
You|Napakamalas naman.
I stand there for a moment, gripping my bag.
Then I remember. Some buses take Santiago Street.
Some don’t.
`,{audio:'bus',next:'driver'}),
driver:scene('bus','A small kindness',`
You|Manong? Excuse me po.
The driver looks over.
You|Dadaan po ba kayo sa Santiago Street?
Driver|Oo. Doon ka bababa?
You|Opo.
My shoulders loosen.
You|Thank you po.
Then I look at the conductor’s ticket stack.
Farther along the route. An extra fare. Of course.
For one embarrassing second, I consider getting off very quickly and hoping nobody stops me.
You|May dagdag po ba? Kasi—
Driver|Upo ka na. Hindi na kita sisingilin.
I hesitate. He nods toward the aisle.
Driver|Nakita kong nabangga ka. May nawala?
You|Wallet ko po.
The driver exhales through his nose.
Driver|Hay. Sige. Sa Santiago kita ibababa.
You|Salamat po. Talaga.
He gestures toward an empty seat.
Driver|Hawakang mabuti ’yang bag mo.
You|Opo.
I sit down. For a while, I just hold my bag against my knees.
Outside, Saint Luis slips past the window.
The day hasn’t improved much.
But someone made a little room in it for me.
`,{audio:'bus',next:'hill'}),
hill:scene('saint-luis','The hill',`
You|Dito na po. Thank you!
Driver|Ingat.
I wait until the bus has gone. Then I turn toward the hill.
It looks smaller.
My legs disagree almost immediately.
Halfway up, I have to change hands with my bag.
Rowan and I used to race here. Downhill was easy.
Uphill, one of us always started arguing about where the finish line was.
I can see his house now. And beyond it, Lola’s porch.
After we’d worn ourselves out, she’d call us in for bibingka.
We’d eat before it had cooled properly. Then go straight back to hide-and-seek.
I remember those afternoons so clearly.
The heat. The crumbs. Trying not to laugh when Rowan walked past my hiding place.
I can’t remember the last thing I said to her.
My grip tightens around the bag. I try.
Something ordinary, probably.
Something I thought I’d get to follow up on.
The path blurs.
`,{audio:'home',choices:[option('Let yourself cry.','hillCry',{griefResponse:'cry'}),option('Hold the tears for now.','hillHold',{griefResponse:'hold'})]}),
hillCry:scene('saint-luis','The hill',`
I put my bag down.
There isn’t a graceful way to do this, apparently.
I wipe my face, then have to do it again.
You|Sorry, Lola.
I don’t try to make the words explain everything.
I stand there until I can breathe without catching on it.
Then I pick up my bag.
`,{audio:'home',next:'otherDoor'}),
hillHold:scene('saint-luis','The hill',`
I look down at my shoes. One breath. Then another.
Not here.
I want to get inside first. Put my things down. Have a door I can close.
You|Just a little farther.
I loosen my grip on the handle and keep walking.
`,{audio:'home',next:'otherDoor'}),
otherDoor:scene('saint-luis','The other door',`
The house won’t clean itself.
That sounds like something Lola would have said. I almost laugh.
Rowan’s house is right there.
I could knock. Just to let them know I’m back.
That would be normal. Polite, even.
I rehearse it.
Hi. It’s been a while.
Four years is probably longer than “a while.”
What if he opens the door?
What if he looks happy to see me?
Somehow, I haven’t prepared for that either.
You|I can say hello.
You|In theory.
`,{audio:'home',choices:[option('Knock on the door.','neighborVisit',{knocked:true}),option('Get settled first.','neighborWait',{knocked:false})]}),
neighborVisit:scene('saint-luis','The other door',`
I turn toward the porch before I can hold a full debate about it.
Up close, the door is familiar enough to make my stomach tighten.
How many afternoons did I spend waiting here?
I knock.
Nothing. I listen.
Then knock again, a little louder.
You|Hello? Mr. and Mrs. Sanchez?
I hesitate before the last name.
You|Rowan?
I wait longer than I need to.
You|Okay. Nobody home.
The relief is immediate. The disappointment takes another second.
I step off the porch and head toward Lola’s house.
`,{audio:'home',next:'doorRepair'}),
neighborWait:scene('saint-luis','The other door',`
I keep walking.
I’ve been traveling all day. I’ve lost my money. I’m not sure what my face is doing.
I can put my bag down before trying to explain four years.
For a moment, I tell myself he probably wouldn’t remember me anyway.
I know that isn’t true.
I’m just not ready.
`,{audio:'home',next:'doorRepair'}),
doorRepair:scene('repair','A familiar stranger',`
I stop.
Another tap. Then a scrape.
Someone’s at the house.
You|What the hell?
I hurry the last few steps.
A man about my age is kneeling in front of the door, his back toward me.
A screwdriver lies beside his knee. He has a hammer in one hand.
The door is open just far enough that I can’t see what he’s doing to it.
My bag knocks against my leg as I climb onto the porch.
You|Excuse me!
He stops.
You|What are you doing? That’s my lola’s house.
The hammer lowers.
The man turns.
`,{audio:'quiet',next:'recognition'}),
recognition:scene('saint-luis','A familiar door',`
Brown hair, tied back low.
A loose strand falls across his face as he looks up.
Then I see his eyes.
Oh.
Rowan.
The accusation is still hanging between us.
For a moment, neither of us moves.
His eyes widen.
Rowan|{name}?
`,{audio:'recognition',cg:'familiar-door',ending:true,openingEnd:true})
};
