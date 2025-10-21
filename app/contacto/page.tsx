import { Metadata } from "next";
import Navbar from "../components/landing/Navbar";
import Footer from "../components/landing/Footer";
import ContactForm from "../components/landing/ContactForm";
import Breadcrumbs from "../components/Breadcrumbs";
import { Urbanist } from "next/font/google";
const urbanist = Urbanist({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});
export const metadata: Metadata = {
  title: "Contacto | Econecta - Tarjetas Digitales NFC Venezuela",
  description:
    "Contáctanos para obtener más información sobre nuestras tarjetas digitales NFC. Soporte técnico y ventas en Venezuela. Email: ventasve@econecta.io",
  keywords:
    "contacto Econecta, soporte tarjetas NFC Venezuela, ventas digitales Venezuela, contacto Caracas",
  openGraph: {
    title: "Contacto | Econecta - Tarjetas Digitales NFC Venezuela",
    description:
      "Contáctanos para obtener más información sobre nuestras tarjetas digitales NFC. Soporte técnico y ventas en Venezuela.",
    images: ["/og-image.jpg"],
    locale: "es_VE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contacto | Econecta Venezuela",
    description:
      "Contáctanos para tarjetas digitales NFC y soporte técnico en Venezuela",
    images: ["/og-image.jpg"],
  },
  alternates: {
    canonical: "https://econecta.io/contacto",
  },
};

export default function ContactPage() {
  return (
    <section className={urbanist.className}>
      <Navbar />
      <div className={`min-h-screen bg-white`}>
        <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <Breadcrumbs
            items={[{ label: "Inicio", href: "/" }, { label: "Contacto" }]}
          />
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Contáctanos
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Estamos aquí para ayudarte. Contáctanos para obtener más
              información sobre nuestros productos y servicios.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Información de contacto */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                  Información de Contacto
                </h2>
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="shrink-0">
                      <svg
                        className="h-6 w-6 text-blue-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-gray-600">Email</p>
                      <p className="font-medium text-gray-900">
                        ventasve@econecta.io
                      </p>
                      <p className="font-medium text-gray-900">
                        soporte@econecta.io
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="shrink-0">
                      <svg
                        className="h-6 w-6 text-blue-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-gray-600">Ubicación</p>
                      <p className="font-medium text-gray-900">
                        Caracas, Venezuela
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Redes Sociales */}
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                  Síguenos en Redes Sociales
                </h2>
                <div className="flex space-x-6">
                  <a
                    href="https://instagram.com/econecta.io"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <span className="sr-only">Instagram</span>
                    <svg
                      className="h-8 w-8"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                  </a>
                  <a
                    href="mailto:ventasve@econecta.io"
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <span className="sr-only">Email</span>
                    <svg
                      className="h-8 w-8"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M20 4H4c-1.103 0-2 .897-2 2v12c0 1.103.897 2 2 2h16c1.103 0 2-.897 2-2V6c0-1.103-.897-2-2-2zm0 2v.511l-8 6.223-8-6.222V6h16zM4 18V9.044l7.386 5.745a.994.994 0 0 0 1.228 0L20 9.044 20.002 18H4z" />
                    </svg>
                  </a>
                </div>
              </div>

              {/* Horario de Atención */}
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                  Horario de Atención
                </h2>
                <p className="text-gray-600">
                  Lunes a Viernes: 9:00 AM - 6:00 PM
                  <br />
                  Sábados: 9:00 AM - 1:00 PM
                </p>
              </div>
            </div>

            {/* Formulario de Contacto */}
            <div className="bg-white shadow-lg rounded-lg p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                Envíanos un Mensaje
              </h2>
              <ContactForm />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </section>
  );
}
