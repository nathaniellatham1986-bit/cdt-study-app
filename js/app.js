import { EXAMS } from './exams.js';
import { newState, review, isMature } from './sm2.js';
import * as S from './store.js';
import { sampleMock, record, acc, mockMinutes, shuffle } from './quiz.js';
import * as A from './audio.js';
const $=s=>document.querySelector(s), view=$('#view'), bar=$('#bar'), title=$('#title');
const CONTENT=['content/digital-workflow.json','content/implants.json','content/comprehensive.json','content/comprehensive-mcq.json','content/ceramics.json','content/complete-dentures.json','content/crown-bridge.json','content/orthodontics.json','content/partial-dentures.json'];
let cards=[], mcq=[], P=S.load(), sess=null, reader=null, tick=null;
P.quiz||(P.quiz={});
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const st=id=>P.cards[id]||newState();
const btns=list=>{bar.innerHTML='';list.forEach(([t,f,c])=>{const b=document.createElement('button');b.textContent=t;if(c)b.className=c;b.onclick=f;bar.append(b);});};
const by=(list,e,d)=>list.filter(c=>(!e||c.exam===e)&&(!d||c.domain===d));
const mcqOf=(e,d)=>by(mcq,e,d);
const cardsOf=(e,d)=>cards.filter(c=>(!e||c.exam===e)&&(!d||c.domain===d));
const due=list=>list.filter(c=>st(c.id).due<=Date.now());
const pct=list=>list.length?Math.round(100*list.filter(c=>isMature(P.cards[c.id])||(P.cards[c.id]?.reps>=2)).length/list.length):0;

