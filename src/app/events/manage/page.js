import { Suspense } from "react";
import { headers } from "next/headers";
import { connection } from "next/server";

import { RequireAuth } from "@/components/auth/require-auth";
import { ManageEvents } from "@/components/events/manage-events";
import { getMyEvents } from "@/lib/events";

export const metadata = {
  title: "Manage Events",
};

async function ManageEventsContent() {
  await connection();

  const cookie = (await headers()).get("cookie");
  const events = await getMyEvents(cookie);

  return <ManageEvents events={events} />;
}

function ManageEventsSkeleton() {
  return (
    <section
      aria-busy="true"
      aria-live="polite"
      className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-20"
    >
      <span className="sr-only">Loading the events you created…</span>
      <div className="h-12 w-12 animate-pulse rounded-2xl bg-muted" />
      <div className="mt-6 h-4 w-32 animate-pulse rounded-full bg-muted" />
      <div className="mt-4 h-11 w-full max-w-xl animate-pulse rounded-xl bg-muted" />
      <div className="mt-3 h-4 w-full max-w-md animate-pulse rounded-full bg-muted" />
      <div className="mt-12 space-y-5">
        {[0, 1].map((index) => (
          <div
            key={index}
            className="flex flex-col gap-5 rounded-2xl border border-border bg-card p-5 shadow-soft sm:flex-row"
          >
            <div className="aspect-[16/9] w-full animate-pulse rounded-xl bg-muted sm:w-48" />
            <div className="flex-1 space-y-3">
              <div className="h-5 w-1/2 animate-pulse rounded-full bg-muted" />
              <div className="h-3 w-full animate-pulse rounded-full bg-muted" />
              <div className="h-3 w-2/3 animate-pulse rounded-full bg-muted" />
              <div className="h-10 w-40 animate-pulse rounded-full bg-muted" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function ManageEventsPage() {
  return (
    <RequireAuth>
      <Suspense fallback={<ManageEventsSkeleton />}>
        <ManageEventsContent />
      </Suspense>
    </RequireAuth>
  );
}
