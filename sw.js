const V='cdt-v9';
const ASSETS=['./','index.html','css/app.css','js/app.js','js/exams.js','js/sm2.js','js/store.js','js/quiz.js','js/audio.js','content/comprehensive.json','content/comprehensive-mcq.json','content/ceramics.json','content/complete-dentures.json','content/crown-bridge.json','content/orthodontics.json','content/partial-dentures.json','content/implants.json','content/digital-workflow.json','manifest.webmanifest','icons/icon-180.png','icons/icon-192.png','icons/icon-512.png'];
// Fetch fresh copies (bypass HTTP cache) so a new version never caches stale files.
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>Promise.all(ASSETS.map(u=>fetch(new Request(u,{cache:'reload'})).then(r=>{if(!r.ok)throw new Error(u);return c.put(u,r);})))));self.skipWaiting();});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
// Network first (fresh content when online), cache fallback when offline.
self.addEventListener('fetch',e=>{if(e.request.method!=='GET'||new URL(e.request.url).origin!==location.origin)return;
 e.respondWith(fetch(e.request,{cache:'no-cache'}).then(res=>{if(res.ok){const c=res.clone();caches.open(V).then(x=>x.put(e.request,c));}return res;}).catch(()=>caches.match(e.request,{ignoreSearch:true})));});
