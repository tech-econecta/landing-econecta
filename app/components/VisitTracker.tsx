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
