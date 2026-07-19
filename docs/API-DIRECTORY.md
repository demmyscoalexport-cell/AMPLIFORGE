# API Directory & Adoption Plan

Master inventory of third-party services, internal Ampliforge routes, and npm packages — **tagged against the live enterprise build** (`main` + design-system branch).

Status legend:

| Tag | Meaning |
|-----|---------|
| ✅ LIVE | Wired in repo today |
| 🟡 PARTIAL | Present but incomplete / env-gated / stubbed |
| ⬜ PLANNED | Adopt in a named roadmap phase |
| ❌ DEFER | Out of scope until later; do not install yet |
| 🔀 REPLACE | Vision name differs from adopted Ampliforge path — keep existing |

**Planning rule:** Prefer extending `/api/v1/projects/*` (current domain model) over inventing a parallel `/api/v1/content/*` namespace until a deliberate v2 migration. New domains (brands, visuals, calendar) get new prefixes.

---

## 1. Critical path (minimum platform)

| # | Service | Status | Where / notes |
|---|---------|--------|---------------|
| 1 | Clerk Auth | ✅ LIVE | `@clerk/nextjs`, middleware, sign-in/up |
| 2 | Clerk Webhooks | ✅ LIVE | `/api/webhooks/clerk` (not `/api/v1/auth/webhook/clerk`) |
| 3 | Claude (Anthropic) | ✅ LIVE | `claude-opus-4-8` in `generate-content.ts` |
| 4 | OpenAI Chat | ✅ LIVE | Fallback `gpt-4o-mini` |
| 6 | Deepgram Nova-2 | ✅ LIVE | `transcribe.ts` |
| — | YouTube captions fallback | ✅ LIVE | `youtube-transcript` (no YouTube Data API key yet) |
| 13 | YouTube Data API v3 | ⬜ PLANNED | Phase P0/P1 — duration, channel brand, better metadata |
| 37–38 | Supabase DB + Storage | 🟡 PARTIAL | DB ✅; Storage not used yet (visuals Phase P3) |
| 31–34 | Stripe + Checkout + Webhooks | 🟡 PARTIAL | Checkout + webhook ✅; Portal / Tax / top-ups ⬜ |
| 46 | Upstash Redis | ✅ LIVE | Rate limit (AI matcher needs fix) |
| 27 | Resend | ✅ LIVE | Welcome, project-complete, low-credits |
| 47 | Sentry | ⬜ PLANNED | Phase E3 / DEVELOPER Phase 3 |

---

## 2. Section A — Third-party external APIs

### A1. Auth

| # | API | Status | Phase |
|---|-----|--------|-------|
| 1 | Clerk Authentication | ✅ LIVE | — |
| 2 | Clerk Webhooks | ✅ LIVE | — |

### A2. AI & ML

| # | API | Status | Phase |
|---|-----|--------|-------|
| 3 | Claude Messages | ✅ LIVE | — |
| 4 | OpenAI Chat Completions | ✅ LIVE | — |
| 5 | OpenAI Vision (thumbnails) | ⬜ PLANNED | P1 insights enhancement |
| 6 | Deepgram Nova-2 | ✅ LIVE | — |
| 7 | OpenAI Whisper | ❌ DEFER | Captions + Deepgram enough; add if failure rate rises |
| 8 | AssemblyAI | ❌ DEFER | Tertiary only |
| 9 | Stability AI | ❌ DEFER | After Satori templates proven (P3+) |
| 10 | DALL·E 3 | ❌ DEFER | Same |
| 11 | Pinecone | ❌ DEFER | RAG / similarity post P5 learning loop |
| 12 | OpenAI Embeddings | ❌ DEFER | With Pinecone |

### A3. YouTube & video

| # | API | Status | Phase |
|---|-----|--------|-------|
| 13 | YouTube Data API v3 | ⬜ PLANNED | P0 metadata + brand extract |
| 14 | YouTube IFrame Player | ⬜ PLANNED | E2 / UX — replace thumbnail stub |
| 15 | yt-dlp self-hosted | ❌ DEFER | Prefer Deepgram URL ingest + captions; only if audio extraction required |

