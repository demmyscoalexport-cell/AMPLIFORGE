<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

---

# Ampliforge — AI Agent Context

**Read DEVELOPER.md first.** It contains the full architecture, stack, DB schema, pipeline explanation, and coding conventions. This file adds agent-specific rules on top of that.

## What this app does
YouTube content repurposing SaaS. User pastes a YouTube URL → app transcribes + generates LinkedIn posts, threads, emails, hooks, summaries, carousels, and captions using Claude AI.

## Agent Rules

### Always follow these
1. **Read DEVELOPER.md** before writing any code. It explains the architecture.
2. **Server components by default.** Add `"use client"` only when needed.
3. **Never import `lib/supabase/admin.ts` in client components.** It holds the service role key and is server-only.
4. **Use `auth()` from `@clerk/nextjs/server`** in server components/API routes. Use `useAuth()` from `@clerk/nextjs` in client components.
5. **CSS variables, not hex.** Use `var(--brand-blue)`, `var(--text-muted)`, etc. from `app/globals.css`.
6. **`cn()` for classNames.** Always import from `@/lib/utils`.
7. **No new dependencies without checking** if an existing one covers the need (Radix UI, Framer Motion, Zustand, Recharts, TanStack Query are all installed).
8. **Types first.** If you add a DB table or column, update `lib/supabase/types.ts`.

### Data fetching pattern
```ts
// Server component data fetch — always in lib/data/
import "server-only";
import { auth } from "@clerk/nextjs/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export async function getMyData() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthenticated");
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase.from("table").select("*").eq("user_id", userId);
  if (error) throw error;
  return data ?? [];
}
```

### API route pattern
```ts
// app/api/v1/something/route.ts
import { requireUserId } from "@/lib/api/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";

export async function GET() {
  const userId = await requireUserId();
  const supabase = createSupabaseAdminClient();
  // ... fetch and return
  return NextResponse.json({ data });
}
```

### Build Phase Reference
See `DEVELOPER.md` → **Build Phases** for what's done vs. pending. Do not rebuild what's already done. Check `lib/data/` before writing new data fetchers — the function you need probably already exists.

### Content types
The 7 content types the app generates: `linkedin`, `email`, `thread`, `hook`, `summary`, `carousel`, `caption`. All defined in `lib/supabase/types.ts` → `ContentType`.

### Processing pipeline
Do not modify `lib/pipeline/process-project.ts` without understanding the full 5-step flow. Each step updates `processing_jobs` table in real-time so the client can poll status. Breaking this breaks the real-time UX.

### Credit system
Credits are deducted in `POST /api/v1/projects` before processing. `CREDITS_PER_PROJECT = 500`. Never skip credit deduction.

## Cursor Cloud specific instructions

Standard commands live in `DEVELOPER.md` / `package.json`: `pnpm dev` (port 3000), `pnpm build`, `pnpm lint`. The update script already runs `pnpm install`. Notes below are the non-obvious things needed to actually run and test this app in the cloud VM.

- **Package manager / pnpm:** Use the base-image `pnpm` (10.x). Do not `corepack enable` — that swaps in pnpm 11, whose strict pre-run deps check fails on the un-approved `@clerk/shared` build script. `pnpm install` prints an `ERR_PNPM_IGNORED_BUILDS` warning (for `@clerk/shared`, `sharp`, `unrs-resolver`) but still exits 0; that warning is expected and harmless.

- **Auth = Clerk keyless dev mode.** With no `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` / `CLERK_SECRET_KEY` set, Clerk auto-provisions a temporary dev instance **in the browser on first page load** (needs outbound egress to `clerk.com`; keys are cached in `.clerk/.tmp/keyless.json`). Consequences:
  - Test only in a real browser. `curl`/server-side hits to protected routes (`/dashboard`, `/projects`, …) without a browser keyless session throw `@clerk/backend: Missing publishableKey` and 500 — this is expected, not a bug.
  - To sign up, use a Clerk **test email** with the `+clerk_test` subaddress (e.g. `ampli+clerk_test@example.com`) and the fixed verification code **`424242`**. Plain emails trigger real email delivery you can't receive.
  - For a non-keyless setup, put real Clerk keys in `.env.local`.

- **Database = local Supabase (Docker).** The app talks to Supabase via `@supabase/supabase-js`, so a real Supabase API is required (plain Postgres won't do). Bring it up with the Supabase CLI: `supabase start` (from repo root; it reads `supabase/config.toml`, applies `supabase/migrations/*`, and loads `supabase/seed.sql`). Requires the Docker daemon running. Put the printed `API_URL`/`ANON_KEY`/`SERVICE_ROLE_KEY` into `.env.local` as `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` / `SUPABASE_SERVICE_ROLE_KEY`.
  - **Critical gotcha:** the repo migrations enable RLS + policies but never `GRANT` table privileges to the Supabase roles. Hosted Supabase grants these by default; **local does not**, so the pipeline's writes and the dashboard/detail reads fail with `permission denied for table ...`. After `supabase start`, run these grants once:
    ```sh
    docker exec -i supabase_db_workspace psql -U postgres -d postgres <<'SQL'
    grant usage on schema public to anon, authenticated, service_role;
    grant all privileges on all tables in schema public to service_role;
    grant all privileges on all sequences in schema public to service_role;
    grant select on all tables in schema public to anon, authenticated;
    alter default privileges in schema public grant all on tables to service_role;
    alter default privileges in schema public grant all on sequences to service_role;
    alter default privileges in schema public grant select on tables to anon, authenticated;
    SQL
    ```

- **`pnpm build` needs a Stripe key placeholder.** `lib/stripe.ts` constructs the Stripe client at module load, so `next build` throws `Neither apiKey nor config.authenticator provided` when `STRIPE_SECRET_KEY` is empty. Set any non-empty placeholder (e.g. `STRIPE_SECRET_KEY=sk_test_placeholder`) in `.env.local` for builds. `pnpm dev` does not need it (that route is only evaluated when hit).

- **Missing AI / transcription keys are fine for dev.** With no `ANTHROPIC_API_KEY`/`OPENAI_API_KEY`, content generation falls back to built-in templates; with no `DEEPGRAM_API_KEY`, transcription falls back to YouTube captions and then a canned "preview transcript". The full pipeline (`POST /api/v1/projects` → processes inline in dev → `done`) still completes and produces all 7 content items — the text is just placeholder until real keys are provided.

- **Hello-world sanity check:** sign up (see above) → `/dashboard` → paste a YouTube URL in the "AmpliForge AI" bar → "Analyze Content" → open the project under `/projects/[id]` to see the generated content tabs.
