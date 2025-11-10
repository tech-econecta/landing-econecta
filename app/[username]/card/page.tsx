import React from "react";
import { Metadata, ResolvingMetadata } from "next";
import { Empty } from "antd";
import { UserData } from "../action-get.user";
import { redirects } from "../page";
import { redirect } from "next/navigation";
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
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/users/${username}`
    );

    if (!response.ok) {
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

  // Manejar redirecciones
  if (redirects[username as keyof typeof redirects]) {
    redirect(`/${redirects[username as keyof typeof redirects]}/card`);
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/users/${username}`
    );

    if (!response.ok) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <Empty description="User not found" />
        </div>
      );
    }

    const userData = (await response.json()) as UserData;
    const perfil = userData.perfil;

    return <CardClient perfil={perfil} username={username} />;
  } catch (error) {
    console.error("Error fetching card data:", error);
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Empty description="Error loading user card" />
      </div>
    );
  }
}
