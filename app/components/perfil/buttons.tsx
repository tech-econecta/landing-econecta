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

// Define el tipo para cada botón
export type Button = {
  label: string;
  url?: string;
  color: string;
  label_color: string;
  path_icon?: string; // Opcional
  border_radius?: number; // Opcional
  width?: number; // Opcional
  height?: number; // Opcional
  icon_size?: number; // Opcional: Tamaño en px del icono/imagen
  action_type?: ButtonActionType | "verified_signature";
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

    if (button.url && button.url.trim()) {
      window.open(button.url, "_blank");
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
        {(buttonsData || []).map((button, index) => (
          <a
            key={index}
            href={
              isModalAction(button)
                ? "#"
                : (button.url || "").trim() || "#"
            }
            target={
              !isModalAction(button) && (button.url || "").trim()
                ? "_blank"
                : undefined
            }
            rel={
              !isModalAction(button) && (button.url || "").trim()
                ? "noopener noreferrer"
                : undefined
            }
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
                    width: button.icon_size ? `${button.icon_size}px` : (button.width ? `${button.width}px` : "100px"),
                    height: button.icon_size ? `${button.icon_size}px` : (button.height ? `${button.height}px` : "100px"),
                    maxWidth: "100%",
                    maxHeight: "100%",
                    borderRadius: `${button.border_radius ?? 10}px`,
                    objectFit: "contain",
                  }}
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
        ))}
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


