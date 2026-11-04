import { cache } from "react";

import { getServerToken } from "@/lib/jwt-token";

/**
 * Server-side event data access.
 *
 * Events live in the Express API (social-development-events-server). Next.js
 * Server Components call it directly and attach the BetterAuth JWT as
 * `Authorization: Bearer <token>`. The Express server verifies that token
 * against its JWKS, so the same rules protect browser and server requests.
 */
const eventServerUrl = (
  process.env.EVENT_SERVER_URL ||
  process.env.AUTH_SERVER_URL ||
  ""
).replace(/\/+$/, "");

async function requestJson(
  path,
  cookie,
  { allowStatuses = [], token: suppliedToken } = {},
) {
  // Public pages can skip the token lookup entirely; private ones always send
  // one. `suppliedToken` lets a caller reuse a token it already has.
  const token =
    suppliedToken ?? (cookie ? await getServerToken(cookie) : "");
  const headers = { accept: "application/json" };

  if (cookie) headers.cookie = cookie;
  if (token) headers.authorization = `Bearer ${token}`;

  const response = await fetch(`${eventServerUrl}${path}`, {
    cache: "no-store",
    headers,
    signal: AbortSignal.timeout(10000),
  });

  if (response.status === 404) return null;

  if (allowStatuses.includes(response.status)) return null;

  if (!response.ok) {
    throw new Error(`The event service responded with ${response.status}.`);
  }

  return response.json();
}

/** Six soonest upcoming events for the home page. */
export async function getUpcomingEvents() {
  const data = await requestJson("/api/events?limit=6");
  return data?.events || [];
}

/**
 * Home-page highlights. Organisers curate them with the `featured` flag; when
 * nothing is curated the API falls back to the soonest upcoming drives.
 * `cache()` keeps the two home-page sections from fetching it twice.
 */
export const getFeaturedEvents = cache(async () => {
  const data = await requestJson("/api/events/featured?limit=3");

  return {
    events: data?.events || [],
    curated: Boolean(data?.curated),
  };
});

/** Every upcoming event for the public events page. */
export async function getAllUpcomingEvents() {
  const data = await requestJson("/api/events");
  return data?.events || [];
}

/**
 * One upcoming event. Pass the incoming `cookie` header to receive
 * `joinedByViewer` / `isOrganizer` for the current visitor.
 */
export async function getUpcomingEventById(id, cookie) {
  const data = await requestJson(
    `/api/events/${encodeURIComponent(id)}`,
    cookie,
  );

  return data?.event || null;
}

/**
 * Events the signed-in volunteer has joined, ordered by event date with
 * upcoming drives first. Returns an empty list when the token is missing or
 * expired (the API answers 401) so the private page shows its empty state
 * instead of crashing while `RequireAuth` redirects.
 */
export async function getJoinedEvents(cookie) {
  if (!cookie) return [];

  const data = await requestJson("/api/events/joined", cookie, {
    allowStatuses: [401],
  });

  return data?.events || [];
}

/**
 * Every event the signed-in volunteer created, upcoming first. Same
 * expired-token handling as `getJoinedEvents`.
 */
export async function getMyEvents(cookie) {
  if (!cookie) return [];

  const data = await requestJson("/api/events/mine", cookie, {
    allowStatuses: [401],
  });

  return data?.events || [];
}
