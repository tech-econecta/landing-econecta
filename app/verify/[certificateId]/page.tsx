import React from "react";
import { Metadata } from "next";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase";
import Link from "next/link";

interface VerifyPageProps {
  params: Promise<{ certificateId: string }>;
}

export const dynamic = "force-dynamic";

export async function generateMetadata(
  props: VerifyPageProps
): Promise<Metadata> {
  const { certificateId } = await props.params;
  return {
    title: `Verificación Oficial | ${certificateId} - Econecta Trust`,
    description: "Portal de validación oficial de firma digital e identidad acreditada en Econecta.",
    robots: {
      index: false, // Por seguridad y privacidad de los certificados
      follow: false,
    },
  };
}

// Función para obtener los datos del certificado desde Firestore
async function getCertificateData(certificateId: string) {
  try {
    const decodedId = decodeURIComponent(certificateId);

    // Intento 1: Colección específica de certificados
    try {
      const certDoc = await getDoc(doc(db, "certificates", decodedId));
      if (certDoc.exists()) {
        return {
          certificate: certDoc.data(),
          source: "certificates_collection",
        };
      }
    } catch {
      // Continuar con fallback
    }

    // Intento 2: Buscar en la colección users dentro de perfil.buttons
    const usersRef = collection(db, "users");
    const snapshot = await getDocs(usersRef);

    for (const userDoc of snapshot.docs) {
      const userData = userDoc.data();
      const buttons = userData?.perfil?.buttons || [];
      for (const btn of buttons) {
        if (
          btn.verified_signature?.certificate_id === decodedId ||
          btn.verified_signature?.certificate_id?.toLowerCase() === decodedId.toLowerCase()
        ) {
          return {
            certificate: btn.verified_signature,
            username: userData.user_name || userDoc.id,
            userProfile: userData.perfil,
            source: "user_profile",
          };
        }
      }
    }

    return null;
  } catch (error) {
    console.error("Error al obtener certificado:", error);
    return null;
  }
}

// Función auxiliar para enmascarar documento
function maskDocumentNumber(docNum: string): string {
  if (!docNum || docNum.length <= 4) return docNum;
  const start = docNum.substring(0, Math.min(3, Math.floor(docNum.length / 3)));
  const end = docNum.slice(-3);
  return `${start}.***.${end}`;
}

