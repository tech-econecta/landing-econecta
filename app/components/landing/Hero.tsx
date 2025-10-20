import Image from "next/image";

export default function Hero() {
  return (
    <div className="relative bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Imagen para móvil (arriba del texto) */}
        <div className="relative hidden">
          <Image
            src="/card-hero.png"
            alt="Tarjeta digital NFC Econecta - Moderniza tu networking profesional compartiendo contactos con un solo toque en Venezuela"
            width={600}
            height={400}
            priority
            className="w-full h-auto"
          />
        </div>

        <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
          <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
            <div className="text-center lg:text-left">
              <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                <span className="block">Tu presencia digital</span>
                <span className="block text-blue-600">en una tarjeta</span>
              </h1>
              <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                Comparte tu información de contacto y redes sociales con un solo
                toque. Moderniza tu networking con nuestra tarjeta digital NFC.
              </p>
              <div className="mt-5 sm:mt-8 flex justify-center lg:justify-start">
                <div className="rounded-md shadow scale-[0.8]">
                  <a
                    href="https://my.econecta.io/"
                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10"
                  >
                    Obtén tu tarjeta
                  </a>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Imagen para desktop (lado derecho) */}
      <div className="hidden lg:block lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
        <Image
          src="/card-hero.png"
          alt="Tarjeta digital Econecta - Comparte tu información profesional con NFC"
          width={600}
          height={400}
          priority
          className="h-full w-full object-cover"
        />
      </div>
    </div>
  );
}
