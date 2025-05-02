"use client";

import React, { useEffect, useState, useRef } from "react";
import { Carousel } from "antd";

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
  height: "auto", // Altura del carrusel
  display: "flex",
  paddingTop: "10px",
  justifyContent: "center",
  alignItems: "center",
  overflow: "hidden",
  cursor: "pointer",
};

const AppCarousel: React.FC<CarouselProps> = ({ slides }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const carouselRef = useRef<any>(null);
  const [autoplay, setAutoplay] = useState(true);

  // Detectar si es un dispositivo móvil
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    // Comprobar al cargar
    checkMobile();

    // Actualizar al cambiar el tamaño de la ventana
    window.addEventListener("resize", checkMobile);

    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  // Actualizar el autoplay del carrusel según el estado del video
  useEffect(() => {
    setAutoplay(!isVideoPlaying);
  }, [isVideoPlaying]);

  const handleSlideClick = (url: string) => {
    if (url) {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  const handleVideoPlay = (event: React.MouseEvent<HTMLVideoElement>) => {
    // Detener la propagación para evitar que se active handleSlideClick
    event.stopPropagation();

    // Obtener el elemento de video y solicitar pantalla completa
    const video = event.currentTarget;

    // En móviles, siempre intentar ir a pantalla completa para mejor experiencia
    if (isMobile || video.requestFullscreen) {
      video.requestFullscreen();
    } else if (video.webkitRequestFullscreen) {
      video.webkitRequestFullscreen();
    } else if (video.msRequestFullscreen) {
      video.msRequestFullscreen();
    }
  };

  // Manejadores de eventos para video
  const handleVideoStateChange = (
    event: React.SyntheticEvent<HTMLVideoElement, Event>
  ) => {
    const video = event.currentTarget;
    setIsVideoPlaying(!video.paused);
  };

  return (
    <Carousel
      autoplay={autoplay}
      infinite
      arrows
      dots={false}
      ref={carouselRef}
      autoplaySpeed={3000}
      pauseOnHover
      pauseOnDotsHover
    >
      {slides.map((slide, index) => (
        <div key={index} onClick={() => handleSlideClick(slide.url)}>
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
                ...contentStyle,
                objectFit: "contain",
                width: isMobile ? "100%" : contentStyle.width,
                height: isMobile ? "auto" : contentStyle.height,
              }}
            />
          ) : (
            <img
              src={slide.image}
              alt={`Slide ${index + 1}`}
              style={{
                ...contentStyle,
                objectFit: "contain",
              }}
            />
          )}
        </div>
      ))}
    </Carousel>
  );
};

export default AppCarousel;
