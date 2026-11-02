import { AuthShell } from "@/components/auth/auth-shell";
import { LoginForm } from "@/components/auth/login-form";

export const metadata = {
  title: "Login",
  description:
    "Log in to Utsho with email and password, or continue with Google or GitHub, to join community service events across Dhaka.",
};

export default function LoginPage() {
  return (
    <AuthShell
      eyebrow="Welcome back"
      title="Log in and pick up where you left off."
      description="Your joined drives and the events you organise are waiting. Sign in with your email and password, or use Google in one tap."
      panelTitle="The city keeps moving because people show up."
      panelBody="Sign back in to see your next drive, manage the events you created, and keep your spot on the volunteer list."
      imageId={6646918}
      imageAlt="Volunteers distributing supplies at a community event in Dhaka"
    >
      <LoginForm />
    </AuthShell>
  );
}
