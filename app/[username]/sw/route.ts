import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  props: { params: Promise<{ username: string }> }
) {
  const params = await props.params;
  const { username } = params;

  // Service Worker específico para este perfil
  // Usa un cache name único por perfil para evitar conflictos
  const cacheName = `econecta-${username}-v1`;
  const scope = `/${username}`;

  const serviceWorkerCode = `
// Service Worker para PWA del perfil: ${username}
const CACHE_NAME = "${cacheName}";
const SCOPE = "${scope}";

// Instalación del Service Worker
self.addEventListener("install", (event) => {
  console.log("Service Worker instalado para: ${username}");
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Cachear recursos básicos del perfil
      return cache.addAll([
        SCOPE,
        "/favicon.ico",
      ]);
    })
  );
  self.skipWaiting(); // Activar inmediatamente
});

// Activación del Service Worker
self.addEventListener("activate", (event) => {
  console.log("Service Worker activado para: ${username}");
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // Solo eliminar caches de otros perfiles, mantener el cache de este perfil
          if (cacheName.startsWith("econecta-") && cacheName !== CACHE_NAME) {
            // Verificar si el cache es de otro perfil
            const otherUsername = cacheName.match(/econecta-(.+?)-v/)?.[1];
            if (otherUsername && otherUsername !== "${username}") {
              return caches.delete(cacheName);
            }
          }
        })
      );
    })
  );
  return self.clients.claim(); // Tomar control inmediatamente
});

// Estrategia: Network First, luego Cache
self.addEventListener("fetch", (event) => {
  // Solo procesar peticiones dentro del scope de este perfil
  if (!event.request.url.includes(SCOPE) && !event.request.url.includes("/favicon.ico")) {
    return; // Dejar que otros service workers manejen sus propias rutas
  }

  // Solo cachear peticiones GET
  if (event.request.method !== "GET") {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Verificar si la respuesta es válida
        if (!response || response.status !== 200 || response.type !== "basic") {
          return response;
        }

        // Clonar la respuesta
        const responseToCache = response.clone();

        // Guardar en cache específico de este perfil
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });

        return response;
      })
      .catch(() => {
        // Si falla la red, intentar desde el cache
        return caches.match(event.request).then((response) => {
          return response || new Response("Offline", { status: 503 });
        });
      })
  );
});
`;

  return new NextResponse(serviceWorkerCode, {
    headers: {
      "Content-Type": "application/javascript",
      "Service-Worker-Allowed": scope,
    },
  });
}

