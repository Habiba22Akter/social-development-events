"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Avatar } from "@base-ui/react/avatar";
import {
  ArrowRight,
  Check,
  ImageIcon,
  Loader2,
  Mail,
  ShieldCheck,
  UserRound,
  X,
} from "lucide-react";
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
  normalizePhotoUrl,
  passwordChecks,
  validateEmail,
  validateName,
  validatePassword,
  validatePhotoUrl,
} from "@/lib/auth-form";
import { authClient } from "@/lib/auth-client";
import { AVATAR_IMAGE_CLASS, initialsOf } from "@/lib/avatar";

const initialValues = {
  name: "",
  email: "",
  photoURL: "",
  password: "",
};

/** Live circular preview so people can see the crop before they sign up. */
function PhotoPreview({ url, name }) {
  const src = normalizePhotoUrl(url);
  const [status, setStatus] = useState("idle");

  if (!src) return null;

  const failed = status === "error";

  return (
    <div className="flex items-center gap-3 rounded-xl border border-border/70 bg-muted/40 px-3 py-2">
      <Avatar.Root
        onLoadingStatusChange={setStatus}
        className="inline-flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-secondary align-middle text-xs font-semibold text-secondary-foreground select-none"
      >
        <Avatar.Image
          src={src}
          alt={`Photo preview for ${name.trim() || "you"}`}
          referrerPolicy="no-referrer"
          className={AVATAR_IMAGE_CLASS}
        />
        <Avatar.Fallback className="flex size-full items-center justify-center">
          {initialsOf(name)}
        </Avatar.Fallback>
      </Avatar.Root>

      <div className="min-w-0 space-y-0.5">
        <p className="text-xs font-medium text-foreground">
          {failed ? "That image could not be loaded." : "Photo preview"}
        </p>
        <p className="text-xs text-muted-foreground">
          {failed
            ? "Check that the link is public, or leave it blank to show your initials."
            : "This is how you'll appear in the navbar. Close-up, roughly square photos look best."}
        </p>
      </div>
    </div>
  );
}

export function RegisterForm() {
  const router = useRouter();
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const checks = passwordChecks(values.password);

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
    const nameError = validateName(values.name);
    const emailError = validateEmail(values.email);
    const photoError = validatePhotoUrl(values.photoURL);
    const passwordError = validatePassword(values.password);

    if (nameError) nextErrors.name = nameError;
    if (emailError) nextErrors.email = emailError;
    if (photoError) nextErrors.photoURL = photoError;
    if (passwordError) nextErrors.password = passwordError;

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (submitting) return;
    setFormError("");

    if (!validate()) {
      toast.error(
        "Please fix the highlighted fields — the password needs an uppercase letter, a lowercase letter and 6 characters.",
      );
      return;
    }

    setSubmitting(true);

    try {
      const photoURL = normalizePhotoUrl(values.photoURL);
      const { data, error } = await authClient.signUp.email({
        name: values.name.trim(),
        email: values.email.trim(),
        password: values.password,
        image: photoURL || undefined,
        photoURL: photoURL || undefined,
      });

      if (error) {
        const message = friendlyAuthError(
          error,
          "Could not create your account. Please try again.",
        );

        setFormError(message);
        toast.error(message);
        return;
      }

      const firstName = data?.user?.name?.trim().split(/\s+/)[0];

      toast.success(
        firstName
          ? `Welcome to Utsho, ${firstName}! Your account is ready.`
          : "Welcome to Utsho! Your account is ready.",
      );
      router.replace(currentRedirectTarget());
      router.refresh();
    } catch {
      const message =
        "Could not create your account right now. Check your connection and try again.";

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
            id="register-name"
            label="Full name"
            type="text"
            icon={UserRound}
            value={values.name}
            onChange={update("name")}
            error={errors.name}
            placeholder="Ayesha Rahman"
            autoComplete="name"
            maxLength={80}
            disabled={submitting}
          />

          <AuthField
            id="register-email"
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

          <AuthField
            id="register-photo"
            label="Photo URL"
            type="url"
            icon={ImageIcon}
            value={values.photoURL}
            onChange={update("photoURL")}
            error={errors.photoURL}
            hint="Optional — a close-up photo works best. Google Drive share links are converted automatically; without one we show your initials."
            placeholder="https://example.com/your-photo.jpg"
            autoComplete="url"
            disabled={submitting}
          />

          <PhotoPreview url={values.photoURL} name={values.name} />

          <div className="grid gap-2">
            <PasswordField
              id="register-password"
              value={values.password}
              onChange={update("password")}
              error={errors.password}
              autoComplete="new-password"
              placeholder="At least 6 characters"
              disabled={submitting}
              hint="Use one uppercase letter and one lowercase letter."
            />

            <ul
              className="flex flex-wrap gap-1.5 rounded-xl border border-border/70 bg-muted/40 px-2.5 py-2"
              aria-label="Password requirements"
            >
              {checks.map((check) => (
                <li
                  key={check.label}
                  className={[
                    "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[0.7rem] font-medium transition-colors",
                    check.ok
                      ? "border-primary/25 bg-primary/10 text-primary"
                      : "border-border bg-background text-muted-foreground",
                  ].join(" ")}
                >
                  {check.ok ? (
                    <Check className="size-3" aria-hidden="true" />
                  ) : (
                    <X className="size-3" aria-hidden="true" />
                  )}
                  {check.label}
                  <span className="sr-only">
                    {check.ok ? "requirement met" : "requirement not met"}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {formError ? (
            <Alert
              variant="destructive"
              className="border-destructive/30 bg-destructive/5"
            >
              <AlertTitle>Could not create your account</AlertTitle>
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
                Creating your account…
              </>
            ) : (
              <>
                Create account
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </>
            )}
          </Button>
        </FieldGroup>
      </form>

      <p className="mt-3 flex items-start gap-2 text-center text-xs leading-relaxed text-muted-foreground">
        <ShieldCheck
          className="mt-0.5 size-3.5 shrink-0 text-primary"
          aria-hidden="true"
        />
        No email verification needed — your account works as soon as you sign
        up. By joining you agree to show up kindly and keep Dhaka&apos;s
        neighbourhoods clean.
      </p>

      <div className="mt-6">
        <SocialAuthButtons disabled={submitting} />
      </div>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-semibold text-primary underline-offset-4 transition-colors hover:underline"
        >
          Log in instead
        </Link>
      </p>
    </div>
  );
}
