import CardPreview from "./CardPreview";
import { UserData } from "@/app/[username]/action-get.user";
import Navbar from "./Navbar";

async function getHeroUserData(): Promise<{
  perfil: UserData["perfil"];
  username: string;
} | null> {
  // Usar variable de entorno o un usuario de ejemplo por defecto
  const heroUsername = process.env.NEXT_PUBLIC_HERO_USERNAME || "econecta";

  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
    const response = await fetch(`${apiUrl}/api/users/${heroUsername}`, {
      next: { revalidate: 3600 }, // Revalidar cada hora
    });

    if (!response.ok) {
      console.error(
        `Error fetching hero user data: ${response.status} ${response.statusText}`
      );
      return null;
    }

    const userData = (await response.json()) as UserData;
    return {
      perfil: userData.perfil,
      username: heroUsername,
    };
  } catch (error) {
    console.error("Error fetching hero user data:", error);
    return null;
  }
}

export default async function Hero() {
  const userData = await getHeroUserData();

  return (
    <section className="relative overflow-hidden bg-slate-950">
      <header className="sticky top-0 z-50">
        <Navbar logoWhite={true} />
      </header>
      <div className="pointer-events-none absolute inset-0">
        {/* Gradiente principal con color de marca */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,#3359fe_0,transparent_50%)] opacity-50" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,#3359fe_0,transparent_50%)] opacity-40" />

        {/* Gradientes secundarios para profundidad */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(51,89,254,0.3)_0,transparent_70%)] opacity-30" />

        {/* Patrón de ondas/conexiones sutiles */}
        <div className="absolute inset-0 opacity-10">
          <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern
                id="grid"
                width="60"
                height="60"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 60 0 L 0 0 0 60"
                  fill="none"
                  stroke="#3359fe"
                  strokeWidth="0.5"
                  opacity="0.3"
                />
              </pattern>
              <linearGradient
                id="waveGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#3359fe" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#3359fe" stopOpacity="0" />
              </linearGradient>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
            <path
              d="M0,200 Q200,150 400,200 T800,200"
              fill="none"
              stroke="url(#waveGradient)"
              strokeWidth="2"
            />
            <path
              d="M0,300 Q200,250 400,300 T800,300"
              fill="none"
              stroke="url(#waveGradient)"
              strokeWidth="2"
            />
          </svg>
        </div>

        {/* Efecto de brillo sutil */}
        <div className="absolute inset-0 bg-linear-to-br from-transparent via-transparent to-primary/20" />
      </div>

      {/* Gradiente de transición hacia la siguiente sección */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-b from-transparent via-slate-950/80 to-slate-950 pointer-events-none z-10" />

      <div className="relative mx-auto flex max-w-6xl flex-col items-start px-4 pb-16 pt-24 sm:px-6 md:flex-row md:pt-28 lg:px-8 lg:pb-24 lg:pt-32">
        {/* Columna izquierda: texto (más directo y resumido) */}
        <div className="w-full md:w-1/2">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-slate-200 backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Tarjetas NFC · Networking profesional
          </div>

          <h1 className="mt-6 text-balance text-4xl font-semibold tracking-tight text-white sm:text-5xl md:text-[3.25rem] lg:text-6xl">
            <span className="block text-primary">
              <span className="text-white">Tu presencia digital</span> en una
              tarjeta
            </span>
          </h1>

          <p className="mt-4 max-w-xl text-pretty text-sm text-slate-300 sm:text-base md:text-lg">
            Comparte tu información de contacto y redes sociales con un solo
            toque. Moderniza tu networking con nuestra tarjeta digital NFC.
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            <a
              href="https://my.econecta.io/"
              className="inline-flex items-center justify-center rounded-full bg-primary px-7 py-3 text-sm font-semibold text-slate-200 shadow-lg shadow-primary/40 transition hover:bg-primary/80"
            >
              Obtener mi tarjeta NFC
            </a>
          </div>
        </div>

        {/* Columna derecha: tarjeta digital real desde Firebase */}
        <div className="mb-10 flex w-full justify-center md:mb-0 md:w-1/2 mt-10 md:mt-0">
          <div className="animate-float">
            {userData ? (
              <div className="scale-90">
                <CardPreview
                  perfil={userData.perfil}
                  username={userData.username}
                />
              </div>
            ) : (
              <div className="relative h-[280px] w-[210px] scale-110 rounded-[26px] bg-[radial-gradient(circle_at_0%_0%,rgba(59,130,246,0.5),transparent_55%),radial-gradient(circle_at_100%_100%,rgba(6,182,212,0.5),transparent_55%)] p-[2px] sm:h-[310px] sm:w-[230px] md:h-[340px] md:w-[250px] lg:h-[370px] lg:w-[270px]">
                <div className="absolute -inset-10 -z-10 bg-[conic-gradient(from_160deg_at_50%_10%,rgba(59,130,246,0.4),transparent_40%,rgba(6,182,212,0.6),transparent_70%)] blur-3xl opacity-80" />
                <div className="relative flex h-full w-full flex-col items-center justify-center rounded-[22px] border border-white/25 bg-white/10 px-5 py-5 text-center backdrop-blur-2xl">
                  <p className="text-sm text-slate-300">Cargando tarjeta...</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