function hint(){
  if(matchMedia('(display-mode: standalone)').matches||navigator.standalone||localStorage.getItem('cdt.hint.off'))return'';
  const ios=/iphone|ipad|ipod/i.test(navigator.userAgent);
  return `<div class="hint" id="hint"><button aria-label="Dismiss" id="hx">✕</button><b>Install on your phone:</b> ${ios
    ?'In Safari, tap the Share button <b>⬆︎</b>, then <b>Add to Home Screen</b>.'
    :'In Chrome, tap the menu <b>⋮</b>, then <b>Add to Home screen</b> / <b>Install app</b>.'} It then works offline.</div>`;
}
function home(){
  stopAll(); title.textContent='CDT Study'; sess=null;
  const all=due(cards);
  view.innerHTML=hint()+`<button class="item now" id="now"><b>▶ Study now</b><div class="mut">${all.length} cards due across all exams</div></button>`+EXAMS.map(e=>{const l=cardsOf(e.id);return`<button class="item" data-e="${e.id}">
    <div class="row"><b>${esc(e.name)}</b><span class="mut">${due(l).length} due</span></div>
    <div class="mut">${e.domains.length} domains · ${e.questions} Qs · ${e.minutes} min · ${l.length} cards · ${mcqOf(e.id).length} quiz Qs</div>
    <div class="bar"><i style="width:${pct(l)}%"></i></div></button>`}).join('')
    +`<p class="mut">Domains and weights: ${esc('NBC CDT Examination Handbook, rev. 3/1/2026')}. Cards are UNVERIFIED study aids paraphrased from the cited source — check the source.</p>`;
  $('#now').onclick=()=>study(null);
  view.querySelectorAll('[data-e]').forEach(b=>b.onclick=()=>exam(b.dataset.e));
  $('#hx')&&($('#hx').onclick=()=>{localStorage.setItem('cdt.hint.off',1);home();});
  btns([['Progress',progress],['Backup',backup]]);
}
function exam(id){
  const e=EXAMS.find(x=>x.id===id); title.textContent=e.name;
  view.innerHTML=`<p class="mut">${esc(e.weightNote||'% of this exam’s questions')} · Source: ${esc(e.src)}</p>`+e.domains.map(d=>{const l=cardsOf(id,d.id);
    return`<button class="item" data-d="${d.id}"><div class="row"><b>${d.id}. ${esc(d.name)}</b><span>${d.lo}–${d.hi}%</span></div>
    <div class="mut">${l.length} cards · ${due(l).length} due · ${mcqOf(id,d.id).length} quiz Qs${d.note?' · '+esc(d.note):''}</div><div class="bar"><i style="width:${pct(l)}%"></i></div></button>`}).join('')
    +`<div class="tools"><button class="item" id="qz"><b>✔ Quiz</b><div class="mut">${mcqOf(id).length} multiple-choice</div></button>
      <button class="item" id="mk"><b>⏱ Mock exam</b><div class="mut">timed, by domain weight</div></button>
      <button class="item" id="au"><b>🔊 Listen</b><div class="mut">hands-free audio</div></button></div>`;
  view.querySelectorAll('[data-d]').forEach(b=>b.onclick=()=>study(id,b.dataset.d));
  $('#qz').onclick=()=>quiz(id); $('#mk').onclick=()=>mockIntro(id); $('#au').onclick=()=>audio(id);
  btns([['‹ Home',home],['Study all due',()=>study(id),'pri']]);
}
function study(eid,did){
  const q=due(cardsOf(eid,did)).map(c=>[Math.random(),c]).sort((a,b)=>a[0]-b[0]).map(x=>x[1]).slice(0,30); sess={eid,did,q,i:0,flip:false}; show();
}
const back=()=>{stopAll();sess&&sess.eid?exam(sess.eid):home();};
const stopAll=()=>{clearInterval(tick);tick=null;reader&&reader.stop();reader=null;};
function show(){
  const s=sess, c=s.q[s.i];
  if(!c){view.innerHTML=`<div class="flash">Nothing due here right now. 🎉<p class="mut">Come back later, or pick another domain.</p></div>`;return btns([['‹ Back',back,'pri']]);}
  title.textContent=`${s.i+1}/${s.q.length} · ${(EXAMS.find(x=>x.id===c.exam)||{}).name||c.exam} ${c.domain}`;
  view.innerHTML=`<div class="flash">${c.sample?'<span class="badge">SAMPLE</span>':''}${c.verified?'':'<span class="badge">UNVERIFIED</span>'}
   <p>${esc(c.front)}</p>${s.flip?`<hr><p>${esc(c.back)}</p><p class="mut">Source: ${esc(c.source.ref)}${c.source.loc?' — '+esc(c.source.loc):''}${c.source.url?` · <a href="${esc(c.source.url)}" target="_blank" rel="noopener">link</a>`:''}</p>`:''}</div>`;
  if(!s.flip) return btns([['‹',back],['Show answer',()=>{s.flip=true;show();},'pri']]);
  btns(['Again','Hard','Good','Easy'].map((t,g)=>[t,()=>{P.cards[c.id]=review(st(c.id),g);S.save(P);if(g===0)s.q.push(c);s.i++;s.flip=false;show();},'g'+g]));
}
function qacc(e,d){const q=(P.quiz[e]||{})[d],a=acc(q);return mcqOf(e,d).length?`<div class="row mut"><span>Quiz accuracy</span><span>${a===null?'—':`${a}% (${q.ok}/${q.n})`}</span></div>`:''}
function progress(){
  title.textContent='Progress';
  view.innerHTML=EXAMS.map(e=>`<div class="item"><b>${esc(e.name)}</b>${e.domains.map(d=>{const l=cardsOf(e.id,d.id),r=l.filter(c=>P.cards[c.id]).length;
    return`<div class="row mut" style="margin-top:6px"><span>${d.id}. ${esc(d.name)} (${d.lo}–${d.hi}%)</span><span>${r}/${l.length} cards</span></div><div class="bar"><i style="width:${pct(l)}%"></i></div>${qacc(e.id,d.id)}`}).join('')}</div>`).join('');
  btns([['‹ Home',home,'pri']]);
}
function backup(){
  title.textContent='Backup';
  view.innerHTML=`<div class="item">Save your progress to a file, or restore it on another phone.<p class="mut">${Object.keys(P.cards).length} cards reviewed.</p>
   <input type="file" id="f" accept="application/json,.json" hidden><p id="msg"></p></div>`;
  $('#f').onchange=async ev=>{try{P=S.importJSON(await ev.target.files[0].text());S.save(P);$('#msg').textContent='Progress restored ✔';}catch(x){$('#msg').textContent='Import failed: '+x.message;}};
  btns([['‹',home],['Import',()=>$('#f').click()],['Export',()=>{const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([S.exportJSON(P)],{type:'application/json'}));a.download=`cdt-progress-${new Date().toISOString().slice(0,10)}.json`;a.click();},'pri']]);
}
// ---------- Quiz & mock exam ----------
function quiz(eid,did){const q=shuffle(mcqOf(eid,did)).slice(0,20);sess={eid,did,q,i:0,mode:'quiz',right:0,pick:null};qshow();}
function mockIntro(eid){
  const e=EXAMS.find(x=>x.id===eid), m=sampleMock(mcqOf(eid),e.domains,e.questions), mins=mockMinutes(e,m.q.length);
  title.textContent='Mock exam'; sess={eid};
  view.innerHTML=`<div class="item"><b>${esc(e.name)} mock exam</b>
   <p>The real exam is <b>${e.questions} questions in ${Math.floor(e.minutes/60)}h${String(e.minutes%60).padStart(2,'0')}</b>. This app has <b>${m.q.length}</b> sourced questions for it right now, so this mock has ${m.q.length} questions with a proportional <b>${mins} min</b> timer.</p>
   <table class="plan"><tr><th>Domain</th><th>Exam target</th><th>Available</th></tr>${m.plan.map(p=>`<tr><td>${p.d}</td><td>${p.want}</td><td>${Math.min(p.have,p.want)}</td></tr>`).join('')}</table>
   <p class="mut">No feedback until the end, like the real test. Questions are UNVERIFIED study aids.</p></div>`;
  btns([['‹',back],['Start',()=>{sess={eid,q:m.q,i:0,mode:'mock',right:0,pick:null,ans:[],end:Date.now()+mins*60000,mins};tick=setInterval(timer,1000);qshow();},'pri']]);
}
function timer(){const s=sess;if(!s||s.mode!=='mock')return;const left=Math.max(0,s.end-Date.now()),t=$('#clock');
  if(t)t.textContent=`${Math.floor(left/60000)}:${String(Math.floor(left/1000)%60).padStart(2,'0')}`; if(!left)mockDone();}
