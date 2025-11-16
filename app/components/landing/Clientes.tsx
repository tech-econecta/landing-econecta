"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

export default function Clientes() {
  const logos = [
    "/client1.png",
    "/client2.png",
    "/client3.png",
    "/client4.png",
  ];

  // Duplicamos los logos para crear un loop infinito más suave
  const duplicatedLogos = [...logos, ...logos];

  return (
    <div className="relative bg-white py-12 sm:py-16 md:py-24 overflow-hidden">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-lg sm:text-xl font-semibold leading-8 text-gray-900 px-4 mb-8 sm:mb-12">
          Confían en nosotros más de 2000 profesionales y empresas
        </h2>

        {/* Carrusel infinito con Swiper */}
        <div className="relative">
          {/* Contenedor del carrusel con Swiper */}
          <Swiper
            modules={[Autoplay]}
            spaceBetween={30}
            slidesPerView="auto"
            loop={true}
            autoplay={{
              delay: 0,
              disableOnInteraction: false,
            }}
            speed={3000}
            allowTouchMove={false}
            breakpoints={{
              640: {
                spaceBetween: 40,
              },
              768: {
                spaceBetween: 50,
              },
            }}
            className="overflow-visible!"
          >
            {duplicatedLogos.map((logo, index) => (
              <SwiperSlide key={index} className="w-auto!">
                <div className="flex items-center justify-center mx-3 sm:mx-4 md:mx-6">
                  <div className="relative group">
                    <img
                      className="max-h-10 sm:max-h-12 md:max-h-16 w-auto object-contain group-hover:opacity-100 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-300 group-hover:scale-110"
                      src={logo}
                      alt={`Cliente ${(index % logos.length) + 1}`}
                      loading="lazy"
                    />
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </div>
  );
}
