// Beneficios del perfil digital: se muestran iguales en todos los planes
const beneficiosPerfil = [
  "Perfil digital personalizable",
  "Botones ilimitados",
  "Analíticas básicas",
  "Soporte técnico",
];

type Plan = {
  nombre: string;
  descripcion: string;
  precio: string;
  beneficiosProducto: string[];
  etiqueta?: string;
  destacado?: boolean;
};

// Precio final: cada producto ya incluye el perfil digital
const planes: Plan[] = [
  {
    nombre: "Tarjeta PVC",
    descripcion: "Tarjeta NFC + perfil digital",
    precio: "$44",
    beneficiosProducto: [
      "Tarjeta NFC de PVC",
      "Diseño personalizado",
      "Resistente y duradera",
    ],
  },
  {
    nombre: "Tarjeta Metal",
    descripcion: "Tarjeta metálica + perfil digital",
    precio: "$64",
    beneficiosProducto: [
      "Tarjeta NFC de metal",
      "Acabado premium",
      "Diseño personalizado",
      "Máxima durabilidad",
    ],
    etiqueta: "Más popular",
    destacado: true,
  },
  {
    nombre: "Brazalete NFC",
    descripcion: "Brazalete NFC + perfil digital",
    precio: "$50",
    beneficiosProducto: [
      "Brazalete NFC",
      "Resistente al agua",
      "Cómodo para uso diario",
      "Ideal para eventos",
    ],
    etiqueta: "Nuevo",
  },
];

function CheckIcon() {
  return (
    <svg
      className="h-5 w-5 text-primary mr-2 shrink-0 mt-0.5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5 13l4 4L19 7"
      />
    </svg>
  );
}

export default function Planes() {
  return (
    <div
      id="planes"
      className="relative bg-white py-24 sm:py-32 overflow-hidden"
    >
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl sm:text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
            Elige tu tarjeta digital
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Pago único · Sin costos recurrentes · Todos los planes incluyen tu
            perfil digital
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-lg grid-cols-1 gap-8 sm:mt-20 sm:grid-cols-2 sm:gap-6 lg:mx-0 lg:max-w-none lg:grid-cols-3 lg:gap-8">
          {planes.map((plan, i) => (
            <div
              key={plan.nombre}
              className={`group relative rounded-3xl p-8 bg-white transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 flex flex-col ${
                plan.destacado
                  ? "border-2 border-primary/50 hover:border-primary hover:shadow-primary/30"
                  : "border border-gray-200 hover:border-primary/50 hover:shadow-primary/20"
              } ${i === planes.length - 1 ? "sm:col-span-2 lg:col-span-1" : ""}`}
            >
              <div className="relative flex flex-col flex-1">
                {plan.etiqueta && (
                  <div className="inline-flex self-start items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary mb-4">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                    {plan.etiqueta}
                  </div>
                )}
                <h3 className="text-lg font-semibold leading-8 text-primary">
                  {plan.nombre}
                </h3>
                <p className="mt-1 text-sm leading-6 text-gray-600">
                  {plan.descripcion}
                </p>
                <p className="mt-6 flex items-baseline gap-x-1">
                  <span className="text-4xl font-bold tracking-tight text-gray-900">
                    {plan.precio}
                  </span>
                  <span className="text-sm font-semibold leading-6 text-gray-600">
                    +IVA
                  </span>
                </p>
                <ul className="mt-8 mb-8 space-y-3 text-sm leading-6 text-gray-600">
                  {[...plan.beneficiosProducto, ...beneficiosPerfil].map((item) => (
                    <li key={item} className="flex items-start">
                      <CheckIcon />
                      {item}
                    </li>
                  ))}
                </ul>
                <a
                  href="https://my.econecta.io"
                  className={`mt-auto block w-full rounded-full bg-primary px-4 py-3 text-center text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:bg-primary/80 hover:scale-105 ${
                    plan.destacado
                      ? "shadow-primary/50 hover:shadow-primary/70"
                      : "shadow-primary/40 hover:shadow-primary/60"
                  }`}
                >
                  Adquirir ahora
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
