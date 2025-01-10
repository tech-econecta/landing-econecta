import { NextResponse } from "next/server";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";
import { db } from "@/firebase";

export async function POST(request: Request, props: { params: Promise<{ username: string }> }) {
  const params = await props.params;
  const { username } = params;

  try {
    const body = await request.json();

    const usersRef = collection(db, "users");
    const q = query(usersRef, where("user_name", "==", username));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    const userDoc = snapshot.docs[0];
    const registrosRef = collection(userDoc.ref, "registros");

    // Convertir body a un array de objetos con nombre del campo y contenido
    const respuesta = Object.entries(body).map(([key, value]) => ({ campo: key, contenido: value }));

    // Utilizamos addDoc para agregar un nuevo documento
    await addDoc(registrosRef, {
      respuesta,
      date: new Date().toISOString(),
      ip: request.headers.get("x-forwarded-for") || "Unknown",
    });

    return NextResponse.json({ message: "Registro guardado exitosamente" });
  } catch (error) {
    console.error("Error al guardar el registro:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
