import { NextResponse } from "next/server";
import axios from "axios";
import { registerUserVisit, VisitGeoInfo } from "@/app/lib/visit";
import { formatVenezuelaDate, getTimeDebugInfo } from "@/app/lib/timezone";

const getGeoInfo = async (ip: string): Promise<VisitGeoInfo> => {
  // Si es una IP local, usar información por defecto
  if (
    ip === "::1" ||
    ip === "127.0.0.1" ||
    ip.startsWith("192.168.") ||
    ip.startsWith("10.")
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
        timeout: 5000,
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
    // Fallback a Venezuela si no se puede obtener la información
    return {
      country: "Venezuela",
      region: "Desconocido",
      city: "Desconocido",
      timezone: "America/Caracas",
      isLocal: false,
      error: true,
    };
  }
};

const getClientIp = async (req: Request): Promise<string> => {
  // Convertir los headers de Request a un objeto simple
  const headersObj: { [key: string]: string } = {};
  req.headers.forEach((value, key) => {
    headersObj[key] = value;
  });

  // Prioridad de headers para obtener la IP real del cliente
  const possibleHeaders = [
    "x-forwarded-for",
    "x-real-ip",
    "x-client-ip",
    "cf-connecting-ip", // Cloudflare
    "x-cluster-client-ip",
    "x-forwarded",
    "forwarded-for",
    "forwarded",
  ];

  for (const header of possibleHeaders) {
    const value = headersObj[header];
    if (value) {
      // x-forwarded-for puede contener múltiples IPs separadas por comas
      const ips = value.split(",").map((ip) => ip.trim());
      const realIp = ips[0]; // La primera IP es la del cliente original

      // Verificar que no sea una IP privada o local
      if (realIp && !isPrivateIp(realIp)) {
        return realIp;
      }
    }
  }

  return "Desconocido";
};

// Función para verificar si una IP es privada/local
const isPrivateIp = (ip: string): boolean => {
  const privateRanges = [
    /^10\./, // 10.0.0.0/8
    /^172\.(1[6-9]|2[0-9]|3[01])\./, // 172.16.0.0/12
    /^192\.168\./, // 192.168.0.0/16
    /^127\./, // 127.0.0.0/8 (localhost)
    /^::1$/, // IPv6 localhost
    /^fc00:/, // IPv6 private
    /^fe80:/, // IPv6 link-local
  ];

  return privateRanges.some((range) => range.test(ip));
};

export async function POST(request: Request) {
  try {
    const { username } = await request.json();
    const ip = await getClientIp(request);
    const geoInfo = await getGeoInfo(ip);

    // Usar la utilidad compartida para registrar la visita
    const result = await registerUserVisit(username, ip, geoInfo);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: result.error === "Usuario no encontrado" ? 404 : 500 }
      );
    }

    return NextResponse.json({
      message: "Visita registrada correctamente",
      ip: result.ip,
      geoInfo: result.geoInfo,
      timestamp: result.venezuelaTime?.toISOString(),
      formattedDate: formatVenezuelaDate(result.venezuelaTime),
      timezone: "America/Caracas",
      debugInfo: getTimeDebugInfo(),
    });
  } catch (error) {
    console.error("Error registrando la visita en API route:", error);
    return NextResponse.json(
      { error: "Error registrando la visita" },
      { status: 500 }
    );
  }
}
