/**
 * Event thumbnails are pasted in as free-form URLs by organisers. These helpers
 * keep one source of truth for turning whatever they paste into something the
 * browser can actually render as an <img>.
 */

export const EVENT_FALLBACK_IMAGE =
  "https://images.pexels.com/photos/11319521/pexels-photo-11319521.jpeg?auto=compress&cs=tinysrgb&w=900";

const DRIVE_HOSTS = new Set([
  "drive.google.com",
  "docs.google.com",
  "drive.usercontent.google.com",
]);

const DRIVE_FILE_ID = /^[A-Za-z0-9_-]{10,}$/;

function getDriveFileId(url) {
  if (!DRIVE_HOSTS.has(url.hostname)) return "";

  const pathMatch = url.pathname.match(/\/file\/d\/([^/]+)/);
  const candidate = pathMatch?.[1] || url.searchParams.get("id") || "";

  return DRIVE_FILE_ID.test(candidate) ? candidate : "";
}

/**
 * Returns `{ url, error, converted }`. `url` is the value to render/store,
 * `error` is a human-readable problem, and `converted` flags links that were
 * rewritten (Google Drive share links are page URLs, not image files).
 */
export function normalizeImageUrl(value) {
  const raw = typeof value === "string" ? value.trim() : "";

  if (!raw) {
    return { url: "", error: "", converted: false };
  }

  let parsed;

  try {
    parsed = new URL(raw);
  } catch {
    return {
      url: raw,
      error:
        "Enter a complete image URL, for example https://example.com/photo.jpg",
      converted: false,
    };
  }

  if (parsed.protocol !== "https:") {
    return { url: raw, error: "Use an HTTPS image URL.", converted: false };
  }

  const driveFileId = getDriveFileId(parsed);

  if (driveFileId) {
    return {
      // The /thumbnail endpoint serves the actual file, so publicly shared
      // Drive images render even though the pasted link is a viewer page.
      url: `https://drive.google.com/thumbnail?id=${driveFileId}&sz=w1600`,
      error: "",
      converted: true,
    };
  }

  return { url: parsed.toString(), error: "", converted: false };
}

/** The src to render, or an empty string when the value is unusable. */
export function getEventImageSrc(value) {
  return normalizeImageUrl(value).url;
}
