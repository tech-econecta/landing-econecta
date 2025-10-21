"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";

const formSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  email: z.string().email("Email inválido"),
});

type FormData = z.infer<typeof formSchema>;

export default function Newsletter() {
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormData) => {
    setStatus("loading");
    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setStatus("success");
        reset();
      } else {
        setStatus("error");
      }
    } catch (_error) {
      setStatus("error");
    }
  };

  return (
    <div className="bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:py-16 lg:px-8">
        <div className="relative isolate overflow-hidden bg-gray-900 px-6 py-12 shadow-2xl rounded-3xl sm:px-24 xl:py-16">
          <h2 className="mx-auto max-w-2xl text-center text-2xl sm:text-3xl font-bold tracking-tight text-white sm:text-4xl">
            ¡Obtén un 15% de descuento!
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-center text-base sm:text-lg leading-8 text-gray-300">
            Suscríbete a nuestro newsletter y recibe un cupón del 15% de
            descuento para tu perfil digital.
          </p>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="mx-auto mt-10 max-w-xl"
          >
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="grow flex flex-col sm:flex-row gap-4 sm:gap-x-2">
                <input
                  {...register("name")}
                  type="text"
                  placeholder="Tu nombre"
                  className="w-full sm:flex-1 rounded-md sm:rounded-l-md border-0 bg-white/5 px-3.5 py-2 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-white sm:text-sm sm:leading-6"
                />
                <input
                  {...register("email")}
                  type="email"
                  placeholder="Tu email"
                  className="w-full sm:flex-1 rounded-md sm:rounded-r-md border-0 bg-white/5 px-3.5 py-2 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-white sm:text-sm sm:leading-6"
                />
              </div>

              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full sm:w-auto flex-none rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                {status === "loading" ? "Enviando..." : "Suscribirse"}
              </button>
            </div>

            <div className="mt-2 flex flex-col sm:flex-row sm:justify-between text-sm gap-2 sm:gap-0">
              <div>
                {errors.name && (
                  <p className="text-red-400">{errors.name.message}</p>
                )}
              </div>
              <div>
                {errors.email && (
                  <p className="text-red-400">{errors.email.message}</p>
                )}
              </div>
            </div>

            <p className="mt-4 text-xs text-center text-gray-400">
              Al hacer clic en "Suscribirse", aceptas nuestros{" "}
              <Link
                href="/terms"
                className="text-white hover:text-gray-200 underline"
              >
                Términos y Condiciones
              </Link>{" "}
              y{" "}
              <Link
                href="/privacy"
                className="text-white hover:text-gray-200 underline"
              >
                Política de Privacidad
              </Link>
            </p>

            {status === "success" && (
              <p className="mt-4 text-sm text-center text-green-400">
                ¡Gracias por suscribirte! Revisa tu correo para obtener tu
                cupón.
              </p>
            )}
            {status === "error" && (
              <p className="mt-4 text-sm text-center text-red-400">
                Hubo un error. Por favor intenta nuevamente.
              </p>
            )}
          </form>

          <svg
            viewBox="0 0 1024 1024"
            className="absolute left-1/2 top-1/2 -z-10 h-256 w-5xl -translate-x-1/2 -translate-y-1/2"
            aria-hidden="true"
          >
            <circle
              cx="512"
              cy="512"
              r="512"
              fill="url(#759c1415-0410-454c-8f7c-9a820de03641)"
              fillOpacity="0.7"
            />
            <defs>
              <radialGradient
                id="759c1415-0410-454c-8f7c-9a820de03641"
                cx="0"
                cy="0"
                r="1"
                gradientUnits="userSpaceOnUse"
                gradientTransform="translate(512 512) rotate(90) scale(512)"
              >
                <stop stopColor="#7775D6" />
                <stop offset="1" stopColor="#E935C1" stopOpacity="0" />
              </radialGradient>
            </defs>
          </svg>
        </div>
      </div>
    </div>
  );
}
