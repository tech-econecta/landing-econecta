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

export interface VisitRegistrationResult {
  success: boolean;
  error?: string;
  ip?: string;
  geoInfo?: VisitGeoInfo;
  venezuelaTime?: Date;
}

/**
 * Registra una visita para un usuario de forma case-insensitive
 */
export async function registerUserVisit(
  username: string, 
  ip: string = "Desconocido", 
  geoInfo: VisitGeoInfo = {
    country: "Venezuela",
    region: "Desconocido",
    city: "Desconocido",
    isLocal: false
  }
): Promise<VisitRegistrationResult> {
  try {
    if (!username) {
      return { success: false, error: "Username is required" };
    }

    const usersRef = collection(db, "users");
    const decodedUsername = decodeURIComponent(username);
    
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

    // Crear fecha con zona horaria de Venezuela
    const venezuelaTime = getCurrentVenezuelaTime();
    const timeDebugInfo = getTimeDebugInfo();

    // Referencia del usuario y agregar estadística
    const userDoc = snapshot.docs[0];
    await addDoc(collection(userDoc.ref, "statics"), {
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
    });

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
