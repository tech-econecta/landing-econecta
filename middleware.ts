import { NextRequest, NextResponse } from "next/server";

/**
 * Middleware para Custom Domains (White-labeling)
 *
 * Detecta si la request viene de un dominio custom (CNAME a econecta.io)
 * y reescribe la ruta internamente a /custom-domain/[slug]
 *
 * Flujo:
 *   tarjetas.acme.com/juan  →  Host: tarjetas.acme.com
 *   Middleware detecta que Host ≠ econecta.io
 *   Rewrite interno a /custom-domain/juan
 *   Header x-custom-domain: tarjetas.acme.com
 */

const ALLOWED_HOSTS = [
  "econecta.io",
  "www.econecta.io",
  "localhost",
  "127.0.0.1",
];

export function middleware(request: NextRequest) {
  const host = request.headers.get("host")?.replace(/:\d+$/, "") || "";

  // Si es el dominio principal o localhost (sin custom domain), dejar pasar
  if (ALLOWED_HOSTS.includes(host)) {
    return NextResponse.next();
  }

  // Es un custom domain → reescribir a la ruta interna
  const pathname = request.nextUrl.pathname;

  // No interceptar assets estáticos que el custom domain necesita
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Rewrite: tarjetas.acme.com/juan → /custom-domain/juan
  const url = request.nextUrl.clone();
  url.pathname = `/custom-domain${pathname === "/" ? "" : pathname}`;

  console.log(`[Middleware] Reescribiendo request de ${host}${pathname} -> ${url.pathname}`);

  // Pasar el host original en un header para que la página sepa qué dominio es
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-custom-domain", host);

  return NextResponse.rewrite(url, {
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico (favicon)
     * - public files (images, etc.)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
