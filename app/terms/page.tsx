"use client";

import { Poppins } from "next/font/google";

const poppins = Poppins({
  weight: ["400", "600", "700"],
  subsets: ["latin"],
});

export default function TermsPage() {
  return (
    <div className={`min-h-screen bg-white ${poppins.className}`}>
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Términos y Condiciones
        </h1>

        <div className="prose prose-lg mx-auto">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              1. Recopilación y Uso de Datos
            </h2>
            <p className="text-gray-600 mb-4">
              En [Nombre de la Empresa], recopilamos y procesamos información personal para proporcionar nuestros servicios de tarjetas NFC. Esta información incluye, pero no se limita a:
            </p>
            <ul className="list-disc pl-6 text-gray-600">
              <li>Nombre completo</li>
              <li>Información de contacto profesional</li>
              <li>Enlaces a redes sociales</li>
              <li>Imagen de perfil</li>
              <li>Información empresarial</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              2. Uso de la Información
            </h2>
            <p className="text-gray-600 mb-4">
              Utilizamos su información para:
            </p>
            <ul className="list-disc pl-6 text-gray-600">
              <li>Crear y mantener su perfil digital</li>
              <li>Mejorar nuestros servicios</li>
              <li>Proporcionar soporte técnico</li>
              <li>Enviar actualizaciones importantes sobre el servicio</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              3. Derechos del Usuario
            </h2>
            <p className="text-gray-600 mb-4">
              Usted tiene derecho a:
            </p>
            <ul className="list-disc pl-6 text-gray-600">
              <li>Acceder a sus datos personales</li>
              <li>Solicitar la corrección de datos inexactos</li>
              <li>Solicitar la eliminación de sus datos</li>
              <li>Oponerse al procesamiento de sus datos</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              4. Eliminación de Datos
            </h2>
            <p className="text-gray-600 mb-4">
              Puede solicitar la eliminación de sus datos en cualquier momento enviando un correo electrónico a soporte@econecta.io. Procesaremos su solicitud en un plazo máximo de 30 días.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              5. Seguridad
            </h2>
            <p className="text-gray-600 mb-4">
              Implementamos medidas de seguridad técnicas y organizativas apropiadas para proteger sus datos personales contra el acceso, modificación, divulgación o destrucción no autorizada.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              6. Contacto
            </h2>
            <p className="text-gray-600">
              Si tiene preguntas sobre estos términos y condiciones o sobre el manejo de sus datos personales, contáctenos en soporte@econecta.io.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
