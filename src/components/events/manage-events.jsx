"use client";

import { useState } from "react";
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
import { ActionLink, actionStyles } from "@/components/ui/action";
import {
  EmptyState,
  PageHeader,
  Section,
} from "@/components/ui/section";
import { fetchWithToken } from "@/lib/client-token";
import {
  EVENT_LIMITS,
  hasErrors,
  validateEventInput,
} from "@/lib/event-form";
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
  const [formErrors, setFormErrors] = useState({});

  function startEditing(event) {
    setFormError("");
    setFormErrors({});
    setConfirmId("");
    setEditingEvent(event);
  }

  function stopEditing() {
    setEditingEvent(null);
    setFormError("");
    setFormErrors({});
  }

  function handleEditChange(event) {
    const { name } = event.target;

    setFormErrors((current) =>
      current[name] ? { ...current, [name]: undefined } : current,
    );
    setFormError("");
  }

  async function handleUpdate(submitEvent) {
    submitEvent.preventDefault();
    setFormError("");

    const id = editingEvent?._id;

    if (!id) return;

    const form = submitEvent.currentTarget;
    const formData = new FormData(form);
    const values = Object.fromEntries(formData);
    const nextErrors = validateEventInput(values, {
      existingDate: toLocalInput(editingEvent.date),
    });

    if (hasErrors(nextErrors)) {
      setFormErrors(nextErrors);
      setFormError("Please fix the highlighted fields and try again.");
      return;
    }

    setFormErrors({});
    setBusyId(id);

    try {
      const response = await fetchWithToken(`/api/events/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          featured: formData.get("featured") === "on",
        }),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setFormError(data.message || "We could not update this event.");
        return;
      }

      toast.success("Event updated successfully.");
      if (data.notice) toast.info(data.notice);
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
      const response = await fetchWithToken(`/api/events/${id}`, {
        method: "DELETE",
      });
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
    <Section>
      <PageHeader
        icon={CalendarPlus}
        eyebrow="Manage events"
        title="Your drives, fully in your hands."
        description="Update the details of a drive you organise, or remove it if plans change. You can only edit events you created."
        action={
          <ActionLink href="/events/create">
            <CalendarPlus className="size-4" aria-hidden="true" />
            Create an event
          </ActionLink>
        }
      />

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
                        className={actionStyles({ variant: "secondary" })}
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
                        className={actionStyles({ variant: "destructive-outline" })}
                      >
                        <Trash2 className="size-4" aria-hidden="true" />
                        Delete
                      </button>
                      {!event.isPast ? (
                        <ActionLink
                          href={`/events/${event._id}`}
                          variant="ghost"
                        >
                          <Eye className="size-4" aria-hidden="true" />
                          View public page
                        </ActionLink>
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
                        className={actionStyles({ variant: "destructive" })}
                      >
                        <Trash2 className="size-4" aria-hidden="true" />
                        {isBusy ? "Deleting…" : "Yes, delete event"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmId("")}
                        disabled={isBusy}
                        className={actionStyles({ variant: "secondary" })}
                      >
                        Keep event
                      </button>
                    </div>
                  </div>
                ) : null}

                {isEditing ? (
                  <form
                    onSubmit={handleUpdate}
                    noValidate
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
                          maxLength={EVENT_LIMITS.title}
                          defaultValue={event.title}
                          onChange={handleEditChange}
                          aria-invalid={Boolean(formErrors.title)}
                          aria-describedby={
                            formErrors.title ? "edit-title-error" : undefined
                          }
                          className={fieldClass}
                        />
                        {formErrors.title ? (
                          <span
                            id="edit-title-error"
                            className="text-xs font-normal text-destructive"
                          >
                            {formErrors.title}
                          </span>
                        ) : null}
                      </label>
                      <label className="grid gap-2 text-sm font-medium">
                        Meeting point
                        <input
                          name="location"
                          maxLength={EVENT_LIMITS.location}
                          defaultValue={event.location}
                          onChange={handleEditChange}
                          aria-invalid={Boolean(formErrors.location)}
                          aria-describedby={
                            formErrors.location ? "edit-location-error" : undefined
                          }
                          className={fieldClass}
                        />
                        {formErrors.location ? (
                          <span
                            id="edit-location-error"
                            className="text-xs font-normal text-destructive"
                          >
                            {formErrors.location}
                          </span>
                        ) : null}
                      </label>
                    </div>
                    <label className="grid gap-2 text-sm font-medium">
                      Description
                      <textarea
                        name="description"
                        maxLength={EVENT_LIMITS.description}
                        defaultValue={event.description}
                        onChange={handleEditChange}
                        aria-invalid={Boolean(formErrors.description)}
                        aria-describedby={
                          formErrors.description ? "edit-description-error" : undefined
                        }
                        className="min-h-24 rounded-xl border border-input bg-background px-3 py-3 font-normal outline-none focus-visible:ring-3 focus-visible:ring-ring/40 aria-invalid:border-destructive"
                      />
                      {formErrors.description ? (
                        <span
                          id="edit-description-error"
                          className="text-xs font-normal text-destructive"
                        >
                          {formErrors.description}
                        </span>
                      ) : null}
                    </label>
                    <div className="grid gap-5 sm:grid-cols-2">
                      <label className="grid gap-2 text-sm font-medium">
                        Event type
                        <select
                          name="type"
                          defaultValue={event.type}
                          onChange={handleEditChange}
                          aria-invalid={Boolean(formErrors.type)}
                          aria-describedby={
                            formErrors.type ? "edit-type-error" : undefined
                          }
                          className={fieldClass}
                        >
                          {eventTypes.map((type) => (
                            <option key={type}>{type}</option>
                          ))}
                        </select>
                        {formErrors.type ? (
                          <span
                            id="edit-type-error"
                            className="text-xs font-normal text-destructive"
                          >
                            {formErrors.type}
                          </span>
                        ) : null}
                      </label>
                      <label className="grid gap-2 text-sm font-medium">
                        Date and time
                        <input
                          name="date"
                          type="datetime-local"
                          min={
                            event.isPast
                              ? undefined
                              : toLocalInput(new Date())
                          }
                          defaultValue={toLocalInput(event.date)}
                          onChange={handleEditChange}
                          aria-invalid={Boolean(formErrors.date)}
                          aria-describedby={
                            formErrors.date ? "edit-date-error" : undefined
                          }
                          className={fieldClass}
                        />
                        {formErrors.date ? (
                          <span
                            id="edit-date-error"
                            className="text-xs font-normal text-destructive"
                          >
                            {formErrors.date}
                          </span>
                        ) : null}
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
                        defaultValue={event.image}
                        onChange={handleEditChange}
                        aria-invalid={Boolean(formErrors.image)}
                        aria-describedby={
                          formErrors.image ? "edit-image-error" : undefined
                        }
                        className={fieldClass}
                      />
                      {formErrors.image ? (
                        <span
                          id="edit-image-error"
                          className="text-xs font-normal text-destructive"
                        >
                          {formErrors.image}
                        </span>
                      ) : null}
                    </label>

                    <label className="flex items-start gap-3 rounded-xl border border-border bg-background p-4 text-sm">
                      <input
                        type="checkbox"
                        name="featured"
                        defaultChecked={Boolean(event.featured)}
                        className="mt-0.5 size-4 shrink-0 accent-primary"
                      />
                      <span>
                        <span className="block font-medium">
                          Feature this event on the home page
                        </span>
                        <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">
                          Featured drives appear in the home-page highlight section.
                        </span>
                      </span>
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
                        className={actionStyles()}
                      >
                        {isBusy ? "Saving…" : "Save changes"}
                      </button>
                      <button
                        type="button"
                        onClick={stopEditing}
                        disabled={isBusy}
                        className={actionStyles({ variant: "secondary" })}
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
        <EmptyState
          className="mt-10"
          icon={CalendarPlus}
          title="You have not created an event yet"
          description="Publish your first community-service drive and it will show up here for editing and deleting."
          action={
            <ActionLink href="/events/create">
              <CalendarPlus className="size-4" aria-hidden="true" />
              Create an event
            </ActionLink>
          }
        />
      )}
    </Section>
  );
}
