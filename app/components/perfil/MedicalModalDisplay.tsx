"use client";

import React, { useEffect } from "react";

export type ButtonActionType = "link" | "document" | "modal";

export interface MedicalListContent {
  type: "allergies" | "illnesses" | "medication";
  title?: string;
  items: string[];
  notes?: string;
}

export interface EmergencyContactContent {
  type: "emergency_contact";
  title?: string;
  name: string;
  phone: string;
  relationship?: string;
  notes?: string;
}

export type ModalContent = MedicalListContent | EmergencyContactContent;

interface MedicalModalDisplayProps {
  content: ModalContent | null;
  open: boolean;
  onClose: () => void;
}

// Iconos SVG inline para máxima compatibilidad
const Icons = {
  AlertTriangle: ({ className = "w-6 h-6" }: { className?: string }) => (
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
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
  ShieldAlert: ({ className = "w-6 h-6" }: { className?: string }) => (
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
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  ),
  Pill: ({ className = "w-6 h-6" }: { className?: string }) => (
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
      <path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z" />
      <line x1="8.5" y1="8.5" x2="15.5" y2="15.5" />
    </svg>
  ),
  HeartPulse: ({ className = "w-6 h-6" }: { className?: string }) => (
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
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
      <path d="M3.22 12H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27" />
    </svg>
  ),
  PhoneCall: ({ className = "w-5 h-5" }: { className?: string }) => (
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
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
      <path d="M14.05 2a9 9 0 0 1 8 7.94" />
      <path d="M14.05 6A5 5 0 0 1 18 10" />
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

const MODAL_CONFIG = {
  allergies: {
    icon: Icons.AlertTriangle,
    title: "Alergias Críticas",
    iconColor: "text-red-500",
    headerBg: "bg-red-50",
    borderColor: "border-red-200",
    itemBg: "bg-red-50 border border-red-200",
    dotColor: "bg-red-500",
  },
  illnesses: {
    icon: Icons.ShieldAlert,
    title: "Enfermedades",
    iconColor: "text-amber-500",
    headerBg: "bg-amber-50",
    borderColor: "border-amber-200",
    itemBg: "bg-amber-50 border border-amber-200",
    dotColor: "bg-amber-500",
  },
  medication: {
    icon: Icons.Pill,
    title: "Medicación",
    iconColor: "text-blue-500",
    headerBg: "bg-blue-50",
    borderColor: "border-blue-200",
    itemBg: "bg-blue-50 border border-blue-200",
    dotColor: "bg-blue-500",
  },
  emergency_contact: {
    icon: Icons.HeartPulse,
    title: "Contacto de Emergencia",
    iconColor: "text-emerald-500",
    headerBg: "bg-emerald-50",
    borderColor: "border-emerald-200",
    itemBg: "bg-emerald-50 border border-emerald-200",
    dotColor: "bg-emerald-500",
  },
} as const;

export const MedicalModalDisplay: React.FC<MedicalModalDisplayProps> = ({
  content,
  open,
  onClose,
}) => {
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

  const config = MODAL_CONFIG[content.type] || MODAL_CONFIG.allergies;
  const Icon = config.icon;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.6)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-sm overflow-hidden rounded-2xl bg-white shadow-2xl transition-all"
        style={{ color: "#1f2937" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between border-b px-5 py-4 ${config.headerBg} ${config.borderColor}`}
        >
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center rounded-xl bg-white p-2 shadow-sm">
              <Icon className={`w-6 h-6 ${config.iconColor}`} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 m-0">
              {content.title || config.title}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors border-0 bg-transparent cursor-pointer"
          >
            <Icons.X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
          {content.type === "emergency_contact" ? (
            <div className="space-y-4">
              <div className={`p-4 rounded-xl ${config.itemBg} space-y-1`}>
                <p className="text-lg font-bold text-gray-900 m-0">
                  {content.name || "Sin nombre registrado"}
                </p>
                {content.relationship && (
                  <p className="text-sm font-medium text-gray-500 m-0">
                    {content.relationship}
                  </p>
                )}
              </div>

              {content.phone ? (
                <a
                  href={`tel:${content.phone}`}
                  className="flex items-center justify-center gap-3 w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 transition-all text-white font-bold text-base shadow-md no-underline"
                >
                  <Icons.PhoneCall className="w-5 h-5 text-white" />
                  <span className="text-white">Llamar: {content.phone}</span>
                </a>
              ) : null}

              {content.notes && (
                <div className="p-3.5 bg-gray-50 rounded-xl text-sm text-gray-600 border border-gray-100">
                  <p className="font-semibold text-gray-900 mb-1 text-xs uppercase tracking-wide">
                    Notas
                  </p>
                  <p className="m-0 whitespace-pre-wrap">{content.notes}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {content.items && content.items.length > 0 ? (
                <ul className="space-y-2 p-0 m-0 list-none">
                  {content.items.map((item, index) => (
                    <li
                      key={index}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium text-gray-900 ${config.itemBg}`}
                    >
                      <span
                        className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${config.dotColor}`}
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-400 text-center text-sm py-4 m-0">
                  Sin información registrada
                </p>
              )}
              {content.notes && (
                <div className="mt-3 p-3.5 bg-gray-50 rounded-xl text-sm text-gray-600 border border-gray-100">
                  <p className="font-semibold text-gray-900 mb-1 text-xs uppercase tracking-wide">
                    Notas
                  </p>
                  <p className="m-0 whitespace-pre-wrap">{content.notes}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
