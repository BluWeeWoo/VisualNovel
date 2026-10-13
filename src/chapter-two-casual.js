// User-edited review 68429. Presentation and wording only; choices stay intact.
export function reviseCasualChapterTwo(story){
 const parse=t=>t.trim().split('\n').map(r=>{const i=r.indexOf('|');return {speaker:r.slice(0,i),text:r.slice(i+1)};});
 const edit=(id,from,to,text)=>{
  const n=story[id];n.casualOldLines??=n.lines.map(l=>({...l}));
  const a=from?n.lines.findIndex(l=>l.text===from):0;
  const b=to?n.lines.findIndex((l,i)=>i>=a&&l.text===to):n.lines.length;
  if(a<0||b<0)throw new Error('Missing casual anchor '+id);
  n.lines.splice(a,b-a,...parse(text));
 };
 edit('c2MarketWalk','Wait. Are you {name}?','We stop by a few shops to finish Rowan’s errands. We buy tilapia, some fruit, and chicken.',`Vendor 2|Wait. Are you {name}?
You|Yeah.
Vendor 2|Oh, welcome back! How’s your lola’s house holding up?
You|Still standing. Rowan’s been helping.
Vendor 2|Good thing, too. Once he notices something loose, he can’t leave it alone.
Rowan|Like your table?
Vendor 2|Exactly. Tomorrow, ha?
Rowan|I said I’ll check it tomorrow.
Vendor 2|Sige. Ingat kayo.
|We step aside as another customer approaches.
You|Do you ever get through here without picking up work?
Rowan|Sometimes I take the other entrance.
|I laugh.`);
 edit('c2Workshop','Outside, Rowan switches the bag to his other hand. The sanding starts again behind us.',null,`|Outside, Rowan switches the shopping bag to his other hand.
|Behind us, the sanding starts again.
|He looks down the road without moving.
You|Ro?
Rowan|Hm?
You|Which way?
Rowan|Oh. This way.
|He starts walking, and I fall into step beside him.
|He’s quieter than he was when we arrived.`);
 edit('c2FridayAsk',null,null,`You|By the way—Friday, huh?
Rowan|Yeah.
You|Want to tell me about it?
Rowan|Well…`);
 edit('c2FridayLeave',null,null,`Thought|Maybe he’s still figuring it out.
|I let him lead the way.`);
 edit('c2CemeteryWalkTogether','Whatever happened that week. Work. Mama.','Are we close?',`Rowan|Whatever happened that week. Pati work at Mama.
|He glances at me.
Rowan|And you, sometimes.
You|Me?
Rowan|Don’t worry, I’m not shit-talking you to Lola. Hahaha.
You|Talaga?
|He laughs softly.
Rowan|I told her you were coming home.
|For a few steps, all I hear is our footsteps.
You|Thanks for telling her.
|He nods.
|We keep walking.
|The shops grow farther apart, and the traffic sounds quieter behind us.`);
 edit('c2Grave','Lola, I’m so sorry I’m late.','I feel an arm around my shoulders.',`You|Lola, I’m so sorry I’m late.
|I look at her name.
|I thought I’d know what to say when I got here.
You|I’m sorry I didn’t try harder.
|My voice catches.
You|I wanted to come. I just…
|I can’t finish.
|The tears come before I can stop them.`);
 edit('c2FatherOffer','And please answer your father. He’s still your father, after all.',null,`Mayumi|And please answer your father when you’re ready.
|Rowan looks down at his plate.
Rowan|He won’t like my answer.
Mayumi|Maybe not. But I’m asking you to talk to him, anak. You don’t have to say yes.
Rowan|He doesn’t really listen.
|Mayumi goes quiet.
Mayumi|I know it hasn’t been easy.
Rowan|Does he even deserve to be called my father?
Mayumi|Rowan…
|He lets out a breath.
Rowan|Sorry, Ma.
|For a moment, nobody reaches for the food.
|Then Mayumi folds the bread bag closed.`);
 edit('c2EndApprenticeship',null,null,`You|Is it still like that now?
|Rowan lets out a long breath.
Rowan|Not exactly. Mama started backing me up.
You|What changed?
Rowan|Carpentry. I started spending more time at Manong Nestor’s workshop.
You|Before the Manila offer?
Rowan|Yeah. That came later.
|He glances toward the tools beside the back door.
Rowan|At first, I was just helping him. Watching how he did things, trying not to mess anything up.
You|And did you?
Rowan|Minsan.
|A small smile appears.
Rowan|He still let me come back.
You|Sounds like he saw something in you.
Rowan|Maybe.
|He looks toward the tools again.
Rowan|We finished a dining table last month. I kept finding excuses to look at it afterward.
You|You were proud.
Rowan|Syempre.
|His smile lasts a little longer this time.
Rowan|And that’s when I realized I wanted to get good at this.
You|What did your father think?
|The smile fades.
Rowan|He thought I was wasting my time. Said it was useless. That it was embarrassing for the Sanchez name.
You|Seriously?
Rowan|Yeah. We had a huge argument.
|He rubs his palm against his trousers.
Rowan|Mama stood up for me. That was the first time I saw her argue with him like that.
You|So what happened?
Rowan|We settled on calling it a hobby. I could keep helping Manong Nestor as long as I still did what my father asked.
You|And now there’s an actual offer.
Rowan|Yeah, a paid apprenticeship. In Manila.
|He nods toward the tools.
Rowan|I can’t exactly call that a hobby anymore.
You|Does Manong Nestor know about the arrangement?
Rowan|He knows I’ve been keeping it to my free time. I haven’t told him all the family stuff.
You|But you want to go?
Rowan|Yeah.
|This time, he doesn’t hesitate.
You|Okay.
|He looks at me.
You|Then I hope you get to.
Rowan|I just need some time to figure out how to tell them.
You|I’m not rushing you, Ro.
|His shoulders loosen a little.`);
 edit('c2EndGlass',null,null,`|He picks up a cloth and starts drying a glass that is already dry.
Rowan|I wanted this week to be nice.
You|It can still be nice.
Rowan|You had that nightmare. Then you visited Lola. I didn’t want to add more.
You|You’re not making things worse by talking to me.
|He nods, but keeps turning the glass.
You|And you don’t have to take care of everything for me.
|His hands slow.
Rowan|I know. Habit, I guess.
You|You could’ve at least let me carry the heavier bag.
|He lets out a small laugh.
Rowan|I’ll remember that next time.
You|Please don’t.
|For a moment, he smiles.
|Then he looks down at the glass again.
You|Ro. It’s dry.
Rowan|Right.
|He puts it down.
|Neither of us says anything for a moment.
Rowan|You said you’re here for the summer.
You|Yeah.
|He runs his thumb over the edge of the cloth.`);
 // Bag banter refers to the accompanied market trip only.
 for(const l of story.c2EndGlass.lines.slice(9,14))l.conditions=[['afternoonRoute','market']];
 story.c2EndGlass.cgCue.from='He picks up a cloth';
 story.c2EndGlass.cgCue.until='He puts it down.';
 edit('c2EndStay',null,'We finish the last few dishes.',`Rowan|I guess I keep hoping you’ll change your mind. Haha.
|My chest tightens.
You|About leaving?
|He nods.
Rowan|Kahit a little longer lang.
You|Ro…
Rowan|You don’t have to answer. I know you’ve got school.
|He rubs the back of his neck.
Rowan|I just got used to you being here again.
Rowan|And now you’re going to leave soon.
Rowan|But I’m determined to make every day with you count.
|I move a little closer.
You|I missed you too.
|He looks at me.
You|I don’t know what will happen after summer.
Rowan|Yeah. I know.
You|But I’m here now. We still have time.
|He lets out a breath.
Rowan|Okay.
|A small smile returns.
Rowan|That’s good.
|I pick up the next plate.
You|Come on. Help me finish these.
|He reaches for the cloth.
Rowan|I thought I was already helping.
You|You’ve been drying one glass for ten minutes.
Rowan|It’s very clean.
|I laugh.`);
 story.c2EndStay.cgCue.until='I pick up the next plate.';
 // Explicit expressions for newly authored passages.
 for(const id of ['c2EndApprenticeship','c2EndGlass','c2EndStay']){
  const n=story[id];let expression=id==='c2EndStay'?'embarrassed':'concerned';
  for(const l of n.lines){
   if(['Minsan.','A small smile appears.','Syempre.','He lets out a small laugh.','A small smile returns.','It’s very clean.'].includes(l.text))expression='smile';
   if(['The smile fades.','Then he looks down at the glass again.'].includes(l.text))expression='concerned';
   l.expression=expression;
  }
 }
}
