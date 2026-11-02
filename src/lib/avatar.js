/** Two-letter initials used whenever a user has no (working) photo. */
export function initialsOf(name = "") {
  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) return "U";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();

  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/** Portrait photos have the face near the top, so crop from the top, not the middle. */
export const AVATAR_IMAGE_CLASS = "size-full object-cover object-top";
