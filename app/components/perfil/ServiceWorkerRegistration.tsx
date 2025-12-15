"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function ServiceWorkerRegistration() {
  const pathname = usePathname();

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      "serviceWorker" in navigator &&
      process.env.NODE_ENV === "production"
    ) {
      // Extraer el username de la ruta (ej: /username -> username)
      const pathParts = pathname?.split("/").filter(Boolean);
      const username = pathParts?.[0];

      // Solo registrar service worker si estamos en una página de perfil
      if (username && pathname?.startsWith(`/${username}`)) {
        // Registrar el service worker específico para este perfil
        navigator.serviceWorker
          .register(`/${username}/sw`, {
            scope: `/${username}/`,
          })
          .then((registration) => {
            console.log(
              `Service Worker registrado para perfil: ${username}`,
              registration
            );

            // Verificar actualizaciones periódicamente
            setInterval(() => {
              registration.update();
            }, 60000); // Cada minuto
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

