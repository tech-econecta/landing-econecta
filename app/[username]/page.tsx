import { Metadata } from "next";
import Buttons from "../components/perfil/buttons";
import AppCarousel from "../components/perfil/slides";
import Captador from "../components/perfil/captador";
import { Empty } from "antd";
import Head from "next/head";

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

type Perfil = {
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
};

type UserData = {
  perfil: Perfil;
  captador?: Captador;
};

type ProfileProps = {
  params: Promise<{ username: string }>;
};

export async function generateMetadata(props: ProfileProps): Promise<Metadata> {
  const params = await props.params;
  const { username } = params;

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${username}`);

    if (!response.ok) {
      console.log(`Error fetching user data for username: ${username}`);
      return {
        title: "User Not Found"
      };
    }

    const { perfil }: UserData = await response.json();

    return {
      title: `${perfil.title} | Perfil`
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Error"
    };
  }
}

export default async function ProfilePage(props: ProfileProps) {
  const params = await props.params;
  const { username } = params;

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${username}`);
    if (!response.ok) {
      console.log(`Error fetching user data for username: ${username}, Status: ${response.status}`);
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
    const backgroundStyle = brandLogo
      ? { backgroundImage: `url(${background_path || brandLogoPath})`, backgroundSize: "cover", backgroundPosition: "center" }
      : { backgroundColor: background_color || "#ffffff" };

    return (
      <div className="min-h-screen flex flex-col items-center pt-4 pb-4" style={backgroundStyle}>
        {/* Inserta la fuente personalizada en el <head> */}
        {customFontUrl && (
          <Head>
            <link href={customFontUrl} rel="stylesheet" />
          </Head>
        )}
        {/* Logo de marca */}
        {brandLogo && (
          <div className="mb-4">
            <img src={brandLogoPath} alt="Brand Logo" className="h-20 w-auto" />
          </div>
        )}

        {/* Imagen del usuario */}
        <div className="mb-4">
          <img
            src={imagen}
            alt="User"
            className="rounded-full"
            style={{ width: `${image_size}px`, height: `${image_size}px`, objectFit: "cover" }}
          />
        </div>

        {/* Título y subtítulo */}
        <h1 className="text-center font-bold" style={{ fontSize: `${title_size}px`, color: text_color }}>
          {title}
        </h1>
        <h2 className="text-center" style={{ fontSize: `${subtitle_size}px`, color: text_color }}>
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
    return <div className="text-center text-red-500">Error loading user data</div>;
  }
}
