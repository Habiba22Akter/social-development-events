"use client";

import { Toaster as SonnerToaster } from "sonner";

import { useTheme } from "@/components/providers/theme-provider";

export function Toaster() {
  const { theme } = useTheme();

  return (
    <SonnerToaster
      theme={theme}
      position="top-center"
      closeButton
      richColors
      toastOptions={{
        classNames: {
          toast: "font-sans",
          description: "text-muted-foreground",
        },
      }}
    />
  );
}
