import { CacheableResponsePlugin } from "workbox-cacheable-response";
import { ExpirationPlugin } from "workbox-expiration";
import { cleanupOutdatedCaches } from "workbox-precaching";
import { registerRoute, setCatchHandler } from "workbox-routing";
import { CacheFirst, NetworkFirst, StaleWhileRevalidate } from "workbox-strategies";

declare let self: ServiceWorkerGlobalScope;

const CACHE_NAME = "offline-fallback-v1";
const OFFLINE_FALLBACK_PAGE = "/";

self.addEventListener("install", (event) => {
    console.log("Service Worker installing...");
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll([OFFLINE_FALLBACK_PAGE, "/manifest.json"]);
        }),
    );

    self.skipWaiting();
});

self.addEventListener("activate", (event) => {
    console.log("Service Worker activating...");
    event.waitUntil(self.clients.claim());
});

cleanupOutdatedCaches();

registerRoute(
    ({ request }) => request.mode === "navigate",
    new NetworkFirst({
        cacheName: "pages-cache",
        plugins: [
            new CacheableResponsePlugin({
                statuses: [0, 200],
            }),
        ],
    }),
);

registerRoute(
    ({ url }) => url.pathname.startsWith("/api/"),
    new NetworkFirst({
        cacheName: "api-cache",
        plugins: [
            new CacheableResponsePlugin({
                statuses: [0, 200],
            }),
            new ExpirationPlugin({
                maxAgeSeconds: 60 * 60 * 24, // 24 hours
                maxEntries: 60,
            }),
        ],
    }),
);

registerRoute(
    ({ request }) =>
        request.destination === "style" ||
        request.destination === "script" ||
        request.destination === "font",
    new StaleWhileRevalidate({
        cacheName: "static-cache",
        plugins: [
            new CacheableResponsePlugin({
                statuses: [0, 200],
            }),
        ],
    }),
);

registerRoute(
    /.*\.(?:png|jpg|jpeg|svg|gif)/,
    new CacheFirst({
        cacheName: "image-cache",
        plugins: [
            new CacheableResponsePlugin({
                statuses: [0, 200],
            }),
            new ExpirationPlugin({
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
                maxEntries: 100,
            }),
        ],
    }),
);

setCatchHandler(async ({ event }) => {
    if (event.request.mode === "navigate") {
        const cache = await caches.open(CACHE_NAME);
        const cachedResponse = await cache.match(OFFLINE_FALLBACK_PAGE);
        if (cachedResponse) {
            return cachedResponse;
        }
    }
    return Response.error();
});
