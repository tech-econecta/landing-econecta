"use client";

import React from "react";
import { Perfil } from "@/app/[username]/action-get.user";
import { Urbanist } from "next/font/google";
import { useQRWithLogo } from "@/app/[username]/card/useQRWithLogo";

const urbanist = Urbanist({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-urbanist",
});

interface CardPreviewProps {
  perfil: Perfil;
  username: string;
}

export default function CardPreview({ perfil, username }: CardPreviewProps) {
  const {
    brandLogo,
    brandLogoPath,
    imagen,
    title,
    subtitle,
    card,
    customFontUrl,
  } = perfil;

  const { textColor = "#000000", cardColor = "#ffffff" } = card || {};

  const fontFamily = customFontUrl
    ? new URL(customFontUrl).searchParams.get("family") ||
      "var(--font-urbanist)"
    : "var(--font-urbanist)";

  // Generar QR con logo de econecta (proporciones optimizadas)
  const qrCodeUrl = useQRWithLogo({
    data: `https://econecta.io/${username}`,
    logoUrl: "/Iso3.png",
    size: 300,
    logoWidth: 85,
    logoHeight: 42,
  });

  return (
    <>
      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes pulse-qr {
          0%,
          100% {
            box-shadow: 0 0 15px rgba(222, 30, 37, 0.3);
          }
          50% {
            box-shadow: 0 0 25px rgba(222, 30, 37, 0.5);
          }
        }

        .card-entrance {
          animation: fade-in-up 0.6s ease-out;
        }

        .card-glassmorphism {
          box-shadow:
            0 8px 32px 0 rgba(31, 38, 135, 0.2),
            0 0 0 1px rgba(255, 255, 255, 0.18);
        }

        .qr-container {
          animation: pulse-qr 2s ease-in-out infinite;
        }
      `}</style>

      <div
        style={{ fontFamily }}
        className={`${customFontUrl ? urbanist.className : ""}`}
      >
        {/* Tarjeta principal con glassmorphism */}
        <div
          style={{
            color: textColor,
            backgroundColor: cardColor,
          }}
          className="card-entrance card-glassmorphism rounded-[20px] p-6 w-full max-w-[340px] shadow-2xl text-center flex flex-col items-center border border-white/20 relative z-10"
        >
          {/* Logo de marca con efecto shimmer */}
          {brandLogo && brandLogoPath && (
            <div className="logo-shimmer w-full mb-5">
              <img
                src={brandLogoPath}
                alt="Brand Logo"
                className="w-full max-w-[260px] mx-auto"
              />
            </div>
          )}

          {/* Foto de usuario con gradiente animado */}
          {imagen && (
            <div className="profile-img-wrapper mb-5">
              <img
                src={imagen}
                alt="User Photo"
                className="w-[120px] h-[120px] object-cover rounded-full"
              />
            </div>
          )}

          {/* Título con animación */}
          <h1
            style={{ color: textColor }}
            className="font-bold text-3xl m-0 mb-2 tracking-tight"
          >
            {title}
          </h1>

          {/* Subtítulo */}
          {subtitle && (
            <h2
              style={{ color: textColor }}
              className="text-base font-medium mb-6 opacity-80"
            >
              {subtitle}
            </h2>
          )}

          {/* Código QR con animación de pulso y logo de econecta */}
          <div className="qr-container bg-white rounded-[20px] p-3 mb-6 transition-all duration-300 hover:scale-105">
            {qrCodeUrl ? (
              <img
                src={qrCodeUrl}
                alt="Código QR"
                className="w-[130px] h-[130px] rounded-[15px]"
              />
            ) : (
              <div className="w-[130px] h-[130px] rounded-[15px] bg-gray-200 animate-pulse" />
            )}
          </div>
        </div>
      </div>
    </>
  );
}

