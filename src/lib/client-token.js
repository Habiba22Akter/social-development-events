"use client";

import { authClient } from "@/lib/auth-client";

/**
 * Client-side JWT access.
 *
 * The `jwtClient()` plugin configured in `src/lib/auth-client.js` exposes
 * `authClient.token()`, which calls `GET /api/auth/token` on the same origin.
 * Tokens are cached in memory until shortly before they expire, so a page with
 * several actions does not mint a new one for every request.
 */
const EXPIRY_SKEW_MS = 5000;

let cachedToken = "";
let cachedUntil = 0;

function decodeExpiry(token) {
  const parts = token.split(".");

  if (parts.length !== 3) return 0;

  try {
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");
    const payload = JSON.parse(atob(padded));

    return typeof payload.exp === "number" ? payload.exp * 1000 : 0;
  } catch {
    return 0;
  }
}

function remember(token) {
  if (!token) return "";

  cachedToken = token;
  cachedUntil = decodeExpiry(token);

  return token;
}

async function fetchTokenFromRoute() {
  try {
    const response = await fetch("/api/auth/token", {
      method: "GET",
      credentials: "include",
      cache: "no-store",
      headers: { accept: "application/json" },
    });

    if (!response.ok) return "";

    const data = await response.json();

    return typeof data?.token === "string" ? data.token : "";
  } catch {
    return "";
  }
}

/**
 * One shared way for Client Components to obtain the access token. Pass
 * `{ force: true }` to ignore the cache (used after a 401 retry).
 */
export async function getClientToken({ force = false } = {}) {
  if (!force && cachedToken && cachedUntil > Date.now() + EXPIRY_SKEW_MS) {
    return cachedToken;
  }

  try {
    const result = await authClient.token();
    const token = result?.data?.token || result?.token || "";

    if (token) return remember(token);
  } catch {
    // Fall through to the same-origin route below.
  }

  return remember(await fetchTokenFromRoute());
}

/**
 * `fetch` with the JWT attached as a Bearer token. A 401 triggers one retry
 * with a freshly minted token, which handles a token expiring mid-session.
 */
export async function fetchWithToken(input, init = {}) {
  async function send(token) {
    const headers = new Headers(init.headers || {});

    if (token) headers.set("Authorization", `Bearer ${token}`);

    return fetch(input, {
      credentials: "same-origin",
      ...init,
      headers,
    });
  }

  let token = await getClientToken();
  let response = await send(token);

  if (response.status === 401) {
    token = await getClientToken({ force: true });

    if (token) response = await send(token);
  }

  return response;
}
