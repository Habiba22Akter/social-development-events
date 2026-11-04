import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

import { connectToDatabase } from "@/lib/mongodb";
import { isLoadableImageUrl, serializeEvent } from "@/lib/events";
import { normalizeImageUrl } from "@/lib/image-url";
import { eventTypes } from "@/lib/site";

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
  const { url: imageUrl, error: imageUrlError } = normalizeImageUrl(image);

  if (
    !title ||
    !description ||
    !eventTypes.includes(type) ||
    !location ||
    !imageUrl ||
    imageUrlError ||
    Number.isNaN(date.getTime())
  ) {
    return NextResponse.json(
      {
        message:
          imageUrlError ||
          "Complete every required field with a valid HTTPS thumbnail URL and event date.",
      },
      { status: 400 },
    );
  }

  if (!(await isLoadableImageUrl(imageUrl))) {
    return NextResponse.json(
      {
        message:
          "That thumbnail URL does not load as an image. Paste a direct image link (for example https://example.com/photo.jpg) or a shared Google Drive link.",
      },
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
    image: imageUrl,
    organizerId: user.id,
    organizerEmail: user.email,
    createdAt: new Date(),
    participants: [],
  };

  const database = await connectToDatabase();
  const result = await database.collection("events").insertOne(event);
  revalidatePath("/");
  revalidatePath("/events");

  return NextResponse.json(
    { event: serializeEvent({ ...event, _id: result.insertedId }) },
    { status: 201 },
  );
}
