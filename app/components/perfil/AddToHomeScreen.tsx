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
    // Función para detectar si está en modo PWA instalada
    const checkStandalone = () => {
      // Verificar display-mode (standalone, minimal-ui, fullscreen)
      const standaloneMatch = window.matchMedia(
        "(display-mode: standalone)"
      ).matches;
      const minimalUIMatch = window.matchMedia(
        "(display-mode: minimal-ui)"
      ).matches;
      const fullscreenMatch = window.matchMedia(
        "(display-mode: fullscreen)"
      ).matches;

      const isStandaloneMode =
        standaloneMatch || minimalUIMatch || fullscreenMatch;

      // Verificar iOS standalone
      const isIOSStandalone = (window.navigator as any).standalone === true;

      // Verificar referrer de Android
      const isAndroidApp = document.referrer.includes("android-app://");

      // Verificar si está en modo ventana (Windows PWA)
      const isWindowMode = (window as any).matchMedia?.(
        "(display-mode: window)"
      )?.matches;

      const result =
        isStandaloneMode || isIOSStandalone || isAndroidApp || isWindowMode;

      return result;
    };

    // Función para actualizar el estado
    const updateStandaloneState = () => {
      const standalone = checkStandalone();
      setIsStandalone(standalone);
      setShowInstallButton(!standalone);
    };

    // Verificar inicialmente
    updateStandaloneState();

    // Detectar si es iOS
    const userAgent = navigator.userAgent;
    const iOS =
      /iPad|iPhone|iPod/.test(userAgent) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    setIsIOS(iOS);

    // Verificar si la API de Web Share está disponible para el botón de compartir
    // Mostrar siempre, incluso en modo standalone
    if (typeof navigator.share === "function") {
      setShowShareButton(true);
    }

    // Escuchar el evento beforeinstallprompt (PWA)
    // Este evento se dispara cuando la PWA cumple los requisitos de instalación
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Solo mostrar botón si no está en modo standalone
      if (!checkStandalone()) {
        setShowInstallButton(true);
      }
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // Escuchar cambios en display-mode usando MediaQueryList
    const standaloneMediaQuery = window.matchMedia(
      "(display-mode: standalone)"
    );
    const minimalUIMediaQuery = window.matchMedia("(display-mode: minimal-ui)");
    const fullscreenMediaQuery = window.matchMedia(
      "(display-mode: fullscreen)"
    );

    const handleDisplayModeChange = () => {
      updateStandaloneState();
    };

    // Agregar listeners para cambios de display-mode
    if (standaloneMediaQuery.addEventListener) {
      standaloneMediaQuery.addEventListener("change", handleDisplayModeChange);
      minimalUIMediaQuery.addEventListener("change", handleDisplayModeChange);
      fullscreenMediaQuery.addEventListener("change", handleDisplayModeChange);
    } else {
      // Fallback para navegadores antiguos
      standaloneMediaQuery.addListener(handleDisplayModeChange);
      minimalUIMediaQuery.addListener(handleDisplayModeChange);
      fullscreenMediaQuery.addListener(handleDisplayModeChange);
    }

    // Verificar periódicamente si cambia a modo standalone (por si se instala mientras está abierto)
    const checkInterval = setInterval(() => {
      updateStandaloneState();
    }, 500); // Verificar cada medio segundo para respuesta más rápida

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
      clearInterval(checkInterval);

      // Remover listeners de media queries
      if (standaloneMediaQuery.removeEventListener) {
        standaloneMediaQuery.removeEventListener(
          "change",
          handleDisplayModeChange
        );
        minimalUIMediaQuery.removeEventListener(
          "change",
          handleDisplayModeChange
        );
        fullscreenMediaQuery.removeEventListener(
          "change",
          handleDisplayModeChange
        );
      } else {
        standaloneMediaQuery.removeListener(handleDisplayModeChange);
        minimalUIMediaQuery.removeListener(handleDisplayModeChange);
        fullscreenMediaQuery.removeListener(handleDisplayModeChange);
      }
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

    // Para iOS, mostrar instrucciones claras ya que no hay API de instalación directa
    // En iOS, el usuario debe usar el botón de compartir de Safari manualmente
    if (isIOS) {
      const instructions = `Para instalar esta app en tu iPhone:

1. Toca el botón de compartir (📤) en la parte inferior de Safari
2. Desplázate hacia abajo en el menú de compartir
3. Toca "Añadir a pantalla de inicio"
4. Toca "Añadir" para confirmar

La app aparecerá como un icono en tu pantalla de inicio.`;

      alert(instructions);
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

  // No mostrar nada solo si no hay ningún botón disponible
  // El botón de compartir se muestra siempre (incluso en modo standalone)
  if (!showInstallButton && !showShareButton) {
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
