"use client";

import React, { useEffect, useState } from "react";
// Importar Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
// Importar Swiper modules
import { Autoplay, Pagination, Navigation } from "swiper/modules";

// Importar Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

// Extender la interfaz HTMLVideoElement para incluir métodos específicos del navegador
declare global {
  interface HTMLVideoElement {
    webkitRequestFullscreen?: () => Promise<void>;
    msRequestFullscreen?: () => Promise<void>;
  }
}

type Slide = {
  image?: string;
  url: string;
  video?: string;
};

type CarouselProps = {
  slides: Slide[];
};

const contentStyle: React.CSSProperties = {
  width: "100%",
  height: "auto",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  overflow: "hidden",
  cursor: "pointer",
};

const AppCarousel: React.FC<CarouselProps> = ({ slides }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [autoplayConfig, setAutoplayConfig] = useState<any>({
    delay: 3000,
    disableOnInteraction: false,
  });

  // Detectar si es un dispositivo móvil
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  const handleSlideClick = (url: string) => {
    if (url) {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  const handleVideoPlay = (event: React.MouseEvent<HTMLVideoElement>) => {
    event.stopPropagation();
    const video = event.currentTarget;

    if (isMobile || video.requestFullscreen) {
      video.requestFullscreen();
    } else if (video.webkitRequestFullscreen) {
      video.webkitRequestFullscreen();
    } else if (video.msRequestFullscreen) {
      video.msRequestFullscreen();
    }
  };

  const handleVideoStateChange = (
    event: React.SyntheticEvent<HTMLVideoElement, Event>
  ) => {
    const video = event.currentTarget;
    setIsVideoPlaying(!video.paused);
  };

  return (
    <div className="w-full relative px-4">
      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        spaceBetween={10}
        slidesPerView={1}
        loop={true}
        autoplay={isVideoPlaying ? false : autoplayConfig}
        pagination={{ clickable: true }}
        className="rounded-xl overflow-hidden"
        style={{
          "--swiper-pagination-color": "#3359fe",
          "--swiper-navigation-color": "#3359fe",
        } as React.CSSProperties}
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index} onClick={() => handleSlideClick(slide.url)}>
            <div style={contentStyle}>
              {slide.video ? (
                <video
                  src={slide.video}
                  controls
                  onClick={handleVideoPlay}
                  playsInline={isMobile}
                  onPlay={handleVideoStateChange}
                  onPause={handleVideoStateChange}
                  onEnded={handleVideoStateChange}
                  style={{
                    objectFit: "contain",
                    width: "100%",
                    height: "auto",
                    borderRadius: "12px",
                  }}
                />
              ) : (
                <img
                  src={slide.image}
                  alt={`Slide ${index + 1}`}
                  style={{
                    objectFit: "contain",
                    width: "100%",
                    height: "auto",
                    borderRadius: "12px",
                  }}
                />
              )}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      
      <style jsx global>{`
        .swiper-pagination-bullet {
          background: #ccc;
          opacity: 1;
        }
        .swiper-pagination-bullet-active {
          background: #3359fe !important;
        }
      `}</style>
    </div>
  );
};

export default AppCarousel;
