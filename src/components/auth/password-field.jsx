"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

import { AuthField } from "@/components/auth/auth-field";

export function PasswordField({
  id,
  label = "Password",
  value,
  onChange,
  error,
  hint,
  autoComplete = "current-password",
  placeholder = "Enter your password",
  disabled = false,
}) {
  const [visible, setVisible] = useState(false);

  return (
    <AuthField
      id={id}
      label={label}
      type={visible ? "text" : "password"}
      value={value}
      onChange={onChange}
      error={error}
      hint={hint}
      placeholder={placeholder}
      autoComplete={autoComplete}
      disabled={disabled}
      trailing={
        <button
          type="button"
          onClick={() => setVisible((current) => !current)}
          aria-label={visible ? "Hide password" : "Show password"}
          aria-pressed={visible}
          tabIndex={-1}
          className="grid size-7 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/40 focus-visible:outline-none"
        >
          {visible ? (
            <EyeOff className="size-4" aria-hidden="true" />
          ) : (
            <Eye className="size-4" aria-hidden="true" />
          )}
        </button>
      }
    />
  );
}
