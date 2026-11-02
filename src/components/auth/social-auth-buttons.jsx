"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { GoogleIcon, SocialIcon } from "@/components/icons/social-icons";
import { Button } from "@/components/ui/button";
import { FieldSeparator } from "@/components/ui/field";
import { friendlyAuthError, safeRedirect } from "@/lib/auth-form";
import { authClient } from "@/lib/auth-client";

function GitHubIcon(props) {
  return <SocialIcon name="github" {...props} />;
}

const providers = [
  {
    id: "google",
    label: "Google",
    icon: GoogleIcon,
    className: "hover:border-[#4285F4]/40 hover:bg-[#4285F4]/5",
  },
  {
    id: "github",
    label: "GitHub",
    icon: GitHubIcon,
    className: "hover:border-foreground/25 hover:bg-muted",
  },
];

export function SocialAuthButtons({
  callbackURL = "/events",
  disabled = false,
  label = "Or continue with",
}) {
  const [pendingProvider, setPendingProvider] = useState(null);

  async function handleSignIn(provider) {
    setPendingProvider(provider);

    try {
      const target = safeRedirect(callbackURL);
      const { error } = await authClient.signIn.social({
        provider,
        callbackURL: `${window.location.origin}${target}`,
      });

      if (error) {
        toast.error(
          friendlyAuthError(
            error,
            `${provider === "google" ? "Google" : "GitHub"} sign-in is not available right now.`,
          ),
        );
        setPendingProvider(null);
      }
      // On success the browser is redirected to the provider, so the loading
      // state stays until the page unloads.
    } catch {
      toast.error(
        "Could not reach the sign-in provider. Check your connection and try again.",
      );
      setPendingProvider(null);
    }
  }

  return (
    <div>
      <FieldSeparator className="my-1">{label}</FieldSeparator>

      <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
        {providers.map(({ id, label: providerLabel, icon: Icon, className }) => {
          const pending = pendingProvider === id;
          const isDisabled = disabled || pendingProvider !== null;

          return (
            <Button
              key={id}
              type="button"
              variant="outline"
              onClick={() => handleSignIn(id)}
              disabled={isDisabled}
              className={`h-11 rounded-xl border-border bg-background text-sm font-semibold ${className}`}
            >
              {pending ? (
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              ) : (
                <Icon className="size-4" aria-hidden="true" />
              )}
              {pending ? "Connecting…" : providerLabel}
              <span className="sr-only">sign in with {providerLabel}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
}
