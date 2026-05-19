import { NextResponse } from "next/server";
import { registerUserVisit } from "@/app/lib/visit";
import { getGeoInfo, parseUserAgent } from "@/app/lib/geo";
import { formatVenezuelaDate, getTimeDebugInfo } from "@/app/lib/timezone";

const getClientIp = async (req: Request): Promise<string> => {
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
    const value = req.headers.get(header);
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
    
    // Parsear información del dispositivo desde el User-Agent
    const userAgent = request.headers.get("user-agent");
    const referrer = request.headers.get("referer") || request.headers.get("referrer") || undefined;
    const deviceInfo = parseUserAgent(userAgent);

    // Usar la utilidad compartida para registrar la visita con datos completos
    const result = await registerUserVisit(username, ip, geoInfo, deviceInfo, referrer, "profile");

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