### A4. Social publish

All ❌ DEFER until Phase P6 (calendar) + P7 (integrations). Prefer export + Zapier webhook before native OAuth.

| # | API | Phase when adopted |
|---|-----|--------------------|
| 16–17 | LinkedIn Marketing + OAuth | P7 |
| 18–19 | Twitter/X API + OAuth | P7 |
| 20–21 | Instagram Graph + Facebook OAuth | P7 |
| 22–23 | TikTok | P8+ optional |
| 24–25 | Buffer / Hootsuite | ❌ DEFER — optional partner path |

### A5. Email & marketing

| # | API | Status | Phase |
|---|-----|--------|-------|
| 26 | SendGrid | ❌ DEFER | Resend is chosen |
| 27 | Resend | ✅ LIVE | Extend: plan-upgrade email E3 |
| 28–30 | ConvertKit / Mailchimp / Substack | ❌ DEFER | Integrations optional P8 |

### A6. Payments

| # | API | Status | Phase |
|---|-----|--------|-------|
| 31 | Stripe Payments | ✅ LIVE | — |
| 32 | Stripe Checkout | ✅ LIVE | `/api/v1/billing/checkout` |
| 33 | Stripe Customer Portal | ⬜ PLANNED | E3 billing polish |
| 34 | Stripe Webhooks | ✅ LIVE | `/api/webhooks/stripe` |
| 35 | Stripe Tax | ❌ DEFER | Enterprise compliance later |
| 36 | Stripe Invoices | 🟡 PARTIAL | Via Stripe Dashboard; API later if needed |
| — | Credit top-up Checkout (`mode: payment`) | ⬜ PLANNED | E3 — documented as done, **not built** |

### A7. Storage & media

| # | API | Status | Phase |
|---|-----|--------|-------|
| 37 | Supabase Storage | ⬜ PLANNED | P3 visuals |
| 38 | Supabase REST/Realtime | ✅ LIVE | JS client; Realtime optional later |
| 39–40 | Imgix / Cloudinary | ❌ DEFER | Start with signed Supabase URLs |
| 41–42 | S3 / R2 | ❌ DEFER | Only if Storage limits hit |

### A8. Edge & cache

| # | API | Status | Phase |
|---|-----|--------|-------|
| 43–45 | Vercel Edge Config / CF Workers | ❌ DEFER | Feature flags later |
| 46 | Upstash Redis | ✅ LIVE | Fix AI route matcher E3 |

### A9. Monitoring & analytics

| # | API | Status | Phase |
|---|-----|--------|-------|
| 47 | Sentry | ⬜ PLANNED | E3 |
| 48 | PostHog | ⬜ PLANNED | E3 soft / P5 |
| 49 | GA4 | ❌ DEFER | Marketing optional |
| 50–52 | OTel / Logtail / Better Stack | ❌ DEFER | Ops maturity |

### A10. Security & compliance

| # | API | Status | Phase |
|---|-----|--------|-------|
| 53–54 | Vanta / Drata | ❌ DEFER | SOC2 when enterprise sales require |
| 55–56 | Snyk / GitHub Advanced Security | ⬜ PLANNED | CI hygiene E4 |
| 57–58 | hCaptcha / Turnstile | ⬜ PLANNED | Guest preview abuse (P4) |

### A11–A15. Dev tools, comms, fonts, calendar, export

| Group | Default stance |
|-------|----------------|
| GitHub / Vercel APIs | Ops only, not product |
| Slack/Discord/Twilio alerts | ❌ DEFER internal ops |
| Google Fonts | ⬜ for Satori (P3) — subset locally preferred |
| Google Calendar / Cal.com | ❌ DEFER; Ampliforge calendar first (P6) |
| PDFMonkey / DocRaptor | ❌ DEFER; client ZIP + PNG first |
| JSZip / FileSaver | ⬜ PLANNED P3 batch download |

