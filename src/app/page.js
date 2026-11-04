import { Suspense } from "react";
import { Hero, HowItWorks } from "@/components/home/hero";
import {
  FeaturedEvents,
  Features,
  Gallery,
  Newsletter,
  UpcomingEvents,
} from "@/components/home/home-sections";

export default function HomePage() {
  return (
    <>
      <Hero />
      <HowItWorks />
      <Features />
      <Suspense
        fallback={
          <section className="mx-auto max-w-7xl px-4 py-24 text-center text-sm text-muted-foreground">
            Loading featured events…
          </section>
        }
      >
        <FeaturedEvents />
      </Suspense>
      <Suspense
        fallback={
          <section className="mx-auto max-w-7xl px-4 py-24 text-center text-sm text-muted-foreground">
            Loading upcoming events…
          </section>
        }
      >
        <UpcomingEvents />
      </Suspense>
      <Gallery />
      <Newsletter />
    </>
  );
}