export default async function VerifyPage(props: VerifyPageProps) {
  const { certificateId } = await props.params;
  const decodedId = decodeURIComponent(certificateId);

  const result = await getCertificateData(decodedId);

  if (!result || !result.certificate) {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center justify-center p-4 font-sans">
        <div className="max-w-md w-full rounded-3xl bg-slate-800/90 border border-slate-700 p-8 text-center shadow-2xl space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 flex items-center justify-center mx-auto">
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-white">Certificado No Encontrado</h2>
          <p className="text-xs text-slate-400">
            El identificador <code className="text-red-400 bg-slate-900 px-2 py-0.5 rounded font-mono">{decodedId}</code> no corresponde a un certificado activo o ha sido revocado.
          </p>
          <div className="pt-4">
            <Link
              href="/"
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-white text-xs font-semibold transition-all no-underline"
            >
              Ir al Inicio de Econecta
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const cert = result.certificate;
  const username = (result as any).username;
  const isMasked = cert.mask_id_number !== false;
  const displayedDocNumber = isMasked && cert.id_document_number
    ? maskDocumentNumber(cert.id_document_number)
    : cert.id_document_number;

  const formattedDate = cert.issue_date
    ? new Date(cert.issue_date).toLocaleDateString("es-ES", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "Fecha no especificada";

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center py-10 px-4 font-sans">
      {/* Fondo con resplandor esmeralda */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-lg space-y-6">
        {/* Logo superior */}
        <div className="flex items-center justify-center gap-2 mb-2">
          <img src="/Iso2.png" alt="Econecta Logo" className="h-8 w-auto" />
          <span className="font-bold text-base tracking-wide text-white">
            ECONECTA <span className="text-emerald-400 font-normal">TRUST</span>
          </span>
        </div>

        {/* Tarjeta Principal del Certificado */}
        <div className="rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl overflow-hidden backdrop-blur-xl">
          {/* Header de Estado Verificado */}
          <div className="bg-gradient-to-r from-emerald-700 via-emerald-600 to-teal-700 p-6 text-white text-center relative">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 shadow-lg mb-3">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/20 backdrop-blur-md text-emerald-100 mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
              DOCUMENTO Y FIRMA AUTÉNTICA
            </div>
            <h1 className="text-2xl font-black text-white m-0 tracking-tight">
              Certificado de Identidad Válido
            </h1>
            <p className="text-xs text-emerald-100/90 mt-1 mb-0">
              Validado por la infraestructura de seguridad de Econecta Platform
            </p>
          </div>

          {/* Información del Titular y Documentos */}
          <div className="p-6 space-y-5">
            {/* Titular */}
            <div className="rounded-2xl bg-slate-800/60 border border-slate-700/60 p-4 space-y-3">
              <div>
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">
                  Titular Acreditado
                </span>
                <h2 className="text-lg font-bold text-white m-0">
                  {cert.full_legal_name || "Titular Oficial"}
                </h2>
                {cert.professional_title && (
                  <p className="text-xs font-medium text-slate-300 mt-0.5 mb-0">
                    {cert.professional_title}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-700/50 text-xs">
                <div className="bg-slate-900/60 p-2.5 rounded-xl">
                  <span className="text-[10px] text-slate-400 font-medium block uppercase">
                    {cert.id_document_type || "Documento"}:
                  </span>
                  <span className="font-mono font-semibold text-white mt-0.5 block">
                    {displayedDocNumber || "Registrado"}
                  </span>
                </div>

                <div className="bg-slate-900/60 p-2.5 rounded-xl">
                  <span className="text-[10px] text-slate-400 font-medium block uppercase">
                    {cert.professional_license ? "Matrícula / Registro" : "Entidad Emisora"}:
                  </span>
                  <span className="font-semibold text-white mt-0.5 block truncate">
                    {cert.professional_license || cert.company_or_institution || cert.issuer_name || "Econecta"}
                  </span>
                </div>
              </div>
            </div>

            {/* Muestra de la Firma Autenticada */}
            {cert.signature_image_url && (
              <div className="rounded-2xl bg-slate-800/60 border border-slate-700/60 p-4 space-y-2">
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">
                  Trazo de Firma Autenticada
                </span>
                <div className="flex items-center justify-center p-4 bg-white/95 rounded-xl border border-slate-700/50 min-h-[100px] shadow-inner">
                  <img
                    src={cert.signature_image_url}
                    alt={`Firma de ${cert.full_legal_name}`}
                    className="max-h-24 max-w-full object-contain filter drop-shadow"
                  />
                </div>
              </div>
            )}

            {/* Datos Técnicos y Hash Criptográfico */}
            <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-4 space-y-2.5 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Serial del Certificado:</span>
                <code className="font-mono font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded text-xs">
                  {cert.certificate_id || decodedId}
                </code>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-400">Fecha y Hora de Emisión:</span>
                <span className="text-slate-200 font-medium">{formattedDate}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-400">Estado de Integridad:</span>
                <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                  Activo e Inmutable
                </span>
              </div>

              {cert.security_hash && (
                <div className="pt-2 border-t border-slate-800">
                  <span className="text-[10px] text-slate-400 block uppercase mb-1">
                    Huella Criptográfica (SHA-256):
                  </span>
                  <div className="bg-slate-950 p-2 rounded-lg font-mono text-[10px] text-emerald-400 truncate select-all">
                    {cert.security_hash}
                  </div>
                </div>
              )}
            </div>

            {/* Enlace al perfil oficial */}
            {username && (
              <div className="pt-2">
                <Link
                  href={`/${username}`}
                  className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-900/30 transition-all no-underline text-center active:scale-[0.98]"
                >
                  <span>Ver Perfil Oficial en Econecta</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Footer institucional */}
        <p className="text-center text-[11px] text-slate-500">
          Servicio de Verificación de Identidad de Econecta • © {new Date().getFullYear()} Econecta
        </p>
      </div>
    </main>
  );
}
