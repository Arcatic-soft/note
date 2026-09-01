var CACHE='nb-lite-v1';
self.addEventListener('install',function(e){self.skipWaiting();});
self.addEventListener('activate',function(e){e.waitUntil(self.clients.claim());});
self.addEventListener('fetch',function(e){
var req=e.request;
if(req.method!=='GET')return;
var url=new URL(req.url);
if(url.origin!==self.location.origin)return;
if(url.pathname.indexOf('api.php')>-1||url.pathname.indexOf('upload.php')>-1)return;
if(req.mode==='navigate'){
e.respondWith(fetch(req).then(function(r){
var copy=r.clone();
caches.open(CACHE).then(function(c){c.put('./index.html',copy);});
return r;
}).catch(function(){return caches.match('./index.html');}));
return;
}
e.respondWith(caches.match(req).then(function(hit){
var net=fetch(req).then(function(r){
if(r&&r.ok){var copy=r.clone();caches.open(CACHE).then(function(c){c.put(req,copy);});}
return r;
}).catch(function(){return hit;});
return hit||net;
}));
});