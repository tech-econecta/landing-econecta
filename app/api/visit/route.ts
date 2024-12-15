import { NextResponse } from "next/server";
import axios from "axios";
import { collection, query, where, getDocs, addDoc, Timestamp } from "firebase/firestore";
import { db } from "@/firebase";

const getGeoInfo = async (ip: string) => {
  try {
    const response = await axios.get(`https://ipinfo.io/${ip}/json?token=3f7e25988623a6`);
    return {
      country: response.data.country || "Desconocido",
      region: response.data.region || "Desconocido",
      city: response.data.city || "Desconocido",
    };
  } catch (error) {
    console.error("Error obteniendo información geográfica:", error);
    return { country: "Desconocido", region: "Desconocido", city: "Desconocido" };
  }
};

const getClientIp = (req: Request): string => {
  const forwarded = req.headers.get("x-forwarded-for");
  const ip = forwarded || "127.0.0.1"; // Default IP in local environment
  return ip.split(",")[0].trim();
};

export async function POST(request: Request) {
  try {
    const { username } = await request.json();
    const ip = getClientIp(request);
    const geoInfo = await getGeoInfo(ip);

    // Verificar usuario
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("user_name", "==", username));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      console.error(`Usuario no encontrado al registrar visita: ${username}`);
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    // Referencia del usuario y agregar estadística
    const userDoc = snapshot.docs[0];
    await addDoc(collection(userDoc.ref, "statics"), {
      date: Timestamp.now(),
      ip: ip || "Desconocido",
      country: geoInfo.country,
      region: geoInfo.region,
      city: geoInfo.city,
    });

    return NextResponse.json({ message: "Visita registrada correctamente" });
  } catch (error) {
    console.error("Error registrando la visita:", error);
    return NextResponse.json({ error: "Error registrando la visita" }, { status: 500 });
  }
}
