"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Loader2, LockKeyhole, Mail } from "lucide-react";
import { toast } from "sonner";

import { AuthField } from "@/components/auth/auth-field";
import { PasswordField } from "@/components/auth/password-field";
import { SocialAuthButtons } from "@/components/auth/social-auth-buttons";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import {
  currentRedirectTarget,
  friendlyAuthError,
  validateEmail,
} from "@/lib/auth-form";
import { authClient } from "@/lib/auth-client";

export function LoginForm() {
  const router = useRouter();
  const [values, setValues] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function update(field) {
    return (event) => {
      const value = event.target.value;

      setValues((current) => ({ ...current, [field]: value }));
      setErrors((current) => ({ ...current, [field]: undefined }));
      setFormError("");
    };
  }

  function validate() {
    const nextErrors = {};
    const emailError = validateEmail(values.email);

    if (emailError) nextErrors.email = emailError;
    if (!values.password) nextErrors.password = "Password is required.";

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (submitting) return;
    setFormError("");

    if (!validate()) {
      toast.error("Please fix the highlighted fields.");
      return;
    }

    setSubmitting(true);

    try {
      const { data, error } = await authClient.signIn.email({
        email: values.email.trim(),
        password: values.password,
        rememberMe: true,
      });

      if (error) {
        const message = friendlyAuthError(error);

        setFormError(message);
        toast.error(message);
        return;
      }

      const firstName = data?.user?.name?.trim().split(/\s+/)[0];

      toast.success(
        firstName ? `Welcome back, ${firstName}!` : "Welcome back to Utsho!",
      );
      router.replace(currentRedirectTarget());
      router.refresh();
    } catch {
      const message =
        "Could not sign you in right now. Check your connection and try again.";

      setFormError(message);
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit} noValidate>
        <FieldGroup className="gap-4">
          <AuthField
            id="login-email"
            label="Email"
            type="email"
            icon={Mail}
            value={values.email}
            onChange={update("email")}
            error={errors.email}
            placeholder="you@example.com"
            autoComplete="email"
            inputMode="email"
            maxLength={254}
            disabled={submitting}
          />

          <PasswordField
            id="login-password"
            value={values.password}
            onChange={update("password")}
            error={errors.password}
            autoComplete="current-password"
            placeholder="Enter your password"
            disabled={submitting}
          />

          {formError ? (
            <Alert
              variant="destructive"
              className="border-destructive/30 bg-destructive/5"
            >
              <AlertTitle>Could not sign you in</AlertTitle>
              <AlertDescription className="text-destructive/90">
                {formError}
              </AlertDescription>
            </Alert>
          ) : null}

          <Button
            type="submit"
            size="lg"
            disabled={submitting}
            aria-busy={submitting}
            className="group h-11 w-full rounded-full text-sm font-semibold shadow-[0_16px_32px_-22px_var(--primary)] transition-transform hover:-translate-y-0.5 disabled:translate-y-0"
          >
            {submitting ? (
              <>
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                Signing you in…
              </>
            ) : (
              <>
                <LockKeyhole className="size-4" aria-hidden="true" />
                Log in
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </>
            )}
          </Button>
        </FieldGroup>
      </form>

      <div className="mt-6">
        <SocialAuthButtons disabled={submitting} />
      </div>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        New to Utsho?{" "}
        <Link
          href="/register"
          className="font-semibold text-primary underline-offset-4 transition-colors hover:underline"
        >
          Create an account
        </Link>
      </p>
    </div>
  );
}
