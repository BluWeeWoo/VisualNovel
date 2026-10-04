import test from 'node:test';
import assert from 'node:assert/strict';
import {playSummerTransition,transitionActive,transitionCopy} from '../assets/summer-transitions.js';
test('Reduced motion proceeds once and blocks duplicate starts until the handoff completes',async()=>{
 let finish,calls=0;
 const pending=playSummerTransition({motion:false,reveal:()=>{calls++;return new Promise(resolve=>finish=resolve);}});
 assert.equal(transitionActive(),true);
 assert.equal(await playSummerTransition({motion:false,reveal:()=>calls++}),false);
 finish();assert.equal(await pending,true);assert.equal(calls,1);assert.equal(transitionActive(),false);
});
test('A failed handoff releases the transition lock',async()=>{
 await assert.rejects(playSummerTransition({motion:false,reveal:()=>{throw Error('test');}}));assert.equal(transitionActive(),false);
});
test('Chapter Two opening is not presented as a completed chapter',()=>{
 assert.match(transitionCopy('chapter',{chapter:2,partial:true}).eyebrow,/TO BE CONTINUED/);
 assert.match(transitionCopy('chapter',{chapter:1}).eyebrow,/COMPLETE/);
 assert.equal(transitionCopy('new',{language:'taglish'}).title,'Balik ka na.');
});
