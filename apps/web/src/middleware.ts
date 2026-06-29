import createMiddleware from "next-intl/middleware";
import { type NextRequest, NextResponse } from "next/server";
import { routing } from "@/src/i18n/routing";

const intlMiddleware = createMiddleware(routing);

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public routes — no auth required
  const publicPrefixes = ["/login", "/register", "/auth", "/api"];
  const isPublic = publicPrefixes.some((p) => pathname.startsWith(p));

  // Protected route groups: (app) -> /dashboard/*, (admin) -> /admin/*
  const isProtected =
    pathname.startsWith("/dashboard") || pathname.startsWith("/admin");

  if (isProtected) {
    // Check for Supabase session cookie
    const hasSession = request.cookies.has(
      "sb-rmtmrkgqrjodzcbwlhom-auth-token",
    );

    if (!hasSession) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Redirect logged-in users away from auth pages
  if (isPublic && !pathname.startsWith("/api")) {
    const hasSession = request.cookies.has(
      "sb-rmtmrkgqrjodzcbwlhom-auth-token",
    );
    if (hasSession) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: [
    // Match all paths except static files and API internals
    "/((?!_next|_vercel|.*\\..*|api/webhook).*)",
  ],
};
