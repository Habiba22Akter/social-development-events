"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Dialog } from "@base-ui/react/dialog";
import {
  ArrowRight,
  CalendarPlus,
  ClipboardList,
  LogIn,
  LogOut,
  Menu,
  Ticket,
  X,
} from "lucide-react";
import { Logo } from "@/components/layout/logo";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { UserAvatar } from "@/components/layout/user-menu";
import { useAuth } from "@/components/providers/auth-provider";
import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";

const privateLinks = [
  { label: "Create Event", href: "/events/create", icon: CalendarPlus },
  { label: "Manage Events", href: "/events/manage", icon: ClipboardList },
  { label: "Joined Events", href: "/events/joined", icon: Ticket },
];

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { user, signOut, isPending } = useAuth();

  const close = () => setOpen(false);
  const name = user?.name ?? user?.displayName ?? "Volunteer";

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger
        aria-label="Open navigation menu"
        className="grid size-9 place-items-center rounded-full border border-border bg-background/60 text-foreground transition-colors hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/40 focus-visible:outline-none lg:hidden"
      >
        <Menu className="size-[1.15rem]" />
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-50 bg-foreground/30 backdrop-blur-sm transition-opacity duration-200 data-ending-style:opacity-0 data-starting-style:opacity-0" />
        <Dialog.Popup className="fixed inset-y-0 right-0 z-50 flex h-dvh w-[86%] max-w-sm flex-col overflow-y-auto border-l border-border bg-background px-5 py-5 shadow-2xl transition-transform duration-300 ease-out data-ending-style:translate-x-full data-starting-style:translate-x-full">
          <Dialog.Title className="sr-only">Site navigation</Dialog.Title>
          <Dialog.Description className="sr-only">
            Browse Utsho pages, manage your events and switch theme.
          </Dialog.Description>

          <div className="flex items-center justify-between">
            <div onClick={close}>
              <Logo />
            </div>
            <Dialog.Close
              aria-label="Close navigation menu"
              className="grid size-9 place-items-center rounded-full border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/40 focus-visible:outline-none"
            >
              <X className="size-[1.15rem]" />
            </Dialog.Close>
          </div>

          <nav className="mt-8 flex flex-col gap-1" aria-label="Main">
            {siteConfig.nav.map((item) => {
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={close}
                  className={cn(
                    "flex items-center justify-between rounded-xl px-3 py-3 text-base font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
                    active && "bg-muted text-foreground",
                  )}
                >
                  {item.label}
                  <ArrowRight className="size-4 opacity-50" />
                </Link>
              );
            })}
          </nav>

          <div className="my-6 h-px bg-border" />

          {user ? (
            <div className="flex flex-col gap-1">
              <div className="mb-3 flex items-center gap-3 rounded-2xl border border-border bg-card p-3">
                <UserAvatar user={user} className="size-10" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">{name}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {user.email}
                  </p>
                </div>
              </div>

              {privateLinks.map(({ label, href, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={close}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <Icon className="size-4" />
                  {label}
                </Link>
              ))}

              <button
                type="button"
                disabled={isPending}
                onClick={async () => {
                  close();
                  await signOut();
                }}
                className="mt-2 flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-destructive transition-colors hover:bg-destructive/10 disabled:opacity-60"
              >
                <LogOut className="size-4" />
                Log out
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-2.5">
              <Link
                href="/login"
                onClick={close}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-border px-5 text-sm font-semibold transition-colors hover:bg-muted"
              >
                <LogIn className="size-4" />
                Log in
              </Link>
              <Link
                href="/register"
                onClick={close}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Join Utsho
                <ArrowRight className="size-4" />
              </Link>
            </div>
          )}

          <div className="mt-auto flex items-center justify-between pt-8">
            <p className="text-xs text-muted-foreground">Dhaka, Bangladesh</p>
            <ThemeToggle />
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