function qshow(){
  const s=sess,c=s.q[s.i];
  if(!c) return s.mode==='mock'?mockDone():qdone();
  title.innerHTML=`${s.mode==='mock'?'Mock':'Quiz'} ${s.i+1}/${s.q.length} · ${esc(c.domain)}${s.mode==='mock'?' · <span id="clock"></span>':''}`; timer();
  const fb=s.mode==='quiz'&&s.pick!==null;
  view.innerHTML=`<div class="q"><span class="badge">UNVERIFIED</span><p class="stem">${esc(c.stem)}</p>
   ${c.options.map((o,i)=>`<button class="opt ${fb?(i===c.answer?'ok':i===s.pick?'bad':'dim'):''}" data-i="${i}" ${fb?'disabled':''}><b>${'ABCD'[i]}</b> ${esc(o)}</button>`).join('')}
   ${fb?`<div class="fb ${s.pick===c.answer?'ok':'bad'}"><b>${s.pick===c.answer?'✔ Correct':'✘ Not quite'}</b> — ${esc(c.explanation)}
     <p class="mut">Source: ${esc(c.source.ref)}${c.source.loc?' — '+esc(c.source.loc):''} · <a href="${esc(c.source.url)}" target="_blank" rel="noopener">link</a></p></div>`:''}</div>`;
  view.querySelectorAll('.opt:not([disabled])').forEach(b=>b.onclick=()=>{const i=+b.dataset.i,ok=i===c.answer;
    record(P,c,ok);S.save(P); if(ok)s.right++;
    if(s.mode==='mock'){s.ans.push({c,i});s.i++;qshow();} else {s.pick=i;qshow();}});
  if(fb) btns([['‹ End',back],['Next ›',()=>{s.i++;s.pick=null;qshow();},'pri']]);
  else btns([['‹ End',s.mode==='mock'?()=>{if(confirm('End the mock exam now?'))mockDone();}:back]]);
}
function qdone(){const s=sess;title.textContent='Quiz done';
  view.innerHTML=`<div class="flash">Score: <b>${s.right}/${s.q.length}</b><p class="mut">Accuracy per domain is on the Progress screen.</p></div>`;
  btns([['‹ Back',back],['Again',()=>quiz(s.eid,s.did),'pri']]);}
function mockDone(){const s=sess;clearInterval(tick);tick=null;if(s.done)return;s.done=true;const e=EXAMS.find(x=>x.id===s.eid);
  title.textContent='Mock result';const per={};for(const {c,i} of s.ans){const p=per[c.domain]||(per[c.domain]={n:0,ok:0});p.n++;if(i===c.answer)p.ok++;}
  view.innerHTML=`<div class="item"><b>${s.right}/${s.q.length} correct</b> (${s.ans.length} answered)
   ${e.domains.map(d=>per[d.id]?`<div class="row mut"><span>${d.id}. ${esc(d.name)}</span><span>${per[d.id].ok}/${per[d.id].n}</span></div>`:'').join('')}
   <p class="mut">This is practice only — it is not the NBC scoring scale.</p></div>`+
   s.ans.filter(({c,i})=>i!==c.answer).map(({c,i})=>`<div class="item"><b>${esc(c.stem)}</b><div class="mut">You: ${esc(c.options[i])}</div><div>✔ ${esc(c.options[c.answer])}</div><div class="mut">${esc(c.source.ref)} ${esc(c.source.loc||'')}</div></div>`).join('');
  btns([['‹ Back',back,'pri']]);}
