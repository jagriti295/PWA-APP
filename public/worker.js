// Flag for enabling cache in production

'use strict';

self.addEventListener('push', function(event) {
  console.log('Received a push message', event);

  var title = 'Yay a message.';
  var body = 'We have received a push message.';
  var icon = './icon-192x192.png';
  var tag = 'simple-push-demo-notification-tag';

  event.waitUntil(
    self.registration.showNotification(title, {
      body: body,
      icon: icon,
      tag: tag
    })
  );
});

self.addEventListener('notificationclick', function(event) {
  console.log('On notification click: ', event.notification.tag);
  // Android doesn’t close the notification when you click on it
  // See: http://crbug.com/463146
  event.notification.close();

  // This looks to see if the current is already open and
  // focuses if it is
  event.waitUntil(clients.matchAll({
    type: 'window'
  }).then(function(clientList) {
    for (var i = 0; i < clientList.length; i++) {
      var client = clientList[i];
      if (client.url === '/' && 'focus' in client) {
        return client.focus();
      }
    }
    if (clients.openWindow) {
      return clients.openWindow('/');
    }
  }));
});



var doCache = true;
var CACHE_NAME = 'pwa-app-cache';
// Delete old caches
self.addEventListener('activate', event => {
  const currentCachelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys()
      .then(keyList =>
        Promise.all(keyList.map(key => {
          if (!currentCachelist.includes(key)) {
            console.log('Deleting cache: ' + key);
            return caches.delete(key);
          }
        }))
      )
  );
});

let deferredPrompt;

self.addEventListener('beforeinstallprompt', (e) => {
  // Prevent Chrome 67 and earlier from automatically showing the prompt
  e.preventDefault();
  // Stash the event so it can be triggered later.
  deferredPrompt = e;
});

(document.getElementById('btnAdd')).addEventListener('click', (e) => {
  // hide our user interface that shows our A2HS button
  btnAdd.style.display = 'none';
  // Show the prompt
  deferredPrompt.prompt();
  // Wait for the user to respond to the prompt
  deferredPrompt.userChoice
    .then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the A2HS prompt');
      } else {
        console.log('User dismissed the A2HS prompt');
      }
      deferredPrompt = null;
    });
});

self.addEventListener('appinstalled', (evt) => {
  console.log("here!!!");
  app.logEvent('a2hs', 'installed');
});

//HOW TO SET CACHE LIMIT?


// This triggers when user starts the app
self.addEventListener('install', function(event) {
  if (doCache) {
    event.waitUntil(
      caches.open(CACHE_NAME)
        .then(function(cache) {
          fetch('asset-manifest.json')
            .then(response => {
              response.json();
              console.log(response);
              //console.log(response.json());
            })
            .then(assets => {
              // We will cache initial page and the main.js
              // We could also cache assets like CSS and images
              console.log("in install");
              const urlsToCache = [
                '/',
                assets['main.js']
                //'static/js/main.c700e347.js'
              ];
              return cache.addAll(urlsToCache);
            })
        })
    );
  }
});
// Here we intercept request and serve up the matching files
self.addEventListener('fetch', function(event) {
  /*if (event.request.cache === 'only-if-cached' && event.request.mode !== 'same-origin') {
    console.log("here");
  return;
  }*/
  if (doCache) {
    console.log("in fetch");
    event.respondWith(
      caches.match(event.request).then(function(response) {
        return response || fetch(event.request);
      })
    );
  }
});