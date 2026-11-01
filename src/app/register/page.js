import { UserPlus } from "lucide-react";
import { PlaceholderPage } from "@/components/layout/placeholder-page";

export const metadata = {
  title: "Register",
};

export default function RegisterPage() {
  return (
    <PlaceholderPage
      icon={UserPlus}
      eyebrow="Join Utsho"
      title="One account, every drive in your city."
      description="Registration will ask for your name, email, photo URL and a password with at least one uppercase letter, one lowercase letter and six characters."
      primary={{ href: "/login", label: "I already have an account" }}
    />
  );
}
