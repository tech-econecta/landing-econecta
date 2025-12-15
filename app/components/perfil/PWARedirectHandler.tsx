"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function PWARedirectHandler() {
  const pathname = usePathname();
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Detectar si estamos ejecutando en modo standalone (PWA instalada)
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone ||
      document.referrer.includes("android-app://");

    // Detectar si el usuario llegó desde un enlace externo o escribió la URL
    // Si está en modo standalone pero llegó desde un enlace, ofrecer abrir en navegador
    if (isStandalone) {
      // Verificar si hay un parámetro que indique que vino de un enlace
      const urlParams = new URLSearchParams(window.location.search);
      const fromLink = urlParams.get("from") === "link";

      // Si llegó desde un enlace en modo standalone, mostrar banner
      if (fromLink) {
        setShowBanner(true);
      }

      // También verificar el referrer
      if (document.referrer && !document.referrer.includes(window.location.origin)) {
        setShowBanner(true);
      }
    }
  }, [pathname]);

  const openInBrowser = () => {
    // Abrir la misma URL en el navegador
    const currentUrl = window.location.href;
    // Remover parámetros de tracking
    const cleanUrl = currentUrl.split("?")[0];
    window.open(cleanUrl, "_blank");
  };

  const dismissBanner = () => {
    setShowBanner(false);
    // Guardar preferencia en localStorage
    localStorage.setItem("pwa-banner-dismissed", "true");
  };

  // No mostrar si el usuario ya lo descartó
  useEffect(() => {
    if (localStorage.getItem("pwa-banner-dismissed") === "true") {
      setShowBanner(false);
    }
  }, []);

  if (!showBanner) {
    return null;
  }

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: "rgba(0, 0, 0, 0.9)",
        color: "#fff",
        padding: "12px 16px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        zIndex: 9999,
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.3)",
      }}
    >
      <span style={{ fontSize: "14px", flex: 1 }}>
        ¿Prefieres abrir en el navegador?
      </span>
      <div style={{ display: "flex", gap: "8px" }}>
        <button
          onClick={openInBrowser}
          style={{
            backgroundColor: "#fff",
            color: "#000",
            border: "none",
            padding: "6px 12px",
            borderRadius: "6px",
            fontSize: "14px",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          Abrir
        </button>
        <button
          onClick={dismissBanner}
          style={{
            backgroundColor: "transparent",
            color: "#fff",
            border: "1px solid #fff",
            padding: "6px 12px",
            borderRadius: "6px",
            fontSize: "14px",
            cursor: "pointer",
          }}
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}

