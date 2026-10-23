// Hands-free reader: pre-recorded natural clips (audio/<exam>/, Piper en_US-lessac-high) played through
// one reused <audio> element; falls back to Web Speech speechSynthesis when a clip is missing or fails.
import { speechParts } from './quiz.js';
const K='cdt.audio.v1', ss=globalThis.speechSynthesis, AC='cdt-audio';
export const supported=true;
export const settings=Object.assign({pause:5,rate:1,voice:'',natural:true},JSON.parse(localStorage.getItem(K)||'{}'));
export const saveSettings=()=>localStorage.setItem(K,JSON.stringify(settings));
export function voices(){
  const score=v=>(/en[-_]US/i.test(v.lang)?4:/^en/i.test(v.lang)?1:-9)+(/enhanced|premium|natural|neural/i.test(v.name)?3:0)+(v.localService?0.5:0);
  return (ss?ss.getVoices():[]).filter(v=>score(v)>0).sort((a,b)=>score(b)-score(a));
}
// ---- clip index: audio/<exam>/index.json = {id:[questionFile, answerFile]}
const IDX={};
export function loadIndex(exam){
  return IDX[exam]||(IDX[exam]=fetch(`audio/${exam}/index.json`).then(r=>r.ok?r.json():{}).catch(()=>({})).then(m=>(IDX[exam]=m)));
}
const ready=exam=>{const v=IDX[exam];return v&&!(v instanceof Promise)?v:null;};
export function clipUrl(item,part){const m=ready(item.exam),f=m&&m[item.id];return f?`audio/${item.exam}/${f[part==='q'?0:1]}`:null;}
export async function examClips(exam){const m=await loadIndex(exam);return Object.values(m).flat().map(f=>`audio/${exam}/${f}`);}
// ---- offline download (stored in a cache the service worker reads from; survives app updates)
export async function offlineCount(exam){if(!('caches' in self))return 0;const c=await caches.open(AC),k=new Set((await c.keys()).map(r=>new URL(r.url).pathname.split('/').pop()));
  return (await examClips(exam)).filter(u=>k.has(u.split('/').pop())).length;}
export async function download(exam,onProgress,signal){
  const urls=await examClips(exam),c=await caches.open(AC);let done=0,fail=0;const q=[...urls];
  async function worker(){while(q.length&&!signal?.aborted){const u=q.shift();
    try{if(!(await c.match(u))){const r=await fetch(u);if(!r.ok)throw 0;await c.put(u,r);}}catch(e){fail++;}
    onProgress&&onProgress(++done,urls.length,fail);}}
  await Promise.all(Array.from({length:6},worker));return {done,total:urls.length,fail};
}
export async function removeOffline(exam){const c=await caches.open(AC);for(const u of await examClips(exam))await c.delete(u);}
// ---- one shared <audio> element (iOS: first play() must come from a tap)
let el=null;
export function player(){if(!el){el=new Audio();el.preload='auto';el.setAttribute('playsinline','');el.id='cdt-player';}return el;}
let lock=null;
async function wake(on){try{if(on&&'wakeLock' in navigator&&!lock){lock=await navigator.wakeLock.request('screen');lock.addEventListener('release',()=>lock=null);}if(!on&&lock){await lock.release();lock=null;}}catch(e){lock=null;}}
export function createReader(items,onUpdate){
  const r={items,i:0,phase:'idle',paused:false,running:false,timer:null,token:0,source:''};
  const emit=()=>onUpdate&&onUpdate(r);
  const tts=(text,tok)=>new Promise(res=>{if(!ss)return res(tok===r.token);const u=new SpeechSynthesisUtterance(text);
    const vs=voices(),v=vs.find(x=>x.name===settings.voice)||vs[0]; u.lang=v?v.lang:"en-US"; try{if(v)u.voice=v;}catch(e){}
    u.rate=settings.rate; u.onend=u.onerror=()=>res(tok===r.token); r.source='device'; ss.speak(u);});
  const clip=(url,tok)=>new Promise(res=>{const a=player();let fin=false;
    const end=ok=>{if(fin)return;fin=true;a.onended=a.onerror=null;res(ok);};
    a.onended=()=>end(true); a.onerror=()=>end(false);
    a.src=url; a.playbackRate=a.defaultPlaybackRate=settings.rate; try{a.preservesPitch=true;}catch(e){}
    r.source='natural'; const p=a.play(); if(p&&p.catch)p.catch(()=>end(false));
    r.cancelClip=()=>{a.pause();fin=true;a.onended=a.onerror=null;res(false);};});
  async function say(item,part,text,tok){
    const url=settings.natural&&clipUrl(item,part);
    if(url){const ok=await clip(url,tok);if(tok!==r.token)return false;if(ok)return true;}
    return tts(text,tok);
  }
  const wait=(ms,tok)=>new Promise(res=>{r.timer=setTimeout(()=>res(tok===r.token),ms);});
  async function run(){
    const tok=++r.token;
    while(r.running&&!r.paused&&r.i<r.items.length&&tok===r.token){
      const c=r.items[r.i],[q,a]=speechParts(c);
      if(r.phase!=='answer'){r.phase='question';emit(); if(!await say(c,'q',q,tok))return;
        r.phase='thinking';emit(); if(!await wait(settings.pause*1000,tok))return;}
      r.phase='answer';emit(); if(!await say(c,'a',a,tok))return;
      if(!await wait(1500,tok))return; r.i++; r.phase='question';
      const n=r.items[r.i],u=n&&settings.natural&&clipUrl(n,'q'); if(u){const l=new Audio();l.preload='auto';l.src=u;} // warm next clip
    }
    if(r.i>=r.items.length){r.running=false;r.phase='done';wake(false);emit();}
  }
  const halt=()=>{r.token++;clearTimeout(r.timer);r.cancelClip&&r.cancelClip();r.cancelClip=null;if(ss)ss.cancel();};
  r.start=()=>{halt();r.running=true;r.paused=false;wake(true);media();run();};   // call from a tap (iOS needs a user gesture)
  r.pause=()=>{r.paused=true;halt();if(r.phase==='thinking')r.phase='answer';emit();};
  r.resume=()=>{r.paused=false;wake(true);run();};
  r.toggle=()=>r.paused?r.resume():r.pause();
  r.skip=()=>{halt();r.i++;r.phase='question';if(!r.paused)run();else emit();};
  r.stop=()=>{halt();r.running=false;r.phase='idle';wake(false);emit();};
  r.setRate=v=>{settings.rate=v;if(el)el.playbackRate=v;};
  function media(){const m=navigator.mediaSession;if(!m)return;try{
    m.metadata=new MediaMetadata({title:'CDT Study — hands-free',artist:'CDT Study'});
    m.setActionHandler('play',()=>r.resume());m.setActionHandler('pause',()=>r.pause());m.setActionHandler('nexttrack',()=>r.skip());}catch(e){}}
  document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible'&&r.running&&!r.paused)wake(true);});
  return r;
}
