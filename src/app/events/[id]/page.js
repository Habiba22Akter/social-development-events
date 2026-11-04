import { Suspense } from "react";
import { headers } from "next/headers";
import { connection } from "next/server";
import { ArrowLeft, CalendarDays, MapPin, Users } from "lucide-react";

import { EventImage } from "@/components/events/event-image";
import { JoinEventButton } from "@/components/events/join-event-button";
import { ActionLink } from "@/components/ui/action";
import { Section } from "@/components/ui/section";
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
  await connection();

  const { id } = await params;
  const cookie = (await headers()).get("cookie");
  const event = await getUpcomingEventById(id, cookie);

  if (!event) {
    return (
      <Section className="text-center">
        <div className="mx-auto max-w-2xl">
          <h1 className="font-heading text-4xl leading-[1.05] font-semibold tracking-tight text-balance sm:text-5xl">
            Event not found
          </h1>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            This event may have passed or is no longer available.
          </p>
          <ActionLink href="/events" className="mt-6">
            Browse upcoming events
          </ActionLink>
        </div>
      </Section>
    );
  }

  return (
    <Section>
      <ActionLink
        href="/events"
        variant="ghost"
        className="-ml-5 text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        Back to upcoming events
      </ActionLink>

      <article className="mt-6 overflow-hidden rounded-3xl border border-border bg-card shadow-soft">
        <div className="relative aspect-[16/9] bg-muted sm:aspect-[2.4/1]">
          <EventImage
            src={event.image}
            alt={event.title}
            priority
            sizes="(min-width: 1024px) 1152px, 100vw"
            className="object-cover"
          />
          <span className="absolute top-5 left-5 rounded-full bg-background/90 px-4 py-2 text-xs font-semibold text-primary backdrop-blur">
            {event.type}
          </span>
        </div>

        <div className="p-6 sm:p-10">
          <h1 className="font-heading text-4xl leading-[1.05] font-semibold tracking-tight text-balance sm:text-5xl">
            {event.title}
          </h1>
          <p className="mt-5 max-w-3xl leading-relaxed text-muted-foreground text-pretty whitespace-pre-wrap">
            {event.description}
          </p>

          <div className="mt-8 grid gap-4 border-y border-border py-6 sm:grid-cols-2">
            <p className="flex items-start gap-3 text-sm">
              <CalendarDays
                className="mt-0.5 size-5 shrink-0 text-primary"
                aria-hidden="true"
              />
              <span>
                <span className="block text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                  When
                </span>
                <span className="mt-1 block font-medium">
                  {formatEventDate(event.date)}
                </span>
              </span>
            </p>
            <p className="flex items-start gap-3 text-sm">
              <MapPin
                className="mt-0.5 size-5 shrink-0 text-primary"
                aria-hidden="true"
              />
              <span>
                <span className="block text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                  Where
                </span>
                <span className="mt-1 block font-medium">{event.location}</span>
              </span>
            </p>
          </div>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <p className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="size-4 text-primary" aria-hidden="true" />
                {event.participantCount || 0} volunteer
                {event.participantCount === 1 ? "" : "s"} joined
              </p>
              {event.isOrganizer ? (
                <p className="text-xs font-medium text-primary">
                  You are organising this event.
                </p>
              ) : null}
            </div>
            <JoinEventButton
              eventId={event._id}
              initialJoined={event.joinedByViewer}
            />
          </div>
        </div>
      </article>
    </Section>
  );
}

function EventDetailsSkeleton() {
  return (
    <Section aria-busy="true" aria-live="polite">
      <span className="sr-only">Loading event details…</span>
      <div className="h-5 w-52 animate-pulse rounded-full bg-muted" />
      <div className="mt-6 overflow-hidden rounded-3xl border border-border bg-card shadow-soft">
        <div className="aspect-[16/9] animate-pulse bg-muted sm:aspect-[2.4/1]" />
        <div className="space-y-4 p-6 sm:p-10">
          <div className="h-10 w-2/3 animate-pulse rounded-xl bg-muted" />
          <div className="h-4 w-full animate-pulse rounded-full bg-muted" />
          <div className="h-4 w-4/5 animate-pulse rounded-full bg-muted" />
          <div className="h-24 w-full animate-pulse rounded-2xl bg-muted" />
        </div>
      </div>
    </Section>
  );
}

export default function EventDetailsPage({ params }) {
  return (
    <Suspense fallback={<EventDetailsSkeleton />}>
      <EventDetailsContent params={params} />
    </Suspense>
  );
}
