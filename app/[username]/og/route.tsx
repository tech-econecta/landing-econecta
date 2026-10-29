import { ImageResponse } from "next/og";
import { NextResponse } from "next/server";
import { getUser } from "../action-get.user";

// Formatos que soporta ImageResponse (Satori); WebP y otros no
const SUPPORTED_TYPES = ["image/png", "image/jpeg", "image/jpg", "image/svg+xml"];

export async function GET(
  request: Request,
  props: { params: Promise<{ username: string }> }
) {
  const { username } = await props.params;
  const fallback = new URL("/og-image.jpg", request.url);

  try {
    const response = await getUser(username);
    const perfil = response.perfil;
    const src = perfil?.imagen || perfil?.brandLogoPath;
    if (response.error || !src) return NextResponse.redirect(fallback);

    const isLogo = !perfil.imagen;
    const imageRes = await fetch(src);
    const contentType = imageRes.headers.get("content-type")?.split(";")[0] || "";
    if (!imageRes.ok || !SUPPORTED_TYPES.includes(contentType)) {
      return NextResponse.redirect(src);
    }
    const dataUrl = `data:${contentType};base64,${Buffer.from(await imageRes.arrayBuffer()).toString("base64")}`;

    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: perfil.background_color || "#ffffff",
          }}
        >
          {isLogo ? (
            // WhatsApp recorta un cuadrado central (630x630): el logo debe caber ahí con margen
            <img src={dataUrl} alt="" width={500} height={380} style={{ objectFit: "contain" }} />
          ) : (
            <img
              src={dataUrl}
              alt=""
              width={440}
              height={440}
              style={{ objectFit: "cover", borderRadius: "50%" }}
            />
          )}
        </div>
      ),
      {
        width: 1200,
        height: 630,
        headers: { "Cache-Control": "public, max-age=86400" },
      }
    );
  } catch (error) {
    console.error("Error generating OG image:", error);
    return NextResponse.redirect(fallback);
  }
}
