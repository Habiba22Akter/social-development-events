import { Suspense } from "react";
import Link from "next/link";
import { connection } from "next/server";
import { CalendarDays, Plus } from "lucide-react";

import { EventCard } from "@/components/home/home-sections";
import { getAllUpcomingEvents } from "@/lib/events";

export const metadata = {
  title: "Upcoming Events",
};

async function EventsContent() {
  await connection();
  const events = await getAllUpcomingEvents();

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-20">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <CalendarDays className="size-6" aria-hidden="true" />
          </div>
          <p className="mt-6 text-xs font-semibold tracking-[0.18em] text-primary uppercase">
            Upcoming events
          </p>
          <h1 className="mt-3 text-4xl font-semibold text-balance sm:text-5xl">
            Every drive on the calendar, in one place.
          </h1>
          <p className="mt-4 text-muted-foreground">
            Find a cause near you and join neighbours who are ready to help.
          </p>
        </div>
        <Link
          href="/events/create"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 focus-visible:ring-3 focus-visible:ring-ring/40 focus-visible:outline-none"
        >
          <Plus className="size-4" aria-hidden="true" />
          Create an event
        </Link>
      </div>

      {events.length ? (
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <EventCard key={event._id.toString()} event={event} />
          ))}
        </div>
      ) : (
        <div className="mt-12 rounded-2xl border border-dashed border-border bg-card p-12 text-center">
          <CalendarDays className="mx-auto size-9 text-primary" aria-hidden="true" />
          <h2 className="mt-4 font-heading text-2xl font-semibold">
            No upcoming events yet
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
            Be the first person to organise a community-service event in your neighbourhood.
          </p>
        </div>
      )}
    </section>
  );
}

export default function EventsPage() {
  return (
    <Suspense
      fallback={
        <section className="mx-auto max-w-7xl px-4 py-24 text-center text-sm text-muted-foreground">
          Loading upcoming events…
        </section>
      }
    >
      <EventsContent />
    </Suspense>
  );
}
