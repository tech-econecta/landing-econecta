import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { Urbanist } from "next/font/google";
const urbanist = Urbanist({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-urbanist",
});

export const metadata: Metadata = {
  title: "Econecta | Tarjetas Digitales NFC en Venezuela",
  description:
    "Moderniza tu networking con tarjetas digitales NFC. Comparte tu información profesional y redes sociales con un solo toque. Solución digital para empresas venezolanas.",
  keywords:
    "tarjetas digitales, NFC, networking, Venezuela, tarjetas de presentación, tecnología, contactos digitales",
  openGraph: {
    title: "Econecta | Tarjetas Digitales NFC en Venezuela",
    description:
      "Moderniza tu networking con tarjetas digitales NFC. Comparte toda tu información con un solo toque.",
    images: ["/og-image.jpg"],
    locale: "es_VE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Econecta | Tarjetas Digitales NFC en Venezuela",
    description: "Moderniza tu networking con tarjetas digitales NFC",
    images: ["/og-image.jpg"],
  },
  robots: "index, follow",
  alternates: {
    canonical: "https://econecta.io",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased ${urbanist.variable}`}>
        {children}
        <Script
          src="https://analytics.econecta.io/script.js"
          data-website-id="4b446d35-a5ef-4060-ab02-cb508f70d5e7"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
