"use server";

import { getDocs } from "firebase/firestore";

import { db } from "@/firebase";
import { query, where } from "firebase/firestore";

import { collection } from "firebase/firestore";

export async function getUser(username: string) {
  if (!username) {
    return {
      error: "Username is required",
    };
  }
  try {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("user_name", "==", username));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return {
        error: "User not found",
      };
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

    return userData;
  } catch (error) {
    console.error("Error fetching user data:", error);
    return {
      error: "Internal server error",
    };
  }
}
