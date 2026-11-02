import { Ticket } from "lucide-react";
import { RequireAuth } from "@/components/auth/require-auth";
import { PlaceholderPage } from "@/components/layout/placeholder-page";

export const metadata = {
  title: "Joined Events",
};

export default function JoinedEventsPage() {
  return (
    <RequireAuth>
      <PlaceholderPage
        icon={Ticket}
        eyebrow="Joined events"
        title="The drives you signed up for."
        description="Every event you join will be listed here, sorted by event date, so you always know where you are expected next."
        primary={{ href: "/events", label: "Find another drive" }}
      />
    </RequireAuth>
  );
}
