import { cn } from "@/lib/utils";

/**
 * Shared page scaffolding. Every route uses the same container width, section
 * rhythm and heading scale, which keeps spacing and alignment identical from
 * the home page to the manage screen.
 */

export function Container({ className, children }) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function Section({ id, muted = false, className, children, ...props }) {
  return (
    <section
      id={id}
      className={cn("py-14 lg:py-20", muted && "bg-muted/40", className)}
      {...props}
    >
      <Container>{children}</Container>
    </section>
  );
}

export function Eyebrow({ className, children }) {
  return (
    <p
      className={cn(
        "text-xs font-semibold tracking-[0.18em] text-primary uppercase",
        className,
      )}
    >
      {children}
    </p>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
  className,
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between",
        className,
      )}
    >
      <div className="max-w-2xl">
        {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
        <h2 className="mt-3 font-heading text-3xl leading-tight font-semibold tracking-tight text-balance sm:text-4xl">
          {title}
        </h2>
        {description ? (
          <p className="mt-4 text-base leading-relaxed text-muted-foreground text-pretty">
            {description}
          </p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

export function PageHeader({ icon: Icon, eyebrow, title, description, action }) {
  return (
    <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl">
        {Icon ? (
          <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Icon className="size-6" aria-hidden="true" />
          </div>
        ) : null}
        <Eyebrow className={Icon ? "mt-6" : undefined}>{eyebrow}</Eyebrow>
        <h1 className="mt-3 font-heading text-4xl leading-[1.05] font-semibold tracking-tight text-balance sm:text-5xl">
          {title}
        </h1>
        {description ? (
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground text-pretty">
            {description}
          </p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

export function EmptyState({ icon: Icon, title, description, action, className }) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-dashed border-border bg-card p-8 text-center sm:p-12",
        className,
      )}
    >
      {Icon ? (
        <Icon className="mx-auto size-9 text-primary" aria-hidden="true" />
      ) : null}
      <h2 className="mt-4 font-heading text-2xl font-semibold tracking-tight">
        {title}
      </h2>
      {description ? (
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted-foreground text-pretty">
          {description}
        </p>
      ) : null}
      {action ? <div className="mt-6 flex justify-center">{action}</div> : null}
    </div>
  );
}
