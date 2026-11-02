"use client";

import { createAuthClient } from "better-auth/react";

/**
 * Browser-side BetterAuth client.
 *
 * Requests go to `/api/auth/*` on this origin (BetterAuth's default), and the
 * Next.js route handler forwards them to the Express auth server. Keeping the
 * browser on the same origin means the HTTP-only session cookie belongs to the
 * Next.js domain — no CORS or third-party cookie workarounds.
 */
export const authClient = createAuthClient();

export const { signIn, signUp, signOut, useSession } = authClient;
