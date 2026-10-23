const V='cdt-v12', AC='cdt-audio';
const ASSETS=['./','index.html','css/app.css','js/app.js','js/exams.js','js/sm2.js','js/store.js','js/quiz.js','js/audio.js','content/comprehensive.json','content/comprehensive-mcq.json','content/ceramics.json','content/complete-dentures.json','content/crown-bridge.json','content/orthodontics.json','content/partial-dentures.json','content/implants.json','content/digital-workflow.json','content/comprehensive-mcq2.json','content/ceramics-mcq2.json','manifest.webmanifest','icons/icon-180.png','icons/icon-192.png','icons/icon-512.png'];
// Fetch fresh copies (bypass HTTP cache) so a new version never caches stale files.
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>Promise.all(ASSETS.map(u=>fetch(new Request(u,{cache:'reload'})).then(r=>{if(!r.ok)throw new Error(u);return c.put(u,r);})))));self.skipWaiting();});
// Keep the audio cache across versions (clip names are content-hashed, so they never go stale).
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V&&k!==AC).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
// Serve a cached clip, honouring Range requests (Safari's media player asks for byte ranges).
async function ranged(req,res){const range=req.headers.get('range');if(!range)return res;
  const buf=await res.arrayBuffer(),n=buf.byteLength,m=/bytes=(\d*)-(\d*)/.exec(range);
  let s=m&&m[1]?+m[1]:0,end=m&&m[2]?+m[2]:n-1;if(m&&!m[1]&&m[2]){s=Math.max(0,n-+m[2]);end=n-1;}end=Math.min(end,n-1);
  return new Response(buf.slice(s,end+1),{status:206,headers:{'Content-Type':'audio/mpeg','Content-Range':`bytes ${s}-${end}/${n}`,'Content-Length':String(end-s+1),'Accept-Ranges':'bytes'}});}
async function clip(req){const c=await caches.open(AC),key=new URL(req.url).pathname.replace(/^.*?(audio\/)/,'audio/');
  let hit=await c.match(key);
  if(!hit){const r=await fetch(req.url,{cache:'no-cache'});if(!r.ok)return r;await c.put(key,r.clone());hit=r;}  // cache on first play
  return ranged(req,hit);}
self.addEventListener('fetch',e=>{if(e.request.method!=='GET'||new URL(e.request.url).origin!==location.origin)return;
 const p=new URL(e.request.url).pathname;
 if(/\/audio\/[^/]+\/[^/]+\.mp3$/.test(p))return e.respondWith(clip(e.request).catch(()=>new Response('',{status:504})));
 // Network first (fresh content when online), cache fallback when offline.
 e.respondWith(fetch(e.request,{cache:'no-cache'}).then(res=>{if(res.ok){const c=res.clone();caches.open(V).then(x=>x.put(e.request,c));}return res;}).catch(()=>caches.match(e.request,{ignoreSearch:true})));});
