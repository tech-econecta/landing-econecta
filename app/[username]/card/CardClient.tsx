"use client";

import React from "react";
import { Perfil } from "../action-get.user";
import { Urbanist } from "next/font/google";
import { useQRWithLogo } from "./useQRWithLogo";

const urbanist = Urbanist({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-urbanist",
});

interface CardClientProps {
  perfil: Perfil;
  username: string;
  shareUrl: string;
}

function generateVCard(perfil: Perfil, username: string, shareUrl: string) {
  const vcard = `BEGIN:VCARD
VERSION:3.0
FN:${perfil.title || username}
TITLE:${perfil.subtitle || ""}
URL:${shareUrl}
PHOTO;VALUE=URI:${perfil.imagen || ""}
END:VCARD`;
  return encodeURIComponent(vcard);
}

export default function CardClient({ perfil, username, shareUrl }: CardClientProps) {
  const {
    brandLogo,
    brandLogoPath,
    imagen,
    title,
    subtitle,
    card,
    customFontUrl,
  } = perfil;

  const {
    textColor = "#000000",
    cardColor = "#ffffff",
    Button1Color = "#000000",
    Button1TextColor = "#ffffff",
    Button2Color = "#DE1E25",
    Button2TextColor = "#ffffff",
  } = card || {};

  const fontFamily = customFontUrl
    ? new URL(customFontUrl).searchParams.get("family") ||
      "var(--font-urbanist)"
    : "var(--font-urbanist)";

  const vCardData = generateVCard(perfil, username, shareUrl);

  // Generar QR con logo de econecta (proporciones optimizadas)
  const qrCodeUrl = useQRWithLogo({
    data: shareUrl,
    logoUrl: "/Iso3.png",
    size: 300,
    logoWidth: 85,
    logoHeight: 42,
  });

  return (
    <>
      <style jsx>{`
        @keyframes gradient-shift {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

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

        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes shimmer {
          0% {
            background-position: -1000px 0;
          }
          100% {
            background-position: 1000px 0;
          }
        }

        .animated-bg {
          position: relative;
          background: linear-gradient(
            -45deg,
            #0f2557,
            #1e40af,
            #3b82f6,
            #60a5fa
          );
          background-size: 400% 400%;
          animation: gradient-shift 15s ease infinite;
        }

        .animated-bg::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image:
            radial-gradient(
              circle at 20% 50%,
              rgba(255, 255, 255, 0.15) 0%,
              transparent 50%
            ),
            radial-gradient(
              circle at 80% 80%,
              rgba(255, 255, 255, 0.1) 0%,
              transparent 50%
            ),
            radial-gradient(
              circle at 40% 20%,
              rgba(255, 255, 255, 0.12) 0%,
              transparent 50%
            );
          opacity: 0.8;
          animation: float 10s ease-in-out infinite;
        }

        .animated-bg::after {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: repeating-linear-gradient(
            45deg,
            transparent,
            transparent 100px,
            rgba(255, 255, 255, 0.03) 100px,
            rgba(255, 255, 255, 0.03) 200px
          );
          pointer-events: none;
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

        .btn-hover {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }

        .btn-hover::before {
          content: "";
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.3),
            transparent
          );
          transition: left 0.5s;
        }

        .btn-hover:hover::before {
          left: 100%;
        }

        .btn-hover:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        }

        .btn-hover:active {
          transform: translateY(-1px);
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        }

        .icon-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>

      <div
        style={{ fontFamily }}
        className={`animated-bg flex flex-col justify-center items-center min-h-screen p-4 ${
          customFontUrl ? urbanist.className : ""
        }`}
      >
        {/* Tarjeta principal con glassmorphism */}
        <div
          style={{
            color: textColor,
            backgroundColor: cardColor,
          }}
          className="card-entrance card-glassmorphism rounded-[20px] p-6 w-full max-w-[340px] shadow-2xl text-center mb-5 flex flex-col items-center border border-white/20 relative z-10"
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

        {/* Botones de acción mejorados */}
        <div className="flex flex-col w-full max-w-[340px] mx-auto gap-3 relative z-10">
          {/* Botón Compartir en WhatsApp */}
          <a
            href={`https://api.whatsapp.com/send?text=Visita mi tarjeta digital: ${encodeURIComponent(shareUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: Button1TextColor,
              backgroundColor: Button1Color,
            }}
            className="btn-hover px-6 py-3.5 text-base font-bold rounded-[12px] no-underline text-center flex items-center justify-center shadow-lg"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="mr-2.5"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Compartir en WhatsApp
          </a>

          {/* Botón Ver Perfil */}
          <a
            href={shareUrl}
            style={{
              color: Button2TextColor,
              backgroundColor: Button2Color,
            }}
            className="btn-hover px-6 py-3.5 text-base font-bold rounded-[12px] no-underline text-center shadow-lg"
          >
            Ver Perfil Completo
          </a>
        </div>

        {/* Ícono inferior con animación flotante */}
        <div className="flex justify-center mt-6 relative z-10">
          <img
            src="/Iso3.png"
            alt="Icon"
            className="h-12 w-auto icon-float transition-opacity duration-300"
          />
        </div>
      </div>
    </>
  );
}
