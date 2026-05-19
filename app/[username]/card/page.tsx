import React from "react";
import { Metadata, ResolvingMetadata } from "next";
import { Empty } from "antd";
import { UserData } from "../action-get.user";
import { redirects } from "../page";
import { redirect } from "next/navigation";
import { getUser } from "../action-get.user";
import CardClient from "./CardClient";

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

  // Validación de acceso privado en la tarjeta también
  const { accessMode, resolvedBy, docId } = userData as any;
  if (accessMode === 'private' && resolvedBy === 'username') {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50 gap-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-sm text-center space-y-4">
          <h1 className="text-xl font-bold text-gray-800">Tarjeta Privada</h1>
          <p className="text-gray-500 text-sm">
            Esta tarjeta no está disponible de forma pública. Necesitas un enlace privado para acceder.
          </p>
        </div>
      </div>
    );
  }

  // Redirect a custom domain si está configurado desde el superadmin
  if (userData.redirect?.enabled && userData.redirect?.url) {
    console.log(`[CardPage] Redirigiendo a custom domain configurado para ${username}: ${userData.redirect.url}`);
    redirect(userData.redirect.url);
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
