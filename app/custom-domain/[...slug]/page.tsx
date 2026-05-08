import { headers } from "next/headers";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/firebase";
import CardClient from "@/app/[username]/card/CardClient";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getUser } from "@/app/[username]/action-get.user";
import ReplaceRedirect from "@/app/components/ReplaceRedirect";

export const dynamic = "force-dynamic";

type CustomDomainProps = {
  params: Promise<{ slug: string[] }>;
};

export async function generateMetadata(
  props: CustomDomainProps
): Promise<Metadata> {
  const { slug } = await props.params;
  const headersList = await headers();
  const customDomain = headersList.get("x-custom-domain") || headersList.get("host")?.replace(/:\d+$/, "");

  if (!customDomain || !slug?.[0]) {
    return { title: "Tarjeta Digital" };
  }

  try {
    const domainsRef = collection(db, "custom_domains");
    const domainQuery = query(
      domainsRef,
      where("domain", "==", customDomain),
      where("enabled", "==", true)
    );
    const domainSnap = await getDocs(domainQuery);

    if (domainSnap.empty) {
      return { title: "Tarjeta Digital" };
    }

    const { prefix } = domainSnap.docs[0].data();
    const username = `${prefix || ""}${slug[0]}`;

    const userData = await getUser(username);

    if (userData.error || !userData.perfil) {
      return { title: "Tarjeta Digital" };
    }

    const perfil = userData.perfil;

    return {
      title: perfil.title || `${slug[0]} | Tarjeta Digital`,
      description: perfil.subtitle || "Tarjeta digital profesional",
      openGraph: {
        title: perfil.title || `${slug[0]} | Tarjeta Digital`,
        description: perfil.subtitle || "Tarjeta digital profesional",
        images: [perfil.imagen || "/og-image.jpg"],
        type: "website",
      },
      icons: {
        icon: perfil.imagen || "/favicon.ico",
        apple: perfil.imagen || "/favicon.ico",
      },
    };
  } catch (error) {
    console.error("Error generating custom domain metadata:", error);
    return { title: "Tarjeta Digital" };
  }
}

export default async function CustomDomainPage(props: CustomDomainProps) {
  const { slug } = await props.params;
  const headersList = await headers();
  // El middleware debería setear x-custom-domain, pero si no, probamos con el host header
  const customDomain = headersList.get("x-custom-domain") || headersList.get("host")?.replace(/:\d+$/, "");

  console.log(`[CustomDomain] Solicitud recibida: host=${customDomain}, slug=${slug?.join("/")}`);

  if (!customDomain || !slug || slug.length === 0) {
    console.log(`[CustomDomain] Petición inválida o incompleta.`);
    return notFound();
  }

  try {
    // 1. Buscar el dominio custom en Firestore
    const domainsRef = collection(db, "custom_domains");
    const domainQuery = query(
      domainsRef,
      where("domain", "==", customDomain),
      where("enabled", "==", true)
    );
    
    console.log(`[CustomDomain] Consultando Firestore para el dominio: ${customDomain}`);
    const domainSnap = await getDocs(domainQuery);

    if (domainSnap.empty) {
      console.error(`[CustomDomain] El dominio "${customDomain}" no está registrado o está desactivado en Firestore.`);
      return notFound();
    }

    const domainData = domainSnap.docs[0].data();
    const prefix = domainData.prefix || "";
    const username = `${prefix}${slug[0]}`;
    
    console.log(`[CustomDomain] Dominio encontrado. Prefix="${prefix}". Username a buscar: "${username}"`);

    // 2. Buscar el usuario usando la lógica compartida (soporta case-insensitive)
    const userData = await getUser(username);

    if (userData.error) {
      console.error(`[CustomDomain] Error al buscar usuario "${username}": ${userData.error}`);
      return notFound();
    }

    if (!userData.perfil) {
      console.error(`[CustomDomain] El usuario "${username}" no tiene un perfil configurado.`);
      return notFound();
    }

    console.log(`[CustomDomain] Usuario encontrado exitosamente: ${username}`);

    // --- Lógica de Redirección ---
    const redirectConfig = userData.redirect;
    if (redirectConfig?.enabled && redirectConfig?.url) {
      console.log(`[CustomDomain-Redirect] Redirigiendo a: ${redirectConfig.url}`);
      return <ReplaceRedirect url={redirectConfig.url} />;
    }
    // ----------------------------

    // 3. Renderizar la tarjeta
    return <CardClient perfil={userData.perfil} username={username} />;
  } catch (error) {
    console.error("[CustomDomain] Error crítico en el proceso de resolución:", error);
    return notFound();
  }
}

