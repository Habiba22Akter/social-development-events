"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Loader2, ShieldCheck } from "lucide-react";

import { useAuth } from "@/components/providers/auth-provider";

/**
 * Client-side guard for pages that need a signed-in user.
 *
 * It deliberately waits for the session query to settle before redirecting,
 * so reloading a private route with a valid cookie never bounces you to login.
 * `proxy.js` has already validated the cookie against the auth server before
 * this page rendered; this guard covers client-side transitions and a session
 * that expires while the tab stays open. Every real API call re-validates the
 * session on the server.
 */
export function RequireAuth({ children }) {
  const { user, isPending, isSigningOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  // Remembers that this page was rendered for a signed-in volunteer. If the
  // session then disappears, it was a sign-out (not an expired cookie), so the
  // volunteer goes home instead of being bounced to the login form.
  const wasSignedIn = useRef(false);

  useEffect(() => {
    if (user) wasSignedIn.current = true;
  }, [user]);

  useEffect(() => {
    if (isPending || user) return;

    if (isSigningOut || wasSignedIn.current) {
      router.replace("/");
      return;
    }

    const redirect = pathname ? `?redirect=${encodeURIComponent(pathname)}` : "";
    router.replace(`/login${redirect}`);
  }, [isPending, user, isSigningOut, pathname, router]);

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
          {isSigningOut
            ? "Signing you out…"
            : isPending
              ? "Checking your session…"
              : "Redirecting you…"}
        </p>
        <p className="mt-2 text-xs text-muted-foreground/80">
          Protected page · Utsho
        </p>
      </section>
    );
  }

  return children;
}
