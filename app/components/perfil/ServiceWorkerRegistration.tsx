"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

// Función para limpiar todos los service workers y caches
const cleanupServiceWorkers = async () => {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
    return;
  }

  try {
    // Obtener todos los registros de service workers
    const registrations = await navigator.serviceWorker.getRegistrations();
    
    console.log(`🔍 Encontrados ${registrations.length} service workers para limpiar`);
    
    // Desregistrar todos los service workers
    let unregisteredCount = 0;
    for (const registration of registrations) {
      try {
        const unregistered = await registration.unregister();
        if (unregistered) {
          unregisteredCount++;
          console.log(`✅ Service Worker desregistrado: ${registration.scope}`);
        } else {
          console.log(`⚠️ No se pudo desregistrar: ${registration.scope}`);
        }
      } catch (err) {
        console.error(`❌ Error al desregistrar ${registration.scope}:`, err);
      }
    }

    // Limpiar todos los caches
    if ("caches" in window) {
      const cacheNames = await caches.keys();
      console.log(`🔍 Encontrados ${cacheNames.length} caches para limpiar`);
      
      let deletedCount = 0;
      for (const cacheName of cacheNames) {
        try {
          const deleted = await caches.delete(cacheName);
          if (deleted) {
            deletedCount++;
            console.log(`✅ Cache eliminado: ${cacheName}`);
          }
        } catch (err) {
          console.error(`❌ Error al eliminar cache ${cacheName}:`, err);
        }
      }
      console.log(`✅ ${deletedCount} caches eliminados`);
    }

    console.log(`✅ Limpieza completada: ${unregisteredCount} service workers desregistrados`);
    return { success: true, unregisteredCount };
  } catch (error) {
    console.error("❌ Error al limpiar service workers:", error);
    return { success: false, error };
  }
};

// Exponer la función globalmente para uso desde la consola
if (typeof window !== "undefined") {
  (window as any).cleanupServiceWorkers = cleanupServiceWorkers;
  console.log("💡 Función disponible: window.cleanupServiceWorkers()");
}

export default function ServiceWorkerRegistration() {
  const pathname = usePathname();

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      "serviceWorker" in navigator
    ) {
      // Extraer el username de la ruta (ej: /username -> username)
      const pathParts = pathname?.split("/").filter(Boolean);
      const username = pathParts?.[0];

      // Solo registrar service worker si estamos en una página de perfil
      if (username && pathname?.startsWith(`/${username}`)) {
        const swUrl = `/${username}/sw`;
        const swScope = `/${username}`;

        // Verificar si ya existe un service worker registrado para este scope
        navigator.serviceWorker
          .getRegistration(swScope)
          .then((existingRegistration) => {
            if (existingRegistration) {
              // Ya existe un service worker registrado
              return existingRegistration;
            } else {
              // No existe, registrar uno nuevo
              return navigator.serviceWorker.register(swUrl, {
                scope: swScope,
              });
            }
          })
          .then((registration) => {
            if (registration) {
              // Verificar actualizaciones periódicamente (solo una vez)
              if (!(registration as any)._updateInterval) {
                (registration as any)._updateInterval = setInterval(() => {
                  registration.update();
                }, 300000); // Cada 5 minutos (más espaciado para móviles)
              }
            }
          })
          .catch((error) => {
            console.error(
              `Error al registrar Service Worker para ${username}:`,
              error
            );
          });
      }
    }
  }, [pathname]);

  return null; // Este componente no renderiza nada
}

