"use client";

import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";

interface UseQRWithLogoOptions {
  data: string;
  logoUrl: string;
  size?: number;
  logoWidth?: number;
  logoHeight?: number;
}

export function useQRWithLogo({
  data,
  logoUrl,
  size = 300,
  logoWidth = 90,
  logoHeight = 45,
}: UseQRWithLogoOptions) {
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const generateQR = async () => {
      try {
        // Crear un canvas temporal para generar el QR
        const canvas = document.createElement("canvas");
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext("2d");

        if (!ctx) return;

        // Generar el código QR en el canvas con alta corrección de errores
        // para que funcione incluso con el logo en el centro
        await QRCode.toCanvas(canvas, data, {
          width: size,
          margin: 1,
          errorCorrectionLevel: "H", // Nivel alto para soportar el logo
          color: {
            dark: "#000000",
            light: "#ffffff",
          },
        });

        // Cargar el logo
        const logo = new Image();
        logo.crossOrigin = "anonymous";

        logo.onload = () => {
          // Calcular dimensiones y posición del contenedor del logo
          const padding = 10;
          const bgWidth = logoWidth + padding * 2;
          const bgHeight = logoHeight + padding * 2;
          const bgX = (size - bgWidth) / 2;
          const bgY = (size - bgHeight) / 2;
          const borderRadius = 50;

          // Dibujar sombra sutil
          ctx.shadowColor = "rgba(0, 0, 0, 0.15)";
          ctx.shadowBlur = 8;
          ctx.shadowOffsetX = 0;
          ctx.shadowOffsetY = 2;

          // Fondo blanco con bordes redondeados
          ctx.fillStyle = "#ffffff";
          ctx.beginPath();
          ctx.roundRect(bgX, bgY, bgWidth, bgHeight, borderRadius);
          ctx.fill();

          // Resetear sombra
          ctx.shadowColor = "transparent";
          ctx.shadowBlur = 0;
          ctx.shadowOffsetX = 0;
          ctx.shadowOffsetY = 0;

          // Añadir un borde sutil al contenedor
          ctx.strokeStyle = "rgba(0, 0, 0, 0.08)";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.roundRect(bgX, bgY, bgWidth, bgHeight, borderRadius);
          ctx.stroke();

          // Calcular posición centrada para el logo manteniendo proporciones
          const logoX = (size - logoWidth) / 2;
          const logoY = (size - logoHeight) / 2;

          // Habilitar suavizado para mejor calidad
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = "high";

          // Dibujar el logo sobre el QR con las proporciones correctas
          ctx.drawImage(logo, logoX, logoY, logoWidth, logoHeight);

          // Convertir el canvas a data URL con alta calidad
          const dataUrl = canvas.toDataURL("image/png", 1.0);
          setQrDataUrl(dataUrl);
        };

        logo.onerror = () => {
          // Si falla la carga del logo, usar solo el QR
          console.error("Error al cargar el logo");
          const dataUrl = canvas.toDataURL("image/png", 1.0);
          setQrDataUrl(dataUrl);
        };

        logo.src = logoUrl;
      } catch (error) {
        console.error("Error al generar QR:", error);
      }
    };

    generateQR();
  }, [data, logoUrl, size, logoWidth, logoHeight]);

  return qrDataUrl;
}
