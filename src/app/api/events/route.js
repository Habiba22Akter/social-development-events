import { NextResponse } from "next/server";

import { connectToDatabase } from "@/lib/mongodb";
import { serializeEvent } from "@/lib/events";

const authServerUrl = process.env.AUTH_SERVER_URL || "http://localhost:8000";

async function getAuthenticatedUser(request) {
  const response = await fetch(`${authServerUrl}/api/auth/get-session`, {
    headers: {
      cookie: request.headers.get("cookie") || "",
    },
    cache: "no-store",
  });

  if (!response.ok) return null;

  const data = await response.json();
  return data?.user || data?.session?.user || null;
}

export async function GET() {
  const database = await connectToDatabase();
  const events = await database
    .collection("events")
    .find({ date: { $gte: new Date() } })
    .sort({ date: 1 })
    .limit(6)
    .toArray();

  return NextResponse.json({ events: events.map(serializeEvent) });
}

export async function POST(request) {
  const user = await getAuthenticatedUser(request);

  if (!user) {
    return NextResponse.json(
      { message: "You must be signed in to create an event." },
      { status: 401 },
    );
  }

  const body = await request.json();
  const title = body.title?.trim();
  const description = body.description?.trim();
  const type = body.type?.trim();
  const location = body.location?.trim();
  const image = body.image?.trim();
  const date = new Date(body.date);

  if (!title || !description || !type || !location || Number.isNaN(date.getTime())) {
    return NextResponse.json(
      { message: "Complete every required field with a valid event date." },
      { status: 400 },
    );
  }

  if (date <= new Date()) {
    return NextResponse.json(
      { message: "Choose a future date and time for your event." },
      { status: 400 },
    );
  }

  const event = {
    title,
    description,
    type,
    location,
    date,
    image: image || null,
    organizerId: user.id,
    organizerName: user.name || user.email || "Utsho organiser",
    createdAt: new Date(),
  };

  const database = await connectToDatabase();
  const result = await database.collection("events").insertOne(event);

  return NextResponse.json(
    { event: serializeEvent({ ...event, _id: result.insertedId }) },
    { status: 201 },
  );
}