// ---------- Hands-free audio ----------
function audio(eid){
  title.textContent='Listen'; sess={eid}; stopAll();
  const e=EXAMS.find(x=>x.id===eid), set=A.settings;
  if(!A.supported){view.innerHTML='<div class="item">This browser has no speech support.</div>';return btns([['‹',back,'pri']]);}
  const opts=()=>A.voices().map(v=>`<option ${v.name===set.voice?'selected':''}>${esc(v.name)}</option>`).join('');
  view.innerHTML=`<div class="item"><b>${esc(e.name)} — hands-free</b>
   <p class="mut">Reads a question, waits, reads the answer, then moves on. Quiz questions are read with their four options.</p>
   <label>What to read<select id="src"><option value="flash">Flashcards (${cardsOf(eid).length})</option><option value="mcq">Quiz questions (${mcqOf(eid).length})</option><option value="both">Both, mixed</option></select></label>
   <label>Domain<select id="dom"><option value="">All domains</option>${e.domains.map(d=>`<option value="${d.id}">${d.id}. ${esc(d.name)}</option>`).join('')}</select></label>
   <label>Pause before answer: <b id="pv">${set.pause}</b> s<input type="range" id="pause" min="2" max="20" value="${set.pause}"></label>
   <label>Speed: <b id="rv">${set.rate}</b>×<input type="range" id="rate" min="0.6" max="1.6" step="0.1" value="${set.rate}"></label>
   <label>Voice<select id="voice">${opts()}</select></label>
   <p class="note">📱 On iPhone, keep the app open and the screen on — iOS usually stops speech when the screen locks or you switch apps. The app asks the screen to stay awake where supported. For better voices: Settings › Accessibility › Spoken Content › Voices › English › download an “Enhanced” or “Premium” voice.</p></div>`;
  speechSynthesis.onvoiceschanged=()=>{const v=$('#voice');if(v)v.innerHTML=opts();};
  $('#pause').oninput=ev=>{set.pause=+ev.target.value;$('#pv').textContent=set.pause;A.saveSettings();};
  $('#rate').oninput=ev=>{set.rate=+ev.target.value;$('#rv').textContent=set.rate;A.saveSettings();};
  $('#voice').onchange=ev=>{set.voice=ev.target.value;A.saveSettings();};
  btns([['‹',back],['▶ Start',()=>{const src=$('#src').value,dom=$('#dom').value||null;
    const items=shuffle([...(src!=='mcq'?cardsOf(eid,dom):[]),...(src!=='flash'?mcqOf(eid,dom):[])]);
    if(!set.voice&&A.voices()[0]){set.voice=A.voices()[0].name;}
    reader=A.createReader(items,playing); reader.start();},'pri']]);
}
function playing(r){
  if(r!==reader)return; const c=r.items[r.i];
  title.textContent=`Listening ${Math.min(r.i+1,r.items.length)}/${r.items.length}`;
  if(r.phase==='done'||!c){view.innerHTML='<div class="flash">All done. 🎧</div>';return btns([['‹ Back',back,'pri']]);}
  const q=c.type==='mcq'?`${esc(c.stem)}<ol type="A">${c.options.map(o=>`<li>${esc(o)}</li>`).join('')}</ol>`:esc(c.front);
  const a=c.type==='mcq'?`${'ABCD'[c.answer]}: ${esc(c.options[c.answer])}`:esc(c.back);
  view.innerHTML=`<div class="flash audio"><div class="phase">${r.paused?'⏸ Paused':{question:'🔊 Question',thinking:'⏳ Think…',answer:'🔊 Answer'}[r.phase]||''}</div>
   <p>${q}</p>${r.phase==='answer'?`<hr><p>${a}</p>`:''}<p class="mut">${esc(c.source.ref)} ${esc(c.source.loc||'')} · UNVERIFIED</p></div>`;
  btns([['■ Stop',()=>{stopAll();audio(r.items[0]?.exam||sess.eid);}],[r.paused?'▶ Resume':'⏸ Pause',()=>r.toggle(),'pri'],['Skip ›',()=>r.skip()]]);
}
(async()=>{
  for(const f of CONTENT){try{for(const c of await (await fetch(f)).json())(c.type==='mcq'?mcq:cards).push(c);}catch(x){console.warn(f,x);}}
  home();
  if('serviceWorker' in navigator) (navigator.serviceWorker.controller&&navigator.serviceWorker.addEventListener('controllerchange',()=>location.reload(),{once:true}),navigator.serviceWorker.register('sw.js',{updateViaCache:'none'})).then(r=>window.__sw=r.scope).catch(e=>console.warn(e));
})();
