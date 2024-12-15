import React from "react";
import { Metadata } from "next";
import { Empty } from "antd";

type CardData = {
  brandLogo?: boolean;
  brandLogoPath?: string;
  imagen?: string;
  title: string;
  subtitle?: string;
  card?: {
    Text_color?: string;
    Card_color?: string;
    Button1_color?: string;
    Button1Text_color?: string;
    Button2_color?: string;
    Button2Text_color?: string;
  };
};

type CardProps = {
  params: Promise<{ username: string }>;
};

export async function generateMetadata(props: CardProps): Promise<Metadata> {
  const params = await props.params;
  const { username } = params;

  return {
    title: `${username} | Tarjeta Digital`,
  };
}

export default async function CardPage(props: CardProps) {
  const params = await props.params;
  const { username } = params;

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${username}`);
    if (!response.ok) {
      return (
        <div className="flex items-center justify-center h-screen">
          <Empty description="User not found" />
        </div>
      );
    }

    const userData = await response.json();

    // Extraemos los datos desde `userData.perfil`
    const perfil = userData.perfil || {};
    const {
      brandLogo,
      brandLogoPath,
      imagen,
      title,
      subtitle,
      card = {}, // Accedemos a `card` dentro de `perfil`
    } = perfil;

    const {
      Text_color = "#000000",
      Card_color = "#ffffff",
      Button1_color = "#34A853",
      Button1Text_color = "#ffffff",
      Button2_color = "#4285F4",
      Button2Text_color = "#ffffff",
    } = card;

    return (
      <html lang="es">
        <head>
          <meta charSet="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Tarjeta de {title}</title>
        </head>
        <body
          style={{
            margin: 0,
            padding: 0,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            background: "linear-gradient(to bottom, #f7f0f7, #d5e1f7)",
            fontFamily: "Axiforma, sans-serif",
          }}
        >
          <div
            className="card-container"
            style={{
              color: Text_color,
              backgroundColor: Card_color,
              borderRadius: "15px",
              padding: "20px",
              width: "300px",
              boxShadow: "0 0 13px rgba(0, 0, 0, 0.3)",
              textAlign: "center",
              marginBottom: "15px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {brandLogo && brandLogoPath && (
              <img
                src={brandLogoPath}
                alt="Brand Logo"
                className="rah-logo"
                style={{
                  width: "250px",
                  marginBottom: "15px",
                }}
              />
            )}

            {imagen && (
              <img
                src={imagen}
                alt="User Photo"
                className="user-photo"
                style={{
                  width: "100px",
                  height: "100px",
                  objectFit: "cover",
                  borderRadius: "50%",
                  marginBottom: "15px",
                }}
              />
            )}

            <h1 style={{ fontWeight: "bold", fontSize: "24px", margin: "0 0 0px", color: Text_color }}>{title}</h1>
            {subtitle && (
              <h2 style={{ fontSize: "14px", fontWeight: "normal", color: Text_color, marginBottom: "20px" }}>
                {subtitle}
              </h2>
            )}

            <div
              className="qr-code"
              style={{
                backgroundColor: "white",
                borderRadius: "15px",
                padding: "10px",
                boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
                marginBottom: "30px",
              }}
            >
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=https://econecta.io/${username}`}
                alt="Código QR"
                style={{ width: "110px", height: "110px", borderRadius: "10px" }}
              />
            </div>
          </div>

          <div
            className="action-buttons"
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "300px",
              margin: "0 auto",
            }}
          >
            <a
              href={`whatsapp://send?text=Visita mi tarjeta digital: https://econecta.io/${username}`}
              className="button green-button"
              style={{
                padding: "10px 20px",
                fontSize: "16px",
                fontWeight: "bold",
                color: Button1Text_color,
                backgroundColor: Button1_color,
                borderRadius: "5px",
                textDecoration: "none",
                textAlign: "center",
                width: "50%",
                marginRight: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <img
                src="https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/whatsapp-white-icon.png"
                alt="WhatsApp"
                style={{ width: "20px", height: "20px", marginRight: "8px" }}
              />
              Compartir
            </a>

            <a
              href={`https://econecta.io/${username}`}
              className="button purple-button"
              style={{
                padding: "10px 20px",
                fontSize: "16px",
                fontWeight: "bold",
                color: Button2Text_color,
                backgroundColor: Button2_color,
                borderRadius: "5px",
                textDecoration: "none",
                textAlign: "center",
                width: "50%",
                marginLeft: "10px",
              }}
            >
              Ver Perfil
            </a>
          </div>
        </body>
      </html>
    );
  } catch (error) {
    console.error("Error fetching card data:", error);
    return (
      <div className="flex items-center justify-center h-screen">
        <Empty description="Error loading user card" />
      </div>
    );
  }
}
