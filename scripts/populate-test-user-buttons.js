const admin = require("firebase-admin");
const path = require("path");
const crypto = require("crypto");

const serviceAccount = require(path.join(__dirname, "../../app-econecta/serviceAccountKeyFirebase.json"));

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();

async function populateAllButtonsForTestUser() {
  const uid = "B8ONHnkND4Nzft8ImpuG4GeKqmb2";
  const userRef = db.collection("users").doc(uid);
  const doc = await userRef.get();

  if (!doc.exists) {
    console.error("Usuario no encontrado:", uid);
    return;
  }

  const userData = doc.data();
  const certId = "ECO-SIG-2026-BP9842";
  const issueDate = new Date().toISOString();

  // Firma elegante en SVG transparente (Trazo manuscrito estilizado de Alexis Méndez)
  const signatureSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 150" width="400" height="150">
    <path d="M 40 100 C 60 40, 80 30, 95 85 C 105 120, 115 60, 140 75 C 160 85, 170 70, 190 75 C 205 80, 215 65, 235 80 C 255 95, 240 120, 270 95 C 290 80, 310 75, 330 85 M 70 75 Q 160 65, 340 70 M 50 115 Q 180 135, 360 105" 
          fill="none" stroke="#1e3a8a" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" opacity="0.95"/>
    <path d="M 120 40 L 125 90 M 210 50 L 212 85" fill="none" stroke="#1e3a8a" stroke-width="3" stroke-linecap="round" />
  </svg>`;
  const signatureImageUrl = `data:image/svg+xml;utf8,${encodeURIComponent(signatureSvg)}`;

  const buttonIconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
    <rect width="100" height="100" rx="20" fill="#298A5D"/>
    <path d="M50 18L76 28V48C76 65 65 79 50 84C35 79 24 65 24 48V28L50 18Z" fill="white" fill-opacity="0.25" stroke="white" stroke-width="4" stroke-linejoin="round"/>
    <path d="M42 50L48 56L60 42" stroke="white" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M34 68C42 63 58 63 66 68" stroke="white" stroke-width="4" stroke-linecap="round"/>
  </svg>`;
  const pathIconUrl = `data:image/svg+xml;utf8,${encodeURIComponent(buttonIconSvg)}`;

  const rawPayload = `${certId}|Alexis Méndez|CI:V-14.892.341|${issueDate}|${uid}`;
  const securityHash = crypto.createHash("sha256").update(rawPayload).digest("hex");

  const existingButtons = userData.perfil?.buttons || [];

  // Mapear y enriquecer cada botón existente con su modal correspondiente
  const updatedButtons = [
    // 1. Botón de Firma Verificada
    {
      label: "Firma Verificada",
      path_icon: pathIconUrl,
      color: "transparent",
      label_color: "#298A5D",
      border_radius: 10,
      action: "",
      url: "",
      documents: [],
      action_type: "verified_signature",
      verified_signature: {
        type: "verified_signature",
        certificate_id: certId,
        full_legal_name: "Alexis Méndez",
        id_document_type: "CI",
        id_document_number: "V-14.892.341",
        mask_id_number: true,
        professional_title: "Oficial de Seguridad y Custodia",
        professional_license: "Reg. Seg. Bancaria BP-8492",
        company_or_institution: "Banco Plaza - División de Seguridad",
        signature_image_url: signatureImageUrl,
        signature_type: "drawn",
        issue_date: issueDate,
        status: "verified",
        issuer_name: "Econecta Security & Banco Plaza Trust",
        security_hash: securityHash,
        notes: "Identidad y firma oficial verificada por la Unidad de Seguridad Integral de Banco Plaza y la plataforma Econecta Trust.",
      },
    },

    // 2. Tipo Sanguíneo
    {
      label: "Tipo Sanguíneo",
      path_icon: existingButtons.find((b) => b.label === "Tipo Sanguíneo")?.path_icon || "https://storage.googleapis.com/somosnano-185ed.appspot.com/users/B8ONHnkND4Nzft8ImpuG4GeKqmb2/1787319786682_MAIL (12).svg",
      color: "transparent",
      label_color: "#298A5D",
      border_radius: 10,
      action: "",
      url: "",
      documents: [],
      action_type: "modal",
      modal_content: {
        type: "illnesses",
        title: "Grupo y Factor Sanguíneo",
        items: [
          "Grupo Sanguíneo: O Positivo (O+)",
          "Factor Rh: Positivo (+)",
          "Antígeno D: Presente",
          "Compatibilidad de Receptores: O+, A+, B+, AB+",
        ],
        notes: "Ficha médica registrada y validada en el Servicio Médico Ocupacional de Banco Plaza.",
      },
    },

    // 3. Alergias Críticas
    {
      label: "Alergias Críticas",
      path_icon: existingButtons.find((b) => b.label === "Alergias Críticas")?.path_icon || "https://storage.googleapis.com/somosnano-185ed.appspot.com/users/B8ONHnkND4Nzft8ImpuG4GeKqmb2/1787319843332_FB (8).svg",
      color: "transparent",
      label_color: "#298A5D",
      border_radius: 10,
      action: "",
      url: "",
      documents: [],
      action_type: "modal",
      modal_content: {
        type: "allergies",
        title: "Alergias Críticas",
        items: [
          "Penicilina y derivados beta-lactámicos (Reacción anafiláctica severa)",
          "AINEs: Aspirina e Ibuprofeno (Edema y broncoespasmo)",
          "Picaduras de abejas / avispas (Hipersensibilidad Grado II)",
        ],
        notes: "PORTADOR DE AUTOINYECTOR DE EPINEFRINA. En caso de exposición accidental o hinchazón facial/disnea, administrar antihistamínico/adrenalina y trasladar a centro asistencial de emergencia.",
      },
    },

    // 4. Enfermedades
    {
      label: "Enfermedades",
      path_icon: existingButtons.find((b) => b.label === "Enfermedades")?.path_icon || "https://storage.googleapis.com/somosnano-185ed.appspot.com/users/B8ONHnkND4Nzft8ImpuG4GeKqmb2/1787319965341_CAT (4).svg",
      color: "transparent",
      label_color: "#298A5D",
      border_radius: 10,
      action: "",
      url: "",
      documents: [],
      action_type: "modal",
      modal_content: {
        type: "illnesses",
        title: "Condiciones Médicas y Antecedentes",
        items: [
          "Hipertensión Arterial Primaria (Controlada con Losartán)",
          "Asma Bronquial Leve Intermitente (Controlada)",
          "Cirugía artroscópica de rodilla derecha (2021)",
        ],
        notes: "Último chequeo cardiológico: Noviembre 2025 (Electrocardiograma normal dentro de parámetros).",
      },
    },

    // 5. Medicación
    {
      label: "Medicación",
      path_icon: existingButtons.find((b) => b.label === "Medicación")?.path_icon || "https://storage.googleapis.com/somosnano-185ed.appspot.com/users/B8ONHnkND4Nzft8ImpuG4GeKqmb2/1787319987934_IN (1).svg",
      color: "transparent",
      label_color: "#298A5D",
      border_radius: 10,
      action: "",
      url: "",
      documents: [],
      action_type: "modal",
      modal_content: {
        type: "medication",
        title: "Medicación Habitual",
        items: [
          "Losartán Potásico 50 mg (1 comprimido V.O. cada 24h - 08:00 AM)",
          "Salbutamol Inhalador 100 mcg (2 inhalaciones SOS en crisis respiratoria)",
          "Complejo Vitamínico B (1 cápsula diaria con el almuerzo)",
        ],
        notes: "No suspender tratamiento antihipertensivo sin indicación médica del Dr. Roberto Gómez (Cardiólogo Tratante).",
      },
    },

    // 6. Contacto de Emergencia
    {
      label: "Contacto de Emergencia",
      path_icon: existingButtons.find((b) => b.label === "Contacto de Emergencia")?.path_icon || "https://storage.googleapis.com/somosnano-185ed.appspot.com/users/B8ONHnkND4Nzft8ImpuG4GeKqmb2/1787320009714_IG (12).svg",
      color: "transparent",
      label_color: "#298A5D",
      border_radius: 10,
      action: "",
      url: "",
      documents: [],
      action_type: "modal",
      modal_content: {
        type: "emergency_contact",
        title: "Contacto de Emergencia Inmediato",
        name: "María Elena de Méndez",
        phone: "+584121234567",
        relationship: "Esposa / Contacto Principal",
        notes: "Contacto de respaldo: Central de Seguridad Banco Plaza (0212-555-0100 Ext. 4022) / Supervisor de Guardia: Cap. Eduardo Rondón.",
      },
    },
  ];

  // Limpiar cualquier undefined por seguridad
  const sanitizedButtons = JSON.parse(JSON.stringify(updatedButtons));

  await userRef.update({
    "perfil.buttons": sanitizedButtons,
  });

  // Guardar en la colección global de certificados
  await db.collection("certificates").doc(certId).set({
    certificateId: certId,
    userId: uid,
    username: userData.user_name || "seguridadplz.alexismendez",
    full_legal_name: "Alexis Méndez",
    id_document_type: "CI",
    id_document_number: "V-14.892.341",
    mask_id_number: true,
    professional_title: "Oficial de Seguridad y Custodia",
    professional_license: "Reg. Seg. Bancaria BP-8492",
    company_or_institution: "Banco Plaza - División de Seguridad",
    signature_image_url: signatureImageUrl,
    signature_type: "drawn",
    issue_date: issueDate,
    status: "verified",
    issuer_name: "Econecta Security & Banco Plaza Trust",
    security_hash: securityHash,
    notes: "Identidad y firma oficial verificada por la Unidad de Seguridad Integral de Banco Plaza y la plataforma Econecta Trust.",
    created_at: issueDate,
  });

  console.log("✅ Todos los 6 botones enriquecidos exitosamente con datos de prueba reales para:", userData.user_name);
  sanitizedButtons.forEach((b, i) => {
    console.log(` ${i + 1}. [${b.label}] -> Action: ${b.action_type} | Modal: ${b.modal_content?.type || b.verified_signature?.type}`);
  });
}

populateAllButtonsForTestUser().catch(console.error);
