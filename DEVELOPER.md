# Ampliforge — Developer & Agent Reference

> **Read this first.** This document is the single source of truth for any developer or AI coding agent working on this repo. It covers what the product is, how it's built, what's done, what's in progress, and the exact conventions to follow.

> **Platform build plan:** See [`docs/`](./docs/README.md) for the audited current state, unified roadmap (enterprise UI → Phase 3 harden → platform kit/visuals), and [API directory](./docs/API-DIRECTORY.md) (LIVE / PLANNED / DEFER). Do not treat the long-form vision inventory as a sprint backlog without those status tags.

---

## What Is Ampliforge?

Ampliforge is a **YouTube content repurposing SaaS**. A creator pastes a YouTube URL, and the app:

1. Fetches the video metadata (title, thumbnail, channel, duration)
2. Transcribes the audio (via Deepgram or YouTube's own captions as fallback)
3. Extracts key insights from the transcript
4. Generates repurposed content using Claude (primary) or OpenAI (fallback):
   - LinkedIn authority post
   - Twitter/X thread
   - Email newsletter snippet
   - Scroll-stopping hook
   - Episode summary
   - Instagram carousel (slides)
   - Social caption

Creators get a full week of content from a single video in under 2 minutes.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4 |
| UI Components | Radix UI + shadcn/ui patterns |
| Animation | Framer Motion |
| Auth | Clerk (with webhook sync to Supabase) |
| Database | Supabase (PostgreSQL + RLS) |
| ORM | Supabase JS client (typed) |
| AI – Primary | Anthropic Claude (`claude-sonnet-4-6`) |
| AI – Fallback | OpenAI (`gpt-4o-mini`) |
| Transcription | Deepgram (YouTube captions as fallback) |
| State | Zustand (client), TanStack Query (server) |
| Charts | Recharts |
| Payments | Stripe (subscriptions + credit top-ups) |
| Email | Resend (transactional) |
| Error Tracking | Sentry |
| Package Manager | pnpm |

---

## Repository Structure

```
ampliforge/
├── app/
│   ├── (auth)/                    # Clerk auth pages: sign-in, sign-up, forgot-password
│   ├── (dashboard)/               # Protected app pages (require login)
│   │   ├── dashboard/             # Home dashboard — stats, recent projects, AI bar
│   │   ├── projects/              # Project list + [id] project detail
│   │   ├── library/               # All generated content items across projects
│   │   ├── templates/             # Public template marketplace
│   │   ├── analytics/             # Usage charts and engagement stats
│   │   ├── settings/              # Profile, notifications, connected accounts
│   │   └── upgrade/               # Plan comparison + Stripe checkout
│   ├── (marketing)/               # Public landing page (hero, pricing, testimonials)
│   └── api/
│       ├── v1/                    # Public API routes (projects CRUD, status polling)
│       ├── internal/              # Internal job trigger (protected by INTERNAL_JOB_SECRET)
│       └── webhooks/clerk/        # Clerk → Supabase user sync
├── components/
│   ├── dashboard/                 # Dashboard UI components
│   ├── landing/                   # Marketing page sections
│   ├── shared/                    # Logo, theme toggle, etc.
│   └── ui/                        # Radix-based primitives (Button, Card, Input, etc.)
├── lib/
│   ├── pipeline/                  # Core processing pipeline (fetch → transcribe → generate)
│   ├── data/                      # Server-side data fetchers (one file per domain)
│   ├── supabase/                  # DB clients (admin, server, client) + types
│   ├── api/                       # Auth helpers (requireUserId, ensureUser)
│   ├── hooks/                     # React hooks (useAiProcessing, useMounted)
│   ├── store/                     # Zustand stores (app-store, ui-store, project-store)
│   ├── seed/                      # Demo project seeder for new users
│   ├── animations.ts              # Framer Motion presets
│   ├── constants.ts               # App-wide constants
│   ├── mock-data.ts               # Pricing tiers, mock activity (being migrated to DB)
│   └── utils.ts                   # cn(), formatNumber()
├── store/                         # Re-exports from lib/store (Zustand)
├── hooks/                         # Re-exports from lib/hooks
├── types/                         # Public-facing app types (index.ts)
├── supabase/
│   └── migrations/                # SQL migration files (run in order)
├── middleware.ts                  # Clerk auth middleware — protects dashboard routes
├── DEVELOPER.md                   # This file
└── AGENTS.md                      # AI agent rules (Next.js version warnings)
```

---

## Environment Variables

Copy `.env.example` to `.env.local` and fill in all values.

```bash
# Clerk — https://clerk.com/dashboard
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/dashboard
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/dashboard
CLERK_WEBHOOK_SIGNING_SECRET=          # From Clerk Dashboard → Webhooks

# Supabase — https://supabase.com/dashboard
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=             # SERVER-ONLY. Never expose to client.

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
INTERNAL_JOB_SECRET=                   # Any random string. Protects /api/internal/*

# AI — Primary
ANTHROPIC_API_KEY=                     # https://console.anthropic.com

# AI — Fallback
OPENAI_API_KEY=                        # https://platform.openai.com

# Transcription
DEEPGRAM_API_KEY=                      # https://console.deepgram.com

# Payments
STRIPE_SECRET_KEY=                     # https://dashboard.stripe.com
STRIPE_WEBHOOK_SECRET=                 # From Stripe Dashboard → Webhooks
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=

# Email
RESEND_API_KEY=                        # https://resend.com/api-keys

# Error tracking
SENTRY_DSN=                            # https://sentry.io
NEXT_PUBLIC_SENTRY_DSN=
```

---

## Database

Supabase PostgreSQL. Run migrations in order:

```bash
# If using Supabase CLI:
supabase db push

# Or paste into Supabase SQL editor:
# supabase/migrations/0001_init.sql
# supabase/migrations/0002_processing_transcripts.sql
```

### Tables

| Table | Purpose |
|---|---|
| `users` | Clerk-synced user records with plan + credits |
| `projects` | Each repurposing job (YouTube URL → content) |
| `content_items` | Generated content pieces (7 types per project) |
| `project_transcripts` | Raw transcript segments + full text |
| `processing_jobs` | Real-time processing state (step, ETA, error) |
| `analytics_daily` | Per-user daily content generation stats |
| `templates` | Public template marketplace |
| `testimonials` | Marketing page testimonials |
| `blog_posts` | Blog/content hub |
| `jobs` | Careers page |
| `team_members` | About page |
| `changelog_entries` | Product changelog |

All user-owned tables have Row Level Security (RLS) enabled. Reads/writes outside the service-role client require the user to be authenticated.

---

## Processing Pipeline

The core value of the app lives in `lib/pipeline/`. When a user submits a YouTube URL:

```
POST /api/v1/projects
  → creates DB project record
  → deducts credits
  → calls enqueueProjectProcessing()
      → in production: POST /api/internal/process-project (background)
      → in dev: runs inline (no background worker)

processProject() steps:
  1. fetch      — fetchSourceMetadata() → YouTube oEmbed + fallback
  2. transcribe — transcribeSource() → Deepgram → YouTube captions fallback
  3. insights   — (currently a stub; will extract key insights from transcript)
  4. generate   — generateContent() → Claude → OpenAI → template fallback
  5. finalize   — mark project done, upsert analytics_daily

Client polls GET /api/v1/projects/[id]/status every 2s via useAiProcessing() hook.
On completion, redirects to /projects/[id].
```

### Content Generation (`lib/pipeline/generate-content.ts`)

Priority order:
1. **Claude** (`claude-sonnet-4-6`) — primary, best quality
2. **OpenAI** (`gpt-4o-mini`) — fallback if Claude fails or key missing
3. **Template** — hardcoded string templates, last resort

Generates these content types: `linkedin`, `email`, `thread`, `hook`, `summary`, `carousel`, `caption`

---

## Auth Flow

1. User signs up via Clerk (`/sign-up`)
2. Clerk fires `user.created` webhook → `/api/webhooks/clerk` → inserts row into `users` table
3. All dashboard routes protected by `middleware.ts` (Clerk `clerkMiddleware`)
4. Server components call `auth()` from `@clerk/nextjs/server` to get `userId`
5. API routes call `requireUserId()` from `lib/api/auth.ts`

**Important:** The `users` table in Supabase uses the Clerk `userId` as the primary key. Never use Supabase Auth — Clerk is the sole auth provider.

---

## Credit System

- Each project creation costs `CREDITS_PER_PROJECT = 500` credits
- Users start with credits based on plan tier (starter: 5,000 / pro: 50,000 / agency: unlimited)
- Credits are deducted atomically in `POST /api/v1/projects` before processing starts
- Users buy more credits or upgrade plan via Stripe (`/upgrade` page)
- Credits state is kept in `useAppStore` (Zustand) and synced from DB on dashboard load

---

## Stripe / Payments

- Plans: `starter` (free), `pro` ($49/mo), `agency` ($149/mo)
- Credit top-ups available as one-time purchases
- Stripe webhooks sync subscription state back to `users.plan` and `users.credits_limit`
- Webhook endpoint: `/api/webhooks/stripe`

---

## Email (Resend)

Transactional emails sent via Resend:
- **Welcome** — fires on `user.created` Clerk webhook
- **Project complete** — fires after `finishProcessingJob()`
- **Low credits warning** — fires when credits fall below 10% of limit
- **Plan upgrade confirmation** — fires on Stripe `customer.subscription.updated`

Templates live in `lib/email/index.ts` as inline HTML strings (no React Email dep required). All senders gracefully degrade to a console warning if `RESEND_API_KEY` is not set — the app never crashes on missing email config.

**Rate limiting** (`lib/rate-limit.ts`)
Upstash Redis sliding-window limits applied in middleware for all `/api/v1/*` routes:
- General tier: 60 requests/minute per user (or IP for unauthenticated)
- AI tier: 10 requests/minute — applies to processing + regeneration routes
- Gracefully skipped (all requests pass) if `UPSTASH_REDIS_REST_URL` is not configured.

---

## Build Phases

### Phase 1 — Core gaps (MVP-complete) ✅ Done
- [x] Core pipeline (YouTube → transcript → AI → content)
- [x] Auth (Clerk + Supabase sync)
- [x] Dashboard shell, project list, project detail
- [x] Landing page
- [x] /library page
- [x] /templates page
- [x] /analytics page
- [x] /settings page
- [x] /upgrade page
- [x] Forgot password (Clerk `reset_password_email_code` flow)
- [x] Carousel + caption generation

### Phase 2 — Sellable ✅ Done
- [x] Stripe integration (subscription Checkout + webhooks; **credit top-ups & Customer Portal → Phase 3 / docs E3**)
- [x] Export/download endpoint (`GET /api/v1/projects/[id]/export`)
- [x] Regenerate content endpoint (`POST /api/v1/projects/[id]/content/[contentId]/regenerate`)
- [x] Rate limiting — Upstash Redis sliding window (60 req/min general, 10 req/min AI routes)
- [x] Resend email integration (welcome, project-complete, low-credits warning)

### Phase 3 — Enterprise 🔄 In progress
- [x] Claude `claude-opus-4-8` as primary AI (OpenAI `gpt-4o-mini` fallback, template last resort)
- [ ] Sentry error monitoring
- [ ] Real activity feed (DB-backed)
- [ ] Brand voice training
- [ ] Team workspaces
- [ ] Admin dashboard
- [ ] Stripe Customer Portal + credit top-up Checkout
- [ ] Merge enterprise UI track (`docs/ENTERPRISE-UI.md` — tokens, onboarding, carousel tab)

> Full sequencing (E0–E3, P0–P8), acceptance checklists, and API adoption: [`docs/ROADMAP.md`](./docs/ROADMAP.md).

---

## Coding Conventions

- **Server components by default.** Only add `"use client"` when you need interactivity, browser APIs, or hooks.
- **Data fetching in `lib/data/`** — one file per domain, server-only, uses admin client.
- **Never import `lib/supabase/admin.ts` in client code.** It holds the service role key.
- **Types in `lib/supabase/types.ts`** — update this file whenever you change the DB schema.
- **No comments** unless the WHY is non-obvious. Well-named identifiers are self-documenting.
- **Tailwind CSS v4** — use CSS variables (`var(--brand-blue)`) defined in `app/globals.css` for brand colors, not hardcoded hex values.
- **`cn()` from `lib/utils`** for all className merging.
- **`formatNumber()` from `lib/utils`** for displaying numbers (credits, counts).
- **Framer Motion** — use presets from `lib/animations.ts` (`fadeUp`, `staggerContainer`) for consistency.

---

## Running Locally

```bash
# Install dependencies
pnpm install

# Start dev server
pnpm dev

# Open http://localhost:3000
```

Ensure `.env.local` is populated. The app will start without most API keys but processing will fall back to templates and some features will be disabled.

---

## Deployment

Designed for **Vercel**. Environment variables must be set in the Vercel project dashboard.

For the Clerk webhook to work in production:
1. Go to Clerk Dashboard → Webhooks → Add Endpoint
2. URL: `https://your-domain.com/api/webhooks/clerk`
3. Events: `user.created`, `user.updated`, `user.deleted`
4. Copy the signing secret → `CLERK_WEBHOOK_SIGNING_SECRET`

For Stripe webhooks:
1. Stripe Dashboard → Webhooks → Add Endpoint
2. URL: `https://your-domain.com/api/webhooks/stripe`
3. Events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`
4. Copy signing secret → `STRIPE_WEBHOOK_SECRET`

---

## Key Files Quick Reference

| What you want to change | File |
|---|---|
| AI content generation logic | `lib/pipeline/generate-content.ts` |
| Processing pipeline steps | `lib/pipeline/process-project.ts` |
| Content types generated | `lib/pipeline/constants.ts` → `DEFAULT_OUTPUT_TYPES` |
| DB types | `lib/supabase/types.ts` |
| Auth middleware | `middleware.ts` |
| Sidebar navigation | `components/dashboard/sidebar.tsx` |
| Dashboard home | `components/dashboard/dashboard-shell.tsx` |
| Project creation API | `app/api/v1/projects/route.ts` |
| Clerk webhook handler | `app/api/webhooks/clerk/route.ts` |
| Credits per project | `lib/pipeline/constants.ts` → `CREDITS_PER_PROJECT` |
| Plan tiers + pricing | `lib/mock-data.ts` → `PRICING_TIERS` |
