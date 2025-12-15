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
    // Service Workers deshabilitados - limpiar cualquier service worker existente
    // pero NO registrar nuevos
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      // Limpiar automáticamente cualquier service worker existente
      cleanupServiceWorkers().then(() => {
        console.log("✅ Service Workers deshabilitados - no se registrarán nuevos");
      });
    }
  }, [pathname]);

  return null; // Este componente no renderiza nada
}

