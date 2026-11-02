"use client";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";

/**
 * Utsho's customised shadcn field.
 *
 * Wraps the shadcn `Field` primitives with the site's form rhythm: 44px tall
 * controls, rounded-xl corners, an optional leading icon and an inline action
 * (the password reveal button). Error/hint wiring follows `aria-describedby`.
 */
export function AuthField({
  id,
  label,
  hint,
  error,
  icon: Icon,
  trailing,
  className,
  inputClassName,
  ...props
}) {
  const describedBy =
    [error ? `${id}-error` : null, hint && !error ? `${id}-hint` : null]
      .filter(Boolean)
      .join(" ") || undefined;

  const controlProps = {
    id,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": describedBy,
    ...props,
  };

  return (
    <Field className={className}>
      <FieldLabel htmlFor={id} className="text-foreground/90">
        {label}
      </FieldLabel>

      {Icon || trailing ? (
        <InputGroup
          className={cn(
            "h-11 rounded-xl bg-background dark:bg-input/20",
            error &&
              "has-[[data-slot][aria-invalid=true]]:border-destructive has-[[data-slot][aria-invalid=true]]:ring-destructive/20",
          )}
        >
          {Icon ? (
            <InputGroupAddon className="text-muted-foreground">
              <Icon className="size-4" aria-hidden="true" />
            </InputGroupAddon>
          ) : null}

          <InputGroupInput
            className={cn("h-full px-3 text-sm", inputClassName)}
            {...controlProps}
          />

          {trailing ? (
            <InputGroupAddon align="inline-end">{trailing}</InputGroupAddon>
          ) : null}
        </InputGroup>
      ) : (
        <Input
          className={cn("h-11 rounded-xl px-3 text-sm", inputClassName)}
          {...controlProps}
        />
      )}

      {hint && !error ? (
        <FieldDescription id={`${id}-hint`}>{hint}</FieldDescription>
      ) : null}

      {error ? <FieldError id={`${id}-error`}>{error}</FieldError> : null}
    </Field>
  );
}
