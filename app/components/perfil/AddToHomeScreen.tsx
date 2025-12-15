"use client";
import React, { useEffect, useState } from "react";

interface AddToHomeScreenProps {
  textColor?: string;
}

const AddToHomeScreen: React.FC<AddToHomeScreenProps> = ({
  textColor = "#000000",
}) => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallButton, setShowInstallButton] = useState(false);
  const [showShareButton, setShowShareButton] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);

  useEffect(() => {
    // Detectar si es iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(iOS);

    // Verificar si la PWA ya está instalada
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
      return;
    }

    // Verificar si la API de Web Share está disponible para el botón de compartir
    if (typeof navigator.share === "function") {
      setShowShareButton(true);
    }

    // Escuchar el evento beforeinstallprompt (PWA)
    // Este evento se dispara cuando la PWA cumple los requisitos de instalación
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallButton(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // En iOS, mostrar el botón siempre (usará instrucciones manuales)
    // En otros dispositivos, solo mostrar cuando haya deferredPrompt
    if (iOS) {
      setShowInstallButton(true);
    }

    // Verificar si ya está instalado (para navegadores que no disparan beforeinstallprompt después de instalar)
    const checkIfInstalled = () => {
      if (window.matchMedia("(display-mode: standalone)").matches) {
        setIsInstalled(true);
        setShowInstallButton(false);
      }
    };

    checkIfInstalled();

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
    };
  }, []);

  const handleShareClick = async () => {
    const currentUrl = window.location.href;
    const pageTitle = document.title;

    if (typeof navigator.share === "function") {
      try {
        await navigator.share({
          title: pageTitle,
          text: `Compartir ${pageTitle}`,
          url: currentUrl,
        });
      } catch (error: any) {
        if (error.name !== "AbortError") {
          console.error("Error al compartir:", error);
        }
      }
    }
  };

  const handleInstallClick = async () => {
    // Si hay prompt disponible (PWA lista para instalar), usarlo
    if (deferredPrompt) {
      try {
        // Mostrar el prompt de instalación nativo del navegador
        await deferredPrompt.prompt();

        // Esperar a que el usuario responda
        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === "accepted") {
          console.log("PWA instalada exitosamente");
          setIsInstalled(true);
        } else {
          console.log("Instalación de PWA cancelada por el usuario");
        }

        // Limpiar el prompt (solo se puede usar una vez)
        setDeferredPrompt(null);
        setShowInstallButton(false);
      } catch (error) {
        console.error("Error al instalar PWA:", error);
      }
      return;
    }

    // Si no hay prompt disponible pero es iOS, mostrar instrucciones
    if (isIOS) {
      setShowInstructions(true);
    }
  };

  const closeInstructions = () => {
    setShowInstructions(false);
  };

  // No mostrar si la PWA ya está instalada o no hay funcionalidad disponible
  if (isInstalled || (!showInstallButton && !showShareButton)) {
    return null;
  }

  return (
    <>
      <div className="flex justify-center gap-3 mt-6 mb-4 px-4 flex-wrap">
        {/* Botón para crear acceso directo */}
        {showInstallButton && (
          <button
            onClick={handleInstallClick}
            style={{
              backgroundColor: "rgba(0, 0, 0, 0.9)",
              color: textColor,
              border: `2px solid ${textColor}`,
              borderRadius: "12px",
              padding: "12px 24px",
              fontSize: "16px",
              fontWeight: "bold",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(0, 0, 0, 1)";
              e.currentTarget.style.transform = "scale(1.05)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(0, 0, 0, 0.9)";
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke={textColor}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {isIOS ? (
                <>
                  <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                  <polyline points="16 6 12 2 8 6" />
                  <line x1="12" y1="2" x2="12" y2="15" />
                </>
              ) : (
                <>
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </>
              )}
            </svg>
            <span>Guardar acceso directo</span>
          </button>
        )}

        {/* Botón para compartir */}
        {showShareButton && (
          <button
            onClick={handleShareClick}
            style={{
              backgroundColor: "rgba(0, 0, 0, 0.9)",
              color: textColor,
              border: `2px solid ${textColor}`,
              borderRadius: "12px",
              padding: "12px 24px",
              fontSize: "16px",
              fontWeight: "bold",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(0, 0, 0, 1)";
              e.currentTarget.style.transform = "scale(1.05)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(0, 0, 0, 0.9)";
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke={textColor}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="18" cy="5" r="3" />
              <circle cx="6" cy="12" r="3" />
              <circle cx="18" cy="19" r="3" />
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
            </svg>
            <span>Compartir</span>
          </button>
        )}
      </div>

      {/* Modal de instrucciones */}
      {showInstructions && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "20px",
          }}
          onClick={closeInstructions}
        >
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "16px",
              padding: "24px",
              maxWidth: "400px",
              width: "100%",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3
              style={{
                fontSize: "20px",
                fontWeight: "bold",
                marginBottom: "16px",
                color: "#000",
              }}
            >
              Instalar App
            </h3>
            {isIOS ? (
              <div style={{ color: "#333", lineHeight: "1.6" }}>
                <p style={{ marginBottom: "12px" }}>
                  <strong>En iPhone/iPad:</strong>
                </p>
                <ol style={{ paddingLeft: "20px", marginBottom: "16px" }}>
                  <li>
                    Toca el botón de compartir (cuadrado con flecha) en la parte
                    inferior
                  </li>
                  <li>
                    Desplázate hacia abajo y selecciona "Añadir a pantalla de
                    inicio"
                  </li>
                  <li>Confirma el nombre y toca "Añadir"</li>
                </ol>
                <p
                  style={{ marginTop: "12px", fontSize: "14px", color: "#666" }}
                >
                  La app se instalará en tu pantalla de inicio y funcionará como
                  una aplicación nativa.
                </p>
              </div>
            ) : (
              <div style={{ color: "#333", lineHeight: "1.6" }}>
                <p style={{ marginBottom: "12px" }}>
                  <strong>Instalación automática:</strong>
                </p>
                <p style={{ marginBottom: "12px" }}>
                  Si el botón de instalación no aparece, asegúrate de:
                </p>
                <ul style={{ paddingLeft: "20px", marginBottom: "16px" }}>
                  <li>Estar usando Chrome o Edge en Android</li>
                  <li>Haber visitado la página al menos una vez</li>
                  <li>No tener la app ya instalada</li>
                </ul>
                <p
                  style={{ marginTop: "12px", fontSize: "14px", color: "#666" }}
                >
                  La app se instalará automáticamente cuando esté lista.
                </p>
              </div>
            )}
            <button
              onClick={closeInstructions}
              style={{
                width: "100%",
                padding: "12px",
                backgroundColor: "#000",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                fontSize: "16px",
                fontWeight: "bold",
                cursor: "pointer",
                marginTop: "16px",
              }}
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default AddToHomeScreen;
