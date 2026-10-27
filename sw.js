/*
 * Legacy cleanup worker for the old root-level Star Forge PWA.
 *
 * New architecture: the root is a static hub with no service worker.
 * Star Forge now owns ./games/starforge/sw.js and cache starforge-v5.
 *
 * Existing users may still have the old root worker (cache starforge-v4)
 * registered. When their browser checks this file, it removes the old root
 * cache, unregisters this worker, and reloads the page so the hub is shown.
 *
 * This file is intentionally NOT registered by the new hub.
 */

const KEEP_CACHES = new Set(['starforge-v5']);

self.addEventListener('install', (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter((key) => key.startsWith('starforge-') && !KEEP_CACHES.has(key))
          .map((key) => caches.delete(key)),
      );

      await self.registration.unregister();

      const clients = await self.clients.matchAll({ type: 'window' });
      for (const client of clients) {
        client.navigate(client.url).catch(() => {});
      }
    })(),
  );
});

