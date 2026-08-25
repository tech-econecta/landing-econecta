"use client";

import React, { useEffect, useState } from "react";
import QRCode from "qrcode";

export type IdDocumentType = "CI" | "DNI" | "PASSPORT" | "RIF" | "RUT" | "OTHER";

export interface VerifiedSignatureContent {
  type?: "verified_signature";
  certificate_id: string;
  full_legal_name: string;
  id_document_type: IdDocumentType;
  id_document_number: string;
  mask_id_number?: boolean;
  professional_title?: string;
  professional_license?: string;
  company_or_institution?: string;
  signature_image_url: string;
  signature_type?: "drawn" | "uploaded" | "digital_seal";
  issue_date: string;
  expiry_date?: string;
  status: "verified" | "pending" | "expired" | "revoked";
  issuer_name: string;
  security_hash?: string;
  notes?: string;
}

interface VerifiedSignatureModalProps {
  content: VerifiedSignatureContent | null | undefined;
  open: boolean;
  onClose: () => void;
}

// Iconos SVG en línea de alta calidad
const Icons = {
  ShieldCheck: ({ className = "w-6 h-6" }: { className?: string }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  ),
  CheckCircle2: ({ className = "w-4 h-4" }: { className?: string }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  ),
  Lock: ({ className = "w-4 h-4" }: { className?: string }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  ),
  Eye: ({ className = "w-4 h-4" }: { className?: string }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  EyeOff: ({ className = "w-4 h-4" }: { className?: string }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49" />
      <path d="M14.084 14.158a3 3 0 0 1-4.242-4.242" />
      <path d="M17.479 17.499A10.75 10.75 0 0 1 2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 2.876-4.133" />
      <line x1="2" x2="22" y1="2" y2="22" />
    </svg>
  ),
  Copy: ({ className = "w-3.5 h-3.5" }: { className?: string }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
    </svg>
  ),
  Check: ({ className = "w-3.5 h-3.5" }: { className?: string }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  ),
  ExternalLink: ({ className = "w-4 h-4" }: { className?: string }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M15 3h6v6" />
      <path d="M10 14 21 3" />
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    </svg>
  ),
  X: ({ className = "w-5 h-5" }: { className?: string }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
};

// Función auxiliar para enmascarar documento
function maskDocumentNumber(docNum: string): string {
  if (!docNum || docNum.length <= 4) return docNum;
  const start = docNum.substring(0, Math.min(3, Math.floor(docNum.length / 3)));
  const end = docNum.slice(-3);
  return `${start}.***.${end}`;
}

export const VerifiedSignatureModal: React.FC<VerifiedSignatureModalProps> = ({
  content,
  open,
  onClose,
}) => {
  const [isMasked, setIsMasked] = useState(true);
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Inicializar estado de enmascaramiento según configuración del certificado
  useEffect(() => {
    if (content) {
      setIsMasked(content.mask_id_number !== false);
    }
  }, [content]);

  // Generar Código QR de verificación
  useEffect(() => {
    if (!open || !content) return;

    const certId = content.certificate_id || "ECO-SIG-VERIFIED";
    const origin = typeof window !== "undefined" ? window.location.origin : "https://econecta.io";
    const verificationUrl = `${origin}/verify/${certId}`;

    QRCode.toDataURL(verificationUrl, {
      width: 160,
      margin: 1,
      color: {
        dark: "#0f172a",
        light: "#ffffff",
      },
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error("Error generating QR:", err));
  }, [open, content]);

  // Bloquear scroll de fondo
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open || !content) return null;

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const certId = content.certificate_id || "ECO-SIG-2026-A1";
  const origin = typeof window !== "undefined" ? window.location.origin : "https://econecta.io";
  const verificationUrl = `${origin}/verify/${certId}`;

  const displayedDocNumber =
    isMasked && content.id_document_number
      ? maskDocumentNumber(content.id_document_number)
      : content.id_document_number;

  const formattedDate = content.issue_date
    ? new Date(content.issue_date).toLocaleDateString("es-ES", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Fecha no disponible";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        backgroundColor: "rgba(15, 23, 42, 0.75)",
        backdropFilter: "blur(8px)",
      }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white text-slate-900 shadow-2xl transition-all border border-slate-200/80 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
        style={{
          boxShadow: "0 25px 50px -12px rgba(16, 185, 129, 0.25), 0 0 0 1px rgba(16, 185, 129, 0.1)",
        }}
      >
        {/* Cabecera de Seguridad */}
        <div className="relative bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 p-5 text-white">
          {/* Patrón de fondo geométrico */}
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage:
                "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
              backgroundSize: "16px 16px",
            }}
          />

          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 shadow-inner">
                <Icons.ShieldCheck className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-semibold uppercase tracking-widest text-emerald-200">
                    Sello de Confianza Oficial
                  </span>
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-300"></span>
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white m-0 leading-tight">
                  Identidad y Firma Verificada
                </h3>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-1.5 text-white/80 hover:bg-white/20 hover:text-white transition-colors border-0 bg-transparent cursor-pointer"
              title="Cerrar"
            >
              <Icons.X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Cuerpo del Modal con Scroll */}
        <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto bg-slate-50/50">
          {/* Ficha del Titular */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-semibold text-emerald-600 uppercase tracking-wider block">
                  Titular Acreditado
                </span>
                <h4 className="text-base font-bold text-slate-900 m-0">
                  {content.full_legal_name || "Nombre no registrado"}
                </h4>
                {content.professional_title && (
                  <p className="text-xs font-medium text-slate-600 mt-0.5 mb-0">
                    {content.professional_title}
                  </p>
                )}
              </div>

              <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <Icons.CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Verificado</span>
              </div>
            </div>

            {/* Datos de Documento y Matrícula */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs">
              <div className="bg-slate-50 p-2 rounded-xl">
                <span className="text-[10px] text-slate-400 font-medium block uppercase">
                  {content.id_document_type || "Documento"}:
                </span>
                <div className="flex items-center justify-between gap-1 mt-0.5">
                  <span className="font-mono font-semibold text-slate-800">
                    {displayedDocNumber || "No especificado"}
                  </span>
                  {content.id_document_number && (
                    <button
                      type="button"
                      onClick={() => setIsMasked(!isMasked)}
                      className="text-slate-400 hover:text-slate-700 p-0.5 border-0 bg-transparent cursor-pointer"
                      title={isMasked ? "Mostrar número" : "Ocultar número"}
                    >
                      {isMasked ? (
                        <Icons.Eye className="w-3.5 h-3.5" />
                      ) : (
                        <Icons.EyeOff className="w-3.5 h-3.5" />
                      )}
                    </button>
                  )}
                </div>
              </div>

              {content.professional_license ? (
                <div className="bg-slate-50 p-2 rounded-xl">
                  <span className="text-[10px] text-slate-400 font-medium block uppercase">
                    Matrícula / Registro:
                  </span>
                  <span className="font-semibold text-slate-800 block truncate mt-0.5">
                    {content.professional_license}
                  </span>
                </div>
              ) : (
                <div className="bg-slate-50 p-2 rounded-xl">
                  <span className="text-[10px] text-slate-400 font-medium block uppercase">
                    Entidad:
                  </span>
                  <span className="font-semibold text-slate-800 block truncate mt-0.5">
                    {content.company_or_institution || content.issuer_name || "Econecta"}
                  </span>
                </div>
              )}
            </div>

            {content.company_or_institution && content.professional_license && (
              <div className="text-[11px] text-slate-500 bg-slate-50 px-2.5 py-1.5 rounded-lg flex items-center gap-1.5">
                <span className="font-medium text-slate-700">Entidad / Empresa:</span>
                <span className="truncate">{content.company_or_institution}</span>
              </div>
            )}
          </div>

          {/* Área de Visualización de Firma Digitalizada con Marca de Agua */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Icons.Lock className="w-3.5 h-3.5 text-emerald-600" />
                Trazo de Firma Auténtica
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                SEGURIDAD ECONECTA
              </span>
            </div>

            <div
              className="relative flex items-center justify-center p-4 rounded-xl border border-dashed border-emerald-300/80 bg-emerald-50/20 overflow-hidden min-h-[120px]"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(45deg, rgba(16, 185, 129, 0.03) 0, rgba(16, 185, 129, 0.03) 10px, transparent 0, transparent 20px)",
              }}
            >
              {/* Marca de agua holográfica en el fondo */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5 rotate-[-12deg] select-none text-center">
                <span className="text-3xl font-black tracking-widest text-emerald-900 uppercase">
                  VERIFIED • ECONECTA • VALIDATED
                </span>
              </div>

              {content.signature_image_url ? (
                <img
                  src={content.signature_image_url}
                  alt={`Firma de ${content.full_legal_name}`}
                  className="relative z-10 max-h-24 max-w-full object-contain filter drop-shadow-md"
                />
              ) : (
                <div className="text-xs text-slate-400 font-medium text-center">
                  Trazo de firma registrado en bóveda digital
                </div>
              )}
            </div>
          </div>

          {/* Bloque Criptográfico y Código QR de Validación */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-3">
            <div className="flex items-center gap-3">
              {/* Código QR Escaneable */}
              {qrDataUrl ? (
                <div className="flex-shrink-0 p-1.5 bg-white rounded-xl border border-slate-200 shadow-sm">
                  <img
                    src={qrDataUrl}
                    alt="QR de Validación"
                    className="w-20 h-20 block"
                  />
                </div>
              ) : (
                <div className="w-20 h-20 rounded-xl bg-slate-100 animate-pulse flex-shrink-0" />
              )}

              <div className="space-y-1.5 flex-1 min-w-0 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 font-medium uppercase block">
                    Serial de Certificado:
                  </span>
                  <div className="flex items-center gap-1.5">
                    <code className="font-mono text-[11px] font-bold text-slate-900 bg-slate-100 px-1.5 py-0.5 rounded">
                      {certId}
                    </code>
                    <button
                      type="button"
                      onClick={() => handleCopy(certId, "certId")}
                      className="p-1 text-slate-400 hover:text-slate-800 transition-colors border-0 bg-transparent cursor-pointer"
                      title="Copiar Serial"
                    >
                      {copiedField === "certId" ? (
                        <Icons.Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Icons.Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 font-medium uppercase block">
                    Fecha de Validación:
                  </span>
                  <span className="text-[11px] text-slate-700 font-medium">
                    {formattedDate}
                  </span>
                </div>
              </div>
            </div>

            {/* Hash SHA-256 de Integridad */}
            {content.security_hash && (
              <div className="pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between text-[10px] text-slate-400 uppercase font-medium mb-1">
                  <span>Hash SHA-256 de Integridad:</span>
                  <button
                    type="button"
                    onClick={() => handleCopy(content.security_hash!, "hash")}
                    className="text-emerald-600 hover:text-emerald-800 font-semibold lowercase flex items-center gap-1 border-0 bg-transparent cursor-pointer"
                  >
                    {copiedField === "hash" ? "¡Copiado!" : "Copiar Hash"}
                  </button>
                </div>
                <div className="bg-slate-900 text-emerald-400 font-mono text-[10px] p-2 rounded-xl truncate select-all">
                  {content.security_hash}
                </div>
              </div>
            )}

            {/* Botón de Enlace a Validación Central */}
            <a
              href={verificationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-bold text-xs shadow-md transition-all no-underline text-center active:scale-[0.98]"
            >
              <span>Validar en Servidor Central</span>
              <Icons.ExternalLink className="w-4 h-4 text-white" />
            </a>
          </div>

          {/* Nota Legal al Pie */}
          <p className="text-[10px] text-slate-400 text-center m-0 px-2 leading-relaxed">
            {content.notes ||
              "Certificado digital emitido con respaldo criptográfico en la plataforma Econecta Security Trust."}
          </p>
        </div>
      </div>
    </div>
  );
};
