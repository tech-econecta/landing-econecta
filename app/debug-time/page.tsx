import TimeDebugger from "@/app/components/TimeDebugger";

export default function DebugTimePage() {
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Debug de Sincronización de Tiempo
          </h1>
          <p className="text-gray-600">
            Verifica la sincronización entre el servidor (VPS) y el cliente
          </p>
        </div>

        <TimeDebugger />

        <div className="mt-8 p-4 bg-blue-50 border rounded-lg">
          <h3 className="font-semibold text-blue-800 mb-2">Instrucciones:</h3>
          <ul className="text-blue-700 space-y-1 text-sm">
            <li>
              • Verifica que la diferencia entre servidor y cliente sea menor a
              5 segundos
            </li>
            <li>
              • La hora de Venezuela debe coincidir con tu zona horaria local
            </li>
            <li>• Si hay problemas, revisa la configuración del VPS</li>
            <li>
              • Usa el botón "Actualizar Información" para obtener datos frescos
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
