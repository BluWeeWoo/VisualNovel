// Approved continuation. Existing node IDs and line positions remain loadable.
import {approvedChapterTwoCues} from './chapter-two-revision.js';
const lines=text=>text.trim().split('\n').map(row=>{const i=row.indexOf('|');return {speaker:row.slice(0,i),text:row.slice(i+1)};});
const node=(title,text,next,extra={})=>({title,place:'c2-painted-living-night',time:'night',day:3,chapter:2,chapterTwo:true,opening:true,continuation:true,rowan:true,music:null,lines:lines(text),...(next?{next}:{}),...extra});
const choice=(text,next)=>({text,next,set:{}});
const kitchen={place:'c2-father-kitchen-night'};
const flash={rowan:false,viewpoint:'Rowan',music:null};
const cg=(key,from)=>({key:'c2-father-'+key,from});
export function extendChapterTwo(story){
 Object.assign(story,{
 c2FatherDinner:node('Your father?',`Thought|His father?
Thought|Rowan’s never really talked about him.
Mayumi|He’s worried about you.
Mayumi|He was wondering why you haven’t answered his calls these past few days.
|Tita turns toward me and smiles.
Mayumi|And I think I have an idea why.
Thought|Is it because of me?
Mayumi|Did you answer?
Rowan|I was out.
Mayumi|Oh…
|Rowan leans back.
Rowan|Hay. What did he want?
Mayumi|He wants you to drop by the municipal hall.
Rowan|Why?
Mayumi|There’s a community meeting. He wants you to come with him.
Rowan|And what, tatambay lang ako doon?
|She looks at him.
Mayumi|Hindi, anak. He wants you to start learning how the office works.
You|Sorry, but Tito works there?
|Rowan glances at me worriedly.
Rowan|He’s the mayor.
|I wait for him to smile.
|He doesn’t.
You|Huh? The mayor’s your dad?
Rowan|Yeah.
You|I didn’t know.
Rowan|It all happened after you left.
|I look at him, trying to work out what to ask first.
Thought|Did Lola know?
|Mayumi gives us a moment before continuing.
Mayumi|He wants to introduce you to people.
Rowan|They all know me, Ma.
Mayumi|Anak, not like that.
|He looks down at the table.`,null,{cast:'family',choices:[choice('Contribute to the conversation.','c2FatherAsk'),choice('Don’t say anything.','c2FatherQuiet')]}),
 c2FatherAsk:node('His plans',`You|Does he want you to work for him someday?
Rowan|Yeah. For training.
You|Training?
Mayumi|He thinks Rowan could run someday.
You|For mayor?
|Mayumi nods.
You|Do you want to?
Rowan|Ayaw ko.
|His answer is immediate.
|Mayumi folds her hands in her lap.`,'c2FatherPressure',{cast:'family'}),
 c2FatherQuiet:node('A family matter',`Thought|This seems like a family matter.
Thought|I don’t want to butt in.`,'c2FatherPressure',{cast:'family'}),
 c2FatherPressure:node('An answer of his own',`Mayumi|Then tell him, anak.
Rowan|I will, Ma.
Mayumi|When?
|He doesn’t answer.
Rowan|I’ve had things to do.
|She glances at him.
Mayumi|Anak, huwag mo nang patagalin. He’s waiting for your answer.
Rowan|Ma, I know, but there are still things that need fixing in the house.
Rowan|Plus, {name}’s here. I want to make sure everything’s comfortable.
Rowan|And there’s still stuff at the—
Mayumi|Rowan.
|He rubs his face.
Rowan|I know.
Mayumi|I’m not telling you to take the job right away.
Rowan|It’s not really a job.
Mayumi|Whatever he’s offering. You don’t have to want it.
Rowan|May choice pa ba ako, Ma?
|His voice is quieter now.
Thought|I know that feeling.
|Mayumi waits until he looks at her.
Mayumi|Okay. I’ll keep him busy while you take your time to answer him.
Rowan|Thank you. Sorry, Ma.
|She takes a sip of water before changing the subject.
Mayumi|Have you talked to Mang Nestor?`,'c2FatherOffer',{cast:'family'}),
 c2FatherOffer:node('The other offer',`Mayumi|About his offer?
Thought|I’m curious about that too.
Thought|Will he tell me?
|Rowan looks at me and smiles.
|He knows I’m curious.
Rowan|Manong Nestor recommended me for an apprenticeship in Manila.
You|Manila? That’s nice, Ro.
Rowan|Yeah. It’s paid, too. But with how highly Manong Nestor speaks of me, his friend might have high expectations.
You|You’re already doing a great job with carpentry here in Saint Luis.
Rowan|Yeah, but I don’t know. Maybe I won’t meet their expectations.
Rowan|And he needs an answer by Friday.
Mayumi|Okay. And what are you going to tell him?
Rowan|I’m working on it.
Mayumi|Anak, pati naman ’yan. You want to do it, right?
Rowan|Of course.
Mayumi|Then what’s stopping you?
Rowan|Ma, please…
|Then I see Tita Mayumi look in my direction.
Mayumi|Hay naku. Please, people are waiting for your answer.
Rowan|I know, Ma. I’m sorry.
Thought|Is it because of me that he can’t decide?
Rowan|Not yet.
|Mayumi lets out a quiet breath.
Mayumi|You’ve wanted that for months, ah.
Rowan|I know, Ma.
Mayumi|All right.
|She reaches for her glass.
Mayumi|Just don’t leave it so long that somebody else gets the place.
|Rowan looks down at his plate.
|For a moment, nobody speaks.
Mayumi|And please answer your father. He’s still your father, after all.
Rowan|Does he really deserve to be called that?
Mayumi|Rowan.
Rowan|I know, Ma. I’m sorry.`,'c2MayumiLeaves',{cast:'family'}),
 c2MayumiLeaves:node('Time to rest',`Mayumi|Okay, busog na ako. I think I need some rest.
Rowan|I’ll take you home.
Mayumi|No need. Just help {name}.
Rowan|Okay, Ma. Ingat.
Mayumi|Yeah, yeah. Bye, anak. Bye, {name}.
|I wave at Tita Mayumi. Before she leaves, she turns around.
Mayumi|Oh, and {name}, please take care of my baby.
Mayumi|Love you both.
|I smile.`,'c2KitchenCabinet',{cast:'family'}),
 c2KitchenCabinet:node('The cabinet door',`|After she leaves, Rowan takes the glasses into the kitchen.
|I follow him to help clean up.
|While putting a glass away, he notices the cabinet door won’t stay shut.
|It swings open again.
|He tries a second time.
|Then again.
|And again.
Thought|I know what he’s doing.
You|Ro.
Rowan|The hinge is—
You|I know what you’re doing.
Rowan|Oh…
|His hand stays on the cabinet for a moment.
|Then he lets go.
Thought|He kept asking if I was okay earlier.
Thought|I haven’t really asked him.`,null,{...kitchen,choices:[choice('Ask him about what’s going on.','c2KitchenAsk')]}),
 c2KitchenAsk:node('You could have told me',`You|You could’ve told me.
Rowan|About my dad?
You|All of it.
Rowan|You’d just got here. I didn’t want to burden you with my problems.`,null,{...kitchen,choices:[choice('Yeah. To see you.','c2KitchenSeeYou'),choice('To rest.','c2KitchenRest')]}),
 c2KitchenSeeYou:node('To see you',`You|Yeah. To see you.
Rowan|Oh…
|Rowan blushes.
Rowan|I’m sorry. I should have said something.`,'c2KitchenListen',{...kitchen}),
 c2KitchenRest:node('To rest',`You|Yeah, I want to rest. But I want to know how you’re doing, too.
Rowan|My life’s boring. Hahaha.
You|Ro…`,'c2KitchenListen',{...kitchen}),
 c2KitchenListen:node('Knowing him again',`|He looks at me.`,null,{...kitchen,choices:[choice('Tell him you want to understand.','c2KitchenHonesty')]}),
 c2KitchenHonesty:node('This Rowan',`You|Can you tell me what’s going on? I know we haven’t really caught up properly.
You|But, Ro, I want to know more about you.
You|Not just the Rowan I grew up with.
You|Or the Rowan I used to race downhill.
You|Or the Rowan who always tried to win every competition we had.
You|I want to know the Rowan standing in front of me now.
You|Ro, I want to know you again. So please don’t hide things from me.
|He draws his shoulders in, blushing.
Rowan|And you wonder why I didn’t accept those confessions.
You|Well, I do care about you.
Rowan|{name}…
Rowan|All right. I’ll tell you everything.
Rowan|I met my father on my eighteenth birthday.`,'c2BirthdayDinner',{...kitchen,cgCue:cg('kitchen-honesty','Can you tell me') }),
 c2BirthdayDinner:node('Five years ago — Rowan’s memory',`|It was my eighteenth birthday. I was still in my school uniform.
Mayumi|Anak, are you sure you don’t want to spend your birthday with your friends?
Rowan|We already celebrated at school, Nay. Besides, I want to be with you and Lola.
Mayumi|Aww. Kabait-bait naman ng anak ko.
Lola|Hahaha. Sure ka, Rowan? Hindi mo pagsisisihan?
Rowan|I’m sure, Lola. I’m happy you’re both here with me.
|We keep eating and talking until Mom gets a phone call.
Mayumi|Hold on. I’ll take this.`,'c2BirthdayWish',{...flash,place:'c2-father-dining-background',cgCue:cg('birthday','It was my eighteenth')}),
 c2BirthdayWish:node('Rowan’s memory — a birthday wish',`|As soon as Mom steps out to take the call, Lola slips a thousand pesos into my hand.
Rowan|Lola…
Lola|Shh. Just take it.
Rowan|Thank you po, Lola.
Lola|By the way, Rowan, what do you really want for your birthday?
Rowan|Well, I want to learn more about carpentry.
Lola|Oh, that’s nice. Have you started studying it?
Rowan|Yup. After studying, I go to Manong Nestor to put what I’ve learned into practice.
Lola|Anything else?
Rowan|Well…
Rowan|I really want to see {name} again. It’s been seven years, and I have so many things to say.`,'c2WishPresent',{...flash,place:'c2-father-dining-background'}),
 c2WishPresent:node('Present — a wish fulfilled',`You|You really wished to see me?
Rowan|Yeah. Took a while, but you’re here.
|He smiles.
You|Corny.
Rowan|Let me finish.`,'c2BirthdayGiftSetup',{...kitchen}),
 c2BirthdayGiftSetup:node('Rowan’s memory — a present upstairs',`Lola|That’s a lovely wish. I’m sure you and {name} will see each other again.
Rowan|I really hope so.
|As Lola and I keep talking, Mom returns.
Mayumi|La, can you ask Rowan to go upstairs? Something’s come up.
|Lola understands what Mom is hinting at.
Lola|Rowan, I have a present for you.
Rowan|Another one?
Lola|Yup. It’s in my room upstairs.
Rowan|Okay. I’ll get it.`,'c2CardiganGifts',{...flash,place:'c2-father-dining-background'}),
 c2CardiganGifts:node('Rowan’s memory — two cardigans',`|I rush upstairs to Lola’s room and find them on the bed.
|Two cardigans. One is gray with white dog patterns. The other is brown with white cat patterns.
|I choose the gray one. I think it’ll suit me.
Rowan|Damn. Lola really knitted this well.
Rowan|I wonder who the other one’s for.`,'c2CardiganPresent',{...flash,place:'d2-bedroom-night',cgCue:cg('cardigan-gifts','I rush upstairs')}),
 c2CardiganPresent:node('Present — the other cardigan',`You|There were two?
Rowan|Yeah.
You|Where’s the other one?
Rowan|Secret.
You|Fine. Go on.`,'c2BirthdayStairs',{...kitchen}),
 c2BirthdayStairs:node('Rowan’s memory — downstairs',`Rowan|Well, I know who I’m giving it to. But first, I want to thank Lola for knitting it.
|As I hurry downstairs, I hear Mom and Lola talking to someone.
Mayumi|Ba’t ka nandito?
???|I just want to see my son. Masama ba?
Lola|Utoy, please leave.
Mayumi|You left us for years. Now you’re coming back for some happy family reunion?
???|I want to fix my mistakes.
|I’m almost at the bottom of the stairs.
Rowan|Ma? Sino ’yan?`,'c2FatherReveal',{...flash,place:'c2-father-stair-background'}),
 c2FatherReveal:node('Rowan’s memory — his father',`|Mom and Lola turn toward me.
Mayumi|Rowan…
???|That’s Rowan?
|I see a middle-aged man with black hair and the same blue eyes as mine.
Mayumi|This is your father, Enrich Sanchez.
Rowan|Father?`,'c2FatherPresent',{...flash,place:'c2-father-stair-background',cgCue:cg('father-reveal','Mom and Lola turn')}),
 c2FatherPresent:node('Present — I’m listening',`|For a moment, I don’t know what to say.
Thought|So Lola knew.
Thought|There’s so much I missed.
You|You were eighteen?
Rowan|Yeah.
|I glance at the cabinet. The door is still open.
You|I’m listening, Ro.`,null,{...kitchen,ending:true,openingEnd:true}),
 c2GraveGoodbye:node('Before leaving',`|I stay a little longer.
|There’s nothing else I know how to say.
|Before standing, I straighten the flowers one last time.
You|Babalik ako, Lola.
|Rowan waits until I turn toward him.
|I brush the dirt from my hands and walk back toward the path.`,'c2GraveLeave',{place:'c2-painted-grave-late-afternoon',time:'evening',rowan:false,music:'letters'}),
 c2GroceriesAfter:node('On the way home',`|My eyes still sting a little.
|But it feels good to laugh with him.`,'c2Mayumi',{place:'c2-painted-hill-houses-night',rowan:true,music:'back-together'})
 });
 // No inserted rows in existing saved nodes: add interstitials and retain their indices.
 for(const [id,n] of Object.entries(story))if(id!=='c2GraveGoodbye'){
  if(n.next==='c2GraveLeave')n.next='c2GraveGoodbye';
  for(const c of n.choices||[])if(c.next==='c2GraveLeave')c.next='c2GraveGoodbye';
 }
 story.c2GraveGoodbye.lines[4].conditions=[['graveTogether',true]];
 story.c2GraveGoodbye.lines[5].conditions=[['graveTogether',true,true]];
 story.c2Groceries.lines[0]={speaker:'',text:'We’ve walked a little way when a plastic bag brushes against his leg. I look down.'};
 story.c2Groceries.lines[1].text='Wait. Don’t you still have the chicken and tilapia?';
 story.c2Groceries.next='c2GroceriesAfter';
 story.c2Corridor.lines[0].text='The bell rings. I step into the corridor, but their laughter follows me.';
 story.c2Corridor.cgCue.from='The bell rings.';
 const assignment=story.c2Committee;
 assignment.lines[0].text='For a moment, everything goes quiet.';
 assignment.lines[1].text='Then a folder slides across a table. Empty chairs surround me.';
 assignment.cgCue.from='For a moment, everything goes quiet.';
 story.c2NewEnding.ending=false;
 story.c2NewEnding.openingEnd=false;
 story.c2NewEnding.next='c2FatherDinner';
 story.c2NewEnding.cgCue=cg('dinner-interrupted','Ro. Your father called.');
 story.c2NewEnding.cast='family';
 story.c2FatherDinner.lines.splice(2,0,{speaker:'Thought',text:'So his father was the one calling him at the market.',conditions:[['afternoonRoute','market']]});
 const reveal=story.c2FatherDinner.lines.findIndex(l=>l.text==='It all happened after you left.');
 story.c2FatherDinner.lines.splice(reveal,0,{speaker:'Thought',text:'Is that why he reacted so strangely when the mayor appeared on the news?',conditions:[['afternoonRoute','market',true]]});
 story.c2FatherOffer.lines.forEach((l,i)=>{if(i<21)l.conditions=[['workshopVisited',true]];else if(i<25)l.conditions=[['workshopVisited',true,true]];});
 // Authored expressions for new present-day scenes; flashbacks never use adult sprites.
 for(const [id,n] of Object.entries(story))if(/^c2(Father|Kitchen|WishPresent|CardiganPresent|MayumiLeaves)/.test(id)&&!n.viewpoint){
  for(const l of n.lines)l.expression=l.speaker==='Rowan'&&/Secret|Let me finish|wish|here\./.test(l.text)?'smile':id==='c2KitchenHonesty'||id==='c2KitchenSeeYou'?'embarrassed':'concerned';
 }
 for(const [id,n] of Object.entries(story))if(id.startsWith('c2')&&n.cgCue)approvedChapterTwoCues[id]=n.cgCue;
}
