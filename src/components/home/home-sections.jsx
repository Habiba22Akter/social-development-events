import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  HeartHandshake,
  Mail,
  MapPin,
  Users,
} from "lucide-react";

import { getUpcomingEvents } from "@/lib/events";

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

function EventCard({ event }) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-border bg-card shadow-soft transition-transform hover:-translate-y-1">
      <div className="relative aspect-[16/9] overflow-hidden bg-muted">
        <Image
          src={event.image || photo(11319521, 800)}
          alt=""
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span className="absolute top-3 left-3 rounded-full bg-background/90 px-3 py-1 text-xs font-semibold text-primary backdrop-blur">
          {event.type}
        </span>
      </div>
      <div className="p-5">
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
        </div>
      </div>
    </article>
  );
}

export function Features() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div className="max-w-2xl">
        <p className="text-xs font-semibold tracking-[0.18em] text-primary uppercase">
          Why Utsho
        </p>
        <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">
          Good work is easier when we do it together.
        </h2>
      </div>
      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {features.map(({ icon: Icon, title, body }) => (
          <div key={title} className="rounded-2xl border border-border bg-card p-6">
            <Icon className="size-7 text-primary" aria-hidden="true" />
            <h3 className="mt-5 text-xl font-semibold">{title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export async function UpcomingEvents() {
  const events = await getUpcomingEvents();

  return (
    <section id="upcoming-events" className="bg-muted/40">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold tracking-[0.18em] text-primary uppercase">
              Recent upcoming events
            </p>
            <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">
              A nearby reason to show up.
            </h2>
          </div>
          <Link href="/events" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">
            View all events <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>

        {events.length ? (
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => <EventCard key={event._id.toString()} event={event} />)}
          </div>
        ) : (
          <div className="mt-10 rounded-2xl border border-dashed border-border bg-card p-10 text-center">
            <HeartHandshake className="mx-auto size-9 text-primary" aria-hidden="true" />
            <h3 className="mt-4 font-heading text-xl font-semibold">The next good thing starts with you.</h3>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
              No upcoming events have been posted yet. Create the first one for your neighbourhood.
            </p>
            <Link href="/events/create" className="mt-5 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground">
              Create an event <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

export function Gallery() {
  return (
    <section id="gallery" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div className="max-w-2xl">
        <p className="text-xs font-semibold tracking-[0.18em] text-primary uppercase">From the community</p>
        <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">Many hands. One shared city.</h2>
      </div>
      <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-3">
        {gallery.map((image, index) => (
          <div key={image.id} className={`relative aspect-square overflow-hidden rounded-2xl bg-muted ${index === 0 ? "md:row-span-2 md:aspect-auto" : ""}`}>
            <Image src={photo(image.id, 700)} alt={image.alt} fill sizes="(min-width: 768px) 33vw, 50vw" className="object-cover transition-transform duration-500 hover:scale-105" />
          </div>
        ))}
      </div>
    </section>
  );
}

export function Newsletter() {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8 lg:pb-24">
      <div className="relative overflow-hidden rounded-[2rem] bg-primary px-6 py-12 text-primary-foreground sm:px-12 lg:flex lg:items-center lg:justify-between lg:gap-10">
        <div className="relative max-w-xl">
          <Mail className="size-8 text-accent" aria-hidden="true" />
          <h2 className="mt-5 text-3xl font-semibold sm:text-4xl">Keep doing good, close to home.</h2>
          <p className="mt-3 text-sm leading-relaxed text-primary-foreground/75">Get a gentle note when a new community-service event is posted in Dhaka.</p>
        </div>
        <form className="relative mt-8 flex w-full max-w-md flex-col gap-3 sm:flex-row lg:mt-0">
          <label htmlFor="newsletter-email" className="sr-only">Email address</label>
          <input id="newsletter-email" type="email" placeholder="you@example.com" required className="h-12 min-w-0 flex-1 rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-5 text-sm text-primary-foreground outline-none placeholder:text-primary-foreground/55 focus-visible:ring-3 focus-visible:ring-accent" />
          <button type="button" className="h-12 rounded-full bg-accent px-6 text-sm font-semibold text-accent-foreground transition-transform hover:-translate-y-0.5">Stay in the loop</button>
        </form>
      </div>
    </section>
  );
}
