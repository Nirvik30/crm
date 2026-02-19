# AI Context — apps/web

Authoritative context for AI assistants (Claude, GitHub Copilot, etc.).
Do not contradict this file without explicit user instruction.

---

## Monorepo Structure

- **Monorepo tool:** Turborepo + pnpm workspaces
- **Workspace root:** `/crm`
- **Web application:** `apps/web`
- **Shared UI package:** `packages/ui`
- **Shared ESLint config:** `packages/eslint-config`
- **Shared TypeScript config:** `packages/typescript-config`

---

## Web App (`apps/web`)

- **Framework:** Next.js 16 with App Router
- **Language:** TypeScript
- **Package manager:** pnpm
- **Dev server runs from:** `apps/web` (not the monorepo root)
- **No `src/` directory.** All source files live directly under `apps/web/`:
  - `app/` — routes and layouts (App Router)
  - `components/` — app-specific components
  - `hooks/` — app-specific hooks
  - `lib/` — utility modules (e.g. Supabase clients)

---

## Routing

- App Router is used exclusively. No Pages Router.
- Route groups use parenthesized folders, e.g. `app/(auth)/`.
- All pages and layouts follow Next.js App Router conventions.

---

## Styling

- **Tailwind CSS v4** via `@tailwindcss/postcss`
- **Global CSS:** `packages/ui/src/styles/globals.css`
- **CSS variables:** enabled
- **Base color:** neutral
- Do not add a separate `tailwind.config.ts` in `apps/web`; Tailwind is configured via PostCSS.

---

## shadcn/ui

- shadcn/ui is installed and configured in `apps/web/components.json`.
- Style: `radix-nova`
- Components resolve to `@workspace/ui/components/<component-name>`
- Utilities resolve to `@workspace/ui/lib/utils`
- When importing shadcn/ui components, always use the `@workspace/ui/components/` path, not `@/components/ui/`.
- Icons use `lucide-react`.

---

## Supabase

- **Package:** `@supabase/supabase-js` v2 (`^2.97.0`)
- **Client (browser):** `apps/web/lib/supabase/client.ts` — module-level singleton via `createClient`
- **Server:** `apps/web/lib/supabase/server.ts` — function `createServerClient()` returning a new client per call
- Both clients use `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- The anon key is intentionally public and safe to expose; it is protected by Supabase Row Level Security (RLS)
- Do not use `@supabase/auth-helpers-nextjs` or `@supabase/ssr` unless explicitly introduced

---

## Environment Variables

- **Location:** `apps/web/.env.local`
- The dev server runs from `apps/web`, so `.env.local` at that path is the correct and only location
- Do not suggest moving, duplicating, or symlinking env files to the monorepo root
- **Client-safe vars** (accessible in browser): must be prefixed `NEXT_PUBLIC_`
- **Server-only vars** (never sent to browser): no prefix

### Current variables

| Variable | Prefix | Used in |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `NEXT_PUBLIC_` | Client + Server |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `NEXT_PUBLIC_` | Client + Server |

### Future variables (do not add until required)

| Variable | Prefix | Purpose |
|---|---|---|
| `GOOGLE_CLIENT_ID` | none | Server-side only, if needed directly |

---

## OAuth (Google)

- Google OAuth credentials (Client ID, Client Secret) are configured in the **Supabase dashboard** only:
  `Authentication → Providers → Google`
- These secrets are never stored in `.env.local` or exposed to the frontend
- The app initiates OAuth via `supabase.auth.signInWithOAuth({ provider: 'google' })`; Supabase handles the exchange

---

## Hard Rules

1. Do not add a `src/` directory to `apps/web`.
2. Do not import shadcn/ui from `@/components/ui/` — always use `@workspace/ui/components/`.
3. Do not move or duplicate `.env.local` outside of `apps/web`.
4. Do not use deprecated Supabase APIs (e.g. `supabase.auth.session()`, `supabase.auth.user()`).
5. Do not introduce `@supabase/auth-helpers-nextjs` or `@supabase/ssr` without explicit instruction.
6. Do not use the Pages Router. All routing is App Router only.
7. Do not store OAuth provider secrets in env files — they belong in the Supabase dashboard.
8. Do not create a `tailwind.config.ts` in `apps/web`; Tailwind is configured via PostCSS only.
