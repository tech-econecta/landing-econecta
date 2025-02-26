"use client";

import { Poppins } from "next/font/google";
import Navbar from "../components/landing/Navbar";
import Footer from "../components/landing/Footer";

const poppins = Poppins({
  weight: ["400", "600", "700"],
  subsets: ["latin"],
});

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <div className={`min-h-screen bg-white ${poppins.className}`}>
        <div className="max-w-4xl mx-auto px-4 py-16">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Sobre Nosotros
            </h1>
            <div className="w-24 h-1 bg-blue-600 mx-auto"></div>
          </div>

          <div className="prose prose-lg mx-auto">
            <div className="space-y-8">
              <div className="bg-white rounded-lg p-8 shadow-sm">
                <p className="text-gray-600 leading-relaxed mb-6">
                  En Econecta, revolucionamos la manera en que las empresas venezolanas se conectan con sus clientes. 
                  Somos una empresa de desarrollo tecnológico con sede en Caracas, pionera en la creación de software 
                  con inteligencia artificial, diseñado específicamente para satisfacer las necesidades del sector 
                  comercial en Venezuela.
                </p>

                <p className="text-gray-600 leading-relaxed mb-6">
                  Nuestra misión es transformar la comunicación empresarial, optimizando la presentación y gestión 
                  de la información para potenciar la productividad y mejorar la experiencia del cliente. Desde 
                  tarjetas de presentación digitales con tecnología NFC hasta soluciones innovadoras que automatizan 
                  la captación de datos, en Econecta combinamos innovación, eficiencia y sostenibilidad para ofrecer 
                  herramientas de alto impacto.
                </p>

                <p className="text-gray-600 leading-relaxed flex items-center">
                  Creemos en la tecnología como motor de cambio y estamos comprometidos con impulsar a las empresas 
                  venezolanas hacia el futuro digital. 
                  <span className="text-2xl ml-2" role="img" aria-label="rocket">🚀</span>
                </p>
              </div>

              {/* Valores o características adicionales */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                <div className="text-center p-6 bg-gray-50 rounded-lg">
                  <div className="text-3xl mb-4">💡</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Innovación</h3>
                  <p className="text-gray-600">Desarrollando soluciones tecnológicas de vanguardia</p>
                </div>
                
                <div className="text-center p-6 bg-gray-50 rounded-lg">
                  <div className="text-3xl mb-4">🤝</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Compromiso</h3>
                  <p className="text-gray-600">Enfocados en el éxito de nuestros clientes</p>
                </div>
                
                <div className="text-center p-6 bg-gray-50 rounded-lg">
                  <div className="text-3xl mb-4">🎯</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Excelencia</h3>
                  <p className="text-gray-600">Calidad y mejora continua en cada servicio</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
} 