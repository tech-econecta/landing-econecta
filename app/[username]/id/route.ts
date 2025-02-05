import { NextRequest, NextResponse } from "next/server";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/firebase";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ username: string }> }
) {
  // Primero await para resolver la promesa de params
  const { username } = await context.params;

  try {
    if (!username) {
      return NextResponse.json(
        { error: "Username is required" },
        { status: 400 }
      );
    }

    const usersRef = collection(db, "users");
    const q = query(usersRef, where("user_name", "==", username));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userDoc = snapshot.docs[0];
    const userData = userDoc.data();

    const uid = userData.uid;
    if (!uid) {
      return NextResponse.json(
        { error: "UID not found for this user" },
        { status: 404 }
      );
    }

    const url = `https://econecta.io/api/users/dynamic/${uid}`;
    return NextResponse.json({ url }, { status: 200 });
  } catch (error) {
    console.error("Error fetching user ID by username:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
