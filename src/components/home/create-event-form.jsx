"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, CalendarPlus, ImageOff } from "lucide-react";
import { toast } from "sonner";

import { ActionLink, actionStyles } from "@/components/ui/action";
import { PageHeader, Section } from "@/components/ui/section";
import { normalizeImageUrl } from "@/lib/image-url";
import { eventTypes } from "@/lib/site";

const fieldClass =
  "h-11 rounded-xl border border-input bg-background px-3 font-normal outline-none focus-visible:ring-3 focus-visible:ring-ring/40";

export function CreateEventForm() {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageError, setImageError] = useState("");
  const [previewError, setPreviewError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const normalizedImage = normalizeImageUrl(imageUrl);

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");

    if (imageError) {
      setMessage(imageError);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(new FormData(event.currentTarget))),
      });
      const data = await response.json();

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
    const value = event.target.value;
    setImageUrl(value);
    setImageError(normalizeImageUrl(value).error);
    setPreviewError("");
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
          className="mt-8 grid gap-5 rounded-3xl border border-border bg-card p-6 shadow-soft sm:p-10"
        >
          <label className="grid gap-2 text-sm font-medium">
            Event title
            <input
              name="title"
              required
              maxLength={100}
              className={fieldClass}
              placeholder="e.g. Mirpur winter clothes drive"
            />
          </label>

          <label className="grid gap-2 text-sm font-medium">
            Description
            <textarea
              name="description"
              required
              maxLength={500}
              className="min-h-28 rounded-xl border border-input bg-background px-3 py-3 font-normal outline-none focus-visible:ring-3 focus-visible:ring-ring/40"
              placeholder="What will volunteers do?"
            />
          </label>

          <div className="grid gap-5 sm:grid-cols-2">
            <label className="grid gap-2 text-sm font-medium">
              Event type
              <select name="type" required className={fieldClass}>
                <option value="">Select a type</option>
                {eventTypes.map((type) => (
                  <option key={type}>{type}</option>
                ))}
              </select>
            </label>
            <label className="grid gap-2 text-sm font-medium">
              Date and time
              <input
                name="date"
                type="datetime-local"
                min={new Date().toISOString().slice(0, 16)}
                required
                className={fieldClass}
              />
            </label>
          </div>

          <label className="grid gap-2 text-sm font-medium">
            Meeting point
            <input
              name="location"
              required
              maxLength={160}
              className={fieldClass}
              placeholder="Mirpur 10 roundabout"
            />
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
              required
              pattern="https://.+"
              className={fieldClass}
              placeholder="https://example.com/photo.jpg"
            />
            {imageError ? (
              <span className="text-xs font-normal text-destructive">
                {imageError}
              </span>
            ) : null}
          </label>

          {normalizedImage.url && !imageError ? (
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
