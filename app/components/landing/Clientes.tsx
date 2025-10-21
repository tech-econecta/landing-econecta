"use client";

export default function Clientes() {
  const logos = [
    "/client1.png",
    "/client2.png",
    "/client3.png",
    "/client4.png",
  ];

  return (
    <div className="bg-white py-12 sm:py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-lg sm:text-xl font-semibold leading-8 text-gray-900 px-4">
          Confían en nosotros más de 2000 profesionales y empresas
        </h2>

        {/* Vista móvil: Scroll horizontal */}
        <div className="md:hidden mt-8 overflow-x-auto pb-4">
          <div className="flex space-x-8 min-w-max px-4">
            {logos.map((logo, index) => (
              <div key={index} className="flex-none w-40">
                <div className="flex justify-center items-center">
                  <img
                    className="max-h-12 w-auto object-contain grayscale hover:grayscale-0 transition-all"
                    src={logo}
                    alt={`Cliente ${index + 1}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Vista tablet/desktop: Grid */}
        <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-8 mt-10">
          {logos.map((logo, index) => (
            <div key={index} className="flex justify-center items-center">
              <img
                className="max-h-12 w-auto object-contain grayscale hover:grayscale-0 transition-all"
                src={logo}
                alt={`Cliente ${index + 1}`}
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
