import React from "react";
import { Metadata, ResolvingMetadata } from "next";
import { Empty } from "antd";
import { UserData } from "../action-get.user";
import { redirects } from "../page";
import { redirect } from "next/navigation";
import { getUser } from "../action-get.user";
import CardClient from "./CardClient";
import { headers } from "next/headers";


type CardProps = {
  params: Promise<{ username: string }>;
};

export const dynamic = "force-dynamic";

export async function generateMetadata(
  props: CardProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const params = await props.params;
  const { username } = params;
  const defaultMetaData = await parent;

  try {
    const userData = await getUser(username);

    if (userData.error || !userData.perfil) {
      return {
        title: "User Not Found",
      };
    }

    const perfil = userData.perfil;
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

  // Manejar redirecciones
  if (redirects[username as keyof typeof redirects]) {
    redirect(`/${redirects[username as keyof typeof redirects]}/card`);
  }

  let userData;
  try {
    userData = await getUser(username);
    console.log(`[CardPage] Datos obtenidos para ${username}:`, userData?.error ? "Error: " + userData.error : "Exito (perfil existe)");
  } catch (error) {
    console.error("Error fetching card data:", error);
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Empty description="Error loading user card" />
      </div>
    );
  }

  if (userData?.error || !userData?.perfil) {
    console.log(`[CardPage] Retornando 'User not found' porque userData.error=${userData?.error} o perfil es indefinido`);
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Empty description="User not found" />
      </div>
    );
  }

  // Validación de acceso privado en la tarjeta: si es privada y se accedió por username público,
  // redirigimos automáticamente usando el docID para auto-corregir la URL y no bloquear al usuario.
  const { accessMode, resolvedBy, docId } = userData as any;
  if (accessMode === 'private' && resolvedBy === 'username' && docId) {
    // Caso A: Si tiene redirección activa, redirigir de inmediato al dominio de destino /card con el ID privado
    if (userData.redirect?.enabled && userData.redirect?.url) {
      try {
        const targetUrl = new URL(userData.redirect.url);
        const customDomain = targetUrl.hostname;
        const finalRedirectUrl = `https://${customDomain}/${docId}/card`;
        console.log(`[CardPage] Redirigiendo privado por username a custom domain card: ${finalRedirectUrl}`);
        redirect(finalRedirectUrl);
      } catch (err) {
        console.error("Error resolviendo URL de redirección externa de tarjeta privada:", err);
      }
    }

    // Caso B: Redirigir internamente a la versión de la tarjeta con ID privado
    console.log(`[CardPage] Autocorrigiendo tarjeta privada a url segura: /${docId}/card`);
    redirect(`/${docId}/card`);
  }

  // Redirect a custom domain si está configurado desde el superadmin
  if (userData.redirect?.enabled && userData.redirect?.url) {
    const headersList = await headers();
    const currentHost = headersList.get("host")?.replace(/:\d+$/, "") || "";
    
    let shouldRedirect = true;
    try {
      const targetUrl = new URL(userData.redirect.url);
      if (currentHost === targetUrl.host) {
        console.log(`[CardPage] Ya estamos en el dominio de destino ${currentHost}. Mostrando tarjeta localmente sin redirigir al perfil.`);
        shouldRedirect = false;
      } else {
        // Redirigir al dominio personalizado PERO a la ruta de la tarjeta (/card), no al perfil completo
        const cleanPathname = targetUrl.pathname === "/" ? "" : targetUrl.pathname;
        const finalRedirectUrl = `https://${targetUrl.host}${cleanPathname}/card`;
        console.log(`[CardPage] Redirigiendo a la tarjeta en el dominio personalizado: ${finalRedirectUrl}`);
        redirect(finalRedirectUrl);
      }
    } catch (e) {
      console.error("Error al procesar redirección en tarjeta:", e);
    }
  }

  console.log(`[CardPage] Renderizando tarjeta para ${username} localmente (sin redireccion)`);
  const perfil = userData.perfil;

  // Calcular la URL de compartir según la configuración
  let shareUrl = `https://econecta.io/${username}`;
  if (userData.redirect?.enabled && userData.redirect?.url) {
    // Si tiene redirección activa, usar la URL de redirección como enlace de compartir
    shareUrl = userData.redirect.url;
  } else if (accessMode === 'private' && docId) {
    // Si es privado sin redirección, usar el docID
    shareUrl = `https://econecta.io/${docId}`;
  }

  return <CardClient perfil={perfil} username={username} shareUrl={shareUrl} />;
}
