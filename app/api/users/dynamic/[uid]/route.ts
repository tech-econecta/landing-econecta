import { NextResponse } from "next/server";
import { collection, doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase";

export async function GET(
  request: Request,
  props: { params: Promise<{ uid: string }> }
) {
  const params = await props.params;
  try {
    const { uid } = params;

    if (!uid) {
      return NextResponse.json({ error: "UID is required" }, { status: 400 });
    }

    // Consultar Firebase usando el UID como ID del documento
    const usersRef = collection(db, "users");
    const userDocRef = doc(db, "users", uid);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userData = userDoc.data();

    // Redirigir directamente al perfil del usuario basado en el nombre de usuario
    const username = userData.user_name;
    if (username) {
      return NextResponse.redirect(`https://econecta.io/${username}`, 307); // Redirección temporal
    } else {
      return NextResponse.json(
        { error: "Username not found" },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error("Error fetching username:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
