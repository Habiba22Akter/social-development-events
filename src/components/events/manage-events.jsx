"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  CalendarDays,
  CalendarPlus,
  Eye,
  MapPin,
  Pencil,
  Trash2,
  Users,
} from "lucide-react";

import { EventImage } from "@/components/events/event-image";
import { eventTypes } from "@/lib/site";

function formatEventDate(date) {
  return new Intl.DateTimeFormat("en-BD", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
}

/** UTC ISO string -> value for a `datetime-local` input. */
function toLocalInput(iso) {
  const date = new Date(iso);
  const pad = (value) => String(value).padStart(2, "0");

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate(),
  )}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

const fieldClass =
  "h-11 rounded-xl border border-input bg-background px-3 font-normal outline-none focus-visible:ring-3 focus-visible:ring-ring/40";

export function ManageEvents({ events }) {
  const router = useRouter();
  const [editingEvent, setEditingEvent] = useState(null);
  const [confirmId, setConfirmId] = useState("");
  const [busyId, setBusyId] = useState("");
  const [formError, setFormError] = useState("");

  function startEditing(event) {
    setFormError("");
    setConfirmId("");
    setEditingEvent(event);
  }

  function stopEditing() {
    setEditingEvent(null);
    setFormError("");
  }

  async function handleUpdate(submitEvent) {
    submitEvent.preventDefault();
    setFormError("");

    const id = editingEvent?._id;

    if (!id) return;

    setBusyId(id);

    try {
      const response = await fetch(`/api/events/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          Object.fromEntries(new FormData(submitEvent.currentTarget)),
        ),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setFormError(data.message || "We could not update this event.");
        return;
      }

      toast.success("Event updated successfully.");
      stopEditing();
      router.refresh();
    } catch {
      setFormError("The event service is unavailable. Please try again.");
    } finally {
      setBusyId("");
    }
  }

  async function handleDelete(id) {
    setBusyId(id);
    setFormError("");

    try {
      const response = await fetch(`/api/events/${id}`, { method: "DELETE" });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        toast.error(data.message || "We could not delete that event.");
        return;
      }

      toast.success("Event deleted.");
      setConfirmId("");
      if (editingEvent?._id === id) stopEditing();
      router.refresh();
    } catch {
      toast.error("The event service is unavailable. Please try again.");
    } finally {
      setBusyId("");
    }
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-20">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <CalendarPlus className="size-6" aria-hidden="true" />
          </div>
          <p className="mt-6 text-xs font-semibold tracking-[0.18em] text-primary uppercase">
            Manage events
          </p>
          <h1 className="mt-3 text-4xl font-semibold text-balance sm:text-5xl">
            Your drives, fully in your hands.
          </h1>
          <p className="mt-4 text-muted-foreground">
            Update the details of a drive you organise, or remove it if plans
            change. You can only edit events you created.
          </p>
        </div>
        <Link
          href="/events/create"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 focus-visible:ring-3 focus-visible:ring-ring/40 focus-visible:outline-none"
        >
          <CalendarPlus className="size-4" aria-hidden="true" />
          Create an event
        </Link>
      </div>

      {events.length ? (
        <div className="mt-12 space-y-5">
          {events.map((event) => {
            const isEditing = editingEvent?._id === event._id;
            const isBusy = busyId === event._id;
            const volunteers = event.participantCount || 0;

            return (
              <article
                key={event._id}
                className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft"
              >
                <div className="flex flex-col gap-5 p-5 sm:flex-row">
                  <div className="relative aspect-[16/9] w-full shrink-0 overflow-hidden rounded-xl bg-muted sm:w-48">
                    <EventImage
                      src={event.image}
                      sizes="(min-width: 640px) 192px, 100vw"
                      className="object-cover"
                    />
                  </div>

                  <div className="flex flex-1 flex-col">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                        {event.type}
                      </span>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          event.isPast
                            ? "bg-muted text-muted-foreground"
                            : "bg-accent/15 text-foreground"
                        }`}
                      >
                        {event.isPast ? "Ended" : "Upcoming"}
                      </span>
                    </div>

                    <h2 className="mt-2 font-heading text-xl font-semibold">
                      {event.title}
                    </h2>
                    <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                      {event.description}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs font-medium text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <CalendarDays className="size-4 text-primary" aria-hidden="true" />
                        {formatEventDate(event.date)}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <MapPin className="size-4 text-primary" aria-hidden="true" />
                        {event.location}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Users className="size-4 text-primary" aria-hidden="true" />
                        {volunteers} volunteer{volunteers === 1 ? "" : "s"} joined
                      </span>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => startEditing(event)}
                        aria-expanded={isEditing}
                        className="inline-flex h-10 items-center gap-2 rounded-full border border-border px-4 text-sm font-semibold transition-colors hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/40 focus-visible:outline-none"
                      >
                        <Pencil className="size-4" aria-hidden="true" />
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setConfirmId(event._id);
                          setEditingEvent(null);
                        }}
                        className="inline-flex h-10 items-center gap-2 rounded-full border border-destructive/40 px-4 text-sm font-semibold text-destructive transition-colors hover:bg-destructive/10 focus-visible:ring-3 focus-visible:ring-ring/40 focus-visible:outline-none"
                      >
                        <Trash2 className="size-4" aria-hidden="true" />
                        Delete
                      </button>
                      {!event.isPast ? (
                        <Link
                          href={`/events/${event._id}`}
                          className="inline-flex h-10 items-center gap-2 rounded-full px-4 text-sm font-semibold text-primary transition-colors hover:bg-primary/10 focus-visible:ring-3 focus-visible:ring-ring/40 focus-visible:outline-none"
                        >
                          <Eye className="size-4" aria-hidden="true" />
                          View public page
                        </Link>
                      ) : null}
                    </div>
                  </div>
                </div>

                {confirmId === event._id ? (
                  <div
                    role="alertdialog"
                    aria-label={`Delete ${event.title}`}
                    className="border-t border-border bg-destructive/5 p-5"
                  >
                    <p className="text-sm font-medium">
                      Delete “{event.title}”? This cannot be undone, and joined
                      volunteers will lose the event from their list.
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => handleDelete(event._id)}
                        disabled={isBusy}
                        className="inline-flex h-10 items-center gap-2 rounded-full bg-destructive px-4 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
                      >
                        <Trash2 className="size-4" aria-hidden="true" />
                        {isBusy ? "Deleting…" : "Yes, delete event"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmId("")}
                        disabled={isBusy}
                        className="inline-flex h-10 items-center rounded-full border border-border px-4 text-sm font-semibold transition-colors hover:bg-muted disabled:opacity-60"
                      >
                        Keep event
                      </button>
                    </div>
                  </div>
                ) : null}

                {isEditing ? (
                  <form
                    onSubmit={handleUpdate}
                    className="grid gap-5 border-t border-border bg-muted/40 p-5"
                  >
                    <p className="text-xs font-semibold tracking-[0.14em] text-muted-foreground uppercase">
                      Editing “{event.title}”
                    </p>
                    <div className="grid gap-5 sm:grid-cols-2">
                      <label className="grid gap-2 text-sm font-medium">
                        Event title
                        <input
                          name="title"
                          required
                          maxLength={100}
                          defaultValue={event.title}
                          className={fieldClass}
                        />
                      </label>
                      <label className="grid gap-2 text-sm font-medium">
                        Meeting point
                        <input
                          name="location"
                          required
                          maxLength={160}
                          defaultValue={event.location}
                          className={fieldClass}
                        />
                      </label>
                    </div>
                    <label className="grid gap-2 text-sm font-medium">
                      Description
                      <textarea
                        name="description"
                        required
                        maxLength={500}
                        defaultValue={event.description}
                        className="min-h-24 rounded-xl border border-input bg-background px-3 py-3 font-normal outline-none focus-visible:ring-3 focus-visible:ring-ring/40"
                      />
                    </label>
                    <div className="grid gap-5 sm:grid-cols-2">
                      <label className="grid gap-2 text-sm font-medium">
                        Event type
                        <select
                          name="type"
                          required
                          defaultValue={event.type}
                          className={fieldClass}
                        >
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
                          min={
                            event.isPast
                              ? undefined
                              : new Date().toISOString().slice(0, 16)
                          }
                          required
                          defaultValue={toLocalInput(event.date)}
                          className={fieldClass}
                        />
                      </label>
                    </div>
                    <label className="grid gap-2 text-sm font-medium">
                      Thumbnail image URL{" "}
                      <span className="font-normal text-muted-foreground">
                        (HTTPS required)
                      </span>
                      <input
                        name="image"
                        type="url"
                        required
                        pattern="https://.+"
                        defaultValue={event.image}
                        className={fieldClass}
                      />
                    </label>

                    {formError ? (
                      <p
                        role="alert"
                        className="rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive"
                      >
                        {formError}
                      </p>
                    ) : null}

                    <div className="flex flex-wrap gap-2">
                      <button
                        type="submit"
                        disabled={isBusy}
                        className="inline-flex h-11 items-center rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
                      >
                        {isBusy ? "Saving…" : "Save changes"}
                      </button>
                      <button
                        type="button"
                        onClick={stopEditing}
                        disabled={isBusy}
                        className="inline-flex h-11 items-center rounded-full border border-border px-5 text-sm font-semibold transition-colors hover:bg-muted disabled:opacity-60"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : null}
              </article>
            );
          })}
        </div>
      ) : (
        <div className="mt-12 rounded-2xl border border-dashed border-border bg-card p-12 text-center">
          <CalendarPlus
            className="mx-auto size-9 text-primary"
            aria-hidden="true"
          />
          <h2 className="mt-4 font-heading text-2xl font-semibold">
            You have not created an event yet
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
            Publish your first community-service drive and it will show up here
            for editing and deleting.
          </p>
          <Link
            href="/events/create"
            className="mt-6 inline-flex h-11 items-center justify-center rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 focus-visible:ring-3 focus-visible:ring-ring/40 focus-visible:outline-none"
          >
            Create an event
          </Link>
        </div>
      )}
    </section>
  );
}
