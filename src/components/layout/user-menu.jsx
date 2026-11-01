"use client";

import Link from "next/link";
import { Menu } from "@base-ui/react/menu";
import { Avatar } from "@base-ui/react/avatar";
import {
  CalendarPlus,
  ClipboardList,
  LogOut,
  Ticket,
  UserRound,
} from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";
import { cn } from "@/lib/utils";

const itemClass =
  "flex cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium text-popover-foreground outline-none select-none transition-colors data-highlighted:bg-muted data-highlighted:text-foreground";

export function initialsOf(name = "") {
  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) return "U";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();

  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function UserAvatar({ user, className }) {
  const name = user?.name ?? user?.displayName ?? "Volunteer";
  const photo = user?.image ?? user?.photoURL;

  return (
    <Avatar.Root
      className={cn(
        "inline-flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-secondary align-middle text-xs font-semibold text-secondary-foreground select-none",
        className,
      )}
    >
      {photo ? (
        <Avatar.Image
          src={photo}
          alt={name}
          referrerPolicy="no-referrer"
          className="size-full object-cover"
        />
      ) : null}
      <Avatar.Fallback className="flex size-full items-center justify-center">
        {initialsOf(name)}
      </Avatar.Fallback>
    </Avatar.Root>
  );
}

export function UserMenu({ user }) {
  const { signOut, isPending } = useAuth();
  const name = user?.name ?? user?.displayName ?? "Volunteer";
  const email = user?.email ?? "";

  return (
    <Menu.Root>
      <div className="group relative hidden lg:block">
        <Menu.Trigger
          aria-label={`Open profile menu for ${name}`}
          className="block rounded-full outline-none focus-visible:ring-3 focus-visible:ring-ring/50 data-popup-open:ring-3 data-popup-open:ring-ring/30"
        >
          <UserAvatar
            user={user}
            className="size-9 ring-2 ring-transparent transition group-hover:ring-primary/25"
          />
        </Menu.Trigger>
        <span
          aria-hidden="true"
          className="pointer-events-none absolute top-full left-1/2 z-10 mt-2 -translate-x-1/2 rounded-md bg-foreground px-2.5 py-1 text-xs font-medium whitespace-nowrap text-background opacity-0 shadow-soft transition-opacity duration-150 group-hover:opacity-100 group-focus-within:opacity-100"
        >
          {name}
        </span>
      </div>

      <Menu.Portal>
        <Menu.Positioner align="end" sideOffset={10} className="z-50 outline-none">
          <Menu.Popup className="w-64 origin-[var(--transform-origin)] rounded-2xl border border-border bg-popover p-1.5 text-popover-foreground shadow-soft outline-none transition-[transform,opacity] duration-150 ease-out data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0">
            <div className="flex items-center gap-2.5 rounded-xl bg-muted/60 px-2.5 py-2">
              <UserAvatar user={user} className="size-8" />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{name}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {email}
                </p>
              </div>
            </div>

            <Menu.Separator className="my-1.5 h-px bg-border" />

            <Menu.Item
              render={<Link href="/events/create" />}
              className={itemClass}
            >
              <CalendarPlus className="size-4 text-muted-foreground" />
              Create Event
            </Menu.Item>
            <Menu.Item
              render={<Link href="/events/manage" />}
              className={itemClass}
            >
              <ClipboardList className="size-4 text-muted-foreground" />
              Manage Events
            </Menu.Item>
            <Menu.Item
              render={<Link href="/events/joined" />}
              className={itemClass}
            >
              <Ticket className="size-4 text-muted-foreground" />
              Joined Events
            </Menu.Item>

            <Menu.Separator className="my-1.5 h-px bg-border" />

            <Menu.Item
              className={cn(itemClass, "text-destructive data-highlighted:bg-destructive/10 data-highlighted:text-destructive")}
              disabled={isPending}
              onClick={signOut}
            >
              <LogOut className="size-4" />
              Log out
            </Menu.Item>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  );
}

export function UserChip({ user, className }) {
  const name = user?.name ?? user?.displayName ?? "Volunteer";
  const email = user?.email ?? "";

  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-2xl border border-border bg-card p-3",
        className,
      )}
    >
      <UserAvatar user={user} className="size-10" />
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold">{name}</p>
        <p className="truncate text-xs text-muted-foreground">{email}</p>
      </div>
      <UserRound className="ml-auto size-4 shrink-0 text-muted-foreground" />
    </div>
  );
}
