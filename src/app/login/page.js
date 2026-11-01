import { LogIn } from "lucide-react";
import { PlaceholderPage } from "@/components/layout/placeholder-page";

export const metadata = {
  title: "Login",
};

export default function LoginPage() {
  return (
    <PlaceholderPage
      icon={LogIn}
      eyebrow="Welcome back"
      title="Log in to pick up where you left off."
      description="Email and password sign-in, plus a social provider, will live here. After login you will land straight back on the drive you were browsing."
      primary={{ href: "/register", label: "Create an account" }}
    />
  );
}
