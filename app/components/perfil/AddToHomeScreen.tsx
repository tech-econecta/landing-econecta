"use client";
import React, { useEffect, useState } from "react";

interface AddToHomeScreenProps {
  textColor?: string;
}

const AddToHomeScreen: React.FC<AddToHomeScreenProps> = ({
  textColor = "#ffff",
}) => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallButton, setShowInstallButton] = useState(false);
  const [showShareButton, setShowShareButton] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Detectar si está en modo standalone (PWA instalada)
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone === true ||
      document.referrer.includes("android-app://");

    setIsStandalone(standalone);

    // Si está en modo standalone, ocultar el botón y salir
    if (standalone) {
      setShowInstallButton(false);
      return;
    }

    // Detectar si es iOS
    const userAgent = navigator.userAgent;
    const iOS =
      /iPad|iPhone|iPod/.test(userAgent) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    setIsIOS(iOS);

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

    // Mostrar el botón siempre si no está en modo standalone
    // El botón funcionará con beforeinstallprompt si está disponible,
    // o con Web Share API en iOS, o mostrará instrucciones en otros casos
    setShowInstallButton(true);

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
    // Si hay prompt disponible (Android/Chrome/Edge PWA), usarlo para instalar
    if (deferredPrompt) {
      try {
        // Mostrar el prompt de instalación nativo del navegador
        await deferredPrompt.prompt();

        // Esperar a que el usuario responda
        const { outcome } = await deferredPrompt.userChoice;

        // Limpiar el prompt (solo se puede usar una vez)
        setDeferredPrompt(null);
        setShowInstallButton(false);
      } catch (error) {
        console.error("Error al instalar PWA:", error);
        // Si falla, intentar otros métodos
      }
    }

    // Para iOS, usar Web Share API para abrir el menú nativo
    // Desde ahí el usuario puede seleccionar "Añadir a pantalla de inicio"
    if (isIOS && typeof navigator.share === "function") {
      try {
        const currentUrl = window.location.href;
        const pageTitle = document.title;

        await navigator.share({
          title: pageTitle,
          text: `Instalar ${pageTitle} como app`,
          url: currentUrl,
        });
        return;
      } catch (error: any) {
        // Si el usuario cancela, no hacer nada
        if (error.name !== "AbortError") {
          console.error("Error al compartir:", error);
        }
      }
      return;
    }

    // Si no hay deferredPrompt, intentar usar Web Share API como alternativa
    if (!deferredPrompt && typeof navigator.share === "function") {
      try {
        const currentUrl = window.location.href;
        const pageTitle = document.title;

        await navigator.share({
          title: pageTitle,
          text: `Instalar ${pageTitle} como app`,
          url: currentUrl,
        });
        return;
      } catch (error: any) {
        if (error.name !== "AbortError") {
          console.error("Error al compartir:", error);
        }
      }
    }

    // Si no hay deferredPrompt y no hay Web Share API, mostrar instrucciones
    if (!deferredPrompt && !isIOS) {
      const isChrome =
        /Chrome/.test(navigator.userAgent) &&
        !/Edg|OPR/.test(navigator.userAgent);
      const isEdge = /Edg/.test(navigator.userAgent);
      const isMobile =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        );

      let message = "";
      if (isMobile) {
        if (isChrome || isEdge) {
          message =
            "Para instalar esta app:\n\n1. Toca el menú (⋮) en la esquina superior derecha\n2. Selecciona 'Instalar app' o 'Añadir a pantalla de inicio'\n\nO busca el icono de instalación (➕) en la barra de direcciones.";
        } else {
          message =
            "Para instalar esta app:\n\n1. Toca el menú del navegador\n2. Busca la opción 'Añadir a pantalla de inicio' o 'Instalar app'";
        }
      } else {
        if (isChrome || isEdge) {
          message =
            "Para instalar esta app:\n\n1. Busca el icono de instalación (➕) en la barra de direcciones\n2. Haz clic en él y selecciona 'Instalar'\n\nO ve al menú (⋮) → 'Instalar app'";
        } else {
          message =
            "Para instalar esta app, busca la opción de instalación en el menú de tu navegador.";
        }
      }

      alert(message);
    }
  };

  // No mostrar nada si está en modo standalone (PWA instalada) o no hay funcionalidad disponible
  if (isStandalone || (!showInstallButton && !showShareButton)) {
    return null;
  }

  return (
    <>
      <div className="flex justify-center gap-3 mt-6 mb-4 px-4 flex-wrap">
        {/* Botón para instalar PWA en modo browser */}
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
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
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
    </>
  );
};

export default AddToHomeScreen;
