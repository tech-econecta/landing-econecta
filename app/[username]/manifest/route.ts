import { NextResponse } from "next/server";
import { getUser } from "../action-get.user";

export async function GET(
  request: Request,
  props: { params: Promise<{ username: string }> }
) {
  const params = await props.params;
  const { username } = params;

  try {
    const response = await getUser(username);

    if (response.error || !response.perfil) {
      // Manifest por defecto si no se encuentra el usuario
      const defaultManifest = {
        id: `/${username}`,
        name: "Econecta",
        short_name: "Econecta",
        description: "Perfil digital en Econecta",
        start_url: `/${username}`,
        scope: `/${username}/`,
        display: "browser",
        background_color: "#ffffff",
        theme_color: "#000000",
        icons: [
          {
            src: "/favicon.ico",
            sizes: "any",
            type: "image/x-icon",
          },
        ],
      };

      return NextResponse.json(defaultManifest, {
        headers: {
          "Content-Type": "application/manifest+json",
        },
      });
    }

    const { perfil } = response;
    const { title, subtitle, imagen, background_color } = perfil;

    const iconUrl = imagen || "/favicon.ico";
    const themeColor = background_color || "#ffffff";
    const backgroundColor = background_color || "#ffffff";

    const manifest = {
      id: `/${username}`,
      name: title || `${username} | Perfil Digital`,
      short_name: title || username,
      description: subtitle || "Perfil digital profesional en Econecta",
      start_url: `/${username}`,
      scope: `/${username}/`,
      display: "browser",
      orientation: "portrait",
      background_color: backgroundColor,
      theme_color: themeColor,
      icons: [
        {
          src: iconUrl,
          sizes: "192x192",
          type: "image/png",
          purpose: "any maskable",
        },
        {
          src: iconUrl,
          sizes: "512x512",
          type: "image/png",
          purpose: "any maskable",
        },
        {
          src: iconUrl,
          sizes: "180x180",
          type: "image/png",
          purpose: "apple-touch-icon",
        },
        {
          src: iconUrl,
          sizes: "180x180",
          type: "image/png",
        },
      ],
      categories: ["business", "social", "productivity"],
      lang: "es",
      dir: "ltr",
    };

    return NextResponse.json(manifest, {
      headers: {
        "Content-Type": "application/manifest+json",
      },
    });
  } catch (error) {
    console.error("Error generating manifest:", error);
    // Manifest por defecto en caso de error
    const defaultManifest = {
      id: `/${username}`,
      name: "Econecta",
      short_name: "Econecta",
      description: "Perfil digital en Econecta",
      start_url: `/${username}`,
      scope: `/${username}/`,
      display: "browser",
      background_color: "#ffffff",
      theme_color: "#000000",
      icons: [
        {
          src: "/favicon.ico",
          sizes: "any",
          type: "image/x-icon",
        },
      ],
    };

    return NextResponse.json(defaultManifest, {
      headers: {
        "Content-Type": "application/manifest+json",
      },
    });
  }
}
