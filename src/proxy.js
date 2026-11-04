import { NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

/**
 * Frontend security gate.
 *
 * The BetterAuth session cookie is HTTP-only, so the browser can never read or
 * forge it. Presence alone is not proof of a session though: a cookie can be
 * expired, revoked, or simply invented. For protected routes this proxy asks the
 * auth server to validate the cookie before the page renders, and redirects
 * unauthenticated visitors to `/login` with a safe return path.
 *
 * This is the first line of defence only. The Express event API re-validates
 * the session on every request, and `RequireAuth` re-checks it in the browser,
 * so a request that somehow slips past the proxy still cannot read private data.
 */
const AUTH_SERVER_URL = (
  process.env.AUTH_SERVER_URL || "http://localhost:8000"
).replace(/\/+$/, "");

/** Pages that require a signed-in volunteer. */
const PROTECTED_PREFIXES = ["/events/create", "/events/manage", "/events/joined"];

/** Pages that make no sense once you are signed in. */
const AUTH_PAGES = ["/login", "/register"];

/** Never let the auth server hold a navigation hostage. */
const SESSION_TIMEOUT_MS = 4000;

const SESSION_COOKIES = [
  "better-auth.session_token",
  "__Secure-better-auth.session_token",
  "better-auth.session_data",
  "__Secure-better-auth.session_data",
  "better-auth.dont_remember",
  "__Secure-better-auth.dont_remember",
];

function isProtected(pathname) {
  return PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

function isAuthPage(pathname) {
  return AUTH_PAGES.includes(pathname);
}

/**
 * Only same-origin, root-relative paths are allowed as redirect targets.
 * `new URL()` normalises `//evil.com` and `/\evil.com` into another origin, so
 * the origin check is what actually stops open redirects.
 */
function safeInternalPath(value, request) {
  if (typeof value !== "string" || !value.startsWith("/")) return null;
  if (value.startsWith("//") || value.includes("\\")) return null;
  if (/[\u0000-\u001f\u007f]/.test(value)) return null;

  let url;

  try {
    url = new URL(value, request.nextUrl.origin);
  } catch {
    return null;
  }

  if (url.origin !== request.nextUrl.origin) return null;
  if (isAuthPage(url.pathname)) return null;

  return `${url.pathname}${url.search}${url.hash}`;
}

/**
 * Ask the Express/BetterAuth server who this cookie belongs to. A 200 with a
 * `session` and `user` means the token is real and still in the database.
 */
async function readSession(request) {
  const cookie = request.headers.get("cookie");

  if (!cookie) return null;

  try {
    const response = await fetch(`${AUTH_SERVER_URL}/api/auth/get-session`, {
      method: "GET",
      headers: { cookie, accept: "application/json" },
      cache: "no-store",
      redirect: "manual",
      signal: AbortSignal.timeout(SESSION_TIMEOUT_MS),
    });

    if (!response.ok) return null;

    const data = await response.json();

    return data?.session && data?.user ? data : null;
  } catch {
    // Unreachable or slow auth server: treat the visitor as signed out so a
    // dead token can never unlock a private page.
    return null;
  }
}

/** Drop a stale session cookie so the browser stops replaying a dead token. */
function clearSessionCookies(response, request) {
  for (const cookie of request.cookies.getAll()) {
    const isSessionCookie = SESSION_COOKIES.some(
      (name) => cookie.name === name || cookie.name.startsWith(`${name}.`),
    );

    if (!isSessionCookie) continue;

    response.cookies.set(cookie.name, "", {
      path: "/",
      maxAge: 0,
      httpOnly: true,
      sameSite: "lax",
      secure: cookie.name.startsWith("__Secure-"),
    });
  }
}

function loginRedirect(request, target) {
  const loginUrl = new URL("/login", request.url);
  const safeTarget = safeInternalPath(target, request);

  if (safeTarget) {
    loginUrl.searchParams.set("redirect", safeTarget);
  }

  return loginUrl;
}

export async function proxy(request) {
  const { pathname, search } = request.nextUrl;
  const protectedRoute = isProtected(pathname);
  const authPage = isAuthPage(pathname);
  const hasSessionCookie = Boolean(getSessionCookie(request));

  // Signed-out visitor on a public/auth page: nothing to validate.
  if (!protectedRoute && !hasSessionCookie) {
    return NextResponse.next();
  }

  const session = hasSessionCookie ? await readSession(request) : null;

  if (protectedRoute && !session) {
    const response = NextResponse.redirect(
      loginRedirect(request, `${pathname}${search}`),
    );

    if (hasSessionCookie) clearSessionCookies(response, request);

    return response;
  }

  if (authPage && session) {
    const target =
      safeInternalPath(request.nextUrl.searchParams.get("redirect"), request) ??
      "/events";

    return NextResponse.redirect(new URL(target, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/login",
    "/register",
    "/events/create/:path*",
    "/events/manage/:path*",
    "/events/joined/:path*",
  ],
};
