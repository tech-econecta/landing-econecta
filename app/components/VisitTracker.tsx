"use client";

import { useEffect, useRef } from "react";

interface VisitTrackerProps {
  username: string;
}

export default function VisitTracker({ username }: VisitTrackerProps) {
  const hasRegistered = useRef(false);

  useEffect(() => {
    // Evitar múltiples registros de la misma visita
    if (hasRegistered.current) return;
    const registerVisit = async () => {
      try {
        console.log("Iniciando registro de visita desde el cliente...");

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/visit`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ username }),
            cache: "no-store",
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        /*         const data = await response.json(); */

        /*         console.log("=== REGISTRO DE VISITA (CLIENTE) ===");
        console.log("Usuario:", username);
        console.log("IP del visitante:", data.ip);
        if (data.ip === "::1" || data.ip === "127.0.0.1") {
          console.log(
            "ℹ️  NOTA: IP ::1 indica que estás en localhost/desarrollo"
          );
        }
        console.log("Información geográfica:", data.geoInfo);
        console.log(
          "Fecha/Hora Venezuela:",
          data.formattedDate || data.timestamp
        );
        console.log("Zona horaria:", data.timezone);
        console.log("User Agent:", navigator.userAgent);
        console.log("Es IP local:", data.geoInfo?.isLocal ? "SÍ" : "NO");
        console.log("=====================================");
 */
        hasRegistered.current = true;
      } catch (error) {
        console.error("Error registrando la visita:", error);
        // En caso de error, no marcar como registrado para permitir reintentos
      }
    };

    // Pequeño delay para asegurar que la página esté completamente cargada
    const timer = setTimeout(() => {
      registerVisit();
    }, 100);

    return () => clearTimeout(timer);
  }, [username]);

  // Este componente no renderiza nada visual
  return null;
}
