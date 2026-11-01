import { CalendarDays } from "lucide-react";
import { PlaceholderPage } from "@/components/layout/placeholder-page";

export const metadata = {
  title: "Upcoming Events",
};

export default function EventsPage() {
  return (
    <PlaceholderPage
      icon={CalendarDays}
      eyebrow="Upcoming events"
      title="Every drive on the calendar, in one place."
      description="The live event board is being wired up next: the six soonest drives, pulled from MongoDB and sorted by date so nothing that has already passed shows up here."
      primary={{ href: "/events/create", label: "Create an event" }}
    />
  );
}
