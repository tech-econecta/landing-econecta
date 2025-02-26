import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { Analytics } from '@vercel/analytics/react';

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: 'Econecta | Tarjetas Digitales NFC en Venezuela',
  description: 'Moderniza tu networking con tarjetas digitales NFC. Comparte tu información profesional y redes sociales con un solo toque. Solución digital para empresas venezolanas.',
  keywords: 'tarjetas digitales, NFC, networking, Venezuela, tarjetas de presentación, tecnología, contactos digitales',
  openGraph: {
    title: 'Econecta | Tarjetas Digitales NFC en Venezuela',
    description: 'Moderniza tu networking con tarjetas digitales NFC. Comparte toda tu información con un solo toque.',
    images: ['/og-image.jpg'],
    locale: 'es_VE',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Econecta | Tarjetas Digitales NFC en Venezuela',
    description: 'Moderniza tu networking con tarjetas digitales NFC',
    images: ['/og-image.jpg'],
  },
  robots: 'index, follow',
  alternates: {
    canonical: 'https://econecta.io'
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
