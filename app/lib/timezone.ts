/**
 * Utilidades para manejo de fechas y zonas horarias
 * Específicamente configurado para Venezuela (America/Caracas)
 */

export const VENEZUELA_TIMEZONE = "America/Caracas";

/**
 * Convierte una fecha a la zona horaria de Venezuela
 */
export function toVenezuelaTime(date: Date = new Date()): Date {
  return new Date(
    date.toLocaleString("en-US", { timeZone: VENEZUELA_TIMEZONE })
  );
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
  };
}
