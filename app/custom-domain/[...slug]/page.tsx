import { headers } from "next/headers";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/firebase";
import { notFound } from "next/navigation";
import { Metadata, ResolvingMetadata } from "next";
import ProfilePage, { generateMetadata as generateProfileMetadata } from "@/app/[username]/page";
import CardPage, { generateMetadata as generateCardMetadata } from "@/app/[username]/card/page";

export const dynamic = "force-dynamic";

type CustomDomainProps = {
  params: Promise<{ slug: string[] }>;
};

// Función auxiliar para obtener el username/ID mapeado al dominio personalizado
async function getResolvedUsername(customDomain: string, slug0: string) {
  const domainsRef = collection(db, "custom_domains");
  const domainQuery = query(
    domainsRef,
    where("domain", "==", customDomain),
    where("enabled", "==", true)
  );
  const domainSnap = await getDocs(domainQuery);

  if (domainSnap.empty) {
    return null;
  }

  const { prefix } = domainSnap.docs[0].data();
  return `${prefix || ""}${slug0}`;
}

export async function generateMetadata(
  props: CustomDomainProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = await props.params;
  const headersList = await headers();
  const customDomain = headersList.get("x-custom-domain") || headersList.get("host")?.replace(/:\d+$/, "");

  if (!customDomain || !slug?.[0]) {
    return { title: "Tarjeta Digital" };
  }

  try {
    const username = await getResolvedUsername(customDomain, slug[0]);
    if (!username) return { title: "Tarjeta Digital" };

    // Si es la ruta /card
    if (slug.length >= 2 && slug[1] === "card") {
      return generateCardMetadata({ params: Promise.resolve({ username }) }, parent);
    }

    // Por defecto, perfil completo
    return generateProfileMetadata({ params: Promise.resolve({ username }) }, parent);
  } catch (error) {
    console.error("Error generating custom domain metadata:", error);
    return { title: "Tarjeta Digital" };
  }
}

export default async function CustomDomainPage(props: CustomDomainProps) {
  const { slug } = await props.params;
  const headersList = await headers();
  const customDomain = headersList.get("x-custom-domain") || headersList.get("host")?.replace(/:\d+$/, "");

  console.log(`[CustomDomain] Solicitud recibida: host=${customDomain}, slug=${slug?.join("/")}`);

  if (!customDomain || !slug || slug.length === 0) {
    console.log(`[CustomDomain] Petición inválida o incompleta.`);
    return notFound();
  }

  try {
    const username = await getResolvedUsername(customDomain, slug[0]);
    if (!username) {
      console.error(`[CustomDomain] El dominio "${customDomain}" no está registrado o está desactivado.`);
      return notFound();
    }

    console.log(`[CustomDomain] Dominio encontrado. Username mapeado: "${username}"`);

    // 1. Delegar a la vista de Tarjeta (Card)
    if (slug.length >= 2 && slug[1] === "card") {
      console.log(`[CustomDomain] Delegando a CardPage para: ${username}`);
      return <CardPage params={Promise.resolve({ username })} />;
    }

    // 2. Delegar a la vista de Perfil Completo
    console.log(`[CustomDomain] Delegando a ProfilePage para: ${username}`);
    return <ProfilePage params={Promise.resolve({ username })} />;
  } catch (error) {
    console.error("[CustomDomain] Error crítico delegando la petición:", error);
    return notFound();
  }
}

