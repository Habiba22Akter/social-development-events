"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Loader2, ShieldCheck } from "lucide-react";

import { useAuth } from "@/components/providers/auth-provider";

/**
 * Client-side guard for pages that need a signed-in user.
 *
 * It deliberately waits for the session query to settle before redirecting,
 * so reloading a private route with a valid cookie never bounces you to login.
 * The `proxy.js` cookie check is the first line of defence; every real API
 * call re-validates the session on the server.
 */
export function RequireAuth({ children }) {
  const { user, isPending } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isPending || user) return;

    const redirect = pathname ? `?redirect=${encodeURIComponent(pathname)}` : "";
    router.replace(`/login${redirect}`);
  }, [isPending, user, pathname, router]);

  if (isPending || !user) {
    return (
      <section className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center px-4 py-20 text-center">
        <span className="relative grid size-14 place-items-center rounded-2xl border border-border bg-card text-primary shadow-soft">
          <ShieldCheck className="absolute size-6 opacity-20" aria-hidden="true" />
          <Loader2 className="size-6 animate-spin" aria-hidden="true" />
        </span>
        <p
          role="status"
          aria-live="polite"
          className="mt-5 text-sm font-medium text-muted-foreground"
        >
          {isPending
            ? "Checking your session…"
            : "Taking you to the login page…"}
        </p>
        <p className="mt-2 text-xs text-muted-foreground/80">
          Protected page · Utsho
        </p>
      </section>
    );
  }

  return children;
}
