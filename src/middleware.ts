import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Edge-compatible middleware for JWT authentication
 * Works with Cloudflare Workers Edge Runtime
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Immediately allow all public routes - check this FIRST
  if (
    pathname === "/" ||                          // Landing page
    pathname.startsWith("/auth/") ||             // Auth pages
    pathname.startsWith("/api/auth") ||          // Auth API
    pathname.startsWith("/_next/") ||            // Next.js internal
    pathname.includes(".")                       // Static files (has extension)
  ) {
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

// Use negative lookahead to exclude public paths
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - / (root)
     * - auth (auth pages)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files with extensions
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.).*)",
  ],
};

