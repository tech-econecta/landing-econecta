import axios from "axios";
import { VisitGeoInfo } from "./visit";

/**
 * Obtiene información geográfica a partir de una IP
 * Utilidad compartida para uso tanto en API routes como en server-side rendering
 */
export async function getGeoInfo(ip: string): Promise<VisitGeoInfo> {
  // Si es una IP local, usar información por defecto
  if (
    ip === "::1" ||
    ip === "127.0.0.1" ||
    ip.startsWith("192.168.") ||
    ip.startsWith("10.") ||
    ip === "Desconocido"
  ) {
    return {
      country: "Venezuela",
      region: "Distrito Capital",
      city: "Caracas",
      isLocal: true,
    };
  }

  try {
    const response = await axios.get(
      `http://ip-api.com/json/${ip}?fields=status,message,country,regionName,city,timezone`,
      {
        timeout: 3000, // 3s timeout para no retrasar mucho la redirección
      }
    );

    if (response.data.status === "success") {
      return {
        country: response.data.country || "Desconocido",
        region: response.data.regionName || "Desconocido",
        city: response.data.city || "Desconocido",
        timezone: response.data.timezone || "America/Caracas",
        isLocal: false,
      };
    } else {
      throw new Error(response.data.message || "API error");
    }
  } catch (error) {
    console.error("Error obteniendo información geográfica:", error);
    return {
      country: "Venezuela",
      region: "Desconocido",
      city: "Desconocido",
      timezone: "America/Caracas",
      isLocal: false,
      error: true,
    };
  }
}

/**
 * Extrae la IP real del cliente a partir de los headers del request
 */
export function getClientIpFromHeaders(headersList: Headers): string {
  const possibleHeaders = [
    "x-forwarded-for",
    "x-real-ip",
    "x-client-ip",
    "cf-connecting-ip",
    "x-cluster-client-ip",
  ];

  for (const header of possibleHeaders) {
    const value = headersList.get(header);
    if (value) {
      const ips = value.split(",").map((ip) => ip.trim());
      const realIp = ips[0];
      if (realIp && !isPrivateIp(realIp)) {
        return realIp;
      }
    }
  }

  return "Desconocido";
}

/**
 * Parsea el User-Agent para extraer información del dispositivo
 */
export function parseUserAgent(userAgent: string | null): {
  device: string;
  browser: string;
  os: string;
} {
  if (!userAgent) {
    return { device: "Desconocido", browser: "Desconocido", os: "Desconocido" };
  }

  // Detectar dispositivo
  let device = "Desktop";
  if (/Mobile|Android|iPhone|iPad|iPod/i.test(userAgent)) {
    if (/iPad|Tablet/i.test(userAgent)) {
      device = "Tablet";
    } else {
      device = "Mobile";
    }
  }

  // Detectar navegador
  let browser = "Otro";
  if (/Chrome\//.test(userAgent) && !/Edg\//.test(userAgent)) {
    browser = "Chrome";
  } else if (/Safari\//.test(userAgent) && !/Chrome\//.test(userAgent)) {
    browser = "Safari";
  } else if (/Firefox\//.test(userAgent)) {
    browser = "Firefox";
  } else if (/Edg\//.test(userAgent)) {
    browser = "Edge";
  } else if (/Opera|OPR\//.test(userAgent)) {
    browser = "Opera";
  }

  // Detectar OS
  let os = "Otro";
  if (/Windows/.test(userAgent)) {
    os = "Windows";
  } else if (/Mac OS X/.test(userAgent)) {
    os = "macOS";
  } else if (/Android/.test(userAgent)) {
    os = "Android";
  } else if (/iPhone|iPad|iPod/.test(userAgent)) {
    os = "iOS";
  } else if (/Linux/.test(userAgent)) {
    os = "Linux";
  }

  return { device, browser, os };
}

function isPrivateIp(ip: string): boolean {
  const privateRanges = [
    /^10\./,
    /^172\.(1[6-9]|2[0-9]|3[01])\./,
    /^192\.168\./,
    /^127\./,
    /^::1$/,
    /^fc00:/,
    /^fe80:/,
  ];
  return privateRanges.some((range) => range.test(ip));
}
