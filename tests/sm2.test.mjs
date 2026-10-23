import { newState, review, DAY } from '../js/sm2.js';
import assert from 'node:assert/strict'; import test from 'node:test';
const t0=1e12;
test('Good progression 1,6,~15 days',()=>{let s=review(newState(),2,t0);assert.equal(s.interval,1);s=review(s,2,t0);assert.equal(s.interval,6);s=review(s,2,t0);assert.equal(s.interval,15);assert.equal(s.due,t0+15*DAY);});
test('Again resets reps, counts lapse, due in 10 min, EF drops',()=>{let s=review(review(newState(),2,t0),0,t0);assert.equal(s.reps,0);assert.equal(s.lapses,1);assert.equal(s.due,t0+600000);assert.ok(s.ef<2.5);});
test('EF floor 1.3',()=>{let s=newState();for(let i=0;i<20;i++)s=review(s,0,t0);assert.equal(s.ef,1.3);});
test('Easy beats Good; Hard shorter than Good',()=>{const b=review(review(newState(),2,t0),2,t0);assert.ok(review(b,3,t0).interval>review(b,2,t0).interval);assert.ok(review(b,1,t0).interval<review(b,2,t0).interval);});
test('rejects bad grade',()=>assert.throws(()=>review(newState(),7)));
