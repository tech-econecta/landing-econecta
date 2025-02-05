import React from "react";
import { Metadata, ResolvingMetadata } from "next";
import { Empty } from "antd";
import { Perfil, UserData } from "../page";
import { url } from "inspector";

type CardProps = {
  params: Promise<{ username: string }>;
};

export async function generateMetadata(
  props: CardProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const params = await props.params;
  const { username } = params;
  const defaultMetaData = await parent;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/users/${username}`
    );

    if (!response.ok) {
      // console.log(`Error fetching user data for username: ${username}`);
      return {
        title: "User Not Found",
      };
    }

    const { perfil }: UserData = await response.json();
    const favicon = perfil.imagen || defaultMetaData.icons?.icon;

    return {
      title: `${username} | Tarjeta Digital`,
      openGraph: {
        images: perfil.imagen || defaultMetaData.openGraph?.images,
        type: "website",
      },
      icons: {
        icon: favicon,
        apple: perfil.imagen || defaultMetaData.icons?.icon,
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Error",
    };
  }
}

export default async function CardPage(props: CardProps) {
  const params = await props.params;
  const { username } = params;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/users/${username}`
    );
    if (!response.ok) {
      return (
        <div className="flex items-center justify-center h-screen">
          <Empty description="User not found" />
        </div>
      );
    }

    const userData = (await response.json()) as { perfil: Perfil };

    // Extraemos los datos desde `userData.perfil`
    const perfil = userData.perfil || {};
    const {
      brandLogo,
      brandLogoPath,
      imagen,
      title,
      subtitle,
      card, // Accedemos a `card` dentro de `perfil`,
      customFontUrl,
    } = perfil;

    const {
      textColor = "#000000",
      cardColor = "#ffffff",
      Button1Color = "#000000",
      Button1TextColor = "#ffffff",
      Button2Color = "#DE1E25",
      Button2TextColor = "#ffffff",
    } = card || {};

    const familyFont: React.CSSProperties = customFontUrl
      ? {
          fontFamily: new URL(customFontUrl).searchParams.get(
            "family"
          ) as string,
        }
      : {};

    return (
      <html lang="en">
        <style>{`@import url('${customFontUrl}')`}</style>

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
            ...familyFont,
          }}
        >
          <div
            className="card-container"
            style={{
              color: textColor,
              backgroundColor: cardColor,
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

            <h1
              style={{
                fontWeight: "bold",
                fontSize: "24px",
                margin: "0 0 0px",
                color: textColor,
              }}
            >
              {title}
            </h1>
            {subtitle && (
              <h2
                style={{
                  fontSize: "16px",
                  fontWeight: "normal",
                  color: textColor,
                  marginBottom: "20px",
                }}
              >
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
                style={{
                  width: "110px",
                  height: "110px",
                  borderRadius: "10px",
                }}
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
                color: Button1TextColor,
                backgroundColor: Button1Color,
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
                color: Button2TextColor,
                backgroundColor: Button2Color,
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
          {/* Ícono centrado debajo de los botones */}
          <div className="flex justify-center mt-5">
            <img src="/Iso3.png" alt="Icon" className="h-10 w-auto" />
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
