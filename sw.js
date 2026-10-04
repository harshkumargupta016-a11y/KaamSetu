const CACHE_NAME = "kaamsetu-shell-v1";
const QUEUE_DB = "kaamsetu-offline";
const QUEUE_STORE = "submissions";

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(["/", "/index.html"])));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET" || new URL(request.url).origin !== self.location.origin || request.url.includes("/api/")) return;
  if (request.mode === "navigate") {
    event.respondWith(fetch(request).then((response) => {
      const copy = response.clone();
      caches.open(CACHE_NAME).then((cache) => cache.put("/", copy));
      return response;
    }).catch(() => caches.match("/")));
  }
});

self.addEventListener("sync", (event) => {
  if (event.tag === "kaamsetu-submissions") event.waitUntil(syncSubmissions());
});

async function openQueueDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(QUEUE_DB, 1);
    request.onupgradeneeded = () => request.result.createObjectStore(QUEUE_STORE, { keyPath: "id" });
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function requestResult(request) {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function syncSubmissions() {
  const db = await openQueueDB();
  const items = await requestResult(db.transaction(QUEUE_STORE, "readonly").objectStore(QUEUE_STORE).getAll());
  for (const item of items) {
    const response = await fetch("/api/submissions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item)
    });
    if (!response.ok) throw new Error(`Submission sync failed with status ${response.status}`);
    await requestResult(db.transaction(QUEUE_STORE, "readwrite").objectStore(QUEUE_STORE).delete(item.id));
  }
  db.close();
}
