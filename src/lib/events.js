/**
 * Server-side event data access.
 *
 * Events live in the Express API (social-development-events-server). Next.js
 * Server Components call it directly, forwarding the browser cookie when the
 * viewer's join state matters, so the Express server remains the single source
 * of truth for event data and access rules.
 */
const eventServerUrl = (
  process.env.EVENT_SERVER_URL ||
  process.env.AUTH_SERVER_URL ||
  "http://localhost:8000"
).replace(/\/+$/, "");

async function requestJson(path, cookie) {
  const response = await fetch(`${eventServerUrl}${path}`, {
    cache: "no-store",
    headers: cookie ? { cookie } : undefined,
    signal: AbortSignal.timeout(10000),
  });

  if (response.status === 404) return null;

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
