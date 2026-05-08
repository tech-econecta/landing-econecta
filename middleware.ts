import { NextRequest, NextResponse } from "next/server";

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

  const pathname = request.nextUrl.pathname;

  // EVITAR BUCLE: Si ya estamos en la ruta interna, no reescribir de nuevo
  if (pathname.startsWith("/custom-domain")) {
    return NextResponse.next();
  }

  // No interceptar assets estáticos
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
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
