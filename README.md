# Utsho — Community service, close to home

Community-service event platform for Dhaka neighbourhoods. Next.js App Router
(JavaScript), Tailwind v4 and shadcn (Base UI) on the front end; BetterAuth,
Express and MongoDB on the auth server.

## Run it

This project has **two** apps and both have to be running.

**1. Auth server** (`../social-development-events-server`)

```bash
cd ../social-development-events-server
npm install
cp .env.example .env    # add MONGODB_URL and BETTER_AUTH_SECRET
npm start               # http://localhost:8000
```

**2. This app**

```bash
npm install
cp .env.example .env.local   # sets AUTH_SERVER_URL=http://localhost:8000
npm run dev                  # http://localhost:3000
```

Open <http://localhost:3000>. The navbar's **Login** button goes to `/login`.

> Auth requests go to `/api/auth/*` on this app and are proxied to the Express
> server, so the session cookie stays on this origin. If the Express server is
> not running, sign-in shows a friendly "auth server is offline" message.

## Authentication

- **Login** — email + password, plus Google and GitHub.
- **Register** — name, email, photo URL (optional) and password.
- **Password rule** — at least 6 characters with one uppercase and one lowercase
  letter. Enforced in the form and again on the server.
- Inline field errors + toasts on failure, a success toast after login/register.
- No email verification and no forgot-password flow, as the brief requires.
- Google login needs `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` on the auth
  server. Redirect URI: `http://localhost:3000/api/auth/callback/google`.
  GitHub uses `/api/auth/callback/github` with `GITHUB_CLIENT_ID` /
  `GITHUB_CLIENT_SECRET`.

Put those values in **`social-development-events-server/.env`** — that is the
process that talks to the providers. Both buttons stay visible either way.

Google credentials can be created at
<https://console.cloud.google.com/apis/credentials>. Until they exist the social
buttons show a clear "provider is not configured" toast instead of failing
silently.

## Commands

- `npm run dev` — dev server on port 3000 (a second instance is blocked; reuse
  the running one).
- `npm run lint` — ESLint 9 flat config.
- `npm run build` — the only full verification (no test suite).
- `npx shadcn@latest add <name>` — add UI primitives (`base-nova`, `tsx: false`).

## Design

Brand tokens live in `src/app/globals.css`: deep teal `--primary`, warm
`--accent`, cream `--background`, with a matching `.dark` set. Use semantic
utilities (`bg-card`, `text-muted-foreground`, `border-border`) — never raw
colours. Headings use Fraunces (`font-heading`), body text Plus Jakarta Sans.

Auth forms are customised shadcn primitives: `Field`, `Input`, `InputGroup`,
`Label`, `Button`, `Card`, `Alert` and `Separator`, styled to the site's 44px
control height, rounded corners and accent-topped cards.
