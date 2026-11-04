import { MongoClient } from "mongodb";

/**
 * One MongoClient per process. In development Next re-evaluates modules on
 * every hot reload, so the client is cached on `globalThis` to avoid leaking
 * connections while you edit files.
 */
const globalForMongo = globalThis;

function createMongoClient() {
  const uri =
    process.env.MONGODB_URI ||
    process.env.MONGODB_URL;

  if (!uri) {
    throw new Error("MONGODB_URI or MONGODB_URL must be configured.");
  }

  return new MongoClient(uri, {
    serverSelectionTimeoutMS: 8000,
  });
}

export const mongoClient =
  globalForMongo.__utshoMongoClient ?? createMongoClient();

if (process.env.NODE_ENV !== "production") {
  globalForMongo.__utshoMongoClient = mongoClient;
}

export const db = mongoClient.db(process.env.MONGODB_DB || undefined);

/** Connect eagerly when a feature needs a live connection (e.g. health checks). */
export async function connectToDatabase() {
  await mongoClient.connect();
  return db;
}
