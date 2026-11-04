import { normalizeImageUrl } from "@/lib/image-url";
import { eventTypes } from "@/lib/site";

/**
 * Client-side mirror of the Express event validator
 * (social-development-events-server/src/events.js).
 *
 * The server remains authoritative — it also checks that the thumbnail URL
 * really resolves to an image — but running the same rules in the browser
 * gives immediate, inline feedback instead of a round-trip.
 */
export const EVENT_LIMITS = {
  title: 100,
  description: 500,
  location: 160,
};

function text(values, key) {
  return typeof values?.[key] === "string" ? values[key].trim() : "";
}

/** `Date` -> value accepted by a `datetime-local` input, in local time. */
export function toLocalDateTimeValue(value) {
  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  const pad = (part) => String(part).padStart(2, "0");

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate(),
  )}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

/**
 * Returns a `{ field: message }` map. An empty object means the form is valid.
 *
 * `existingDate` is the event's current `datetime-local` value when editing:
 * an unchanged date is allowed to be in the past so organisers can still fix
 * the text of an event that already happened.
 */
export function validateEventInput(values, { existingDate = "" } = {}) {
  const errors = {};
  const title = text(values, "title");
  const description = text(values, "description");
  const type = text(values, "type");
  const location = text(values, "location");
  const image = text(values, "image");
  const rawDate = text(values, "date");

  if (!title) {
    errors.title = "Add an event title.";
  } else if (title.length > EVENT_LIMITS.title) {
    errors.title = `Keep the title to ${EVENT_LIMITS.title} characters or fewer.`;
  }

  if (!description) {
    errors.description = "Describe what volunteers will do.";
  } else if (description.length > EVENT_LIMITS.description) {
    errors.description = `Keep the description to ${EVENT_LIMITS.description} characters or fewer.`;
  }

  if (!type) {
    errors.type = "Choose an event type.";
  } else if (!eventTypes.includes(type)) {
    errors.type = "Choose a valid event type.";
  }

  if (!location) {
    errors.location = "Add a meeting point.";
  } else if (location.length > EVENT_LIMITS.location) {
    errors.location = `Keep the meeting point to ${EVENT_LIMITS.location} characters or fewer.`;
  }

  if (!image) {
    errors.image = "Add a thumbnail image URL.";
  } else {
    const { error } = normalizeImageUrl(image);

    if (error) errors.image = error;
  }

  if (!rawDate) {
    errors.date = "Choose the date and time.";
  } else {
    const date = new Date(rawDate);
    const unchanged = Boolean(existingDate) && rawDate === existingDate;

    if (Number.isNaN(date.getTime())) {
      errors.date = "Enter a valid date and time.";
    } else if (!unchanged && date <= new Date()) {
      errors.date = "Choose a future date and time.";
    }
  }

  return errors;
}

export function hasErrors(errors) {
  return Object.values(errors).some(Boolean);
}
