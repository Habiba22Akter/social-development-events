import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function getUpcomingEvents() {
  const database = await connectToDatabase();

  return database
    .collection("events")
    .find({ date: { $gte: new Date() } })
    .sort({ date: 1 })
    .limit(6)
    .toArray();
}

export async function getAllUpcomingEvents() {
  const database = await connectToDatabase();

  return database
    .collection("events")
    .find({ date: { $gte: new Date() } })
    .sort({ date: 1 })
    .toArray();
}

export async function getUpcomingEventById(id) {
  if (!ObjectId.isValid(id)) return null;

  const database = await connectToDatabase();
  return database.collection("events").findOne({
    _id: new ObjectId(id),
    date: { $gte: new Date() },
  });
}

const PRIVATE_HOST =
  /^(localhost|127\.|10\.|192\.168\.|169\.254\.|0\.0\.0\.0|\[::1\]|.*\.local|.*\.internal)$/i;

/**
 * Confirms the URL really serves an image before we store it. Without this,
 * links to web pages (a Drive viewer, a homepage) pass the HTTPS check and
 * then render as broken thumbnails.
 */
export async function isLoadableImageUrl(value) {
  let url;

  try {
    url = new URL(value);
  } catch {
    return false;
  }

  if (url.protocol !== "https:" || PRIVATE_HOST.test(url.hostname)) {
    return false;
  }

  try {
    const response = await fetch(url, {
      redirect: "follow",
      cache: "no-store",
      headers: { Accept: "image/*" },
      signal: AbortSignal.timeout(8000),
    });
    const contentType = (response.headers.get("content-type") || "").toLowerCase();

    // Read only the headers; never download the whole image.
    if (response.body) {
      await response.body.cancel().catch(() => {});
    }

    return response.ok && contentType.startsWith("image/");
  } catch {
    return false;
  }
}

export function serializeEvent(event) {
  return {
    ...event,
    _id: event._id.toString(),
    date: event.date.toISOString(),
    createdAt: event.createdAt?.toISOString(),
    participants: event.participants || [],
  };
}
