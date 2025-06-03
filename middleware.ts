import type { NextRequest } from "next/server";
import { auth0 } from "lib/auth0"; // Usa la ruta relativa correcta

export async function middleware(request: NextRequest) {
  return await auth0.middleware(request);
}

export const config = {
  matcher: [
    // Protege TODAS las rutas, excepto estáticos y auth
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|auth).*)",
  ],
};
