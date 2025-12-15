"use client";
import React, { useEffect, useState } from "react";

interface AddToHomeScreenProps {
  textColor?: string;
}

const AddToHomeScreen: React.FC<AddToHomeScreenProps> = ({
  textColor = "#000000",
}) => {
  const [showInstallButton, setShowInstallButton] = useState(true);
  const [showShareButton, setShowShareButton] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isChrome, setIsChrome] = useState(false);
  const [isFirefox, setIsFirefox] = useState(false);
  const [isSafari, setIsSafari] = useState(false);
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

    // Detectar el navegador
    const userAgent = navigator.userAgent;
    const iOS =
      /iPad|iPhone|iPod/.test(userAgent) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    setIsIOS(iOS);
    setIsChrome(/Chrome/.test(userAgent) && !/Edg|OPR/.test(userAgent));
    setIsFirefox(/Firefox/.test(userAgent));
    setIsSafari(/Safari/.test(userAgent) && !/Chrome/.test(userAgent));

    // Verificar si la API de Web Share está disponible para el botón de compartir
    if (typeof navigator.share === "function") {
      setShowShareButton(true);
    }

    // Mostrar el botón si no está en modo standalone
    setShowInstallButton(true);
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
    const currentUrl = window.location.href;
    const pageTitle = document.title;

    // Método 1: Para iOS, usar Web Share API que permite añadir a pantalla de inicio
    if (isIOS && typeof navigator.share === "function") {
      try {
        await navigator.share({
          title: pageTitle,
          text: `Guardar ${pageTitle}`,
          url: currentUrl,
        });
        return;
      } catch (error: any) {
        if (error.name !== "AbortError") {
          console.error("Error al compartir:", error);
        }
      }
    }

    // Método 2: Intentar usar window.external.AddFavorite (IE/Edge antiguo)
    if (
      typeof (window as any).external !== "undefined" &&
      (window as any).external.AddFavorite
    ) {
      try {
        (window as any).external.AddFavorite(currentUrl, pageTitle);
        return;
      } catch (error) {
        // Si falla, continuar con otros métodos
      }
    }

    // Método 3: Intentar usar sidebar.addPanel (Firefox antiguo)
    if (
      typeof (window as any).sidebar !== "undefined" &&
      (window as any).sidebar.addPanel
    ) {
      try {
        (window as any).sidebar.addPanel(pageTitle, currentUrl, "");
        return;
      } catch (error) {
        // Si falla, continuar con otros métodos
      }
    }

    // Método 4: Para móviles Android, intentar usar Web Share API
    if (!isIOS && typeof navigator.share === "function") {
      try {
        await navigator.share({
          title: pageTitle,
          text: `Guardar ${pageTitle}`,
          url: currentUrl,
        });
        return;
      } catch (error: any) {
        if (error.name !== "AbortError") {
          // Si falla, mostrar instrucciones
        }
      }
    }

    // Método 5: Para desktop, mostrar instrucciones claras
    const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
    const shortcut = isMac ? "Cmd+D" : "Ctrl+D";

    const instructions = isIOS
      ? "Toca el botón de compartir (📤) y selecciona 'Añadir a pantalla de inicio'"
      : isChrome
        ? `Presiona ${shortcut} para guardar esta página como favorito\n\nO haz clic en el menú (⋮) → Marcadores → Marcar esta página`
        : isFirefox
          ? `Presiona ${shortcut} para guardar esta página como marcador\n\nO haz clic en el menú (☰) → Marcadores → Añadir marcador`
          : isSafari
            ? `Presiona ${shortcut} para guardar esta página como favorito\n\nO haz clic en el menú → Marcadores → Añadir marcador`
            : `Presiona ${shortcut} para guardar esta página como favorito\n\nO usa el menú del navegador para añadir a favoritos`;

    alert(`Para guardar esta página:\n\n${instructions}`);
  };

  // No mostrar nada si está en modo standalone (PWA instalada)
  if (isStandalone) {
    return null;
  }

  return (
    <>
      <div className="flex justify-center gap-3 mt-6 mb-4 px-4 flex-wrap">
        {/* Botón para crear acceso directo - oculto si está en modo standalone */}
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
