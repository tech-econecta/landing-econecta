"use client";
import React, { useState } from "react";
import {
  MedicalModalDisplay,
  type ModalContent,
  type ButtonActionType,
} from "./MedicalModalDisplay";
import {
  VerifiedSignatureModal,
  type VerifiedSignatureContent,
} from "./VerifiedSignatureModal";

export type Button = {
  label: string;
  url?: string;
  color: string;
  label_color: string;
  path_icon?: string; // Opcional
  border_radius?: number; // Opcional
  width?: number; // Opcional
  height?: number; // Opcional
  action_type?: ButtonActionType | "verified_signature";
  documents?: Array<{
    name: string;
    url: string;
    size?: number;
    type?: string;
  }>;
  modal_content?: ModalContent;
  verified_signature?: VerifiedSignatureContent;
};

// Define las props del componente
type ButtonsProps = {
  buttonsData: Button[]; // Lista de botones
};

const Buttons: React.FC<ButtonsProps> = ({ buttonsData }) => {
  const [activeModalContent, setActiveModalContent] =
    useState<ModalContent | null>(null);
  const [activeSignatureContent, setActiveSignatureContent] =
    useState<VerifiedSignatureContent | null>(null);

  const getButtonUrl = (button: Button): string => {
    if (button.url && button.url.trim()) {
      return button.url.trim();
    }
    if (button.documents && button.documents.length > 0) {
      const latestDoc = button.documents[button.documents.length - 1];
      if (latestDoc?.url && latestDoc.url.trim()) {
        return latestDoc.url.trim();
      }
    }
    return "";
  };

  const handleButtonClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    button: Button
  ) => {
    e.preventDefault();

    if (button.action_type === "verified_signature" || button.verified_signature) {
      if (button.verified_signature) {
        setActiveSignatureContent(button.verified_signature);
      } else {
        // Fallback construyendo datos mínimos del titular si solo viene la firma configurada
        setActiveSignatureContent({
          certificate_id: "ECO-SIG-VERIFIED",
          full_legal_name: button.label || "Titular Verificado",
          id_document_type: "CI",
          id_document_number: "Verificado Oficialmente",
          signature_image_url: button.path_icon || "",
          issue_date: new Date().toISOString(),
          status: "verified",
          issuer_name: "Econecta Trust Platform",
        });
      }
      return;
    }

    if (button.action_type === "modal" && button.modal_content) {
      setActiveModalContent(button.modal_content);
      return;
    }

    const targetUrl = getButtonUrl(button);
    if (targetUrl) {
      window.open(targetUrl, "_blank");
    }
  };

  const isModalAction = (button: Button) =>
    button.action_type === "modal" ||
    button.action_type === "verified_signature" ||
    Boolean(button.verified_signature);

  return (
    <>
      <div
        className="buttons"
        style={{
          display: "grid",
          padding: "25px",
          gridTemplateColumns: "repeat(2, 1fr)", // Siempre dos columnas
          gridGap: "35px", // Espaciado entre los botones
          paddingTop: "10px",
          width: "100%", // Abarca el 100% del ancho de la pantalla
        }}
      >
        {(buttonsData || []).map((button, index) => {
          const targetUrl = getButtonUrl(button);
          const isModal = isModalAction(button);

          return (
            <a
              key={index}
              href={isModal ? "#" : targetUrl || "#"}
              target={!isModal && targetUrl ? "_blank" : undefined}
              rel={!isModal && targetUrl ? "noopener noreferrer" : undefined}
              onClick={(e) => handleButtonClick(e, button)}
              style={{
                textDecoration: "none",
                overflow: "clip",
              }}
              className="font-bold cursor-pointer"
            >
              <div
                className="button"
                style={{
                  backgroundColor: button.color || "transparent",
                  borderRadius: `${button.border_radius ?? 10}px`,
                  display: "flex", // Usamos flexbox
                  flexDirection: "column", // Coloca la imagen y el texto en columna
                  justifyContent: "center", // Centra verticalmente
                  alignItems: "center", // Centra horizontalmente
                  cursor: "pointer",
                  padding: "5px",
                  margin: "auto",
                }}
              >
                {button.path_icon && (
                  <img
                    src={button.path_icon}
                    alt={button.label}
                    style={{
                      maxWidth: "80%", // Escala el ícono al 70% del ancho del botón
                      maxHeight: "80%", // Escala el ícono al 70% del alto del botón
                      borderRadius: `${button.border_radius ?? 10}px`,
                    }}
                    className="w-[100px]"
                  />
                )}
                <p
                  style={{
                    color: button.label_color,
                    fontSize: "16px",
                    marginTop: "12px", // Espaciado entre la imagen y el texto
                    textAlign: "center",
                    wordBreak: "break-word",
                    whiteSpace: "normal",
                  }}
                  className="font-bold"
                >
                  {button.label}
                </p>
              </div>
            </a>
          );
        })}
      </div>

      {/* Modal de información médica / emergencia */}
      <MedicalModalDisplay
        content={activeModalContent}
        open={Boolean(activeModalContent)}
        onClose={() => setActiveModalContent(null)}
      />

      {/* Modal de Firma e Identidad Verificada */}
      <VerifiedSignatureModal
        content={activeSignatureContent}
        open={Boolean(activeSignatureContent)}
        onClose={() => setActiveSignatureContent(null)}
      />
    </>
  );
};

export default Buttons;


