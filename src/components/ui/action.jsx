import Link from "next/link";

import { cn } from "@/lib/utils";

/**
 * One pill button for the whole site. The home page sets the tone — rounded,
 * confident, slightly lifted on hover — and every other page reuses it so the
 * action language never drifts.
 */
const base =
  "group inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold transition-all duration-200 focus-visible:ring-3 focus-visible:ring-ring/40 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-60";

const variants = {
  primary:
    "bg-primary text-primary-foreground shadow-[0_14px_28px_-20px_var(--primary)] hover:-translate-y-0.5 hover:bg-primary/90",
  secondary:
    "border border-border bg-background/70 text-foreground hover:-translate-y-0.5 hover:bg-muted",
  ghost: "text-primary hover:bg-primary/10",
  accent:
    "bg-accent text-accent-foreground shadow-[0_14px_28px_-20px_var(--accent)] hover:-translate-y-0.5 hover:bg-accent/90",
  "on-primary":
    "border border-primary-foreground/25 text-primary-foreground hover:-translate-y-0.5 hover:bg-primary-foreground/10",
  destructive:
    "bg-destructive text-white hover:-translate-y-0.5 hover:opacity-90",
  "destructive-outline":
    "border border-destructive/40 text-destructive hover:bg-destructive/10",
};

export function actionStyles({ variant = "primary", className } = {}) {
  return cn(base, variants[variant] ?? variants.primary, className);
}

export function ActionLink({
  href,
  variant = "primary",
  className,
  children,
  ...props
}) {
  return (
    <Link href={href} className={actionStyles({ variant, className })} {...props}>
      {children}
    </Link>
  );
}
