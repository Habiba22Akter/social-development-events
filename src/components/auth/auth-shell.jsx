"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  HeartHandshake,
  MapPin,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

const photo = (id, width = 1200) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${width}`;

const highlights = [
  {
    icon: ShieldCheck,
    title: "Your details stay yours",
    body: "Passwords are hashed and sessions live in secure, HTTP-only cookies.",
  },
  {
    icon: HeartHandshake,
    title: "Built for Dhaka volunteers",
    body: "Join drives in Mirpur, Mohammadpur, Dhanmondi and beyond in a few taps.",
  },
];

export function AuthShell({
  eyebrow,
  title,
  description,
  children,
  panelTitle = "One account, every drive in your city.",
  panelBody = "Find a clothes distribution in Mirpur, a cleanup by the river, or start a drive of your own — all from one place.",
  imageId = 6646918,
  imageAlt = "Volunteers working together at a community service event",
}) {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="bg-hero-glow pointer-events-none absolute inset-0 -z-10"
      />
      <div
        aria-hidden="true"
        className="bg-dot-grid pointer-events-none absolute inset-0 -z-10 opacity-30 [mask-image:radial-gradient(70%_60%_at_50%_0%,black,transparent)]"
      />

      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.02fr_0.98fr] lg:items-stretch lg:gap-14 lg:py-20">
        <aside className="relative hidden overflow-hidden rounded-[2rem] border border-primary/20 bg-primary text-primary-foreground shadow-soft lg:block dark:border-border dark:bg-card dark:text-foreground">
          <Image
            src={photo(imageId)}
            alt={imageAlt}
            fill
            sizes="(min-width: 1024px) 46vw, 100vw"
            loading="eager"
            className="object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-primary/95 via-primary/85 to-primary/45 dark:from-background/95 dark:via-background/85 dark:to-background/45" />
          <div className="absolute inset-0 bg-[radial-gradient(28rem_22rem_at_85%_10%,color-mix(in_oklab,var(--accent)_35%,transparent),transparent_70%)]" />

          <div className="relative flex h-full min-h-[32rem] flex-col justify-between p-9">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-3 py-1.5 text-[0.68rem] font-semibold tracking-[0.16em] uppercase backdrop-blur dark:border-border dark:bg-muted/60">
                <Sparkles className="size-3.5 text-accent" aria-hidden="true" />
                Utsho community
              </p>
              <h2 className="mt-6 max-w-sm font-heading text-3xl leading-tight font-semibold tracking-tight text-balance sm:text-4xl">
                {panelTitle}
              </h2>
              <p className="mt-4 max-w-sm text-sm leading-relaxed text-primary-foreground/80 dark:text-muted-foreground">
                {panelBody}
              </p>
            </div>

            <div className="space-y-3">
              {highlights.map(({ icon: Icon, title: itemTitle, body }) => (
                <div
                  key={itemTitle}
                  className="flex gap-3 rounded-2xl border border-primary-foreground/15 bg-primary-foreground/10 p-3.5 backdrop-blur dark:border-border dark:bg-muted/50"
                >
                  <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-accent text-accent-foreground shadow-[0_10px_24px_-16px_var(--accent)]">
                    <Icon className="size-4" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold">{itemTitle}</p>
                    <p className="mt-0.5 text-xs leading-relaxed text-primary-foreground/75 dark:text-muted-foreground">
                      {body}
                    </p>
                  </div>
                </div>
              ))}

              <p className="inline-flex items-center gap-1.5 pt-1 text-[0.7rem] font-medium tracking-wide text-primary-foreground/70 uppercase dark:text-muted-foreground">
                <MapPin className="size-3.5 text-accent" aria-hidden="true" />
                16 neighbourhoods across Dhaka
              </p>
            </div>
          </div>
        </aside>

        <div className="w-full">
          <Card className="[--card-spacing:0px] gap-0 overflow-hidden rounded-3xl border border-border/70 bg-card/95 shadow-soft ring-0 backdrop-blur">
            <span
              aria-hidden="true"
              className="block h-1.5 w-full bg-gradient-to-r from-primary via-accent to-primary"
            />

            <CardContent className="p-6 sm:p-8">
              <p className="text-xs font-semibold tracking-[0.18em] text-primary uppercase">
                {eyebrow}
              </p>
              <h1 className="mt-3 font-heading text-4xl leading-[1.05] font-semibold tracking-tight text-balance sm:text-5xl">
                {title}
              </h1>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground text-pretty">
                {description}
              </p>

              <div className="mt-7">{children}</div>
            </CardContent>
          </Card>

          <div className="mt-5 flex items-center justify-between gap-3 px-1 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="size-3.5 text-primary" aria-hidden="true" />
              Secured by BetterAuth
            </span>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 rounded-lg px-1 py-1 font-medium transition-colors hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/40 focus-visible:outline-none"
            >
              <ArrowLeft className="size-3.5" aria-hidden="true" />
              Back to home
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
