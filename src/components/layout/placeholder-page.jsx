import Link from "next/link";
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";

export function PlaceholderPage({
  eyebrow = "Coming next",
  title,
  description,
  icon: Icon = Sparkles,
  primary = { href: "/events", label: "Browse events" },
}) {
  return (
    <section className="mx-auto flex max-w-3xl flex-col items-center px-4 py-20 text-center sm:px-6 lg:py-28">
      <span className="grid size-16 place-items-center rounded-2xl border border-border bg-card text-primary shadow-soft">
        <Icon className="size-7" aria-hidden="true" />
      </span>
      <p className="mt-6 text-xs font-semibold tracking-[0.18em] text-primary uppercase">
        {eyebrow}
      </p>
      <h1 className="mt-3 font-heading text-3xl font-semibold text-balance sm:text-4xl">
        {title}
      </h1>
      <p className="mt-4 max-w-xl text-muted-foreground text-pretty">
        {description}
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          href={primary.href}
          className="group inline-flex h-11 items-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:ring-3 focus-visible:ring-ring/40 focus-visible:outline-none"
        >
          {primary.label}
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
        <Link
          href="/"
          className="inline-flex h-11 items-center gap-2 rounded-full border border-border px-5 text-sm font-semibold transition-colors hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/40 focus-visible:outline-none"
        >
          <ArrowLeft className="size-4" />
          Back home
        </Link>
      </div>
    </section>
  );
}
