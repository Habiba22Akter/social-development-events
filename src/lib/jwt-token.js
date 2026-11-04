import { JWT_COOKIE } from "@/lib/auth-cookies";

/**
 * Server-side JWT access for Server Components and route handlers.
 *
 * Order of preference:
 *   1. the `utsho.jwt` HTTP-only cookie, when it has not expired;
 *   2. a fresh token from the Express auth server's `GET /api/auth/token`,
 *      using the BetterAuth session cookie.
 *
 * The second path is what makes Server Components work on a cold visit: the
 * session cookie is enough to mint a token even before the browser has called
 * `/get-session` and received the `set-auth-jwt` header.
 */
const AUTH_SERVER_URL = (process.env.AUTH_SERVER_URL || "").replace(/\/+$/, "");

const TOKEN_TIMEOUT_MS = 5000;
const EXPIRY_SKEW_MS = 5000;

const SESSION_COOKIE_NAMES = [
  "better-auth.session_token",
  "__Secure-better-auth.session_token",
];

function readCookie(cookieHeader, name) {
  if (!cookieHeader) return "";

  for (const part of cookieHeader.split(";")) {
    const index = part.indexOf("=");

    if (index === -1) continue;

    if (part.slice(0, index).trim() !== name) continue;

    try {
      return decodeURIComponent(part.slice(index + 1).trim());
    } catch {
      return part.slice(index + 1).trim();
    }
  }

  return "";
}

function hasSessionCookie(cookieHeader) {
  return SESSION_COOKIE_NAMES.some((name) => Boolean(readCookie(cookieHeader, name)));
}

/**
 * Reads the `exp` claim without verifying the signature. Verification happens
 * on the Express server; this check only avoids sending a token that is
 * already dead.
 */
export function tokenIsFresh(token) {
  const parts = token.split(".");

  if (parts.length !== 3) return false;

  try {
    const payload = JSON.parse(
      Buffer.from(parts[1], "base64url").toString("utf8"),
    );

    return (
      typeof payload.exp === "number" &&
      payload.exp * 1000 > Date.now() + EXPIRY_SKEW_MS
    );
  } catch {
    return false;
  }
}

/** Mints a token for the current BetterAuth session. */
export async function requestFreshToken(cookieHeader) {
  if (!cookieHeader || !hasSessionCookie(cookieHeader)) return "";

  try {
    const response = await fetch(`${AUTH_SERVER_URL}/api/auth/token`, {
      method: "GET",
      headers: { cookie: cookieHeader, accept: "application/json" },
      cache: "no-store",
      redirect: "manual",
      signal: AbortSignal.timeout(TOKEN_TIMEOUT_MS),
    });

    if (!response.ok) return "";

    const data = await response.json();

    return typeof data?.token === "string" ? data.token : "";
  } catch {
    return "";
  }
}

/**
 * Returns a usable access token for the incoming request, or an empty string
 * when the visitor is signed out or the auth server is unreachable.
 */
export async function getServerToken(cookieHeader) {
  if (!cookieHeader) return "";

  const stored = readCookie(cookieHeader, JWT_COOKIE);

  if (stored && tokenIsFresh(stored)) return stored;

  return requestFreshToken(cookieHeader);
}
