export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** The rule from the brief: 6+ characters, one uppercase, one lowercase. */
export const PASSWORD_RULE =
  "Password must be at least 6 characters and include one uppercase and one lowercase letter.";

export function validateName(value) {
  const name = value.trim();

  if (!name) return "Please tell us your name.";
  if (name.length < 2) return "Name must be at least 2 characters.";
  if (name.length > 80) return "Name must be 80 characters or fewer.";

  return null;
}

export function validateEmail(value) {
  const email = value.trim();

  if (!email) return "Email is required.";
  if (!EMAIL_PATTERN.test(email)) return "Enter a valid email address.";
  if (email.length > 254) return "Email is too long.";

  return null;
}

export function validatePassword(value, { requireComplexity = true } = {}) {
  if (!value) return "Password is required.";
  if (value.length < 6) return "Password must be at least 6 characters.";
  if (value.length > 64) return "Password must be 64 characters or fewer.";

  if (requireComplexity) {
    if (!/[A-Z]/.test(value)) {
      return "Password must include at least one uppercase letter.";
    }
    if (!/[a-z]/.test(value)) {
      return "Password must include at least one lowercase letter.";
    }
  }

  return null;
}

export function validatePhotoUrl(value) {
  const url = value.trim();

  if (!url) return null;

  try {
    const parsed = new URL(url);

    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
      return "Photo URL must start with http:// or https://.";
    }

    return null;
  } catch {
    return "Enter a valid photo URL, or leave it blank.";
  }
}

const GOOGLE_DRIVE_HOST = /(^|\.)(drive|docs)\.google\.com$/i;
const GOOGLE_DRIVE_ID = /\/d\/([A-Za-z0-9_-]{10,})/;

/**
 * A Drive "share" link (drive.google.com/file/d/<id>/view?usp=sharing) serves an
 * HTML page, not an image, so <img> fails and the avatar falls back to initials.
 * Rewrite those links to Google's public thumbnail endpoint, which returns the
 * actual image bytes. Any other URL is returned untouched.
 */
export function normalizePhotoUrl(value) {
  const url = (value ?? "").trim();

  if (!url) return "";

  let parsed;

  try {
    parsed = new URL(url);
  } catch {
    return url;
  }

  if (!GOOGLE_DRIVE_HOST.test(parsed.hostname)) return url;

  const id =
    parsed.pathname.match(GOOGLE_DRIVE_ID)?.[1] ??
    parsed.searchParams.get("id");

  if (!id) return url;

  return `https://lh3.googleusercontent.com/d/${id}=w1000`;
}

export function passwordChecks(value) {
  return [
    { label: "6+ characters", ok: value.length >= 6 },
    { label: "Uppercase letter", ok: /[A-Z]/.test(value) },
    { label: "Lowercase letter", ok: /[a-z]/.test(value) },
  ];
}

const AUTH_ERROR_MESSAGES = {
  USER_ALREADY_EXISTS:
    "An account with this email already exists. Try logging in instead.",
  USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL:
    "An account with this email already exists. Try logging in instead.",
  INVALID_EMAIL: "Enter a valid email address.",
  INVALID_EMAIL_OR_PASSWORD: "Incorrect email or password. Please try again.",
  INVALID_PASSWORD: "Incorrect email or password. Please try again.",
  PASSWORD_TOO_SHORT: "Password must be at least 6 characters.",
  PASSWORD_TOO_LONG: "Password must be 64 characters or fewer.",
  USER_NOT_FOUND: "No account was found with that email.",
  EMAIL_NOT_VERIFIED: "Please verify your email address before signing in.",
  PROVIDER_NOT_FOUND:
    "That sign-in provider is not configured yet. Add its client ID and secret to the auth server's .env file.",
  SOCIAL_ACCOUNT_ALREADY_LINKED:
    "That social account is already linked to another user.",
  AUTH_SERVER_UNREACHABLE:
    "The auth server is offline. Start it with `npm start` inside social-development-events-server, then try again.",
};

export function friendlyAuthError(
  error,
  fallback = "Something went wrong. Please try again.",
) {
  if (!error) return fallback;

  const code = typeof error.code === "string" ? error.code : "";
  const message = typeof error.message === "string" ? error.message : "";

  return AUTH_ERROR_MESSAGES[code] || message || fallback;
}

/**
 * Only allow same-origin, root-relative paths so `?redirect=` can't be abused.
 *
 * A plain `startsWith("/")` check is not enough: browsers treat `/\evil.com`
 * as a protocol-relative URL, so the parsed origin is what decides.
 */
export function safeRedirect(value, fallback = "/events") {
  if (typeof value !== "string" || !value) return fallback;
  if (!value.startsWith("/") || value.startsWith("//") || value.includes("\\")) {
    return fallback;
  }
  if (/[\u0000-\u001f\u007f]/.test(value)) return fallback;

  const origin =
    typeof window === "undefined"
      ? process.env.NEXT_PUBLIC_APP_URL
      : window.location.origin;

  if (!origin) return fallback;

  let url;

  try {
    url = new URL(value, origin);
  } catch {
    return fallback;
  }

  if (url.origin !== origin) return fallback;

  return `${url.pathname}${url.search}${url.hash}`;
}

export function currentRedirectTarget(fallback = "/events") {
  if (typeof window === "undefined") return fallback;

  return safeRedirect(
    new URLSearchParams(window.location.search).get("redirect"),
    fallback,
  );
}
