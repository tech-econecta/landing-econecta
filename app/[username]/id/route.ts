import { NextResponse } from "next/server";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/firebase"; // Ajusta la ruta si difiere en tu proyecto

interface Params {
  username: string;
}

export async function GET(
  request: Request,
  { params }: { params: Params }
) {
  const { username } = params;

  try {
    if (!username) {
      return NextResponse.json({ error: "Username is required" }, { status: 400 });
    }

    // Consulta la colección "users" filtrando por el campo user_name
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("user_name", "==", username));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userDoc = snapshot.docs[0];
    const userData = userDoc.data();

    // Verifica que exista el ID o UID asociado al usuario
    const uid = userData.uid;
    if (!uid) {
      return NextResponse.json({ error: "UID not found for this user" }, { status: 404 });
    }

    // Retornar la URL deseada reemplazando [id] con el uid encontrado
    const url = `https://econecta.io/api/users/dynamic/${uid}`;
    return NextResponse.json({ url }, { status: 200 });

  } catch (error) {
    console.error("Error fetching user ID by username:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
