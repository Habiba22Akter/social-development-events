import { ClipboardList } from "lucide-react";
import { PlaceholderPage } from "@/components/layout/placeholder-page";

export const metadata = {
  title: "Manage Events",
};

export default function ManageEventsPage() {
  return (
    <PlaceholderPage
      icon={ClipboardList}
      eyebrow="Manage events"
      title="Your drives, your call."
      description="Events you created will appear here with edit and delete actions — only the organiser who owns an event can change it."
      primary={{ href: "/events/create", label: "Create an event" }}
    />
  );
}
