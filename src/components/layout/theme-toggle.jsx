"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/providers/theme-provider";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }) {
  const { toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      title="Switch between light and dark"
      aria-label="Switch between light and dark theme"
      className={cn(
        "group relative grid size-9 shrink-0 place-items-center rounded-full border border-border bg-background/60 text-muted-foreground transition-colors hover:border-primary/30 hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/40 focus-visible:outline-none",
        className,
      )}
    >
      <Sun className="size-[1.05rem] transition-transform duration-500 group-hover:rotate-45 dark:hidden" />
      <Moon className="hidden size-[1.05rem] transition-transform duration-500 group-hover:-rotate-12 dark:block" />
    </button>
  );
}
