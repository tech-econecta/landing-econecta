"use server";

import { getDoc, getDocs } from "firebase/firestore";

import { db } from "@/firebase";
import { query, where } from "firebase/firestore";

import { collection } from "firebase/firestore";
import { DocumentReference } from "firebase-admin/firestore";

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

    if (snapshot.empty) {
      return {
        error: "User not found",
      };
    }

    const data = snapshot.docs[0].data();
    const empresaRef = data.empresa_ref as DocumentReference;
    //TODO: Cursor PROMPT Fix error
    //@ts-ignore
    const empresaSnapshot = await getDoc(empresaRef);
    const empresaData = empresaSnapshot.data();
    return { ...data, empresa: empresaData };
  } catch (error) {
    console.error("Error fetching user data:", error);
    return {
      error: "Internal server error",
    };
  }
}
