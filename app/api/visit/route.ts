import { NextResponse } from "next/server";
import axios from "axios";
import { collection, query, where, getDocs, addDoc, Timestamp } from "firebase/firestore";
import { db } from "@/firebase";
import { getClientIp as getIP } from 'request-ip';

const getGeoInfo = async (ip: string) => {
  try {
    const response = await axios.get(`http://ip-api.com/json/${ip}`);
    return {
      country: response.data.country || "Desconocido",
      region: response.data.regionName || "Desconocido",
      city: response.data.city || "Desconocido",
    };
  } catch (error) {
    console.error("Error obteniendo información geográfica:", error);
    return { country: "Desconocido", region: "Desconocido", city: "Desconocido" };
  }
};

const getClientIp = (req: Request): string => {
  // Convertir los headers de Request a un objeto simple
  const headers: { [key: string]: string } = {};
  req.headers.forEach((value, key) => {
    headers[key] = value;
  });

  // Crear un objeto similar a req para request-ip
  const reqObject = {
    headers,
    connection: { remoteAddress: headers['x-real-ip'] || '0.0.0.0' },
    socket: { remoteAddress: headers['x-real-ip'] || '0.0.0.0' }
  };

  const ip = getIP(reqObject as any) || '0.0.0.0';
  return ip;
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

    return NextResponse.json({ 
      message: "Visita registrada correctamente",
      ip,
      geoInfo
    });
  } catch (error) {
    console.error("Error registrando la visita:", error);
    return NextResponse.json({ error: "Error registrando la visita" }, { status: 500 });
  }
}
