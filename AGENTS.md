<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Utsho

Community-service event platform for Dhaka neighbourhoods. Next.js App Router, JavaScript (no TypeScript), Tailwind v4, Base UI through shadcn.

## Commands

- `npm run dev` — dev server on port 3000. Next 16 records the running server in `.next/dev/lock`; if one is already running, reuse it instead of starting a second.
- `npm run lint` — ESLint 9 flat config using `eslint-config-next/core-web-vitals`. No formatter is configured.
- `npm run build` — the only full verification. There is no test suite or typechecker.
- Add UI primitives with `npx shadcn@latest add <name>` (`components.json` is configured for the `base-nova` style with `tsx: false`).

## Framework gotchas

- `cacheComponents`, `partialPrefetching`, and `reactCompiler` are enabled in `next.config.mjs`. Uncached/request-time data used during prerender throws. `new Date()` is wrapped in an async `"use cache"` component in `src/components/layout/footer.jsx` — follow that pattern, or put dynamic UI under `<Suspense>`.
- Read the version-matched docs in `node_modules/next/dist/docs/` before using Next APIs; this version differs from training data. Keep the managed block at the top of this file intact.
- `cn` comes from the `cn` npm package, re-exported by `@/lib/utils`. There is no clsx/tailwind-merge setup; import it from `@/lib/utils`.
- `@/*` maps to `src/*` (`jsconfig.json`). Components are `.jsx`; routes are `page.js`.

## Design system

- Brand is **Utsho** (উৎস), tagline "Community service, close to home." Copy is Dhaka-specific and real — never add Lorem ipsum.
- Theme tokens live in `src/app/globals.css` (`:root`, `.dark`, `@theme inline`). Use semantic utilities (`bg-background`, `text-muted-foreground`, `border-border`, `bg-primary`, `text-accent`) instead of raw colors.
- Headings use Fraunces through `font-heading`; body is Plus Jakarta Sans. `h1`–`h3` already inherit `font-heading` from the base layer.
- Dark mode is the `.dark` class. It is custom, not `next-themes`: `src/lib/theme.js` holds the blocking script and the `utsho-theme` storage key, and `theme-provider.jsx` owns state. Change both together.
- Mobile-first responsive layout. Desktop nav appears at `lg`; `mobile-nav.jsx` is the drawer below that.

## App structure

- `src/app/layout.js` — fonts, metadata, blocking theme script, then `ThemeProvider` → `AuthProvider` → `Navbar` / `main` / `Footer`.
- `src/lib/site.js` — site name, nav links, socials, and `eventTypes`. Add new nav links there.
- `src/components/layout/` — navbar, mobile drawer, user menu, footer, logo, theme toggle.
- `src/components/home/hero.jsx` — hero and "How it works". Home sections still missing: features, recent events, gallery, newsletter.
- `/login`, `/register`, `/events`, `/events/create`, `/events/manage`, `/events/joined` are **placeholders** built with `placeholder-page.jsx`; replace them with real features.

## Auth and data (not wired yet)

- `src/components/providers/auth-provider.jsx` is a stub exposing `user`, `isPending`, `setUser`, `signOut`. The navbar, drawer, and user menu all read from `useAuth()`; replace its internals with BetterAuth rather than adding a second context.
- No Express, MongoDB, or BetterAuth code or dependencies exist yet. Do not import packages missing from `package.json`.
- `/events/create`, `/events/manage`, and `/events/joined` are meant to require a signed-in user.

## UI conventions

- Never use `alert()` or `confirm()` for validation or success. Use inline messages, toasts, or dialog UI.
- Images use `next/image` with `fill` + `sizes`; `remotePatterns` allows any HTTPS host. Hero images use Pexels URLs through the local `photo()` helper.
- Icons come from `lucide-react`, which has no brand icons. Social SVGs live in `src/components/icons/social-icons.jsx`.
- Preserve focus-visible rings, `aria-current`, and `sr-only` labels when editing nav or menu code.
