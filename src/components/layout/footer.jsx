import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Heart,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import { LogoMark } from "@/components/layout/logo";
import { SocialIcon } from "@/components/icons/social-icons";
import { siteConfig } from "@/lib/site";

const exploreLinks = [
  { label: "Home", href: "/" },
  { label: "Upcoming Events", href: "/events" },
  { label: "Gallery", href: "/#gallery" },
  { label: "How it works", href: "/#how-it-works" },
];

const involvedLinks = [
  { label: "Create an event", href: "/events/create" },
  { label: "Joined events", href: "/events/joined" },
  { label: "Manage events", href: "/events/manage" },
  { label: "Become a volunteer", href: "/register" },
];

export function Footer() {
  return (
    <footer
      id="contact"
      className="relative mt-auto overflow-hidden border-t border-border bg-card"
    >
      <div
        aria-hidden="true"
        className="bg-dot-grid pointer-events-none absolute inset-0 opacity-30 [mask-image:linear-gradient(to_bottom,black,transparent_65%)]"
      />

      <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="relative overflow-hidden rounded-3xl bg-primary px-6 py-10 text-primary-foreground sm:px-10 lg:px-14">
          <div
            aria-hidden="true"
            className="absolute -top-24 -right-16 size-64 rounded-full bg-accent/25 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="absolute -bottom-28 left-1/3 size-64 rounded-full bg-primary-foreground/10 blur-3xl"
          />

          <div className="relative grid gap-8 lg:grid-cols-[1.5fr_1fr] lg:items-center">
            <div>
              <p className="flex items-center gap-2 text-xs font-semibold tracking-[0.18em] text-accent uppercase">
                <Heart className="size-3.5" aria-hidden="true" />
                Get involved
              </p>
              <h2 className="mt-3 max-w-xl font-heading text-3xl leading-tight font-semibold text-balance sm:text-4xl">
                Your city needs you this weekend.
              </h2>
              <p className="mt-3 max-w-lg text-sm leading-relaxed text-primary-foreground/80 sm:text-base">
                Find a cause, bring a friend, and leave your neighbourhood a
                little better than you found it.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 lg:justify-end">
              <Link
                href="/events"
                className="group inline-flex h-11 items-center gap-2 rounded-full bg-accent px-5 text-sm font-semibold text-accent-foreground transition-transform hover:-translate-y-0.5 focus-visible:ring-3 focus-visible:ring-accent/50 focus-visible:outline-none"
              >
                Browse events
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/events/create"
                className="inline-flex h-11 items-center gap-2 rounded-full border border-primary-foreground/25 px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-foreground/10 focus-visible:ring-3 focus-visible:ring-primary-foreground/30 focus-visible:outline-none"
              >
                Start an event
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1.2fr]">
          <div>
            <div className="flex items-center gap-2.5">
              <LogoMark className="size-9 rounded-xl" />
              <span className="font-heading text-xl font-semibold tracking-tight">
                Utsho<span className="text-accent-foreground dark:text-accent">.</span>
              </span>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              A volunteer-led platform connecting people in Dhaka with social
              service events — from winter clothes drives in Mirpur to cleanup
              mornings by the Buriganga.
            </p>

            <div className="mt-6 flex items-center gap-2">
              {siteConfig.socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label={`Utsho on ${social.label}`}
                  className="grid size-9 place-items-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary/30 hover:bg-primary hover:text-primary-foreground focus-visible:ring-3 focus-visible:ring-ring/40 focus-visible:outline-none"
                >
                  <SocialIcon name={social.icon} />
                </a>
              ))}
            </div>
          </div>

          <FooterColumn title="Explore" links={exploreLinks} />
          <FooterColumn title="Get involved" links={involvedLinks} />

          <div>
            <h3 className="font-heading text-sm font-semibold tracking-wide">
              Reach us
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              <li>
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="inline-flex items-start gap-2.5 transition-colors hover:text-foreground"
                >
                  <Mail className="mt-0.5 size-4 shrink-0 text-primary" />
                  {siteConfig.email}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${siteConfig.phone.replace(/\s/g, "")}`}
                  className="inline-flex items-start gap-2.5 transition-colors hover:text-foreground"
                >
                  <Phone className="mt-0.5 size-4 shrink-0 text-primary" />
                  {siteConfig.phone}
                </a>
              </li>
              <li className="inline-flex items-start gap-2.5">
                <MapPin className="mt-0.5 size-4 shrink-0 text-primary" />
                <span>{siteConfig.address}</span>
              </li>
            </ul>

            <Link
              href="/events/create"
              className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-primary underline-offset-4 hover:underline"
            >
              Organise with us
              <ArrowUpRight className="size-4" />
            </Link>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            © <CopyrightYear /> Utsho. Built by neighbours, for neighbours.
          </p>
          <div className="flex items-center gap-5">
            <Link href="/#about" className="transition-colors hover:text-foreground">
              Privacy
            </Link>
            <Link href="/#about" className="transition-colors hover:text-foreground">
              Terms
            </Link>
            <span className="inline-flex items-center gap-1.5">
              Made with
              <Heart className="size-3.5 fill-accent text-accent" />
              in Dhaka
            </span>
          </div>
        </div>
      </div>

      <p
        aria-hidden="true"
        className="pointer-events-none relative -mb-4 select-none text-center font-heading text-[19vw] leading-[0.75] font-semibold text-foreground/[0.045] lg:-mb-8"
      >
        Utsho
      </p>
    </footer>
  );
}

async function CopyrightYear() {
  "use cache";
  return new Date().getFullYear();
}

function FooterColumn({ title, links }) {
  return (
    <div>
      <h3 className="font-heading text-sm font-semibold tracking-wide">
        {title}
      </h3>
      <ul className="mt-4 space-y-2.5 text-sm">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
