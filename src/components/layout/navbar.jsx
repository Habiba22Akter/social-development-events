"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, LogIn, LogOut, MapPin, Sparkles } from "lucide-react";
import { Logo } from "@/components/layout/logo";
import { MobileNav } from "@/components/layout/mobile-nav";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { UserMenu } from "@/components/layout/user-menu";
import { useAuth } from "@/components/providers/auth-provider";
import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const { user, signOut, isPending } = useAuth();

  return (
    <header className="sticky top-0 z-40 w-full">
      <div className="hidden border-b border-primary/25 bg-primary text-primary-foreground sm:block">
        <div className="mx-auto flex h-9 max-w-7xl items-center justify-between gap-6 px-4 text-[0.72rem] font-medium tracking-wide sm:px-6 lg:px-8">
          <p className="flex items-center gap-2">
            <Sparkles className="size-3.5 text-accent" aria-hidden="true" />
            Volunteer-led since 2021 · Serving 16 neighbourhoods across Dhaka
          </p>
          <p className="hidden items-center gap-2 md:flex">
            <MapPin className="size-3.5 text-accent" aria-hidden="true" />
            {siteConfig.address}
          </p>
        </div>
      </div>

      <div className="border-b border-border/70 bg-background/85 backdrop-blur-xl supports-[backdrop-filter]:bg-background/70">
        <nav
          aria-label="Main"
          className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:h-[4.5rem] lg:px-8"
        >
          <Logo />

          <div className="hidden items-center gap-1 lg:flex">
            {siteConfig.nav.map((item) => {
              const active =
                item.href === "/" ? pathname === "/" : pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "relative rounded-full px-3.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/40 focus-visible:outline-none",
                    active && "text-foreground",
                  )}
                >
                  {item.label}
                  <span
                    className={cn(
                      "absolute inset-x-3.5 -bottom-0.5 h-0.5 origin-left scale-x-0 rounded-full bg-accent transition-transform duration-300",
                      active && "scale-x-100",
                    )}
                  />
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />

            {user ? (
              <>
                <UserMenu user={user} />
                <button
                  type="button"
                  onClick={signOut}
                  disabled={isPending}
                  className="hidden h-9 items-center gap-1.5 rounded-full border border-border px-3 text-sm font-medium text-muted-foreground transition-colors hover:border-destructive/30 hover:bg-destructive/10 hover:text-destructive focus-visible:ring-3 focus-visible:ring-ring/40 focus-visible:outline-none disabled:opacity-60 lg:inline-flex"
                >
                  <LogOut className="size-4" />
                  Logout
                </button>
              </>
            ) : (
              <div className="hidden items-center gap-2 lg:flex">
                <Link
                  href="/login"
                  className="inline-flex h-9 items-center gap-1.5 rounded-full px-3.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/40 focus-visible:outline-none"
                >
                  <LogIn className="size-4" />
                  Login
                </Link>
                <Link
                  href="/register"
                  className="group inline-flex h-9 items-center gap-1.5 rounded-full bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-[0_10px_24px_-16px_var(--primary)] transition-colors hover:bg-primary/90 focus-visible:ring-3 focus-visible:ring-ring/40 focus-visible:outline-none"
                >
                  Join Utsho
                  <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                </Link>
              </div>
            )}

            <MobileNav />
          </div>
        </nav>
      </div>
    </header>
  );
}
