const V='cdt-v3';
const ASSETS=['./','index.html','css/app.css','js/app.js','js/exams.js','js/sm2.js','js/store.js','js/quiz.js','js/audio.js','content/comprehensive.json','content/comprehensive-mcq.json','content/ceramics.json','manifest.webmanifest','icons/icon-180.png','icons/icon-192.png','icons/icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(ASSETS)));self.skipWaiting();});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;
 e.respondWith(caches.match(e.request,{ignoreSearch:true}).then(r=>r||fetch(e.request).then(res=>{if(res.ok&&new URL(e.request.url).origin===location.origin){const c=res.clone();caches.open(V).then(x=>x.put(e.request,c));}return res;})));});
