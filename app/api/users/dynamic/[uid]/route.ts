import { NextResponse } from "next/server";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/firebase";

export async function GET(request: Request, props: { params: Promise<{ uid: string }> }) {
  const params = await props.params;
  try {
    const { uid } = params;

    if (!uid) {
      return NextResponse.json({ error: "UID is required" }, { status: 400 });
    }

    // Consultar Firebase usando el UID
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("uid", "==", uid));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userDoc = snapshot.docs[0];
    const userData = userDoc.data();

    // Redirigir directamente al perfil del usuario basado en el nombre de usuario
    const username = userData.user_name;
    if (username) {
      return NextResponse.redirect(`https://econecta.io/${username}`, 307); // Redirección temporal
    } else {
      return NextResponse.json({ error: "Username not found" }, { status: 404 });
    }
  } catch (error) {
    console.error("Error fetching username:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
