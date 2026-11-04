// import { betterAuth } from "better-auth";
// import { mongodbAdapter } from "better-auth/adapters/mongodb";
// import { nextCookies } from "better-auth/next-js";
// import { APIError, createAuthMiddleware } from "better-auth/api";

// import { db, mongoClient } from "@/lib/mongodb";

// const PASSWORD_RULE =
//   "Password must be at least 6 characters and include one uppercase and one lowercase letter.";

// const googleConfigured = Boolean(
//   process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET,
// );

// const githubConfigured = Boolean(
//   process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET,
// );

// export const auth = betterAuth({
//   appName: "Utsho",
//   baseURL:
//     process.env.BETTER_AUTH_URL ||
//     process.env.NEXT_PUBLIC_APP_URL ||
//   secret: process.env.BETTER_AUTH_SECRET,

//   database: mongodbAdapter(db, {
//     client: mongoClient,
//     // Works with both standalone MongoDB and Atlas replica sets. Flip this to
//     // `true` if your deployment needs multi-document transactions.
//     transaction: false,
//   }),

//   emailAndPassword: {
//     enabled: true,
//     autoSignIn: true,
//     minPasswordLength: 6,
//     maxPasswordLength: 64,
//   },

//   socialProviders: {
//     ...(googleConfigured
//       ? {
//           google: {
//             clientId: process.env.GOOGLE_CLIENT_ID,
//             clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//           },
//         }
//       : {}),
//     ...(githubConfigured
//       ? {
//           github: {
//             clientId: process.env.GITHUB_CLIENT_ID,
//             clientSecret: process.env.GITHUB_CLIENT_SECRET,
//           },
//         }
//       : {}),
//   },

//   session: {
//     expiresIn: 60 * 60 * 24 * 7,
//     updateAge: 60 * 60 * 24,
//   },

//   user: {
//     changeEmail: {
//       enabled: false,
//     },
//     deleteUser: {
//       enabled: false,
//     },
//   },

//   // The UI validates these rules too; this keeps the API honest if someone
//   // posts straight to `/api/auth/sign-up/email`.
//   hooks: {
//     before: createAuthMiddleware(async (ctx) => {
//       if (ctx.path !== "/sign-up/email") return;

//       const password =
//         typeof ctx.body?.password === "string" ? ctx.body.password : "";

//       if (
//         password.length < 6 ||
//         !/[A-Z]/.test(password) ||
//         !/[a-z]/.test(password)
//       ) {
//         throw new APIError("BAD_REQUEST", { message: PASSWORD_RULE });
//       }
//     }),
//   },

//   advanced: {
//     database: {
//       generateId: false,
//     },
//   },

//   plugins: [nextCookies()],
// });


import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { jwt } from "better-auth/plugins"

const client = new MongoClient(process.env.MONGODB_URL);
const db = client.db("MongoClient");

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client,
  }),
  emailAndPassword: {
    enabled: true,
  },
  plugins: [jwt()],
  session: {
    cookieCatch: {
      enabled: true,
      strategy: "jwt",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    }
  }
});
