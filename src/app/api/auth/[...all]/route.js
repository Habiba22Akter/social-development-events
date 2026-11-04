import { NextResponse } from "next/server";

import { clearJwtCookie, setJwtCookie } from "@/lib/auth-cookies";

/**
 * Everything under /api/auth/* is owned by the Express auth server.
 *
 * The browser keeps talking to this same-origin route, so BetterAuth's HTTP-only
 * session cookie stays on the Next.js domain (no CORS, no third-party cookie
 * problems). The request is forwarded server-to-server.
 */
const AUTH_SERVER_URL = (process.env.AUTH_SERVER_URL || "").replace(/\/+$/, "");

const FORWARDABLE_METHODS = ["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD"];

function upstreamUrl(request) {
  const incoming = new URL(request.url);
  const path = incoming.pathname.replace(/^\/api\/auth/, "");

  return `${AUTH_SERVER_URL}/api/auth${path}${incoming.search}`;
}

function buildHeaders(request) {
  const headers = new Headers();

  request.headers.forEach((value, key) => {
    const name = key.toLowerCase();

    // Hop-by-hop headers must be recomputed by the upstream fetch.
    if (name === "host" || name === "connection" || name === "content-length") {
      return;
    }

    headers.set(key, value);
  });

  const incoming = new URL(request.url);
  headers.set("x-forwarded-host", incoming.host);
  headers.set("x-forwarded-proto", incoming.protocol.replace(":", ""));

  return headers;
}

function copyResponseHeaders(upstream) {
  const headers = new Headers();

  upstream.headers.forEach((value, key) => {
    const name = key.toLowerCase();

    if (name === "set-cookie" || name === "content-encoding" || name === "content-length") {
      return;
    }

    headers.set(key, value);
  });

  // A sign-in can set several cookies at once (session + state), so they have
  // to be appended individually.
  const cookies =
    typeof upstream.headers.getSetCookie === "function"
      ? upstream.headers.getSetCookie()
      : [];

  for (const cookie of cookies) {
    headers.append("set-cookie", cookie);
  }

  return headers;
}

async function forward(request) {
  if (!FORWARDABLE_METHODS.includes(request.method)) {
    return NextResponse.json(
      { message: `Method ${request.method} is not supported.` },
      { status: 405 },
    );
  }

  const init = {
    method: request.method,
    headers: buildHeaders(request),
    redirect: "manual",
    cache: "no-store",
    signal: AbortSignal.timeout(20000),
  };

  if (request.method !== "GET" && request.method !== "HEAD") {
    const body = await request.arrayBuffer();

    if (body.byteLength > 0) {
      init.body = body;
    }
  }

  try {
    const upstream = await fetch(upstreamUrl(request), init);
    const response = new NextResponse(
      request.method === "HEAD" ? null : upstream.body,
      {
        status: upstream.status,
        statusText: upstream.statusText,
        headers: copyResponseHeaders(upstream),
      },
    );

    // BetterAuth attaches the signed JWT to `/get-session` responses. Mirror
    // it into the HTTP-only `utsho.jwt` cookie so Server Components and the
    // Express API can use it without asking the browser for it.
    const jwt = upstream.headers.get("set-auth-jwt");
    const pathname = new URL(request.url).pathname;

    if (jwt) {
      setJwtCookie(response, jwt);
    } else if (pathname.endsWith("/get-session")) {
      // No session means any cached token is stale.
      clearJwtCookie(response);
    }

    if (pathname.endsWith("/sign-out")) {
      clearJwtCookie(response);
    }

    return response;
  } catch (error) {
    console.error("Auth proxy failed:", error);

    return NextResponse.json(
      {
        code: "AUTH_SERVER_UNREACHABLE",
        message:
          "The auth server is not responding. Start it with `npm start` in social-development-events-server and try again.",
      },
      { status: 503 },
    );
  }
}

export const GET = forward;
export const POST = forward;
export const PUT = forward;
export const PATCH = forward;
export const DELETE = forward;
export const HEAD = forward;
