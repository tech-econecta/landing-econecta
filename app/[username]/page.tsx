import { Metadata, ResolvingMetadata } from "next";
import Buttons from "../components/perfil/buttons";
import AppCarousel from "../components/perfil/slides";
import Captador from "../components/perfil/captador";
import VisitTracker from "../components/VisitTracker";
import AddToHomeScreen from "../components/perfil/AddToHomeScreen";
import ServiceWorkerRegistration from "../components/perfil/ServiceWorkerRegistration";
import { Empty } from "antd";
import { getUser } from "./action-get.user";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import ReplaceRedirect from "../components/ReplaceRedirect";
import { registerUserVisit } from "../lib/visit";
import { getGeoInfo, getClientIpFromHeaders, parseUserAgent } from "../lib/geo";

type ProfileProps = {
  params: Promise<{ username: string }>;
};

export const dynamic = "force-dynamic";

export async function generateMetadata(
  props: ProfileProps,
  _parent: ResolvingMetadata,
): Promise<Metadata> {
  const params = await props.params;
  const { username } = params;

  try {
    const response = await getUser(username);

    if (response.error) {
      return {
        title: "Usuario no encontrado",
        description: "Este perfil no existe en Econecta",
        openGraph: {
          title: "Usuario no encontrado",
          description: "Este perfil no existe en Econecta",
          images: ["/og-image.jpg"],
        },
      };
    }

    const { perfil = {} } = (response || {}) as any;

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://econecta.io";

    return {
      title: perfil?.title || `${username} | Perfil Digital`,
      description: perfil?.subtitle || "Perfil digital profesional en Econecta",
      manifest: `/${username}/manifest`,
      openGraph: {
        title: perfil?.title || `${username} | Perfil Digital`,
        description:
          perfil?.subtitle || "Perfil digital profesional en Econecta",
        images: [perfil?.imagen || "/og-image.jpg"],
        type: "profile",
      },
      twitter: {
        card: "summary_large_image",
        title: perfil?.title || `${username} | Perfil Digital`,
        description:
          perfil?.subtitle || "Perfil digital profesional en Econecta",
        images: [perfil?.imagen || "/og-image.jpg"],
      },
      icons: [
        {
          rel: "icon",
          url: perfil?.imagen || "/favicon.ico",
        },
        {
          rel: "apple-touch-icon",
          url: perfil?.imagen || "/favicon.ico",
        },
      ],
      other: {
        "theme-color": perfil?.background_color || "#ffffff",
        "apple-mobile-web-app-capable": "yes",
        "apple-mobile-web-app-status-bar-style": perfil?.background_color
          ? "black-translucent"
          : "default",
        "apple-mobile-web-app-title": perfil?.title || username,
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Error",
      description: "Ocurrió un error al cargar este perfil",
      openGraph: {
        title: "Error",
        description: "Ocurrió un error al cargar este perfil",
        images: ["/og-image.jpg"],
      },
    };
  }
}

export const redirects = {
  marilusgarcia: "rentahouse.marilusgarcia",
  "autojac.jeanhmuñoz": "autojac.jeanhmunoz",
};

export default async function ProfilePage(props: ProfileProps) {
  const params = await props.params;
  const { username } = params;

  // Decodificar el username para manejar caracteres especiales como la "ñ"
  const decodedUsername = decodeURIComponent(username);
  if (redirects[decodedUsername as keyof typeof redirects]) {
    redirect(`/${redirects[decodedUsername as keyof typeof redirects]}`);
  }

  let response;
  try {
    response = await getUser(username);
  } catch (error) {
    console.error("Error fetching user data:", error);
    return (
      <div className="text-center text-red-500">Error loading user data</div>
    );
  }

  if (response.error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Empty description="User not found" />
      </div>
    );
  }

  // Validación de acceso privado: si el perfil es privado y se accedió por username público,
  // redirigimos automáticamente usando el docID para auto-corregir la URL y no bloquear las tarjetas físicas.
  const { accessMode, resolvedBy, docId, redirect: redirectConfig } = response as any;
  if (accessMode === 'private' && resolvedBy === 'username' && docId) {
    // Caso A: Si tiene redirección activa, redirigir de inmediato al dominio personalizado usando el docID privado
    if (redirectConfig?.enabled && redirectConfig?.url) {
      console.log(`[Profile] Perfil privado accedido por username. Redirigiendo directo al dominio de destino con el ID privado.`);
      // Reemplazar la URL objetivo para que use el docID
      try {
        const targetUrl = new URL(redirectConfig.url);
        const headersList = await headers();
        const customDomain = targetUrl.hostname;
        
        // Registrar la visita antes de redirigir (para analíticas)
        const ip = getClientIpFromHeaders(headersList);
        const userAgent = headersList.get("user-agent") || "";
        const geoInfo = await getGeoInfo(ip);
        const device = parseUserAgent(userAgent);
        
        await registerUserVisit({
          userId: docId,
          ip,
          country: geoInfo.country,
          city: geoInfo.city,
          device: device.type,
          browser: device.browser,
          isRedirect: true
        });

        const finalRedirectUrl = `https://${customDomain}/${docId}`;
        console.log(`[Redirect] TRIGGERED (Private Username Fallback): Redirigiendo a ${finalRedirectUrl}`);
        return <ReplaceRedirect url={finalRedirectUrl} />;
      } catch (err) {
        console.error("Error resolviendo URL de redirección en fallback privado:", err);
      }
    }

    // Caso B: Si es privado sin redirección externa, redirigir internamente a econecta.io/{docID}
    console.log(`[Profile] Perfil privado accedido por username público. Auto-corrigiendo URL a la versión privada por ID: /${docId}`);
    redirect(`/${docId}`);
  }

  const { perfil, captador, redirect: redirectConfig } = response;

  // Log para depuración en producción (se verá en los logs del servidor)
  console.log(`[Profile] Cargando perfil: ${username}. Configuración de redirección:`, JSON.stringify(redirectConfig || { msg: "No config" }));

  // Verificar si el usuario tiene una redirección activa configurada desde el admin
  if (redirectConfig?.enabled && redirectConfig?.url) {
    const headersList = await headers();
    const currentHost = headersList.get("host")?.replace(/:\d+$/, "") || "";
    
    let shouldRedirect = true;
    try {
      const targetUrl = new URL(redirectConfig.url);
      if (currentHost === targetUrl.host) {
        console.log(`[Redirect] SKIPPED: Ya estamos en el dominio de destino ${currentHost}. Mostrando perfil.`);
        shouldRedirect = false;
      }
    } catch (e) {
      console.error("Error al parsear URL de redirección:", e);
    }

    if (shouldRedirect) {
      console.log(`[Redirect] TRIGGERED: Redirigiendo usuario ${username} a ${redirectConfig.url}`);
      
      // Registrar la visita COMPLETA antes de redirigir (server-side)
      // Esta es la ÚNICA oportunidad de capturar analíticas para usuarios redirigidos
      try {
        const ip = getClientIpFromHeaders(headersList);
        const userAgent = headersList.get("user-agent");
        const referrer = headersList.get("referer") || headersList.get("referrer") || undefined;
        
        // Obtener geolocalización completa (con timeout de 3s)
        const geoInfo = await getGeoInfo(ip);
        
        // Parsear información del dispositivo
        const deviceInfo = parseUserAgent(userAgent);
        
        // Registrar visita con TODOS los datos disponibles
        await registerUserVisit(username, ip, geoInfo, deviceInfo, referrer, "redirect");
        
        console.log(`[Analytics] Visita registrada completa para ${username} (redirect). IP: ${ip}, País: ${geoInfo.country}, Device: ${deviceInfo.device}, Browser: ${deviceInfo.browser}`);
      } catch (e) {
        console.error("Error al registrar visita pre-redirección:", e);
      }

      // Realizar la redirección usando un componente de cliente con replace
      return <ReplaceRedirect url={redirectConfig.url} />;
    }
  } else {
    if (redirectConfig) {
      console.log(`[Redirect] NOT TRIGGERED: enabled=${redirectConfig.enabled}, hasUrl=${!!redirectConfig.url}`);
    }
  }

    // Destructuramos para mejorar la claridad del uso de los datos
    const {
      background_path,
      background_color,
      customFontUrl,
      brandLogoPath,
      brandLogo: _brandLogo,
      text_color,
      title,
      title_size,
      subtitle,
      subtitle_size,
      imagen,
      image_size,
      slide_activate: _slide_activate,
      slides,
      buttons,
    } = perfil || {};

    // Determina el fondo (imagen o color)
    const backgroundStyle = background_path
      ? {
          backgroundImage: `url('${background_path}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }
      : { backgroundColor: background_color || "#ffffff" };
    const fontFamily: React.CSSProperties["fontFamily"] = customFontUrl
      ? (new URL(customFontUrl).searchParams.get("family") as string)
      : "var(--font-urbanist)";

    // Función para determinar si necesita logo claro
    const needsLightLogo = (color: string): boolean => {
      if (!color) return false;

      // Convertir el color a RGB
      let r = 0,
        g = 0,
        b = 0;

      // Si es formato hex
      if (color.startsWith("#")) {
        const hex = color.replace("#", "");
        r = parseInt(hex.substring(0, 2), 16);
        g = parseInt(hex.substring(2, 4), 16);
        b = parseInt(hex.substring(4, 6), 16);
      }
      // Si es formato rgb/rgba
      else if (color.startsWith("rgb")) {
        const matches = color.match(/\d+/g);
        if (matches) {
          r = parseInt(matches[0]);
          g = parseInt(matches[1]);
          b = parseInt(matches[2]);
        }
      }

      // Calcular luminosidad usando la fórmula estándar
      const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

      // Detectar si es un color azul (b > r y b > g)
      const isBlueish = b > r && b > g && b > 100;

      // Detectar si es un color verde/cyan oscuro
      const isGreenish = g > r && g > 100;

      // Usar logo claro si:
      // 1. El fondo es oscuro (luminance < 0.5)
      // 2. Es azul con luminance < 0.7 (azules medios como #4169E1)
      // 3. Es verde/cyan con luminance < 0.65
      return (
        luminance < 0.5 ||
        (isBlueish && luminance < 0.7) ||
        (isGreenish && luminance < 0.65)
      );
    };

    // Seleccionar el logo según el color de fondo
    const logoSrc = needsLightLogo(background_color || "#ffffff")
      ? "/Iso2.png"
      : "/Iso3.png";

    return (
      <div
        className={`min-h-screen flex flex-col items-center pt-4 pb-4`}
        style={{ ...backgroundStyle, fontFamily }}
      >
        {/* Registrar Service Worker para PWA - optimizado para móviles */}
        <ServiceWorkerRegistration />
        {/* Componente para registrar visitas desde el cliente */}
        <VisitTracker username={username} />
        {customFontUrl && <style>{`@import url('${customFontUrl}')`}</style>}
        {/* Logo de marca */}
        {brandLogoPath && (
          <div className="p-3">
            <img src={brandLogoPath} alt="Brand Logo" className="h-24 w-auto" />
          </div>
        )}
        {imagen && (
          <div className="p-2">
            <img
              src={imagen}
              alt="User"
              className="rounded-full"
              style={{
                width: `${image_size}px`,
                height: `${image_size}px`,
                objectFit: "cover",
              }}
            />
          </div>
        )}
        {/* Título y subtítulo */}
        <h1
          className="text-center text-clip pl-2 pr-2"
          style={{
            fontSize: `${title_size}px`,
            color: text_color,
            fontWeight: "bold",
            marginBottom: "2px",
            fontFamily,
          }}
        >
          {title}
        </h1>
        <h2
          className="text-center font-semibold"
          style={{
            fontSize: `${subtitle_size}px`,
            fontFamily,
            color: text_color,
          }}
        >
          {subtitle}
        </h2>
        {/* Carrusel condicional */}
        {(slides || [])?.length > 0 && (
          <div className="mb-4 w-full max-w-lg">
            <AppCarousel slides={slides || []} />
          </div>
        )}
        {/* Usa el componente Buttons */}
        <Buttons buttonsData={buttons || []} />
        {/* Botón para agregar a pantalla de inicio */}
        <AddToHomeScreen />
        {/* Ícono centrado debajo de los botones */}
        <div className="flex justify-center mt-4">
          <img
            src={logoSrc}
            alt="Icon"
            className="h-10 w-auto"
            style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))" }}
          />
        </div>
        {/* Modal de captura */}
        {captador && captador?.visible && (
          <Captador
            visible={captador.visible}
            campos={captador.campos}
            backgroundColor={captador.backgroundColor}
            submitColor={captador.submitColor}
            submitTextColor={captador.submitTextColor}
            title={captador.title}
            titleColor={captador.titleColor}
            username={username}
            isMandatory={captador.isMandatory}
          />
        )}
      </div>
    );
}
