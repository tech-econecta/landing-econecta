import { NextResponse } from "next/server";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/firebase";

export async function GET(request: Request, props: { params: Promise<{ username: string }> }) {
  const params = await props.params;
  try {
    if (!params || !params.username) {
      console.error("Route parameters are missing");
      return NextResponse.json({ error: "Invalid parameters" }, { status: 400 });
    }

    const { username } = params;
    // console.log("Received username in route.ts:", username);

    const usersRef = collection(db, "users");
    const q = query(usersRef, where("user_name", "==", username));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      // console.log(`No user found for username: ${username}`);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    let userData: any;
    snapshot.forEach((doc) => {
      const data = doc.data();
      userData = {
        perfil: data.perfil || {}, // Asegurarse de que perfil existe
        captador: data.captador || null, // Asegurarse de que captador existe
      };
    });

    // console.log("User data retrieved from Firestore:", userData);

    return NextResponse.json(userData);
  } catch (error) {
    console.error("Error fetching user data:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
