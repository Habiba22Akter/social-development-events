import Image from "next/image";
import {
  ArrowRight,
  CalendarPlus,
  Droplets,
  GraduationCap,
  HandHeart,
  HeartPulse,
  Leaf,
  Shirt,
  Soup,
  Sparkles,
} from "lucide-react";

import { ActionLink } from "@/components/ui/action";
import { Section, SectionHeading } from "@/components/ui/section";

const causes = [
  { label: "Cleanup", icon: Droplets },
  { label: "Plantation", icon: Leaf },
  { label: "Donation", icon: Shirt },
  { label: "Education", icon: GraduationCap },
  { label: "Health", icon: HeartPulse },
  { label: "Food drive", icon: Soup },
];

const steps = [
  {
    title: "Find a cause nearby",
    body: "Browse upcoming drives in your neighbourhood — filter by type, date or area.",
    icon: Sparkles,
  },
  {
    title: "Join in one tap",
    body: "Reserve your spot, get the meeting point, and bring a friend along if you like.",
    icon: HandHeart,
  },
  {
    title: "Show up, follow through",
    body: "Spend a few hours with neighbours and watch a small effort become real change.",
    icon: Leaf,
  },
];

const photo = (id, width = 900) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${width}`;

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="bg-hero-glow pointer-events-none absolute inset-0 -z-10"
      />
      <div
        aria-hidden="true"
        className="bg-dot-grid pointer-events-none absolute inset-0 -z-10 opacity-40 [mask-image:radial-gradient(60%_60%_at_50%_0%,black,transparent)]"
      />

      <div className="mx-auto grid max-w-7xl gap-14 px-4 pt-14 pb-16 sm:px-6 lg:grid-cols-[1.02fr_0.98fr] lg:items-center lg:gap-10 lg:px-8 lg:pt-20 lg:pb-24">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border border-border bg-card/80 px-3.5 py-1.5 text-xs font-semibold tracking-wide text-muted-foreground shadow-soft backdrop-blur">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-60" />
              <span className="relative inline-flex size-2 rounded-full bg-primary" />
            </span>
            Volunteer-led · Dhaka, Bangladesh
          </p>

          <h1 className="mt-6 font-heading text-4xl leading-[1.04] font-semibold text-balance sm:text-5xl lg:text-[3.9rem]">
            Small acts, shared.
            <br />
            <span className="relative inline-block">
              Real change, local.
              <svg
                aria-hidden="true"
                viewBox="0 0 300 12"
                preserveAspectRatio="none"
                className="absolute -bottom-2 left-0 h-3 w-full text-accent"
              >
                <path
                  d="M2 8.5c48-5 96-7 148-6 50 1 98 3 148 6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </h1>

          <p className="mt-7 max-w-xl text-base leading-relaxed text-muted-foreground text-pretty sm:text-lg">
            Utsho brings neighbours together around the causes that matter —
            winter clothes drives in Mirpur, blanket distributions in
            Mohammadpur, and cleanup mornings by the river. Find a drive, join
            it, and bring a friend.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <ActionLink href="/events">
              Find an event
              <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </ActionLink>
            <ActionLink href="/events/create" variant="secondary">
              <CalendarPlus className="size-4 text-primary" />
              Start an event
            </ActionLink>
          </div>

          <dl className="mt-10 grid max-w-lg grid-cols-3 gap-4 border-t border-border pt-6">
            {[
              { value: "42", label: "drives hosted" },
              { value: "1,280", label: "volunteers" },
              { value: "16", label: "neighbourhoods" },
            ].map((stat) => (
              <div key={stat.label}>
                <dt className="sr-only">{stat.label}</dt>
                <dd>
                  <span className="font-heading text-2xl font-semibold sm:text-3xl">
                    {stat.value}
                  </span>
                  <span className="mt-1 block text-xs text-muted-foreground sm:text-sm">
                    {stat.label}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-border bg-muted shadow-soft">
            <Image
              src={photo(11319521, 1100)}
              alt="Volunteers sorting winter clothes and blankets for a distribution drive"
              fill
              preload
              sizes="(min-width: 1024px) 44vw, (min-width: 640px) 80vw, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
          </div>

          <div className="absolute -bottom-6 -left-4 hidden w-40 overflow-hidden rounded-2xl border-4 border-background shadow-soft sm:block lg:-left-8 lg:w-48">
            <div className="relative aspect-square">
              <Image
                src={photo(7156161, 500)}
                alt="Volunteers packing donated clothes into boxes"
                fill
                sizes="12rem"
                className="object-cover"
              />
            </div>
          </div>

          <div className="absolute top-5 -right-3 rounded-2xl border border-border bg-card/95 px-4 py-3 shadow-soft backdrop-blur lg:-right-6">
            <p className="text-[0.68rem] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
              Next drive
            </p>
            <p className="mt-1 text-sm font-semibold">Winter clothes · Mirpur 10</p>
            <p className="mt-0.5 text-xs text-muted-foreground">Sat · 9:00 am</p>
          </div>

          <div className="absolute right-4 bottom-6 hidden items-center gap-2 rounded-full bg-background/90 px-3 py-1.5 text-xs font-semibold shadow-soft backdrop-blur sm:flex">
            <HandHeart className="size-3.5 text-primary" />
            100% volunteer-run
          </div>
        </div>
      </div>

      <div className="border-y border-border bg-card/60">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p className="text-[0.7rem] font-semibold tracking-[0.18em] text-muted-foreground uppercase">
            Causes we show up for
          </p>
          <ul className="flex flex-wrap gap-2">
            {causes.map(({ label, icon: Icon }) => (
              <li
                key={label}
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/30 hover:text-foreground"
              >
                <Icon className="size-3.5 text-primary" aria-hidden="true" />
                {label}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export function HowItWorks() {
  return (
    <Section id="how-it-works">
      <SectionHeading
        eyebrow="How Utsho works"
        title="Three steps between good intentions and good work."
        description="No memberships, no long forms. Just a clear list of drives that need hands — and a way to raise your own."
      />

      <ol className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {steps.map((step, index) => (
          <li
            key={step.title}
            className="group flex h-full flex-col rounded-2xl border border-border bg-card p-6 transition-colors hover:border-primary/25"
          >
            <span className="font-heading text-sm font-semibold text-muted-foreground/70">
              0{index + 1}
            </span>
            <span className="mt-4 grid size-11 place-items-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
              <step.icon className="size-5" aria-hidden="true" />
            </span>
            <h3 className="mt-5 font-heading text-lg font-semibold">
              {step.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {step.body}
            </p>
          </li>
        ))}
      </ol>
    </Section>
  );
}
