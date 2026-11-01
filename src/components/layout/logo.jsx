import Link from "next/link";
import { cn } from "@/lib/utils";

export function LogoMark({ className }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "relative grid size-10 shrink-0 place-items-center overflow-hidden rounded-2xl bg-primary text-primary-foreground shadow-[0_10px_24px_-14px_var(--primary)]",
        className,
      )}
    >
      <svg viewBox="0 0 24 24" fill="none" className="size-6">
        <path
          d="M12 21v-9.4"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
        />
        <path
          d="M11.9 12.6C8.3 12.6 6 10.1 6 6.4c3.6 0 5.9 2.5 5.9 6.2Z"
          fill="currentColor"
          fillOpacity="0.95"
        />
        <path
          d="M12.2 10.4c0-3.2 2-5.4 5.5-5.4 0 3.2-2.1 5.4-5.5 5.4Z"
          fill="currentColor"
          fillOpacity="0.55"
        />
        <circle cx="12" cy="21" r="1.3" fill="currentColor" fillOpacity="0.7" />
      </svg>
      <span className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/10 to-transparent" />
    </span>
  );
}

export function Logo({ className, markClassName, textClassName }) {
  return (
    <Link
      href="/"
      aria-label="Utsho — home"
      className={cn(
        "group inline-flex items-center gap-2.5 rounded-xl outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
        className,
      )}
    >
      <LogoMark
        className={cn(
          "transition-transform duration-300 group-hover:-rotate-6",
          markClassName,
        )}
      />
      <span
        className={cn(
          "font-heading text-[1.35rem] leading-none font-semibold tracking-tight",
          textClassName,
        )}
      >
        Utsho<span className="text-accent-foreground dark:text-accent">.</span>
      </span>
    </Link>
  );
}
