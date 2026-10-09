// Presentation only: use visible line anchors so saved indices and branches stay intact.
import {lineVisible} from './line-visibility.js';
export function graveArt(base,state){
 const flower=state.flags.c2Flowers;
 return base+(['lilies','roses','orchids'].includes(flower)?'-'+flower:'');
}
export function reviewedCG(story,state){
 const lines=story[state.node].lines.filter(l=>lineVisible(l,state.flags));
 const between=(from,until)=>{const a=lines.findIndex(l=>l.text.includes(from)),b=until?lines.findIndex(l=>l.text.includes(until)):lines.length;return a>=0&&state.line>=a&&state.line<(b<0?lines.length:b);};
 if(state.node==='c2Workshop')return between('Without missing a beat','So, did Rowan')?'c2-review-nestor':null;
 if(state.node==='c2GraveTogether')return between('Then I crouch')?'c2-review-'+graveArt(state.flags.graveTogether===true?'grave-together':'grave-alone',state):null;
 if(state.node==='c2Grave')return state.flags.graveTogether===true&&state.flags.c2GraveStay===true&&between('I feel an arm','I adjust the flowers.')?'c2-review-'+graveArt('grave-comfort',state):null;
 if(state.node==='c2Mayumi')return between('As I head home,',state.flags.graveTogether===true?'She turns.':'There’s a short pause.')?'c2-review-mayumi':null;
}
