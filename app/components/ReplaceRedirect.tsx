"use client";

import { useEffect } from "react";

interface ReplaceRedirectProps {
  url: string;
}

export default function ReplaceRedirect({ url }: ReplaceRedirectProps) {
  useEffect(() => {
    try {
      // Obtener el origin y path actual
      const currentOrigin = window.location.origin;
      const currentPath = window.location.pathname;
      
      // Parsear la URL de destino
      const targetUrl = new URL(url);
      
      // EVITAR BUCLE: Si el origen y el path ya coinciden, no redireccionamos
      // Normalizamos el path quitando la barra final si existe
      const normCurrentPath = currentPath.replace(/\/$/, "");
      const normTargetPath = targetUrl.pathname.replace(/\/$/, "");

      if (currentOrigin === targetUrl.origin && normCurrentPath === normTargetPath) {
        console.log("✅ Ya estamos en el destino, cancelando redirección para evitar bucle.");
        return;
      }

      console.log("🚀 Redirección de cliente iniciada hacia:", url);
      window.location.replace(url);
    } catch (e) {
      console.error("Error en redirección:", e);
      // Si falla el parseo de la URL, intentamos redirigir de todos modos como fallback
      window.location.replace(url);
    }
  }, [url]);

  return (
    <div className="flex items-center justify-center h-screen bg-white">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Redirigiendo...</p>
      </div>
    </div>
  );
}
