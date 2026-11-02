import { NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

/**
 * Optimistic protection for private routes.
 *
 * This only checks that a session cookie exists — it does not validate the
 * token (that would need a database round-trip on every navigation). Real
 * data access must re-check the session server-side, which the BetterAuth
 * route handler and future event APIs do.
 */
export function proxy(request) {
  const sessionCookie = getSessionCookie(request);

  if (sessionCookie) {
    return NextResponse.next();
  }

  const loginUrl = new URL("/login", request.url);
  const target = `${request.nextUrl.pathname}${request.nextUrl.search}`;

  loginUrl.searchParams.set("redirect", target);

  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: [
    "/events/create/:path*",
    "/events/manage/:path*",
    "/events/joined/:path*",
  ],
};
