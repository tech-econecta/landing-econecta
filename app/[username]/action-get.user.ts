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
    const decodedUsername = decodeURIComponent(username);
    const q = query(usersRef, where("user_name", "==", decodedUsername));
    const snapshot = await getDocs(q);

    console.log({ snapshot: snapshot.docs });
    if (snapshot.empty) {
      return {
        error: "User not found",
      };
    }

    return snapshot.docs[0].data();
  } catch (error) {
    console.error("Error fetching user data:", error);
    return {
      error: "Internal server error",
    };
  }
}
