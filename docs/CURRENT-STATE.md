# Current State (Audited)

_Baseline date: 2026-07-19_  
_Sources: `origin/main` @ `7c4818d` + enterprise branch `origin/cursor/design-tokens-phase0-7d44` @ `10799a5`_

This is the factual inventory planners must use. Prefer this over aspirational checklists when they conflict.

---

## 1. Two tracks that must be unified

| Track | Location | Status |
|-------|----------|--------|
| **Core SaaS** | `main` | Phase 1–2 done; Phase 3 enterprise features mostly open |
| **Enterprise UI / design system** | `cursor/design-tokens-phase0-7d44` (PR #2) | Ahead of `main`: tokens, onboarding, carousel tab, `/design` |

**Planning rule:** Treat the design-system branch as the UI foundation. Merge or rebase it onto `main` before large platform features (kit/visuals/review) so new UI is token-native.

---

## 2. What `main` has shipped

### Core product loop (complete)
Paste YouTube URL → deduct 500 credits → `processProject` (fetch → transcribe → **stub insights** → generate 7 types → finalize) → client polls status → project detail → copy / regenerate / export → Stripe upgrade.

### Pipeline (`lib/pipeline/`)

| Step | Implementation |
|------|----------------|
| fetch | YouTube oEmbed; podcast/webinar hostname fallback; **duration always null** |
| transcribe | Deepgram → YouTube captions → hardcoded fallback |
| insights | **Stub** — advances job UI only; no extraction, no persistence |
| generate | Claude `claude-opus-4-8` → OpenAI `gpt-4o-mini` → templates |
| finalize | `projects.done`, `analytics_daily`, emails |

Content types: `linkedin`, `email`, `thread`, `hook`, `summary`, `carousel`, `caption`.

### App surfaces on `main`

| Area | Status |
|------|--------|
| Landing `/` | Real (not redesign onto new tokens) |
| Auth sign-in / sign-up / forgot-password | Real (forgot: send-code only; no complete-reset UI) |
| Dashboard, projects, project detail, library, templates, analytics, settings, upgrade | Real pages |
| Marketing `/pricing` `/blog` `/about` `/careers` `/changelog` `/contact` | **Linked, no pages** (data fetchers exist) |
| Activity feed / notification bell | **Mock** (`lib/mock-data.ts`) |
| Templates “Use template” | UI only |
| File upload in command bar | Disabled |
| Video player | Thumbnail UI only |
| Library star toggle | Display only |
| Settings notifications / 2FA / dark mode / billing portal | Incomplete / coming soon |
| Credit top-ups | **Documented as done; not implemented** |
| Plan-upgrade email | **Documented; not implemented** |
| Sentry | Listed in stack; **no code** |
| Brand voice / teams / admin | Phase 3; **not started** |

### API surface

| Route | Methods | Notes |
|-------|---------|-------|
| `/api/v1/projects` | POST | Create + credits + enqueue |
| `/api/v1/projects/[id]/status` | GET | Poll job |
| `/api/v1/projects/[id]/transcript` | GET | Transcript |
| `/api/v1/projects/[id]/export` | GET | JSON / txt |
| `/api/v1/projects/[id]/content/[contentId]/regenerate` | POST | Full regenerate; writes `updated_at` but **column missing** |
| `/api/v1/billing/checkout` | POST | Subscription only (starter/pro env prices) |
| `/api/v1/seed-demo` | POST | Demo projects |
| `/api/internal/process-project` | POST | Worker |
| `/api/webhooks/clerk` | POST | User sync + welcome email |
| `/api/webhooks/stripe` | POST | Plan/credits sync |

No list/delete project REST. No Stripe Customer Portal. Agency → mailto.

### Data layer (`lib/data/`)
`projects`, `content`, `analytics`, `templates`, `blog`, `testimonials`, `jobs`, `team`, `changelog` — present. No `users` fetcher module.

### Schema
Migrations `0001_init.sql`, `0002_processing_transcripts.sql`. Tables match `lib/supabase/types.ts`. No `project_insights`, no `brand_profiles`, no `visual_assets`, no team tables.

### Known correctness gaps on `main`
- Zustand credits (`store/app-store.ts`) **never synced from DB** (`setCredits` unused)
- AI rate-limit matcher targets non-existent `/api/v1/projects/:id/process`
- Pricing: `DEVELOPER.md` ($49/$149) ≠ `PRICING_TIERS` ($29/$79/$199)
- Analytics counters only linkedin/email/threads
- `detectSourceType` imported unused in orchestrator

---

## 3. What the enterprise UI branch adds (not on `main` yet)

Source: `docs/DESIGN_SYSTEM_PROGRESS.md` on that branch.

### Done
- **Phase 0 tokens:** `/tokens/{primitive,semantic,component}.json`, `lib/design/tokens.ts`, `globals.css` `@theme`, UI refactors (button, badge, input, card, tabs)
- **Living style guide:** `/design`
- **Onboarding:** `/onboarding` 3-step flow; sign-up redirects there; handoff into processing
- **Carousel tab** on project detail (7th format was generated but hidden on `main`)
- Token-aligned output previews / transcript surface

### Remaining on that track
- Processing “wow-moment” redesign
- Projects empty / loading / error states
- Remaining `components/ui/*` token migration
- Billing success/cancel pages
- Marketing pages (pricing, blog, careers, about, changelog)
- Style Dictionary automation, hex lint ban, WCAG checks, Figma sync

### Architecture guardrails (from that initiative)
- No changes to `lib/pipeline/*`, DB schema, or auth **during UI phases**
- Dark-mode-first; no raw hex in components; CSS variables only

---

## 4. DEVELOPER.md Phase 3 checklist (authoritative for ops/enterprise features)

```
- [x] Claude claude-opus-4-8 as primary AI
- [ ] Sentry error monitoring
- [ ] Real activity feed (DB-backed)
- [ ] Brand voice training
- [ ] Team workspaces
- [ ] Admin dashboard
```

These remain open on `main`. Brand voice training overlaps product vision “brand early” — plan as shared foundation (see ROADMAP Phase E3).

---

## 5. Capability matrix vs platform vision

| Vision capability | Status |
|-------------------|--------|
| YouTube → multi-format text | ✅ Built |
| Real-time processing UX | ✅ Functional; redesign pending on enterprise branch |
| Onboarding first-run | ✅ On enterprise branch only |
| Insight extraction | ❌ Stub |
| Brand auto-extraction / brand kit | ❌ Not started (Phase 3 “brand voice”) |
| Template visual PNGs (Satori) | ❌ Not started |
| Contextual (section) regenerate | ❌ Whole-item only |
| Guest preview before signup | ❌ Not started |
| Content calendar / scheduling | ❌ Not started |
| Post-publish analytics | ❌ Not started (generation stats only) |
| Team approval workflows | ❌ Not started |
| Native social publish | ❌ Not started |

---

## 6. Implications for planning

1. **Merge enterprise UI first** so tokens/onboarding/carousel are the baseline.
2. **Close Phase 3 enterprise gaps** (Sentry, activity, brand voice, teams, admin) in parallel with UI finish — brand voice is a prerequisite for visuals.
3. **Correct Phase 2 documentation debt** (credit top-ups, rate-limit matcher, credits sync, `updated_at`) before calling the platform “enterprise-ready.”
4. **Then** build platform quality layers: insights → curated kit → visuals → review studio.
5. Defer calendar, guest preview abuse surface, and live social analytics until A–D quality exists.
