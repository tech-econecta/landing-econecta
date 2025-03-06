import { Metadata, ResolvingMetadata } from "next";
import Buttons from "../components/perfil/buttons";
import AppCarousel from "../components/perfil/slides";
import Captador from "../components/perfil/captador";
import { Empty } from "antd";

type Button = {
  label_color: string;
  color: string;
  url: string;
  border_radius: number;
  path_icon: string;
  width: number;
  height: number;
  label: string;
};

type Captador = {
  visible?: boolean;
  campos: {
    nombre: string;
    label: string;
    placeholder?: string;
    type: "input" | "DatePicker" | "InputNumber" | "Switch" | "Radio";
  }[];
  backgroundColor?: string;
  submitColor?: string;
  submitTextColor?: string;
  title?: string;
  titleColor?: string;
};

type Slide = {
  image?: string;
  url: string;
  video?: string;
};

export type Perfil = {
  background_path: string;
  background_color: string;
  brandLogoPath: string;
  brandLogo: boolean;
  customFontUrl: string;
  text_color: string;
  title: string;
  title_size: number;
  subtitle: string;
  subtitle_size: number;
  imagen: string;
  image_size: number;
  buttons: Button[];
  slide_activate: boolean;
  slides: Slide[];
  card: {
    subtitle: string;
    title: string;
    Button1TextColor: string;
    Button2Color: string;
    Button1Color: string;
    cardColor: string;
    Button2TextColor: string;
    textColor: string;
  };
};

export type UserData = {
  perfil: Perfil;
  captador?: Captador;
};

type ProfileProps = {
  params: Promise<{ username: string }>;
};

export async function generateMetadata(
  props: ProfileProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const params = await props.params;
  const { username } = params;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/users/${username}`
    );

    if (!response.ok) {
      return {
        title: "Usuario no encontrado",
        description: "Este perfil no existe en Econecta",
        openGraph: {
          title: "Usuario no encontrado",
          description: "Este perfil no existe en Econecta",
          images: ['/og-image.jpg'],
        },
      };
    }

    const { perfil }: UserData = await response.json();

    return {
      title: perfil.title || `${username} | Perfil Digital`,
      description: perfil.subtitle || 'Perfil digital profesional en Econecta',
      openGraph: {
        title: perfil.title || `${username} | Perfil Digital`,
        description: perfil.subtitle || 'Perfil digital profesional en Econecta',
        images: [perfil.imagen || '/og-image.jpg'],
        type: "profile",
      },
      twitter: {
        card: 'summary_large_image',
        title: perfil.title || `${username} | Perfil Digital`,
        description: perfil.subtitle || 'Perfil digital profesional en Econecta',
        images: [perfil.imagen || '/og-image.jpg'],
      },
      icons: [{
        rel: 'icon',
        url: perfil.imagen || '/favicon.ico',
      }, {
        rel: 'apple-touch-icon',
        url: perfil.imagen || '/favicon.ico',
      }],
    };
  } catch (error) {
    return {
      title: "Error",
      description: "Ocurrió un error al cargar este perfil",
      openGraph: {
        title: "Error",
        description: "Ocurrió un error al cargar este perfil",
        images: ['/og-image.jpg'],
      },
    };
  }
}

export default async function ProfilePage(props: ProfileProps) {
  const params = await props.params;
  const { username } = params;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/users/${username}`
    );
    if (!response.ok) {
      // console.log(`Error fetching user data for username: ${username}, Status: ${response.status}`);
      return (
        <div className="flex items-center justify-center h-screen">
          <Empty description="User not found" />
        </div>
      );
    }

    const { perfil, captador }: UserData = await response.json();

    // Registrar la visita al perfil
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/visit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username }),
    }).catch((err) => console.error("Error registrando la visita:", err));

    // Destructuramos para mejorar la claridad del uso de los datos
    const {
      background_path,
      background_color,
      customFontUrl,
      brandLogoPath,
      brandLogo,
      text_color,
      title,
      title_size,
      subtitle,
      subtitle_size,
      imagen,
      image_size,
      slide_activate,
      slides,
      buttons,
    } = perfil;

    // Determina el fondo (imagen o color)
    const backgroundStyle = background_path
      ? {
          backgroundImage: `url('${background_path}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }
      : { backgroundColor: background_color || "#ffffff" };

    const familyFont: React.CSSProperties = customFontUrl
      ? {
          fontFamily: new URL(customFontUrl).searchParams.get(
            "family"
          ) as string,
        }
      : {};

    return (
      <div
        className="min-h-screen flex flex-col items-center pt-4 pb-4"
        style={{ ...backgroundStyle, ...familyFont }}
      >
        {customFontUrl && <style>{`@import url('${customFontUrl}')`}</style>}

        {/* Logo de marca */}
        {brandLogo && (
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
            // fontSize: "1.70em",
            color: text_color,
            fontWeight: "bold",
            marginBottom: "2px",
            ...(Object.keys(familyFont).length
              ? familyFont
              : { fontFamily: "Poppins" }),
          }}
        >
          {title}
        </h1>
        <h2
          className="text-center font-semibold"
          style={{
            fontSize: `${subtitle_size}px`,
            // fontSize: "1.25em",
            color: text_color,
            ...(Object.keys(familyFont).length
              ? familyFont
              : { fontFamily: "Poppins" }),
          }}
        >
          {subtitle}
        </h2>

        {/* Carrusel condicional */}
        {slide_activate && slides.length > 0 && (
          <div className="mb-4 w-full max-w-lg">
            <AppCarousel slides={slides} />
          </div>
        )}

        {/* Usa el componente Buttons */}
        <Buttons buttonsData={buttons} />

        {/* Ícono centrado debajo de los botones */}
        <div className="flex justify-center mt-4">
          <img src="/Iso3.png" alt="Icon" className="h-10 w-auto" />
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
          />
        )}
      </div>
    );
  } catch (error) {
    console.error("Error rendering profile page:", error);
    return (
      <div className="text-center text-red-500">Error loading user data</div>
    );
  }
}
