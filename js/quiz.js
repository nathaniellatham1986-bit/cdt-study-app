// Pure quiz helpers (no DOM) — tested in tests/quiz.test.mjs
export const shuffle=(a,rnd=Math.random)=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(rnd()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};
// Sample a mock exam: each domain gets round(midpoint% × total) questions, capped at what exists.
export function sampleMock(items,domains,total,rnd=Math.random){
  const plan=domains.map(d=>{const pool=items.filter(i=>i.domain===d.id),want=Math.round((d.lo+d.hi)/2/100*total);
    return{d:d.id,want,have:pool.length,pick:shuffle(pool,rnd).slice(0,want)};});
  return{q:shuffle(plan.flatMap(p=>p.pick),rnd),plan,want:plan.reduce((s,p)=>s+p.want,0)};
}
// Record an answer into P.quiz[exam][domain] = {n, ok}
export function record(P,item,correct){
  P.quiz||(P.quiz={}); const e=P.quiz[item.exam]||(P.quiz[item.exam]={}), d=e[item.domain]||(e[item.domain]={n:0,ok:0});
  d.n++; if(correct)d.ok++; return d;
}
export const acc=s=>s&&s.n?Math.round(100*s.ok/s.n):null;
// Proportional time for a short mock: exam minutes × (asked / official question count)
export const mockMinutes=(exam,n)=>Math.max(1,Math.round(exam.minutes*n/exam.questions));
// Text the audio reader speaks for an item: [prompt, answer]
export function speechParts(c){
  if(c.type==='mcq') return [`${c.stem} ${c.options.map((o,i)=>`${'ABCD'[i]}: ${o}.`).join(' ')}`, `The answer is ${'ABCD'[c.answer]}: ${c.options[c.answer]}.`];
  return [c.front, c.back];
}
