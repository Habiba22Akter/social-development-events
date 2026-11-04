"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, CalendarPlus, ImageOff } from "lucide-react";
import { toast } from "sonner";

import { ActionLink, actionStyles } from "@/components/ui/action";
import { PageHeader, Section } from "@/components/ui/section";
import { fetchWithToken } from "@/lib/client-token";
import {
  EVENT_LIMITS,
  hasErrors,
  toLocalDateTimeValue,
  validateEventInput,
} from "@/lib/event-form";
import { normalizeImageUrl } from "@/lib/image-url";
import { eventTypes } from "@/lib/site";

const fieldClass =
  "h-11 rounded-xl border border-input bg-background px-3 font-normal outline-none focus-visible:ring-3 focus-visible:ring-ring/40 aria-invalid:border-destructive";

function FieldError({ id, children }) {
  if (!children) return null;

  return (
    <span id={id} className="text-xs font-normal text-destructive">
      {children}
    </span>
  );
}

export function CreateEventForm() {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [previewError, setPreviewError] = useState("");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const normalizedImage = normalizeImageUrl(imageUrl);
  const minDate = toLocalDateTimeValue(new Date());

  function clearError(field) {
    setErrors((current) =>
      current[field] ? { ...current, [field]: undefined } : current,
    );
    setMessage("");
  }

  function handleChange(event) {
    clearError(event.target.name);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);
    const values = Object.fromEntries(formData);
    const nextErrors = validateEventInput(values);

    if (hasErrors(nextErrors)) {
      setErrors(nextErrors);
      setMessage("Please fix the highlighted fields and try again.");
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      const response = await fetchWithToken("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          featured: formData.get("featured") === "on",
        }),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setMessage(data.message || "We could not create that event.");
        return;
      }

      toast.success("Event created successfully.");
      if (data.notice) toast.info(data.notice);
      router.push("/events");
      router.refresh();
    } catch {
      setMessage("The event service is unavailable. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleImageChange(event) {
    setImageUrl(event.target.value);
    setPreviewError("");
    clearError("image");
  }

  return (
    <Section>
      <div className="mx-auto max-w-3xl">
        <ActionLink
          href="/events"
          variant="ghost"
          className="-ml-5 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Back to events
        </ActionLink>

        <div className="mt-6">
          <PageHeader
            icon={CalendarPlus}
            eyebrow="Create event"
            title="Put your neighbourhood on the map."
            description="Share the details people need to join your next community-service event."
          />
        </div>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="mt-8 grid gap-5 rounded-3xl border border-border bg-card p-6 shadow-soft sm:p-10"
        >
          <label className="grid gap-2 text-sm font-medium">
            Event title
            <input
              name="title"
              maxLength={EVENT_LIMITS.title}
              onChange={handleChange}
              aria-invalid={Boolean(errors.title)}
              aria-describedby={errors.title ? "title-error" : undefined}
              className={fieldClass}
              placeholder="e.g. Mirpur winter clothes drive"
            />
            <FieldError id="title-error">{errors.title}</FieldError>
          </label>

          <label className="grid gap-2 text-sm font-medium">
            Description
            <textarea
              name="description"
              maxLength={EVENT_LIMITS.description}
              onChange={handleChange}
              aria-invalid={Boolean(errors.description)}
              aria-describedby={
                errors.description ? "description-error" : undefined
              }
              className="min-h-28 rounded-xl border border-input bg-background px-3 py-3 font-normal outline-none focus-visible:ring-3 focus-visible:ring-ring/40 aria-invalid:border-destructive"
              placeholder="What will volunteers do?"
            />
            <FieldError id="description-error">{errors.description}</FieldError>
          </label>

          <div className="grid gap-5 sm:grid-cols-2">
            <label className="grid gap-2 text-sm font-medium">
              Event type
              <select
                name="type"
                onChange={handleChange}
                aria-invalid={Boolean(errors.type)}
                aria-describedby={errors.type ? "type-error" : undefined}
                className={fieldClass}
              >
                <option value="">Select a type</option>
                {eventTypes.map((type) => (
                  <option key={type}>{type}</option>
                ))}
              </select>
              <FieldError id="type-error">{errors.type}</FieldError>
            </label>
            <label className="grid gap-2 text-sm font-medium">
              Date and time
              <input
                name="date"
                type="datetime-local"
                min={minDate}
                onChange={handleChange}
                aria-invalid={Boolean(errors.date)}
                aria-describedby={errors.date ? "date-error" : undefined}
                className={fieldClass}
              />
              <FieldError id="date-error">{errors.date}</FieldError>
            </label>
          </div>

          <label className="grid gap-2 text-sm font-medium">
            Meeting point
            <input
              name="location"
              maxLength={EVENT_LIMITS.location}
              onChange={handleChange}
              aria-invalid={Boolean(errors.location)}
              aria-describedby={errors.location ? "location-error" : undefined}
              className={fieldClass}
              placeholder="Mirpur 10 roundabout"
            />
            <FieldError id="location-error">{errors.location}</FieldError>
          </label>

          <label className="grid gap-2 text-sm font-medium">
            Thumbnail image URL{" "}
            <span className="font-normal text-muted-foreground">
              (direct image link, a page link, or a Google Drive file)
            </span>
            <input
              name="image"
              type="url"
              value={imageUrl}
              onChange={handleImageChange}
              aria-invalid={Boolean(errors.image)}
              aria-describedby={errors.image ? "image-error" : undefined}
              className={fieldClass}
              placeholder="https://example.com/photo.jpg"
            />
            <FieldError id="image-error">{errors.image}</FieldError>
          </label>

          {normalizedImage.url && !errors.image ? (
            <div className="grid gap-2">
              <div className="relative aspect-[16/9] overflow-hidden rounded-xl border border-border bg-muted">
                {previewError ? (
                  <div className="flex h-full flex-col items-center justify-center gap-2 text-muted-foreground">
                    <ImageOff className="size-6" aria-hidden="true" />
                    <span className="text-xs font-medium">Preview unavailable</span>
                  </div>
                ) : (
                  <Image
                    src={normalizedImage.url}
                    alt="Thumbnail preview"
                    fill
                    sizes="(min-width: 768px) 672px, 100vw"
                    className="object-cover"
                    onLoad={() => setPreviewError("")}
                    onError={() =>
                      setPreviewError(
                        "Preview unavailable here. If this is a page link, its preview image is used on publish — and if the page has none, a default community photo is used.",
                      )
                    }
                  />
                )}
              </div>
              {previewError ? (
                <p className="text-xs text-muted-foreground">{previewError}</p>
              ) : null}
              {normalizedImage.converted ? (
                <p className="text-xs text-muted-foreground">
                  Google Drive link detected — the shared file will be used as the
                  thumbnail.
                </p>
              ) : null}
            </div>
          ) : null}

          <label className="flex items-start gap-3 rounded-xl border border-border bg-muted/40 p-4 text-sm">
            <input
              type="checkbox"
              name="featured"
              className="mt-0.5 size-4 shrink-0 accent-primary"
            />
            <span>
              <span className="block font-medium">
                Feature this event on the home page
              </span>
              <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">
                Featured drives appear in the home-page highlight section. You can
                change this later from Manage Events.
              </span>
            </span>
          </label>

          {message ? (
            <p
              role="alert"
              className="rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive"
            >
              {message}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className={actionStyles({ className: "mt-2 w-full" })}
          >
            {isSubmitting ? "Publishing…" : "Publish event"}
          </button>
        </form>
      </div>
    </Section>
  );
}
