import { Suspense } from "react";
import { connection } from "next/server";
import { CalendarDays, Plus } from "lucide-react";

import { EventCard } from "@/components/home/home-sections";
import { ActionLink } from "@/components/ui/action";
import { EmptyState, PageHeader, Section } from "@/components/ui/section";
import { getAllUpcomingEvents } from "@/lib/events";

export const metadata = {
  title: "Upcoming Events",
};

async function EventsContent() {
  await connection();
  const events = await getAllUpcomingEvents();

  return (
    <Section>
      <PageHeader
        icon={CalendarDays}
        eyebrow="Upcoming events"
        title="Every drive on the calendar, in one place."
        description="Find a cause near you and join neighbours who are ready to help."
        action={
          <ActionLink href="/events/create">
            <Plus className="size-4" aria-hidden="true" />
            Create an event
          </ActionLink>
        }
      />

      {events.length ? (
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <EventCard key={event._id.toString()} event={event} />
          ))}
        </div>
      ) : (
        <EmptyState
          className="mt-10"
          icon={CalendarDays}
          title="No upcoming events yet"
          description="Be the first person to organise a community-service event in your neighbourhood."
          action={
            <ActionLink href="/events/create">
              Create an event
              <Plus className="size-4" aria-hidden="true" />
            </ActionLink>
          }
        />
      )}
    </Section>
  );
}

function EventsSkeleton() {
  return (
    <Section aria-busy="true" aria-live="polite">
      <span className="sr-only">Loading upcoming events…</span>
      <div className="h-12 w-12 animate-pulse rounded-2xl bg-muted" />
      <div className="mt-6 h-4 w-32 animate-pulse rounded-full bg-muted" />
      <div className="mt-4 h-11 w-full max-w-xl animate-pulse rounded-xl bg-muted" />
      <div className="mt-3 h-4 w-full max-w-md animate-pulse rounded-full bg-muted" />
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
              <div className="h-11 w-full animate-pulse rounded-full bg-muted" />
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

export default function EventsPage() {
  return (
    <Suspense fallback={<EventsSkeleton />}>
      <EventsContent />
    </Suspense>
  );
}
