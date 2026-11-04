import { NextResponse } from "next/server";

import { JWT_COOKIE } from "@/lib/auth-cookies";

/**
 * Forwards same-origin /api/events/* calls to the Express API server, keeping
 * the BetterAuth session cookie on the Next.js domain (same pattern as the
 * /api/auth proxy). Browsers never talk to port 8000 directly.
 */
const eventServerUrl = (
  process.env.EVENT_SERVER_URL ||
  process.env.AUTH_SERVER_URL ||
  ""
).replace(/\/+$/, "");

const FORWARDABLE_METHODS = ["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD"];

const HOP_BY_HOP = new Set([
  "host",
  "connection",
  "content-length",
  "content-encoding",
  "transfer-encoding",
]);

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

function buildHeaders(request) {
  const headers = new Headers();
  const incoming = new URL(request.url);

  request.headers.forEach((value, key) => {
    if (HOP_BY_HOP.has(key.toLowerCase())) return;
    headers.set(key, value);
  });

  // Client Components attach the JWT themselves via `fetchWithToken`. This
  // fallback keeps plain same-origin fetches working by reading the HTTP-only
  // mirror cookie.
  if (!headers.has("authorization")) {
    const token = readCookie(request.headers.get("cookie"), JWT_COOKIE);

    if (token) headers.set("authorization", `Bearer ${token}`);
  }

  headers.set("x-forwarded-host", incoming.host);
  headers.set("x-forwarded-proto", incoming.protocol.replace(":", ""));

  return headers;
}

function copyResponseHeaders(upstream) {
  const headers = new Headers();

  upstream.headers.forEach((value, key) => {
    if (HOP_BY_HOP.has(key.toLowerCase())) return;
    headers.set(key, value);
  });

  return headers;
}

export async function forwardToEventServer(request) {
  if (!FORWARDABLE_METHODS.includes(request.method)) {
    return NextResponse.json(
      { message: `Method ${request.method} is not supported.` },
      { status: 405 },
    );
  }

  const incoming = new URL(request.url);
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
    const upstream = await fetch(
      `${eventServerUrl}${incoming.pathname}${incoming.search}`,
      init,
    );

    return new Response(request.method === "HEAD" ? null : upstream.body, {
      status: upstream.status,
      statusText: upstream.statusText,
      headers: copyResponseHeaders(upstream),
    });
  } catch {
    return NextResponse.json(
      {
        message:
          "The event service is unavailable. Start the Express server and try again.",
      },
      { status: 503 },
    );
  }
}
