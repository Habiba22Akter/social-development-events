import { connectToDatabase } from "@/lib/mongodb";

export async function getUpcomingEvents() {
  const database = await connectToDatabase();

  return database
    .collection("events")
    .find({ date: { $gte: new Date() } })
    .sort({ date: 1 })
    .limit(6)
    .toArray();
}

export function serializeEvent(event) {
  return {
    ...event,
    _id: event._id.toString(),
    date: event.date.toISOString(),
    createdAt: event.createdAt?.toISOString(),
  };
}
