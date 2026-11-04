import { Suspense } from "react";
import { headers } from "next/headers";
import { connection } from "next/server";
import { ArrowRight, CalendarDays, Ticket } from "lucide-react";

import { RequireAuth } from "@/components/auth/require-auth";
import { JoinedEventCard } from "@/components/events/joined-event-card";
import { ActionLink } from "@/components/ui/action";
import {
  EmptyState,
  PageHeader,
  Section,
  SectionHeading,
} from "@/components/ui/section";
import { getJoinedEvents } from "@/lib/events";

export const metadata = {
  title: "Joined Events",
};

function CountLabel({ count }) {
  return (
    <p className="text-xs font-semibold tracking-[0.14em] text-muted-foreground uppercase">
      {count} event{count === 1 ? "" : "s"}
    </p>
  );
}

async function JoinedEventsContent() {
  await connection();

  const cookie = (await headers()).get("cookie");
  const events = await getJoinedEvents(cookie);
  const upcoming = events.filter((event) => !event.isPast);
  const past = events.filter((event) => event.isPast);

  return (
    <Section>
      <PageHeader
        icon={Ticket}
        eyebrow="Joined events"
        title="The drives you signed up for."
        description="Every event you join is listed here by date, so you always know where you are expected next."
        action={
          <ActionLink href="/events">
            Find another drive
            <ArrowRight className="size-4" aria-hidden="true" />
          </ActionLink>
        }
      />

      {events.length ? (
        <div className="mt-12 space-y-14">
          {upcoming.length ? (
            <div>
              <SectionHeading
                title="Coming up"
                description="Events you have joined that are still ahead."
                action={<CountLabel count={upcoming.length} />}
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
                description="Your record of drives you showed up for."
                action={<CountLabel count={past.length} />}
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
        <EmptyState
          className="mt-10"
          icon={CalendarDays}
          title="You have not joined an event yet"
          description="Browse the upcoming drives near you and join one — your schedule will fill up here."
          action={
            <ActionLink href="/events">
              Browse upcoming events
              <ArrowRight className="size-4" aria-hidden="true" />
            </ActionLink>
          }
        />
      )}
    </Section>
  );
}

function JoinedEventsSkeleton() {
  return (
    <Section aria-busy="true" aria-live="polite">
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
              <div className="h-11 w-full animate-pulse rounded-full bg-muted" />
            </div>
          </div>
        ))}
      </div>
    </Section>
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
