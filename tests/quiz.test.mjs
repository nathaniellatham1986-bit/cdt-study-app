import assert from 'node:assert/strict'; import test from 'node:test'; import fs from 'node:fs';
import { sampleMock, record, acc, mockMinutes, speechParts } from '../js/quiz.js';
import { EXAMS } from '../js/exams.js';
const load=f=>JSON.parse(fs.readFileSync(new URL('../content/'+f,import.meta.url)));
const all=[...load('implants.json'),...load('comprehensive.json'),...load('comprehensive-mcq.json'),...load('ceramics.json'),...load('complete-dentures.json'),...load('partial-dentures.json')];
test('every item well-formed, cited, unverified, domain exists',()=>{const ids=new Set();for(const c of all){
  assert.ok(!ids.has(c.id),c.id);ids.add(c.id);assert.equal(c.verified,false);assert.ok(c.source?.ref&&c.source?.url,c.id);
  const e=EXAMS.find(x=>x.id===c.exam);assert.ok(e&&e.domains.some(d=>d.id===c.domain),c.id);
  if(c.type==='mcq'){assert.equal(c.options.length,4);assert.ok(c.answer>=0&&c.answer<4);assert.equal(new Set(c.options).size,4,c.id);assert.ok(c.explanation);}
  else{assert.equal(c.type,'flash');assert.ok(c.front&&c.back);}}});
test('mock exam respects domain weights and caps at availability',()=>{const e=EXAMS.find(x=>x.id==='ceramics');
  const items=all.filter(c=>c.exam==='ceramics'&&c.type==='mcq');const m=sampleMock(items,e.domains,e.questions,()=>0.3);
  for(const p of m.plan){assert.equal(p.pick.length,Math.min(p.want,p.have));}assert.equal(m.want,80);assert.equal(m.q.length,m.plan.reduce((s,p)=>s+p.pick.length,0));
  assert.equal(new Set(m.q.map(x=>x.id)).size,m.q.length);});
test('record/acc',()=>{const P={};record(P,{exam:'x',domain:'A'},true);record(P,{exam:'x',domain:'A'},false);assert.deepEqual(P.quiz.x.A,{n:2,ok:1});assert.equal(acc(P.quiz.x.A),50);assert.equal(acc(undefined),null);});
test('mockMinutes proportional',()=>assert.equal(mockMinutes({minutes:90,questions:80},40),45));
test('speechParts mcq',()=>{const [q,a]=speechParts({type:'mcq',stem:'S?',options:['w','x','y','z'],answer:2});assert.match(q,/B: x/);assert.equal(a,'The answer is C: y.');});
