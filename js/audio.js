// Hands-free reader: Web Speech speechSynthesis + Wake Lock + Media Session.
import { speechParts } from './quiz.js';
const K='cdt.audio.v1', ss=globalThis.speechSynthesis;
export const supported=!!ss;
export const settings=Object.assign({pause:5,rate:1,voice:''},JSON.parse(localStorage.getItem(K)||'{}'));
export const saveSettings=()=>localStorage.setItem(K,JSON.stringify(settings));
// Prefer en-US enhanced/premium voices, then en-US, then other English.
export function voices(){
  const score=v=>(/en[-_]US/i.test(v.lang)?4:/^en/i.test(v.lang)?1:-9)+(/enhanced|premium|natural|neural/i.test(v.name)?3:0)+(v.localService?0.5:0);
  return (ss?ss.getVoices():[]).filter(v=>score(v)>0).sort((a,b)=>score(b)-score(a));
}
let lock=null;
async function wake(on){try{if(on&&'wakeLock' in navigator&&!lock){lock=await navigator.wakeLock.request('screen');lock.addEventListener('release',()=>lock=null);}if(!on&&lock){await lock.release();lock=null;}}catch(e){lock=null;}}
export function createReader(items,onUpdate){
  const r={items,i:0,phase:'idle',paused:false,running:false,timer:null,token:0};
  const emit=()=>onUpdate&&onUpdate(r);
  const say=(text,tok)=>new Promise(res=>{const u=new SpeechSynthesisUtterance(text);
    const vs=voices(),v=vs.find(x=>x.name===settings.voice)||vs[0]; u.lang=v?v.lang:"en-US"; try{if(v)u.voice=v;}catch(e){}
    u.rate=settings.rate; u.onend=u.onerror=()=>res(tok===r.token); ss.speak(u);});
  const wait=(ms,tok)=>new Promise(res=>{r.timer=setTimeout(()=>res(tok===r.token),ms);});
  async function run(){
    const tok=++r.token;
    while(r.running&&!r.paused&&r.i<r.items.length&&tok===r.token){
      const [q,a]=speechParts(r.items[r.i]);
      if(r.phase!=='answer'){r.phase='question';emit(); if(!await say(q,tok))return;
        r.phase='thinking';emit(); if(!await wait(settings.pause*1000,tok))return;}
      r.phase='answer';emit(); if(!await say(a,tok))return;
      if(!await wait(1500,tok))return; r.i++; r.phase='question';
    }
    if(r.i>=r.items.length){r.running=false;r.phase='done';wake(false);emit();}
  }
  const halt=()=>{r.token++;clearTimeout(r.timer);ss.cancel();};
  r.start=()=>{ss.cancel();r.running=true;r.paused=false;wake(true);media();run();};   // call from a tap (iOS needs a user gesture)
  r.pause=()=>{r.paused=true;halt();if(r.phase==='thinking')r.phase='answer';else if(r.phase==='question')r.phase='question';emit();};
  r.resume=()=>{r.paused=false;wake(true);run();};
  r.toggle=()=>r.paused?r.resume():r.pause();
  r.skip=()=>{halt();r.i++;r.phase='question';if(!r.paused)run();else emit();};
  r.stop=()=>{halt();r.running=false;r.phase='idle';wake(false);emit();};
  function media(){const m=navigator.mediaSession;if(!m)return;try{
    m.metadata=new MediaMetadata({title:'CDT Study — hands-free',artist:'CDT Study'});
    m.setActionHandler('play',()=>r.resume());m.setActionHandler('pause',()=>r.pause());m.setActionHandler('nexttrack',()=>r.skip());}catch(e){}}
  document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible'&&r.running&&!r.paused)wake(true);});
  return r;
}
