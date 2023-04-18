const { offlineFallback, warmStrategyCache } = require('workbox-recipes');
const { CacheFirst, StaleWhileRevalidate } = require('workbox-strategies');
const { registerRoute } = require('workbox-routing');
const { CacheableResponsePlugin } = require('workbox-cacheable-response');
const { ExpirationPlugin } = require('workbox-expiration');
const { precacheAndRoute } = require('workbox-precaching/precacheAndRoute');

precacheAndRoute(self.__WB_MANIFEST);

// cache strategy
const pageCache = new CacheFirst({
  cacheName: 'page-cache',
  plugins: [
    new CacheableResponsePlugin({
      statuses: [0, 200],
    }),
    new ExpirationPlugin({
      maxAgeSeconds: 30 * 24 * 60 * 60,
    }),
  ],
});

// loads provided URLs into cache during the service worker install phase
// caches with the options of the provided strategy (pageCache)
warmStrategyCache({
  urls: ['/index.html', '/'],
  strategy: pageCache,
});

// registerRoute(matchCb, handlerCb)
registerRoute(
  ({ request }) =>
    request.mode === 'navigate', pageCache
);

registerRoute(
  ({ request }) => ["style", "script", "worker"].includes(request.destination),
  // ensures that the locally cached content is "fresh"
  new StaleWhileRevalidate({
    cacheName: "asset-cache",
    plugins: [
      // module provides a standard way for the server to determine whether a response should be cached based on its numeric status code
      // the presence of a header with a specific value, or a combination of the two
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
    ],
  })
);
