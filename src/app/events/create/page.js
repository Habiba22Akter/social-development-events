import { CalendarPlus } from "lucide-react";
import { RequireAuth } from "@/components/auth/require-auth";
import { PlaceholderPage } from "@/components/layout/placeholder-page";

export const metadata = {
  title: "Create Event",
};

export default function CreateEventPage() {
  return (
    <RequireAuth>
      <PlaceholderPage
        icon={CalendarPlus}
        eyebrow="Create event"
        title="Put your neighbourhood on the map."
        description="This protected page will hold the create-event form: title, description, type, thumbnail, location and a future-only event date."
        primary={{ href: "/events", label: "See upcoming events" }}
      />
    </RequireAuth>
  );
}
