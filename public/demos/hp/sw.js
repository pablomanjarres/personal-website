// Portfolio copy of the demo: the app registers ./sw.js, so this worker only
// clears anything an earlier build cached and unregisters itself.
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.map((key) => caches.delete(key))))
      .then(() => self.registration.unregister()),
  );
});
