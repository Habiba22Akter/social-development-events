import { Suspense } from "react";
import { headers } from "next/headers";
import Link from "next/link";
import { connection } from "next/server";
import { ArrowRight, CalendarDays, Ticket } from "lucide-react";

import { RequireAuth } from "@/components/auth/require-auth";
import { JoinedEventCard } from "@/components/events/joined-event-card";
import { getJoinedEvents } from "@/lib/events";

export const metadata = {
  title: "Joined Events",
};

function SectionHeading({ title, count, description }) {
  return (
    <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h2 className="font-heading text-2xl font-semibold">{title}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
      <p className="text-xs font-semibold tracking-[0.14em] text-muted-foreground uppercase">
        {count} event{count === 1 ? "" : "s"}
      </p>
    </div>
  );
}

async function JoinedEventsContent() {
  await connection();

  const cookie = (await headers()).get("cookie");
  const events = await getJoinedEvents(cookie);
  const upcoming = events.filter((event) => !event.isPast);
  const past = events.filter((event) => event.isPast);

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-20">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Ticket className="size-6" aria-hidden="true" />
          </div>
          <p className="mt-6 text-xs font-semibold tracking-[0.18em] text-primary uppercase">
            Joined events
          </p>
          <h1 className="mt-3 text-4xl font-semibold text-balance sm:text-5xl">
            The drives you signed up for.
          </h1>
          <p className="mt-4 text-muted-foreground">
            Every event you join is listed here by date, so you always know
            where you are expected next.
          </p>
        </div>
        <Link
          href="/events"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 focus-visible:ring-3 focus-visible:ring-ring/40 focus-visible:outline-none"
        >
          Find another drive
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </div>

      {events.length ? (
        <div className="mt-12 space-y-14">
          {upcoming.length ? (
            <div>
              <SectionHeading
                title="Coming up"
                count={upcoming.length}
                description="Events you have joined that are still ahead."
              />
              <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {upcoming.map((event) => (
                  <JoinedEventCard key={event._id} event={event} />
                ))}
              </div>
            </div>
          ) : null}

          {past.length ? (
            <div>
              <SectionHeading
                title="Already happened"
                count={past.length}
                description="Your record of drives you showed up for."
              />
              <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {past.map((event) => (
                  <JoinedEventCard key={event._id} event={event} />
                ))}
              </div>
            </div>
          ) : null}
        </div>
      ) : (
        <div className="mt-12 rounded-2xl border border-dashed border-border bg-card p-12 text-center">
          <CalendarDays className="mx-auto size-9 text-primary" aria-hidden="true" />
          <h2 className="mt-4 font-heading text-2xl font-semibold">
            You have not joined an event yet
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
            Browse the upcoming drives near you and join one — your schedule
            will fill up here.
          </p>
          <Link
            href="/events"
            className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 focus-visible:ring-3 focus-visible:ring-ring/40 focus-visible:outline-none"
          >
            Browse upcoming events
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      )}
    </section>
  );
}

function JoinedEventsSkeleton() {
  return (
    <section
      aria-busy="true"
      aria-live="polite"
      className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-20"
    >
      <span className="sr-only">Loading your joined events…</span>
      <div className="h-12 w-12 animate-pulse rounded-2xl bg-muted" />
      <div className="mt-6 h-4 w-32 animate-pulse rounded-full bg-muted" />
      <div className="mt-4 h-11 w-full max-w-xl animate-pulse rounded-xl bg-muted" />
      <div className="mt-3 h-4 w-full max-w-md animate-pulse rounded-full bg-muted" />
      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2].map((index) => (
          <div
            key={index}
            className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft"
          >
            <div className="aspect-[16/9] animate-pulse bg-muted" />
            <div className="space-y-3 p-5">
              <div className="h-5 w-3/4 animate-pulse rounded-full bg-muted" />
              <div className="h-3 w-full animate-pulse rounded-full bg-muted" />
              <div className="h-3 w-2/3 animate-pulse rounded-full bg-muted" />
              <div className="h-10 w-full animate-pulse rounded-full bg-muted" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function JoinedEventsPage() {
  return (
    <RequireAuth>
      <Suspense fallback={<JoinedEventsSkeleton />}>
        <JoinedEventsContent />
      </Suspense>
    </RequireAuth>
  );
}
