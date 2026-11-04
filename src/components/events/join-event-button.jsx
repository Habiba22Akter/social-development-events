"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "@/components/providers/auth-provider";

export function JoinEventButton({ eventId, initialJoined = false }) {
  const { user, isPending } = useAuth();
  const router = useRouter();
  const [isJoining, setIsJoining] = useState(false);
  const [hasJoined, setHasJoined] = useState(false);
  const joined = hasJoined || initialJoined;

  async function handleJoin() {
    if (!user) {
      router.push(`/login?redirect=${encodeURIComponent(`/events/${eventId}`)}`);
      return;
    }

    setIsJoining(true);

    try {
      const response = await fetch(`/api/events/${eventId}/join`, {
        method: "POST",
      });
      const data = await response.json().catch(() => ({}));

      // A duplicate join is not an error: the API answers idempotently.
      if (!response.ok && response.status !== 409) {
        toast.error(data.message || "Could not join this event.");
        return;
      }

      setHasJoined(true);
      toast.success(
        data.alreadyJoined
          ? "You already joined this event."
          : "You joined this event.",
      );
      router.refresh();
    } catch {
      toast.error("The event service is unavailable. Please try again.");
    } finally {
      setIsJoining(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleJoin}
      disabled={isPending || isJoining || joined}
      className="h-12 rounded-full bg-primary px-7 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5 disabled:pointer-events-none disabled:opacity-60"
    >
      {joined ? "Joined" : isJoining ? "Joining…" : user ? "Join event" : "Log in to join"}
    </button>
  );
}
