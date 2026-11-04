import Image from "next/image";
import Link from "next/link";
import { connection } from "next/server";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  HeartHandshake,
  Mail,
  MapPin,
  Star,
  Users,
} from "lucide-react";

import { getFeaturedEvents, getUpcomingEvents } from "@/lib/events";
import { EventImage } from "@/components/events/event-image";
import { ActionLink, actionStyles } from "@/components/ui/action";
import {
  EmptyState,
  Section,
  SectionHeading,
} from "@/components/ui/section";

const photo = (id, width = 900) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${width}`;

const features = [
  {
    icon: MapPin,
    title: "Neighbourhood-first",
    body: "Find practical ways to help in Mirpur, Mohammadpur and communities across Dhaka.",
  },
  {
    icon: Users,
    title: "People-powered",
    body: "Meet reliable volunteers and organisers who care about making a visible difference.",
  },
  {
    icon: CheckCircle2,
    title: "Clear and simple",
    body: "See the cause, meeting point and schedule before you commit your time.",
  },
];

const gallery = [
  { id: 6646917, alt: "Volunteers planting trees together" },
  { id: 6994982, alt: "Community members sharing donated food" },
  { id: 6646918, alt: "Volunteers cleaning a public space" },
  { id: 6646848, alt: "People sorting supplies for a donation drive" },
  { id: 6994981, alt: "Neighbours working together outdoors" },
  { id: 6646919, alt: "Volunteers carrying community supplies" },
];

function formatEventDate(date) {
  return new Intl.DateTimeFormat("en-BD", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
}

export function EventCard({ event }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-soft transition-transform duration-300 hover:-translate-y-1">
      <div className="relative aspect-[16/9] overflow-hidden bg-muted">
        <EventImage
          src={event.image}
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span className="absolute top-3 left-3 rounded-full bg-background/90 px-3 py-1 text-xs font-semibold text-primary backdrop-blur">
          {event.type}
        </span>
        {event.featured ? (
          <span className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground shadow-soft">
            <Star className="size-3.5 fill-current" aria-hidden="true" />
            Featured
          </span>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="line-clamp-2 font-heading text-xl leading-snug font-semibold">
          {event.title}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {event.description}
        </p>
        <div className="mt-4 space-y-2 text-xs font-medium text-muted-foreground">
          <p className="flex items-center gap-2">
            <CalendarDays className="size-4 shrink-0 text-primary" aria-hidden="true" />
            {formatEventDate(event.date)}
          </p>
          <p className="flex items-center gap-2">
            <MapPin className="size-4 shrink-0 text-primary" aria-hidden="true" />
            {event.location}
          </p>
        </div>
        <div className="mt-auto pt-5">
          <Link
            href={`/events/${event._id.toString()}`}
            className={actionStyles({ variant: "secondary", className: "w-full" })}
          >
            View event
            <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}

export function Features() {
  return (
    <Section>
      <SectionHeading
        eyebrow="Why Utsho"
        title="Good work is easier when we do it together."
      />
      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {features.map(({ icon: Icon, title, body }) => (
          <div
            key={title}
            className="flex h-full flex-col rounded-2xl border border-border bg-card p-6 transition-colors hover:border-primary/25"
          >
            <span className="grid size-11 place-items-center rounded-xl bg-primary/10 text-primary">
              <Icon className="size-5" aria-hidden="true" />
            </span>
            <h3 className="mt-5 font-heading text-xl font-semibold">{title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {body}
            </p>
          </div>
        ))}
      </div>
    </Section>
  );
}

export async function FeaturedEvents() {
  await connection();
  const { events, curated } = await getFeaturedEvents();

  if (!events.length) return null;

  return (
    <Section id="featured-events">
      <SectionHeading
        eyebrow={curated ? "Featured events" : "Featured this week"}
        title="Drives that need hands right now."
        description="A short list of the community-service events we are highlighting this week."
        action={
          <ActionLink href="/events" variant="secondary">
            View all events
            <ArrowRight className="size-4" aria-hidden="true" />
          </ActionLink>
        }
      />

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {events.map((event) => (
          <EventCard key={event._id.toString()} event={event} />
        ))}
      </div>
    </Section>
  );
}

export async function UpcomingEvents() {
  await connection();
  const [{ events: featured }, upcoming] = await Promise.all([
    getFeaturedEvents(),
    getUpcomingEvents(),
  ]);

  // Do not repeat the featured cards directly below themselves. When every
  // upcoming event is already highlighted, this section has nothing left.
  const featuredIds = new Set(featured.map((event) => event._id.toString()));
  const events = upcoming.filter(
    (event) => !featuredIds.has(event._id.toString()),
  );

  if (!events.length && featured.length) return null;

  return (
    <Section id="upcoming-events" muted>
      <SectionHeading
        eyebrow="Recent upcoming events"
        title="A nearby reason to show up."
        action={
          <ActionLink href="/events" variant="secondary">
            View all events
            <ArrowRight className="size-4" aria-hidden="true" />
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
          icon={HeartHandshake}
          title="The next good thing starts with you."
          description="No upcoming events have been posted yet. Create the first one for your neighbourhood."
          action={
            <ActionLink href="/events/create">
              Create an event
              <ArrowRight className="size-4" aria-hidden="true" />
            </ActionLink>
          }
        />
      )}
    </Section>
  );
}

export function Gallery() {
  return (
    <Section id="gallery">
      <SectionHeading
        eyebrow="From the community"
        title="Many hands. One shared city."
        description="A look at the drives already happening across the city."
      />
      <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3">
        {gallery.map((image) => (
          <div
            key={image.id}
            className="group relative aspect-square overflow-hidden rounded-2xl border border-border bg-muted"
          >
            <Image
              src={photo(image.id, 700)}
              alt={image.alt}
              fill
              sizes="(min-width: 768px) 33vw, 50vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        ))}
      </div>
    </Section>
  );
}

export function Newsletter() {
  return (
    <Section className="pb-14 lg:pb-20">
      <div className="relative overflow-hidden rounded-[2rem] bg-primary px-6 py-12 text-primary-foreground sm:px-12 lg:flex lg:items-center lg:justify-between lg:gap-10">
        <div className="relative max-w-xl">
          <Mail className="size-8 text-accent" aria-hidden="true" />
          <h2 className="mt-5 font-heading text-3xl leading-tight font-semibold tracking-tight text-balance sm:text-4xl">
            Keep doing good, close to home.
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-primary-foreground/80 text-pretty sm:text-base">
            Get a gentle note when a new community-service event is posted in
            Dhaka.
          </p>
        </div>
        <form className="relative mt-8 flex w-full max-w-md flex-col gap-3 sm:flex-row lg:mt-0">
          <label htmlFor="newsletter-email" className="sr-only">
            Email address
          </label>
          <input
            id="newsletter-email"
            type="email"
            placeholder="you@example.com"
            required
            className="h-11 min-w-0 flex-1 rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-5 text-sm text-primary-foreground outline-none placeholder:text-primary-foreground/55 focus-visible:ring-3 focus-visible:ring-accent"
          />
          <button
            type="button"
            className="h-11 shrink-0 rounded-full bg-accent px-6 text-sm font-semibold text-accent-foreground transition-transform duration-200 hover:-translate-y-0.5 focus-visible:ring-3 focus-visible:ring-accent focus-visible:outline-none"
          >
            Stay in the loop
          </button>
        </form>
      </div>
    </Section>
  );
}
