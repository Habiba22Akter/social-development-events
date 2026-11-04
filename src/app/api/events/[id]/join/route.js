import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

import { connectToDatabase } from "@/lib/mongodb";

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

export async function POST(request, { params }) {
  const user = await getAuthenticatedUser(request);

  if (!user) {
    return NextResponse.json(
      { message: "Log in to join this event." },
      { status: 401 },
    );
  }

  const { id } = await params;

  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ message: "Event not found." }, { status: 404 });
  }

  const database = await connectToDatabase();
  const result = await database.collection("events").updateOne(
    {
      _id: new ObjectId(id),
      date: { $gte: new Date() },
      "participants.userId": { $ne: user.id },
    },
    {
      $addToSet: {
        participants: {
          userId: user.id,
          email: user.email,
          name: user.name || "",
        },
      },
    },
  );

  if (result.matchedCount === 0) {
    const event = await database.collection("events").findOne({
      _id: new ObjectId(id),
      date: { $gte: new Date() },
    });

    if (!event) {
      return NextResponse.json({ message: "Event not found." }, { status: 404 });
    }

    return NextResponse.json(
      { message: "You have already joined this event." },
      { status: 409 },
    );
  }

  return NextResponse.json({ message: "You joined this event." });
}
