import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Edge-compatible middleware for JWT authentication
 * Works with Cloudflare Workers Edge Runtime
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public routes that don't require authentication
  const publicRoutes = [
    "/",                    // Landing page
    "/auth/signin",
    "/auth/signup",
    "/api/auth",
  ];
  const isPublicRoute = publicRoutes.some((route) => 
    route === "/" ? pathname === "/" : pathname.startsWith(route)
  );

  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Check for auth token in cookies
  const token = request.cookies.get("auth-token")?.value;

  if (!token) {
    // Redirect to sign-in page
    const signInUrl = new URL("/auth/signin", request.url);
    signInUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(signInUrl);
  }

  // Token validation happens in API routes
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - / (root/landing page)
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - _next/data (data fetching)
     * - favicon.ico (favicon)
     * - auth pages
     * - api/auth routes
     * - public assets (png, jpg, svg, etc.)
     */
    "/((?!$|_next/static|_next/image|_next/data|favicon.ico|.*\\.(?:png|jpg|jpeg|svg|gif|webp|ico)|auth|api/auth).*)",
  ],
};

