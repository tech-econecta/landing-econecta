"use client";

import { useEffect } from "react";

interface ReplaceRedirectProps {
  url: string;
}

export default function ReplaceRedirect({ url }: ReplaceRedirectProps) {
  useEffect(() => {
    console.log("🚀 Redirección de cliente iniciada hacia:", url);
    // Usamos replace para que la página actual no se guarde en el historial
    window.location.replace(url);
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
