const C='dw-2',A=['./','./index.html','./manifest.json','./icon-192.png','./icon-512.png'];
self.addEventListener('install',e=>e.waitUntil(caches.open(C).then(c=>c.addAll(A)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>clients.claim())));
self.addEventListener('fetch',e=>{
  if(new URL(e.request.url).origin!==location.origin)return;
  e.respondWith(fetch(e.request).then(r=>{const c=r.clone();caches.open(C).then(x=>x.put(e.request,c));return r}).catch(()=>caches.match(e.request)));
});
self.addEventListener('periodicsync',e=>{
  if(e.tag==='daily-word')e.waitUntil(self.registration.showNotification('今日の言葉が届きました',{body:'タップして意味と議論を見る',icon:'icon-192.png',tag:'daily'}));
});
self.addEventListener('notificationclick',e=>{
  e.notification.close();
  e.waitUntil(clients.matchAll({type:'window'}).then(l=>l.length?l[0].focus():clients.openWindow('./')));
});
