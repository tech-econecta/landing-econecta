"use server";

import { NextRequest, NextResponse } from "next/server";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/firebase";

export async function GET(
  request: NextRequest, 
  context: { params: Promise<{ username: string }> }
) {
  // Resolver la promesa de params
  const { username } = await context.params;

  try {
    if (!username) {
      return NextResponse.json(
        { error: "Se requiere nombre de usuario" }, 
        { status: 400 }
      );
    }

    const usersRef = collection(db, "users");
    const q = query(usersRef, where("user_name", "==", username));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return NextResponse.json(
        { error: "Usuario no encontrado" }, 
        { status: 404 }
      );
    }

    // Obtener todos los datos del documento del usuario
    const userDoc = snapshot.docs[0];
    const userData = userDoc.data();

    return NextResponse.json(userData, { status: 200 });
    
  } catch (error) {
    console.error("Error al obtener datos del usuario:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" }, 
      { status: 500 }
    );
  }
}

