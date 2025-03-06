export default function Planes() {
  return (
    <div id="planes" className="bg-gray-100 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl sm:text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Elige tu tarjeta digital</h2>
          <p className="mt-6 text-lg leading-8 text-gray-600">Pago único - Sin costos recurrentes</p>
        </div>
        <div className="mx-auto mt-16 grid max-w-lg grid-cols-1 gap-y-6 sm:mt-20 sm:grid-cols-2 sm:gap-y-0 sm:gap-x-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {/* Perfil Digital */}
          <div className="rounded-3xl p-8 ring-1 ring-gray-200 bg-white">
            <h3 className="text-lg font-semibold leading-8 text-blue-600">Perfil Digital</h3>
            <p className="mt-4 text-sm leading-6 text-gray-600">Tu presencia digital profesional</p>
            <p className="mt-6 flex items-baseline gap-x-1">
              <span className="text-4xl font-bold tracking-tight text-gray-900">$22</span>
              <span className="text-sm font-semibold leading-6 text-gray-600">+IVA</span>
            </p>
            <ul className="mt-8 space-y-3 text-sm leading-6 text-gray-600">
              <li>Perfil digital personalizable</li>
              <li>Botones ilimitados</li>
              <li>Analíticas básicas</li>
              <li>Soporte técnico</li>
            </ul>
            <a
              href="https://my.econecta.io"
              className="mt-8 block w-full rounded-md bg-blue-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              Adquirir ahora
            </a>
          </div>

          {/* Tarjeta PVC */}
          <div className="rounded-3xl p-8 ring-1 ring-gray-200 bg-white">
            <h3 className="text-lg font-semibold leading-8 text-blue-600">Tarjeta PVC</h3>
            <p className="mt-4 text-sm leading-6 text-gray-600">Tarjeta NFC profesional</p>
            <p className="mt-6 flex items-baseline gap-x-1">
              <span className="text-4xl font-bold tracking-tight text-gray-900">$22</span>
              <span className="text-sm font-semibold leading-6 text-gray-600">+IVA</span>
            </p>
            <ul className="mt-8 space-y-3 text-sm leading-6 text-gray-600">
              <li>Tarjeta NFC de PVC</li>
              <li>Diseño personalizado</li>
              <li>Tecnología NFC integrada</li>
              <li>Resistente y duradera</li>
            </ul>
            <a
              href="https://my.econecta.io"
              className="mt-8 block w-full rounded-md bg-blue-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              Adquirir ahora
            </a>
          </div>

          {/* Tarjeta Metal */}
          <div className="rounded-3xl p-8 ring-1 ring-gray-200 bg-white">
            <h3 className="text-lg font-semibold leading-8 text-blue-600">Tarjeta Metal</h3>
            <p className="mt-4 text-sm leading-6 text-gray-600">Máxima elegancia</p>
            <p className="mt-6 flex items-baseline gap-x-1">
              <span className="text-4xl font-bold tracking-tight text-gray-900">$44</span>
              <span className="text-sm font-semibold leading-6 text-gray-600">+IVA</span>
            </p>
            <ul className="mt-8 space-y-3 text-sm leading-6 text-gray-600">
              <li>Tarjeta NFC de metal</li>
              <li>Acabado premium</li>
              <li>Diseño personalizado</li>
              <li>Máxima durabilidad</li>
            </ul>
            <a
              href="https://my.econecta.io"
              className="mt-8 block w-full rounded-md bg-blue-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              Adquirir ahora
            </a>
          </div>
        </div>
      </div>
    </div>
  );
} 