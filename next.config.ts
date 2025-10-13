import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Optimiza el build para producción
  output: "standalone",

  // Configuración de imágenes
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "econecta.io",
      },
      {
        protocol: "https",
        hostname: "www.econecta.io",
      },
    ],
  },

  // Habilita compresión
  compress: true,

  // Headers de seguridad
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
