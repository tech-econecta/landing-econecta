import { collection, query, where, getDocs, addDoc, Timestamp } from "firebase/firestore";
import { db } from "@/firebase";
import { getCurrentVenezuelaTime, formatVenezuelaDate, getTimeDebugInfo } from "./timezone";

export interface VisitGeoInfo {
  country: string;
  region: string;
  city: string;
  timezone?: string;
  isLocal: boolean;
  error?: boolean;
}

export interface VisitDeviceInfo {
  device: string;
  browser: string;
  os: string;
  userAgent?: string;
}

export interface VisitRegistrationResult {
  success: boolean;
  error?: string;
  ip?: string;
  geoInfo?: VisitGeoInfo;
  venezuelaTime?: Date;
}

/**
 * Registra una visita para un usuario de forma case-insensitive
 * Ahora incluye información de dispositivo, referrer, y fuente (redirect vs perfil)
 */
export async function registerUserVisit(
  username: string, 
  ip: string = "Desconocido", 
  geoInfo: VisitGeoInfo = {
    country: "Venezuela",
    region: "Desconocido",
    city: "Desconocido",
    isLocal: false
  },
  deviceInfo?: VisitDeviceInfo,
  referrer?: string,
  source: "profile" | "redirect" = "profile"
): Promise<VisitRegistrationResult> {
  try {
    if (!username) {
      return { success: false, error: "Username is required" };
    }

    const usersRef = collection(db, "users");
    const decodedUsername = decodeURIComponent(username);

    let userDoc;

    // Intento 0: búsqueda directa por Document ID (para accesos vía enlace privado)
    try {
      const { doc: docRef, getDoc } = await import("firebase/firestore");
      const directDoc = await getDoc(docRef(db, "users", decodedUsername));
      if (directDoc.exists()) {
        userDoc = directDoc;
      }
    } catch (e) {
      // ID inválido para Firestore, continuamos con búsqueda por username
    }

    // Si no se encontró por ID, buscar por username
    if (!userDoc) {
      // Intento 1: match exacto
      let q = query(usersRef, where("user_name", "==", decodedUsername));
      let snapshot = await getDocs(q);

      // Intento 2: primera letra mayúscula (ej: keeppz -> Keeppz)
      if (snapshot.empty) {
        const capitalizedUsername = decodedUsername.charAt(0).toUpperCase() + decodedUsername.slice(1);
        q = query(usersRef, where("user_name", "==", capitalizedUsername));
        snapshot = await getDocs(q);
      }

      // Intento 3: todo minúscula (ej: Keeppz -> keeppz)
      if (snapshot.empty) {
        const lowercasedUsername = decodedUsername.toLowerCase();
        q = query(usersRef, where("user_name", "==", lowercasedUsername));
        snapshot = await getDocs(q);
      }

      if (snapshot.empty) {
        console.error(`Usuario no encontrado al registrar visita: ${username}`);
        return { success: false, error: "Usuario no encontrado" };
      }

      userDoc = snapshot.docs[0];
    }

    // Crear fecha con zona horaria de Venezuela
    const venezuelaTime = getCurrentVenezuelaTime();
    const timeDebugInfo = getTimeDebugInfo();


    // Construir el documento de visita con todos los datos disponibles
    const visitData: Record<string, any> = {
      date: Timestamp.fromDate(venezuelaTime),
      dateUTC: Timestamp.now(),
      ip: ip,
      country: geoInfo.country,
      region: geoInfo.region,
      city: geoInfo.city,
      timezone: geoInfo.timezone || "America/Caracas",
      isLocal: geoInfo.isLocal || false,
      hasGeoError: geoInfo.error || false,
      serverTimezone: timeDebugInfo.serverTimezone,
      offsetMinutes: timeDebugInfo.offsetMinutes,
      source: source, // "redirect" o "profile" — indica si fue una visita redirigida
    };

    // Agregar info de dispositivo si está disponible
    if (deviceInfo) {
      visitData.device = deviceInfo.device;
      visitData.browser = deviceInfo.browser;
      visitData.os = deviceInfo.os;
    }

    // Agregar referrer si está disponible
    if (referrer) {
      visitData.referrer = referrer;
    }

    await addDoc(collection(userDoc.ref, "statics"), visitData);

    return { 
      success: true, 
      ip, 
      geoInfo, 
      venezuelaTime 
    };
  } catch (error) {
    console.error("Error en registerUserVisit:", error);
    return { success: false, error: "Error registrando la visita" };
  }
}
