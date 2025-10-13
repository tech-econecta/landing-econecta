/**
 * Utilidades para manejo de fechas y zonas horarias
 * Específicamente configurado para Venezuela (America/Caracas)
 */

export const VENEZUELA_TIMEZONE = "America/Caracas";

/**
 * Convierte una fecha a la zona horaria de Venezuela
 * Corregido para manejar correctamente las zonas horarias
 */
export function toVenezuelaTime(date: Date = new Date()): Date {
  // Obtener el offset de Venezuela en milisegundos
  const venezuelaTime = new Date(date.toLocaleString("en-US", { timeZone: VENEZUELA_TIMEZONE }));
  
  // Calcular la diferencia entre UTC y Venezuela
  const utcTime = new Date(date.toLocaleString("en-US", { timeZone: "UTC" }));
  const offset = date.getTime() - utcTime.getTime();
  
  // Aplicar el offset para obtener la hora correcta de Venezuela
  return new Date(venezuelaTime.getTime() + offset);
}

/**
 * Formatea una fecha para mostrar en Venezuela
 */
export function formatVenezuelaDate(date: Date = new Date()): string {
  return date.toLocaleString("es-VE", {
    timeZone: VENEZUELA_TIMEZONE,
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
}

/**
 * Obtiene la fecha actual en Venezuela como string ISO
 */
export function getVenezuelaISOString(): string {
  return toVenezuelaTime().toISOString();
}

/**
 * Obtiene información completa de fecha/hora para Venezuela
 */
export function getVenezuelaTimeInfo() {
  const now = new Date();
  const venezuelaTime = toVenezuelaTime(now);

  return {
    utc: now.toISOString(),
    venezuela: venezuelaTime.toISOString(),
    formatted: formatVenezuelaDate(venezuelaTime),
    timezone: VENEZUELA_TIMEZONE,
    offset: venezuelaTime.getTimezoneOffset(),
    serverTime: now.toISOString(),
    serverTimezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  };
}

/**
 * Función más robusta para obtener la hora actual en Venezuela
 * Considera el horario de verano y otros ajustes automáticos
 */
export function getCurrentVenezuelaTime(): Date {
  const now = new Date();
  
  // Usar Intl.DateTimeFormat para obtener la hora correcta
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: VENEZUELA_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });
  
  const parts = formatter.formatToParts(now);
  const dateStr = `${parts[0].value}-${parts[2].value}-${parts[4].value}T${parts[6].value}:${parts[8].value}:${parts[10].value}`;
  
  return new Date(dateStr);
}

/**
 * Función para debug de información de tiempo
 */
export function getTimeDebugInfo() {
  const now = new Date();
  const venezuelaTime = getCurrentVenezuelaTime();
  
  return {
    serverUTC: now.toISOString(),
    serverLocal: now.toString(),
    serverTimezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    venezuelaISO: venezuelaTime.toISOString(),
    venezuelaFormatted: formatVenezuelaDate(venezuelaTime),
    offsetMinutes: (venezuelaTime.getTime() - now.getTime()) / (1000 * 60),
    timestamp: Date.now(),
  };
}