---

## 3. Section B — Internal Ampliforge APIs

### 3.1 Adopted convention (keep)

Current routes on `main` — **do not rename** without a migration RFC:

| Live route | Maps vision # | Status |
|------------|---------------|--------|
| `POST /api/webhooks/clerk` | 79 | ✅ |
| `POST /api/webhooks/stripe` | 143 | ✅ |
| `POST /api/v1/projects` | 91 (process) | ✅ |
| `GET /api/v1/projects/[id]/status` | 92 | ✅ |
| `GET /api/v1/projects/[id]/transcript` | — | ✅ |
| `GET /api/v1/projects/[id]/export` | package export | ✅ |
| `POST .../content/[contentId]/regenerate` | 100 | ✅ |
| `POST /api/v1/billing/checkout` | 140 | ✅ |
| `POST /api/v1/seed-demo` | — | ✅ |
| `POST /api/internal/process-project` | worker | ✅ |

RSC data fetchers (`lib/data/*`) cover list/get for projects, library, analytics, templates — not all need REST yet.

### 3.2 Gaps vs vision inventory (build by phase)

#### E3 — Enterprise harden (DEVELOPER Phase 3 + billing debt)

| Route | Purpose |
|-------|---------|
| `POST /api/v1/billing/portal` | Stripe Customer Portal (#141) |
| `POST /api/v1/billing/credits` | One-time credit top-up Checkout |
| `GET /api/v1/users/me` | Profile + plan + credits (#82) — sync Zustand |
| `PATCH /api/v1/users/me` | Profile fields (#83) |
| `GET /api/v1/users/me/usage` | Usage stats (#84) |
| `GET /api/v1/activity` | DB-backed activity feed |
| Org routes `#86–90` | Team workspaces |

#### P1 — Insights

| Route | Purpose |
|-------|---------|
| `GET /api/v1/projects/[id]/insights` | Structured insights for UI |

(Processing stays on existing create + status poll; no WebSocket required yet.)

#### P2 — Kit / content pieces

| Route | Purpose |
|-------|---------|
| `GET /api/v1/projects/[id]` | Optional JSON package for clients (#95) |
| `PATCH /api/v1/projects/[id]/content/[contentId]` | Edit body (#99) |
| `POST .../alternatives` | Hook/angle alternatives (#102) |
| `POST .../publish-state` | Mark published (#103) — before native publish |
| `DELETE /api/v1/projects/[id]` | Delete package (#97) |

Vision `/api/v1/content/*` → **alias later**; primary stays `/projects`.

#### P3 — Visuals

| Route | Purpose |
|-------|---------|
| `POST /api/v1/visuals/generate` | (#104) |
| `GET /api/v1/visuals/[id]` | (#109) |
| `GET /api/v1/visuals/[id]/download` | Signed URL (#112) |
| `POST /api/v1/visuals/download/batch` | ZIP (#113) |

#### P3/E3 — Brands

| Route | Purpose |
|-------|---------|
| `GET/POST /api/v1/brands` | (#120–121) |
| `POST /api/v1/brands/extract` | (#122) |
| `PUT /api/v1/brands/[id]` | (#125) |
| `POST .../set-default` | (#127) |

Maps to DEVELOPER “Brand voice training.”

#### P4 — Guest / preview

| Route | Purpose |
|-------|---------|
| `POST /api/v1/preview/process` | Abuse-limited guest job |
| `POST /api/v1/preview/claim` | Attach to Clerk user after signup |

#### P5 — Analytics

| Route | Purpose |
|-------|---------|
| Extend `GET` analytics series | (#128) |
| `POST /api/v1/analytics/pieces/[id]/performance` | Manual report (#131) |
| `GET /api/v1/analytics/insights` | Preference insights (#132) |

#### P6 — Calendar

| Route | Purpose |
|-------|---------|
| `GET /api/v1/calendar` | (#134) |
| `POST /api/v1/calendar/schedule` | (#135) |
| `PUT/DELETE /api/v1/calendar/[id]` | (#136–137) |
| `POST /api/v1/calendar/optimize` | (#138) |

#### P7 — Integrations & outgoing webhooks

| Route | Purpose |
|-------|---------|
| `/api/v1/integrations/:platform/connect` | (#144–147) |
| `POST /api/v1/integrations/publish` | (#150) |
| Outgoing webhook register/list/delete/test | (#151–154) |

#### Realtime (#155–157)

| Approach | Phase |
|----------|-------|
| Keep **HTTP poll** (2s) | ✅ LIVE |
| Supabase Realtime or SSE on job row | ⬜ optional P2+ |
| Full WebSocket channels | ❌ DEFER |

### 3.3 Explicit non-adoptions (near term)

- Do not add Drizzle alongside Supabase JS without RFC
- Do not add SendGrid while Resend ships
- Do not add Whisper/Assembly until Deepgram+captions SLOs fail
- Do not add Pinecone before learning-loop requirements are clear
- Do not add Buffer/Hootsuite before first-party LinkedIn publish

---

## 4. Section C — NPM packages

### ✅ Already in `package.json`

next, react, react-dom, typescript, @clerk/nextjs, @supabase/*, @anthropic-ai/sdk, (openai via dynamic? — check generate-content), @upstash/*, stripe, @stripe/stripe-js, resend, svix, framer-motion, lucide-react, radix set, cva, clsx, tailwind-merge, cmdk, sonner, zustand, @tanstack/react-query, recharts, next-themes, geist, youtube-transcript, eslint, tailwindcss

_Note: verify `openai` package — generation may call REST without dedicated dep; add explicitly in P0 if missing._

### ⬜ Add by phase

| Phase | Packages |
|-------|----------|
| E3 | `@sentry/nextjs`, optionally `posthog-js` |
| P3 | `satori`, `@resvg/resvg-js`, `jszip`, `file-saver`, font files / `@fontsource/*` |
| P3 advanced | `sharp` if needed; **not** puppeteer until template limits hit |
| P2 UX | `zod` (+ react-hook-form if forms grow) |
| P6 | `date-fns` |
| P7 | platform OAuth SDKs as needed |
| E4 | vitest, playwright, storybook (governance) |

### ❌ Do not add yet

drizzle-orm, inngest/bullmq (until job volume requires), pusher, fabric/konva, @aws-sdk/*, ai SDK (optional later), SendGrid, Stability SDKs.

---

## 5. Dependency map (adopted)

```
CRITICAL (live or next)
  Clerk → users
  YouTube oEmbed (+ Data API next) → metadata
  Deepgram (+ captions) → transcript
  Claude (+ OpenAI) → content
  Supabase → DB (+ Storage next)
  Stripe → subscriptions (+ portal/top-ups next)
  Upstash → rate limits
  Resend → transactional email
  Sentry → errors (next)

ENHANCEMENT (phased)
  YouTube IFrame, Satori/Resvg, brand extract
  PostHog, Customer Portal
  LinkedIn/X/IG OAuth publish
  Manual performance → prompt prefs

DEFER
  Whisper, Assembly, Pinecone, Stability/DALL·E
  Imgix, S3/R2, Buffer/Hootsuite, Vanta, Cal.com
```

---

## 6. API build sequence (summary)

| Order | Phase | API work |
|-------|-------|----------|
| 1 | E0 | Merge enterprise UI (no new APIs) |
| 2 | E3 | Sentry, portal, top-ups, users/me, activity, orgs; fix rate-limit matcher; credits sync |
| 3 | P0 | YouTube Data API; schema for insights/brands |
| 4 | P1–P2 | Insights GET; content PATCH; alternatives; delete project |
| 5 | P3 | brands/*, visuals/*, Storage |
| 6 | P4 | preview/* + Turnstile |
| 7 | P5–P6 | analytics performance; calendar/* |
| 8 | P7 | integrations/* + outgoing webhooks |

Full phase definitions: [ROADMAP.md](./ROADMAP.md).
