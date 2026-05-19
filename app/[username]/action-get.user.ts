"use server";

import { DocumentData, getDoc, getDocs, doc } from "firebase/firestore";

import { db } from "@/firebase";
import { query, where } from "firebase/firestore";

import { collection, DocumentReference } from "firebase/firestore";

interface GetUserData {
  user_name?: string;
  perfil?: Perfil;
  captador?: Captador;
  referencia?: DocumentReference<DocumentData, DocumentData>;
  empresa?: Empresa | undefined;
  redirect?: {
    enabled: boolean;
    url: string;
    updated_at?: any;
    updated_by?: string;
  };
  accessMode?: 'public' | 'private';
  docId?: string;
  resolvedBy?: 'id' | 'username';
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

    let data: DocumentData | undefined;
    let docId: string | undefined;
    let referencia: DocumentReference<DocumentData, DocumentData> | undefined;
    let resolvedBy: 'id' | 'username' = 'username';

    // Intento 0: búsqueda directa por Document ID (para enlaces privados)
    try {
      const directDoc = await getDoc(doc(db, "users", decodedUsername));
      if (directDoc.exists()) {
        data = directDoc.data();
        docId = directDoc.id;
        referencia = directDoc.ref;
        resolvedBy = 'id';
      }
    } catch (e) {
      // ID inválido para Firestore, continuamos con búsqueda por username
    }

    // Si no se encontró por ID, buscar por username
    if (!data) {
      // Intento 1: match exacto
      let q = query(usersRef, where("user_name", "==", decodedUsername));
      let snapshot = await getDocs(q);

      // Intento 2: primera letra mayúscula (ej: keeppz -> Keeppz)
      if (snapshot.empty) {
        const capitalizedUsername = decodedUsername.charAt(0).toUpperCase() + decodedUsername.slice(1);
        q = query(usersRef, where("user_name", "==", capitalizedUsername));
        snapshot = await getDocs(q);
      }

      // Intento 3: todo minúscula (ej: Keeppz -> keeppz)
      if (snapshot.empty) {
        const lowercasedUsername = decodedUsername.toLowerCase();
        q = query(usersRef, where("user_name", "==", lowercasedUsername));
        snapshot = await getDocs(q);
      }

      if (snapshot.empty) {
        return {
          error: "User not found",
        };
      }

      data = snapshot.docs[0].data();
      docId = snapshot.docs[0].id;
      referencia = snapshot.docs[0].ref;
      resolvedBy = 'username';
    }

    let empresaData: Empresa | undefined = undefined;
    if (data.empresa_ref) {
      try {
        // Si es un string, convertirlo a DocumentReference
        const empresaRef =
          typeof data.empresa_ref === "string"
            ? doc(db, "empresas", data.empresa_ref.split("/")[1])
            : data.empresa_ref;

        const empresaSnapshot = await getDoc(empresaRef);
        if (empresaSnapshot.exists()) {
          empresaData = empresaSnapshot.data() as Empresa;
        }
      } catch (error) {
        console.error("Error al obtener datos de la empresa:", error);
      }
    }
    return {
      ...data,
      referencia,
      empresa: empresaData,
      accessMode: data.accessMode || 'public',
      docId,
      resolvedBy,
    };
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
  isMandatory?: boolean;
};

type Slide = {
  image?: string;
  url: string;
  video?: string;
};

export type Empresa = {
  ODOO: {
    db: string;
    password: string;
    stage_id: number;
    type: string;
    url: string;
    username: string;
  };
  prefijo: string;
};

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
  redirect?: {
    enabled: boolean;
    url: string;
    updated_at?: any;
    updated_by?: string;
  };
  accessMode?: 'public' | 'private';
  docId?: string;
  resolvedBy?: 'id' | 'username';
};
