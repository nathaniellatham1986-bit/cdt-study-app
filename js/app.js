import { EXAMS } from './exams.js';
import { newState, review, isMature } from './sm2.js';
import * as S from './store.js';
const $=s=>document.querySelector(s), view=$('#view'), bar=$('#bar'), title=$('#title');
let cards=[], P=S.load(), sess=null;
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const st=id=>P.cards[id]||newState();
const btns=list=>{bar.innerHTML='';list.forEach(([t,f,c])=>{const b=document.createElement('button');b.textContent=t;if(c)b.className=c;b.onclick=f;bar.append(b);});};
const cardsOf=(e,d)=>cards.filter(c=>c.exam===e&&(!d||c.domain===d));
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
  title.textContent='CDT Study'; sess=null;
  view.innerHTML=hint()+EXAMS.map(e=>{const l=cardsOf(e.id);return`<button class="item" data-e="${e.id}">
    <div class="row"><b>${esc(e.name)}</b><span class="mut">${due(l).length} due</span></div>
    <div class="mut">${e.domains.length} domains · ${e.questions} Qs · ${e.minutes} min · ${l.length} cards</div>
    <div class="bar"><i style="width:${pct(l)}%"></i></div></button>`}).join('')
    +`<p class="mut">Domains and weights: ${esc('NBC CDT Examination Handbook, rev. 3/1/2026')}. Cards marked SAMPLE are unverified placeholders.</p>`;
  view.querySelectorAll('[data-e]').forEach(b=>b.onclick=()=>exam(b.dataset.e));
  $('#hx')&&($('#hx').onclick=()=>{localStorage.setItem('cdt.hint.off',1);home();});
  btns([['Progress',progress],['Backup',backup]]);
}
function exam(id){
  const e=EXAMS.find(x=>x.id===id); title.textContent=e.name;
  view.innerHTML=`<p class="mut">${esc(e.weightNote||'% of this exam’s questions')} · Source: ${esc(e.src)}</p>`+e.domains.map(d=>{const l=cardsOf(id,d.id);
    return`<button class="item" data-d="${d.id}"><div class="row"><b>${d.id}. ${esc(d.name)}</b><span>${d.lo}–${d.hi}%</span></div>
    <div class="mut">${l.length} cards · ${due(l).length} due${d.note?' · '+esc(d.note):''}</div><div class="bar"><i style="width:${pct(l)}%"></i></div></button>`}).join('');
  view.querySelectorAll('[data-d]').forEach(b=>b.onclick=()=>study(id,b.dataset.d));
  btns([['‹ Home',home],['Study all due',()=>study(id),'pri']]);
}
function study(eid,did){
  const q=due(cardsOf(eid,did)); sess={eid,did,q,i:0,flip:false}; show();
}
function show(){
  const s=sess, c=s.q[s.i];
  if(!c){view.innerHTML=`<div class="flash">Nothing due here right now. 🎉<p class="mut">Come back later, or pick another domain.</p></div>`;return btns([['‹ Back',()=>exam(s.eid),'pri']]);}
  title.textContent=`${s.i+1}/${s.q.length} · ${c.exam} ${c.domain}`;
  view.innerHTML=`<div class="flash">${c.sample?'<span class="badge">SAMPLE</span>':''}${c.verified?'':'<span class="badge">UNVERIFIED</span>'}
   <p>${esc(c.front)}</p>${s.flip?`<hr><p>${esc(c.back)}</p><p class="mut">Source: ${esc(c.source.ref)} — ${esc(c.source.loc)}</p>`:''}</div>`;
  if(!s.flip) return btns([['‹',()=>exam(s.eid)],['Show answer',()=>{s.flip=true;show();},'pri']]);
  btns(['Again','Hard','Good','Easy'].map((t,g)=>[t,()=>{P.cards[c.id]=review(st(c.id),g);S.save(P);if(g===0)s.q.push(c);s.i++;s.flip=false;show();},'g'+g]));
}
function progress(){
  title.textContent='Progress';
  view.innerHTML=EXAMS.map(e=>`<div class="item"><b>${esc(e.name)}</b>${e.domains.map(d=>{const l=cardsOf(e.id,d.id),r=l.filter(c=>P.cards[c.id]).length;
    return`<div class="row mut" style="margin-top:6px"><span>${d.id}. ${esc(d.name)} (${d.lo}–${d.hi}%)</span><span>${r}/${l.length}</span></div><div class="bar"><i style="width:${pct(l)}%"></i></div>`}).join('')}</div>`).join('');
  btns([['‹ Home',home,'pri']]);
}
function backup(){
  title.textContent='Backup';
  view.innerHTML=`<div class="item">Save your progress to a file, or restore it on another phone.<p class="mut">${Object.keys(P.cards).length} cards reviewed.</p>
   <input type="file" id="f" accept="application/json,.json" hidden><p id="msg"></p></div>`;
  $('#f').onchange=async ev=>{try{P=S.importJSON(await ev.target.files[0].text());S.save(P);$('#msg').textContent='Progress restored ✔';}catch(x){$('#msg').textContent='Import failed: '+x.message;}};
  btns([['‹',home],['Import',()=>$('#f').click()],['Export',()=>{const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([S.exportJSON(P)],{type:'application/json'}));a.download=`cdt-progress-${new Date().toISOString().slice(0,10)}.json`;a.click();},'pri']]);
}
(async()=>{
  try{cards=await (await fetch('content/samples.json')).json();}catch{cards=[];}
  home();
  if('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').then(r=>window.__sw=r.scope).catch(e=>console.warn(e));
})();
