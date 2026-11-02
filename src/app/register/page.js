import { AuthShell } from "@/components/auth/auth-shell";
import { RegisterForm } from "@/components/auth/register-form";

export const metadata = {
  title: "Register",
  description:
    "Create your Utsho account to join and organise community service events across Dhaka neighbourhoods.",
};

export default function RegisterPage() {
  return (
    <AuthShell
      eyebrow="Join Utsho"
      title="One account, every drive in your city."
      description="Create your volunteer profile in under a minute — name, email, photo URL and a password. No email verification step."
      panelTitle="Good intentions deserve a place to land."
      panelBody="Utsho keeps every cleanup, plantation, clothes drive and food run in one calendar — so your next few hours of volunteering are easy to find."
      imageId={11319521}
      imageAlt="Volunteers sorting winter clothes and blankets for a community drive"
    >
      <RegisterForm />
    </AuthShell>
  );
}
