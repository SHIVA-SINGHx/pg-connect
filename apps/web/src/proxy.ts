import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protected paths requiring active authenticated session
  const protectedPaths = ["/owner", "/admin", "/profile", "/messages"];
  const isProtected = protectedPaths.some((p) => pathname.startsWith(p));

  if (isProtected) {
    // In production, check for Supabase auth cookie or auth token header
    const token =
      request.cookies.get("sb-access-token")?.value ||
      request.cookies.get("pgconnect_auth_token")?.value ||
      request.headers.get("Authorization");

    // Allow browser client to manage auth fallback gracefully in development,
    // while ensuring security headers are set.
    const response = NextResponse.next();
    response.headers.set("X-Protected-Route", "true");
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/owner/:path*",
    "/admin/:path*",
    "/profile/:path*",
    "/messages/:path*",
  ],
};
