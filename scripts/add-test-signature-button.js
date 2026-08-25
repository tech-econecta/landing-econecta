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

async function addVerifiedSignatureToTestUser() {
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

  // Icono del botón de Firma Verificada
  const buttonIconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
    <rect width="100" height="100" rx="20" fill="#298A5D"/>
    <path d="M50 18L76 28V48C76 65 65 79 50 84C35 79 24 65 24 48V28L50 18Z" fill="white" fill-opacity="0.25" stroke="white" stroke-width="4" stroke-linejoin="round"/>
    <path d="M42 50L48 56L60 42" stroke="white" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M34 68C42 63 58 63 66 68" stroke="white" stroke-width="4" stroke-linecap="round"/>
  </svg>`;
  const pathIconUrl = `data:image/svg+xml;utf8,${encodeURIComponent(buttonIconSvg)}`;

  // Calcular Hash SHA-256 de Integridad
  const rawPayload = `${certId}|Alexis Méndez|CI:V-14.892.341|${issueDate}|${uid}`;
  const securityHash = crypto.createHash("sha256").update(rawPayload).digest("hex");

  const verifiedSignatureData = {
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
  };

  const newVerifiedButton = {
    label: "Firma Verificada",
    path_icon: pathIconUrl,
    color: "transparent",
    label_color: "#298A5D",
    border_radius: 10,
    action: "",
    url: "",
    documents: [],
    action_type: "verified_signature",
    verified_signature: verifiedSignatureData,
  };

  // Filtrar si ya existía un botón de firma para reemplazarlo limpiamente, o ponerlo de primero
  const currentButtons = (userData.perfil?.buttons || []).filter(
    (b) => b.action_type !== "verified_signature" && b.label !== "Firma Verificada"
  );

  const updatedButtons = [newVerifiedButton, ...currentButtons];

  // Actualizar perfil de usuario
  await userRef.update({
    "perfil.buttons": updatedButtons,
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

  console.log("✅ Botón de Firma Verificada configurado exitosamente para:", userData.user_name);
  console.log("🔗 Perfil público: https://econecta.io/" + userData.user_name);
  console.log("🛡️ Página de verificación: https://econecta.io/verify/" + certId);
}

addVerifiedSignatureToTestUser().catch(console.error);
