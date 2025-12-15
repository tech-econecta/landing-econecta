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
// Service Worker optimizado para modo browser - buena UX en móviles
// Perfil: ${username}
const CACHE_NAME = "${cacheName}";
const SCOPE = "${scope}";
const CACHE_VERSION = "v1";
const MAX_CACHE_AGE = 7 * 24 * 60 * 60 * 1000; // 7 días

// Recursos estáticos que se cachean en la instalación
const STATIC_CACHE_URLS = [
  "/favicon.ico",
];

// Instalación del Service Worker - ligera y rápida
self.addEventListener("install", (event) => {
  console.log("Service Worker instalado para: ${username}");
  // No cachear nada en la instalación para mantenerlo ligero
  // Solo activar inmediatamente
  self.skipWaiting();
});

// Activación del Service Worker
self.addEventListener("activate", (event) => {
  console.log("Service Worker activado para: ${username}");
  event.waitUntil(
    Promise.all([
      // Limpiar caches antiguos
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((name) => {
            if (name.startsWith("econecta-") && name !== CACHE_NAME) {
              const otherUsername = name.match(/econecta-(.+?)-v/)?.[1];
              if (otherUsername && otherUsername !== "${username}") {
                return caches.delete(name);
              }
            }
            // Limpiar caches muy antiguos
            if (name === CACHE_NAME) {
              return caches.open(name).then((cache) => {
                return cache.keys().then((keys) => {
                  return Promise.all(
                    keys.map((key) => {
                      return cache.match(key).then((response) => {
                        if (response) {
                          const cachedDate = response.headers.get("sw-cached-date");
                          if (cachedDate) {
                            const age = Date.now() - parseInt(cachedDate);
                            if (age > MAX_CACHE_AGE) {
                              return cache.delete(key);
                            }
                          }
                        }
                      });
                    })
                  );
                });
              });
            }
          })
        );
      }),
      self.clients.claim() // Tomar control inmediatamente
    ])
  );
});

// Estrategia optimizada para móviles: Network First con fallback a cache
// Cachea solo imágenes y recursos estáticos, NO cachea HTML dinámico
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  
  // Solo procesar peticiones dentro del scope de este perfil
  if (!url.pathname.startsWith(SCOPE) && !url.pathname.includes("/favicon.ico")) {
    return; // Dejar pasar sin interceptar
  }

  // Solo procesar peticiones GET
  if (event.request.method !== "GET") {
    return;
  }

  // No cachear HTML dinámico - siempre obtener la versión más reciente
  if (event.request.headers.get("accept")?.includes("text/html")) {
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          // Solo usar cache si la red falla completamente
          return caches.match(event.request);
        })
    );
    return;
  }

  // Para imágenes y recursos estáticos: Network First con cache
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Solo cachear respuestas exitosas de imágenes y recursos estáticos
        if (
          response.status === 200 &&
          response.type === "basic" &&
          (event.request.destination === "image" ||
           event.request.url.match(/\\.(jpg|jpeg|png|gif|webp|svg|ico|woff|woff2|ttf|eot)$/i))
        ) {
          const responseToCache = response.clone();
          // Agregar timestamp para limpieza posterior
          const headers = new Headers(responseToCache.headers);
          headers.set("sw-cached-date", Date.now().toString());
          
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, new Response(responseToCache.body, {
              status: responseToCache.status,
              statusText: responseToCache.statusText,
              headers: headers
            }));
          });
        }
        return response;
      })
      .catch(() => {
        // Si falla la red, intentar desde el cache (solo para recursos estáticos)
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          // Si no hay cache, devolver respuesta de error
          return new Response("Recurso no disponible", {
            status: 503,
            statusText: "Service Unavailable"
          });
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

