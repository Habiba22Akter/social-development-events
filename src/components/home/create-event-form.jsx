"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, CalendarPlus } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

import { eventTypes } from "@/lib/site";

export function CreateEventForm() {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");
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
      router.push("/events");
      router.refresh();
    } catch {
      setMessage("The event service is unavailable. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8 lg:py-20">
      <Link href="/events" className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" aria-hidden="true" /> Back to events
      </Link>
      <div className="mt-8 rounded-3xl border border-border bg-card p-6 shadow-soft sm:p-10">
        <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <CalendarPlus className="size-6" aria-hidden="true" />
        </div>
        <h1 className="mt-6 text-3xl font-semibold sm:text-4xl">Put your neighbourhood on the map.</h1>
        <p className="mt-3 text-muted-foreground">Share the details people need to join your next community-service event.</p>
        <form onSubmit={handleSubmit} className="mt-8 grid gap-5">
          <label className="grid gap-2 text-sm font-medium">Event title<input name="title" required maxLength={100} className="h-11 rounded-xl border border-input bg-background px-3 font-normal outline-none focus-visible:ring-3 focus-visible:ring-ring/40" placeholder="e.g. Mirpur winter clothes drive" /></label>
          <label className="grid gap-2 text-sm font-medium">Description<textarea name="description" required maxLength={500} className="min-h-28 rounded-xl border border-input bg-background px-3 py-3 font-normal outline-none focus-visible:ring-3 focus-visible:ring-ring/40" placeholder="What will volunteers do?" /></label>
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="grid gap-2 text-sm font-medium">Event type<select name="type" required className="h-11 rounded-xl border border-input bg-background px-3 font-normal outline-none focus-visible:ring-3 focus-visible:ring-ring/40"><option value="">Select a type</option>{eventTypes.map((type) => <option key={type}>{type}</option>)}</select></label>
            <label className="grid gap-2 text-sm font-medium">Date and time<input name="date" type="datetime-local" min={new Date().toISOString().slice(0, 16)} required className="h-11 rounded-xl border border-input bg-background px-3 font-normal outline-none focus-visible:ring-3 focus-visible:ring-ring/40" /></label>
          </div>
          <label className="grid gap-2 text-sm font-medium">Meeting point<input name="location" required maxLength={160} className="h-11 rounded-xl border border-input bg-background px-3 font-normal outline-none focus-visible:ring-3 focus-visible:ring-ring/40" placeholder="Mirpur 10 roundabout" /></label>
          <label className="grid gap-2 text-sm font-medium">Thumbnail image URL <span className="font-normal text-muted-foreground">(HTTPS required)</span><input name="image" type="url" required pattern="https://.+" className="h-11 rounded-xl border border-input bg-background px-3 font-normal outline-none focus-visible:ring-3 focus-visible:ring-ring/40" placeholder="https://..." /></label>
          {message ? <p role="alert" className="rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">{message}</p> : null}
          <button type="submit" disabled={isSubmitting} className="mt-2 h-12 rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground disabled:opacity-60">{isSubmitting ? "Publishing…" : "Publish event"}</button>
        </form>
      </div>
    </section>
  );
}
