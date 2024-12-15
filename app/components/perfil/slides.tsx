"use client";

import React from "react";
import { Carousel } from "antd";

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
  const handleSlideClick = (url: string) => {
    if (url) {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <Carousel autoplay infinite arrows dots={false}>
      {slides.map((slide, index) => (
        <div key={index} onClick={() => handleSlideClick(slide.url)}>
          {slide.video ? (
            <video
              src={slide.video}
              controls
              style={{
                ...contentStyle,
                objectFit: "contain",
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
