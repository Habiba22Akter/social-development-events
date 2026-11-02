import { RequireAuth } from "@/components/auth/require-auth";
import { CreateEventForm } from "@/components/home/create-event-form";

export const metadata = {
  title: "Create Event",
};

export default function CreateEventPage() {
  return (
    <RequireAuth>
      <CreateEventForm />
    </RequireAuth>
  );
}
