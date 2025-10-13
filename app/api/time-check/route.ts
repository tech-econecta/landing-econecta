import { NextResponse } from "next/server";
import { getTimeDebugInfo, getCurrentVenezuelaTime } from "@/app/lib/timezone";

export async function GET() {
  try {
    const timeDebugInfo = getTimeDebugInfo();
    const venezuelaTime = getCurrentVenezuelaTime();

    return NextResponse.json({
      success: true,
      serverTime: {
        utc: timeDebugInfo.serverUTC,
        local: timeDebugInfo.serverLocal,
        timezone: timeDebugInfo.serverTimezone,
      },
      venezuelaTime: {
        iso: timeDebugInfo.venezuelaISO,
        formatted: timeDebugInfo.venezuelaFormatted,
        offsetMinutes: timeDebugInfo.offsetMinutes,
      },
      timestamp: timeDebugInfo.timestamp,
      message: "Información de tiempo del servidor obtenida correctamente",
    });
  } catch (error) {
    console.error("Error obteniendo información de tiempo:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Error obteniendo información de tiempo del servidor",
        details: error instanceof Error ? error.message : "Error desconocido",
      },
      { status: 500 }
    );
  }
}
