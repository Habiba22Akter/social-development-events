import Link from "next/link";
import { CalendarDays, Check, MapPin, Users } from "lucide-react";

import { EventImage } from "@/components/events/event-image";

function formatEventDate(date) {
  return new Intl.DateTimeFormat("en-BD", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
}

/**
 * A card for one event the volunteer joined. Past events stay in the list but
 * lose their link, because the public details page only serves upcoming events.
 */
export function JoinedEventCard({ event }) {
  const ended = Boolean(event.isPast);
  const volunteers = event.participantCount || 0;

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-soft transition-transform hover:-translate-y-1">
      <div className="relative aspect-[16/9] overflow-hidden bg-muted">
        <EventImage
          src={event.image}
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className={`object-cover transition-transform duration-500 group-hover:scale-105 ${
            ended ? "opacity-70 saturate-50" : ""
          }`}
        />
        <span className="absolute top-3 left-3 rounded-full bg-background/90 px-3 py-1 text-xs font-semibold text-primary backdrop-blur">
          {event.type}
        </span>
        <span className="absolute top-3 right-3 inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
          <Check className="size-3" aria-hidden="true" />
          {ended ? "Attended" : "Joined"}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-heading text-xl font-semibold">{event.title}</h3>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {event.description}
        </p>

        <div className="mt-5 space-y-2 text-xs font-medium text-muted-foreground">
          <p className="flex items-center gap-2">
            <CalendarDays className="size-4 text-primary" aria-hidden="true" />
            {formatEventDate(event.date)}
          </p>
          <p className="flex items-center gap-2">
            <MapPin className="size-4 text-primary" aria-hidden="true" />
            {event.location}
          </p>
          <p className="flex items-center gap-2">
            <Users className="size-4 text-primary" aria-hidden="true" />
            {volunteers} volunteer{volunteers === 1 ? "" : "s"} joined
          </p>
        </div>

        <div className="mt-auto pt-5">
          {ended ? (
            <p className="inline-flex h-10 w-full items-center justify-center rounded-full border border-dashed border-border text-sm font-semibold text-muted-foreground">
              Event ended
            </p>
          ) : (
            <Link
              href={`/events/${event._id}`}
              className="inline-flex h-10 w-full items-center justify-center rounded-full border border-border text-sm font-semibold transition-colors hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/40 focus-visible:outline-none"
            >
              View event
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
