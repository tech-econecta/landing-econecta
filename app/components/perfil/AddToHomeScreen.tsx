"use client";
import React, { useEffect, useState } from "react";

interface AddToHomeScreenProps {
  textColor?: string;
}

const AddToHomeScreen: React.FC<AddToHomeScreenProps> = ({
  textColor = "#000000",
}) => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showButton, setShowButton] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [canShare, setCanShare] = useState(false);

  useEffect(() => {
    // Detectar si es iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(iOS);

    // Verificar si la API de Web Share está disponible
    if (typeof navigator.share === "function") {
      setCanShare(true);
      setShowButton(true);
    }

    // Para Android/Chrome: escuchar el evento beforeinstallprompt
    // Esto crea un acceso directo (no necesariamente una PWA completa)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowButton(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // Si es iOS o tiene Web Share, mostrar el botón
    if (iOS || typeof navigator.share === "function") {
      setShowButton(true);
    }

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
    };
  }, []);

  const handleInstallClick = async () => {
    const currentUrl = window.location.href;
    const pageTitle = document.title;

    // Intentar usar Web Share API primero (más universal para crear accesos directos)
    if (canShare && typeof navigator.share === "function") {
      try {
        await navigator.share({
          title: pageTitle,
          text: `Acceso directo a ${pageTitle}`,
          url: currentUrl,
        });
        // Después de compartir, el usuario puede crear el acceso directo desde el menú
        return;
      } catch (error: any) {
        // Si el usuario cancela, no hacer nada
        if (error.name === "AbortError") {
          return;
        }
        console.error("Error al compartir:", error);
      }
    }

    // Si hay prompt disponible (Android/Chrome), usarlo para crear acceso directo
    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === "accepted") {
          console.log("Acceso directo creado");
        } else {
          console.log("Creación de acceso directo cancelada");
        }

        setDeferredPrompt(null);
        setShowButton(false);
      } catch (error) {
        console.error("Error al crear acceso directo:", error);
      }
      return;
    }

    // Para iOS, intentar abrir el menú de compartir manualmente
    if (isIOS && typeof navigator.share === "function") {
      try {
        await navigator.share({
          title: pageTitle,
          url: currentUrl,
        });
      } catch (error: any) {
        if (error.name !== "AbortError") {
          console.error("Error:", error);
        }
      }
    }
  };

  // No mostrar si ya está instalado
  if (!showButton) {
    return null;
  }

  return (
    <div className="flex justify-center mt-6 mb-4 px-4">
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
    </div>
  );
};

export default AddToHomeScreen;
