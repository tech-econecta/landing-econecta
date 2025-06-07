"use server";

import { DocumentData, getDoc, getDocs } from "firebase/firestore";

import { db } from "@/firebase";
import { query, where } from "firebase/firestore";

import { collection, DocumentReference } from "firebase/firestore";


interface GetUserData {
  perfil?: Perfil;
  captador?: Captador;
  referencia?: DocumentReference<DocumentData, DocumentData>;
    empresa?: Empresa | undefined;
    error?: string;
}

export async function getUser(username: string): Promise<GetUserData> {
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
    const referencia =snapshot.docs[0].ref
    const empresaRef = data.empresa_ref as DocumentReference;
    
    
    let empresaData : Empresa | undefined = undefined 
    if (empresaRef) {
      const empresaSnapshot = await getDoc(empresaRef);
      empresaData = empresaSnapshot.data() as Empresa;
    }
    return { ...data, referencia, empresa: empresaData };
  } catch (error) {
    console.error("Error fetching user data:", error);
    return {
      error: "Internal server error",
    };
  }
}



type Button = {
  label_color: string;
  color: string;
  url: string;
  border_radius: number;
  path_icon: string;
  width: number;
  height: number;
  label: string;
};

type Captador = {
  visible?: boolean;
  campos: {
    nombre: string;
    label: string;
    placeholder?: string;
    type: "input" | "DatePicker" | "InputNumber" | "Switch" | "Radio";
    odoo_field_key?: string;
  }[];
  backgroundColor?: string;
  submitColor?: string;
  submitTextColor?: string;
  title?: string;
  titleColor?: string;
};

type Slide = {
  image?: string;
  url: string;
  video?: string;
};

export type Empresa = {
    ODOO: {
      db: string,
      password: string,
      stage_id: number,
      type: string,
      url: string,
      username: string
    },
    prefijo: string
}

export type Perfil = {
  background_path: string;
  background_color: string;
  brandLogoPath: string;
  brandLogo: boolean;
  customFontUrl: string;
  text_color: string;
  title: string;
  title_size: number;
  subtitle: string;
  subtitle_size: number;
  imagen: string;
  image_size: number;
  buttons: Button[];
  slide_activate: boolean;
  slides: Slide[];
  card: {
    subtitle: string;
    title: string;
    Button1TextColor: string;
    Button2Color: string;
    Button1Color: string;
    cardColor: string;
    Button2TextColor: string;
    textColor: string;
  };
};

export type UserData = {
  perfil: Perfil;
  captador?: Captador;
  empresa?: Empresa;
  referencia?: any;
};