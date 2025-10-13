"use client";

import { useState, useEffect } from "react";

interface TimeDebugInfo {
  success: boolean;
  serverTime: {
    utc: string;
    local: string;
    timezone: string;
  };
  venezuelaTime: {
    iso: string;
    formatted: string;
    offsetMinutes: number;
  };
  timestamp: number;
  message: string;
}

export default function TimeDebugger() {
  const [debugInfo, setDebugInfo] = useState<TimeDebugInfo | null>(null);
  const [clientTime, setClientTime] = useState<Date>(new Date());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchServerTime = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/time-check", {
        method: "GET",
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setDebugInfo(data);
      setClientTime(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServerTime();
  }, []);

  if (loading) {
    return (
      <div className="p-4 border rounded-lg bg-blue-50">
        <p>Cargando información de tiempo...</p>
      </div>
    );
  }

  return (
    <div className="p-6 border rounded-lg bg-gray-50 max-w-4xl mx-auto">
      <h2 className="text-xl font-bold mb-4">
        Debug de Sincronización de Tiempo
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {/* Información del Cliente */}
        <div className="p-4 border rounded bg-white">
          <h3 className="font-semibold text-blue-600 mb-2">
            Cliente (Navegador)
          </h3>
          <p>
            <strong>Hora actual:</strong> {clientTime.toISOString()}
          </p>
          <p>
            <strong>Hora local:</strong> {clientTime.toString()}
          </p>
          <p>
            <strong>Zona horaria:</strong>{" "}
            {Intl.DateTimeFormat().resolvedOptions().timeZone}
          </p>
          <p>
            <strong>Timestamp:</strong> {clientTime.getTime()}
          </p>
        </div>

        {/* Información del Servidor */}
        <div className="p-4 border rounded bg-white">
          <h3 className="font-semibold text-green-600 mb-2">Servidor (VPS)</h3>
          {debugInfo ? (
            <>
              <p>
                <strong>Hora UTC:</strong> {debugInfo.serverTime.utc}
              </p>
              <p>
                <strong>Hora local:</strong> {debugInfo.serverTime.local}
              </p>
              <p>
                <strong>Zona horaria:</strong> {debugInfo.serverTime.timezone}
              </p>
              <p>
                <strong>Timestamp:</strong> {debugInfo.timestamp}
              </p>
            </>
          ) : (
            <p className="text-red-600">No disponible</p>
          )}
        </div>
      </div>

      {/* Información de Venezuela */}
      {debugInfo && (
        <div className="p-4 border rounded bg-yellow-50 mb-4">
          <h3 className="font-semibold text-orange-600 mb-2">
            Hora de Venezuela
          </h3>
          <p>
            <strong>Hora ISO:</strong> {debugInfo.venezuelaTime.iso}
          </p>
          <p>
            <strong>Formateada:</strong> {debugInfo.venezuelaTime.formatted}
          </p>
          <p>
            <strong>Offset (minutos):</strong>{" "}
            {debugInfo.venezuelaTime.offsetMinutes}
          </p>
        </div>
      )}

      {/* Diferencia de tiempo */}
      {debugInfo && (
        <div className="p-4 border rounded bg-purple-50 mb-4">
          <h3 className="font-semibold text-purple-600 mb-2">
            Análisis de Sincronización
          </h3>
          <p>
            <strong>Diferencia servidor-cliente:</strong>{" "}
            {debugInfo.timestamp - clientTime.getTime()} ms
          </p>
          <p>
            <strong>Estado:</strong>{" "}
            {Math.abs(debugInfo.timestamp - clientTime.getTime()) < 5000 ? (
              <span className="text-green-600">✓ Sincronizado</span>
            ) : (
              <span className="text-red-600">⚠ Desincronizado</span>
            )}
          </p>
        </div>
      )}

      {error && (
        <div className="p-4 border rounded bg-red-50 mb-4">
          <h3 className="font-semibold text-red-600 mb-2">Error</h3>
          <p>{error}</p>
        </div>
      )}

      <button
        onClick={fetchServerTime}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
      >
        Actualizar Información
      </button>
    </div>
  );
}
