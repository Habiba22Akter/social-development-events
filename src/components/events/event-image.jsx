"use client";

import Image from "next/image";
import { useState } from "react";
import { ImageOff } from "lucide-react";

import { EVENT_FALLBACK_IMAGE, getEventImageSrc } from "@/lib/image-url";

/**
 * Renders an organiser-supplied thumbnail. Broken/blocked URLs fall back to the
 * shared community photo (or an "unavailable" tile when there is no fallback)
 * instead of leaving an empty grey block.
 */
export function EventImage({
  src,
  alt = "",
  sizes,
  priority = false,
  className = "",
  fallbackSrc = EVENT_FALLBACK_IMAGE,
}) {
  const [failedSrc, setFailedSrc] = useState("");
  const primarySrc = getEventImageSrc(src);

  let activeSrc = "";

  if (primarySrc && primarySrc !== failedSrc) {
    activeSrc = primarySrc;
  } else if (fallbackSrc && fallbackSrc !== failedSrc) {
    activeSrc = fallbackSrc;
  }

  if (!activeSrc) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-muted text-muted-foreground">
        <ImageOff className="size-6" aria-hidden="true" />
        <span className="text-xs font-medium">Image unavailable</span>
      </div>
    );
  }

  return (
    <Image
      src={activeSrc}
      alt={alt}
      fill
      priority={priority}
      unoptimized={activeSrc === primarySrc}
      sizes={sizes}
      className={className}
      onError={() => setFailedSrc(activeSrc)}
    />
  );
}
