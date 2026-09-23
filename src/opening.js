// Approved PDF adaptation. This route stops at Rowan's first recognition.
// Legacy chapter nodes remain available to existing saves in story.js.
const scene = (place, title, text, end = {}) => ({place, time:'day', title,
  opening:true, lines:text.trim().split('\n').filter(Boolean).map(row=>{
    const i=row.indexOf('|'); return {speaker:i<0?'':row.slice(0,i),text:i<0?row:row.slice(i+1)};
  }), ...end});
const option=(text,next,set)=>({text,next,set});
export const opening = {
journey:scene('bus','01 / The road back',`
It’s been eight hours since we left the city, including the stopover. I can’t get comfortable anymore.
I move my knee away from the seat in front of me. The window keeps rattling beside my head.
I used to come to Saint Luis every summer.
Then I stopped visiting.
I kept telling myself I’d come back the next year.
More than four years have passed since my last visit.
The sea appears between two buildings. I lean closer to the window to get a better look.
I’m finally back in Saint Luis.
There are small fishing boats in the bay. I can see the old baywalk along the shore.
Lola used to take Rowan and me for walks there in the afternoons.
Rowan and I would argue over little things, then forget about them a few minutes later.
You|Hay. I wonder how he’s been.
Thinking about him makes me smile.
Then I remember Lola’s funeral.
He was probably at the funeral.
Two years ago, Lola died during finals week.
I stayed in the city to take my exams. I thought missing them would put my studies at risk.
I had a reason for staying, but I still feel guilty.
I was her grandchild, and I wasn’t there.
I hold my bag a little tighter.
My family always put so much pressure on me to do well in school.
They made me leave Saint Luis with them, even though I wanted to stay with Lola.
They left her behind too. Why am I the only one who should feel bad?
I know that’s unfair. Blaming them won’t change the fact that I missed her funeral.
Now they’re upset with me for spending the summer here. I just wanted a break.
You|Can I do anything without someone getting angry at me?
I take a breath and turn toward the open window.
I came here because I needed some rest.
College has been exhausting. These past few weeks have been rough, and I keep thinking about the arguments with my family.
Lola’s house needs cleaning, and a few things probably need fixing. I can help with that.
I’ll clean up, do what repairs I can, and get some sleep.
That’s all I planned to do this summer.
I look back toward the baywalk.
What am I going to say if I see Rowan?
Sorry I stopped visiting? Sorry I never called?
And how do I explain missing the funeral?
Conductor|SAINT LUIS! SAINT LUIS!
The shout makes me jump. It wakes the passenger across the aisle too.
You|Grabe.
At least I’m not the only one he scared.
`,{next:'busBump',audio:'bus'}),
busBump:scene('bus','A very good start',`
Everyone gets up at once. After eight hours, we’re all ready to get off this bus.
I reach for my bag.
A man bumps into me. My hand slips off the seat, and I fall into the aisle.
You|Aray!
I sit on the floor for a moment. My hip hurts, and my bag is still caught around my wrist.
Stranger|Sorry! Sorry. My son’s already getting off.
He looks toward the front of the bus.
Stranger|I need to catch him.
`,{audio:'bus',choices:[option('“It’s fine. Go.”','bumpKind',{strangerResponse:'kind'}),option('Glare at him.','bumpGlare',{strangerResponse:'glare'}),option('“Watch where you’re going!”','bumpAngry',{strangerResponse:'angry'}),option('Say nothing.','bumpSilent',{strangerResponse:'silent'})]}),
bumpKind:scene('bus','A very good start',`
You|It’s fine. Go.
My hip still hurts, but he’s clearly in a hurry.
Stranger|Thank you. Sorry again.
He hurries past the other passengers toward the exit.
`,{audio:'bus',next:'wallet'}),
bumpGlare:scene('bus','A very good start',`
I glare at him from the floor.
He looks uncomfortable.
Stranger|Sorry.
He leaves before I can say anything.
`,{audio:'bus',next:'wallet'}),
bumpAngry:scene('bus','A very good start',`
You|Watch where you’re going!
I didn’t mean to shout that loudly. He looks startled.
Stranger|Sorry, sorry.
He turns toward the exit.
`,{audio:'bus',next:'wallet'}),
bumpSilent:scene('bus','A very good start',`
I reach for the seat and pull myself up.
Stranger|Sorry.
I don’t answer, so he walks away.
`,{audio:'bus',next:'wallet'}),
wallet:scene('bus','A very good start',`
I brush the dirt off my clothes.
You|Great start.
I check that I still have my bag and phone. Then I reach for my wallet.
I check both back pockets.
They’re empty.
I search the seat, the floor underneath it, and the aisle.
You|No. Come on.
My wallet is gone.
I look toward the exit. The man is gone too.
Did he take it when he bumped into me? Was there even a child with him?
You|Shit.
My cards and IDs are in my bag. I check them twice anyway.
The wallet only had cash.
But I needed that cash to pay for the ride to Lola’s house.
Through the windshield, I can see the road toward town.
The nearest ATM is in town, too far to walk with my bag. Lola’s house is the other way.
You|Napakamalas naman.
I hold onto my bag and try to think of what to do.
Then I remember that some buses pass through Santiago Street, near Lola’s house.
Maybe this one does. I should ask.
`,{audio:'bus',next:'driver'}),
driver:scene('bus','A small kindness',`
You|Manong? Excuse me po.
The driver looks over.
You|Dadaan po ba kayo sa Santiago Street?
Driver|Oo. Doon ka bababa?
You|Opo.
I feel a little better. At least the bus goes where I need to go.
You|Thank you po.
Then I notice the tickets in the conductor’s hand.
Will I have to pay extra to stay on? I don’t have any cash left.
I briefly think about getting off before they ask me to pay. But then I’d still be stuck here.
You|May dagdag po ba? Kasi—
Driver|Upo ka na. Hindi na kita sisingilin.
Before I can explain, he points toward where I fell.
Driver|Nakita kong nabangga ka. May nawala?
You|Wallet ko po.
The driver sighs.
Driver|Hay. Sige. Sa Santiago kita ibababa.
You|Salamat po. Talaga.
He points to an empty seat.
Driver|Hawakang mabuti ’yang bag mo.
You|Opo.
I sit down and keep my bag on my lap as the bus starts moving again.
I watch the houses pass by the window.
I’m still upset about my wallet.
But I’m grateful to the driver. Thanks to him, I can get to Lola’s house.
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
