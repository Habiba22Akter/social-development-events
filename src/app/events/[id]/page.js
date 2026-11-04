import { Suspense } from "react";
import Link from "next/link";
import { ArrowLeft, CalendarDays, MapPin, Users } from "lucide-react";

import { EventImage } from "@/components/events/event-image";
import { JoinEventButton } from "@/components/events/join-event-button";
import { getUpcomingEventById } from "@/lib/events";

export const metadata = {
  title: "Event details",
};

export const instant = false;

function formatEventDate(date) {
  return new Intl.DateTimeFormat("en-BD", {
    dateStyle: "full",
    timeStyle: "short",
  }).format(new Date(date));
}

async function EventDetailsContent({ params }) {
  const { id } = await params;
  const event = await getUpcomingEventById(id);

  if (!event) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6">
        <h1 className="text-3xl font-semibold">Event not found</h1>
        <p className="mt-3 text-muted-foreground">
          This event may have passed or is no longer available.
        </p>
        <Link
          href="/events"
          className="mt-6 inline-flex h-11 items-center rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground"
        >
          Browse upcoming events
        </Link>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8 lg:py-20">
      <Link
        href="/events"
        className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        Back to upcoming events
      </Link>

      <article className="mt-8 overflow-hidden rounded-3xl border border-border bg-card shadow-soft">
        <div className="relative aspect-[2/1] bg-muted sm:aspect-[2.4/1]">
          <EventImage
            src={event.image}
            alt={event.title}
            priority
            sizes="(min-width: 1024px) 960px, 100vw"
            className="object-cover"
          />
          <span className="absolute top-5 left-5 rounded-full bg-background/90 px-4 py-2 text-xs font-semibold text-primary backdrop-blur">
            {event.type}
          </span>
        </div>

        <div className="p-6 sm:p-10">
          <h1 className="text-4xl font-semibold text-balance sm:text-5xl">
            {event.title}
          </h1>
          <p className="mt-5 max-w-3xl whitespace-pre-wrap leading-relaxed text-muted-foreground">
            {event.description}
          </p>

          <div className="mt-8 grid gap-4 border-y border-border py-6 sm:grid-cols-2">
            <p className="flex items-start gap-3 text-sm">
              <CalendarDays className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
              <span>
                <span className="block text-xs font-semibold tracking-wide text-muted-foreground uppercase">When</span>
                <span className="mt-1 block font-medium">{formatEventDate(event.date)}</span>
              </span>
            </p>
            <p className="flex items-start gap-3 text-sm">
              <MapPin className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
              <span>
                <span className="block text-xs font-semibold tracking-wide text-muted-foreground uppercase">Where</span>
                <span className="mt-1 block font-medium">{event.location}</span>
              </span>
            </p>
          </div>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="size-4 text-primary" aria-hidden="true" />
              {event.participants?.length || 0} volunteer{event.participants?.length === 1 ? "" : "s"} joined
            </p>
            <JoinEventButton eventId={event._id.toString()} />
          </div>
        </div>
      </article>
    </section>
  );
}

export default function EventDetailsPage({ params }) {
  return (
    <Suspense
      fallback={
        <section className="mx-auto max-w-3xl px-4 py-24 text-center text-sm text-muted-foreground">
          Loading event details…
        </section>
      }
    >
      <EventDetailsContent params={params} />
    </Suspense>
  );
}
