/**
 * The JWT is mirrored in an HTTP-only cookie on the Next.js origin.
 *
 * BetterAuth owns the session cookie; this second cookie only carries the
 * short-lived access token that the Express event API verifies. Keeping it
 * HTTP-only means client JavaScript cannot read or forge it, while the Next.js
 * proxy and Server Components can still forward it.
 */
export const JWT_COOKIE = "utsho.jwt";

/** Matches the JWT plugin's 15-minute `expirationTime`. */
export const JWT_MAX_AGE = 60 * 15;

export function setJwtCookie(response, token) {
  if (!token) return response;

  response.cookies.set(JWT_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: JWT_MAX_AGE,
  });

  return response;
}

export function clearJwtCookie(response) {
  response.cookies.set(JWT_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });

  return response;
}
