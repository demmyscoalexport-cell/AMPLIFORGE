# Ampliforge Unified Build Roadmap

Single sequencing plan aligned with:

1. Audited `main` + enterprise UI branch ([CURRENT-STATE.md](./CURRENT-STATE.md))
2. Design-system track ([ENTERPRISE-UI.md](./ENTERPRISE-UI.md))
3. Product vision constraints ([VISION.md](./VISION.md))
4. API adoption ([API-DIRECTORY.md](./API-DIRECTORY.md))

Legend: ✅ done · 🔄 in flight · ⬜ planned

---

## Track overview

```
E0  Merge enterprise UI branch
E1–E2 Finish design-system screens (non-pipeline)
E3  DEVELOPER Phase 3 + billing/API debt
P0  Platform prerequisites (YouTube Data, schema)
P1  Insight foundation
P2  Curated content kit + piece APIs
P3  Brand + Satori visuals
P4  Review studio + contextual regenerate
P5  Guest value demo (abuse-guarded)
P6  Calendar (light distribution)
P7  Learning loop (manual/import analytics)
P8  Native integrations + full package expansion
```

**Priority rule:** Cut from the right (P8 → P5) before starving E0–E3 or P1–P4.  
**UI rule:** All new UI is token-native (enterprise design system).  
**API rule:** Extend `/api/v1/projects/*`; add `/brands`, `/visuals`, `/calendar` as new domains.

---

## E0 — Merge enterprise UI foundation 🔄

**Job:** Get tokens, onboarding, carousel tab, `/design` onto `main`.

**In scope**
- Land `cursor/design-tokens-phase0-7d44` (PR #2)
- Update DEVELOPER.md structure notes (`tokens/`, `lib/design/`, `/onboarding`)

**Out of scope:** Pipeline/schema changes

**Exit**
- [ ] Enterprise branch merged
- [ ] `/onboarding`, `/design`, carousel tab live on `main`
- [ ] `pnpm build` green

**APIs:** none new

---

## E1–E2 — Finish enterprise UI screens ⬜

**Job:** Complete the 24-screen inventory polish without blocking backend Phase 3.

**In scope** (see ENTERPRISE-UI.md)
- Processing wow-moment redesign
- Projects empty / loading / error states
- Remaining `components/ui/*` token migration
- Marketing pages with existing fetchers: `/pricing`, `/blog`, `/about`, `/careers`, `/changelog`
- `/billing/success`, `/billing/cancelled`
- Complete forgot-password confirm step

**Exit**
- [ ] Inventory rows 2–7, 15–17, 23–24 marked done or explicitly deferred with ticket
- [ ] No raw hex in migrated components

**APIs:** none required (Stripe redirect URLs only)

---

## E3 — Enterprise product harden ⬜

**Job:** Close DEVELOPER.md Phase 3 + known sellable debt.

**In scope**
- Sentry (`@sentry/nextjs`)
- Real activity feed (DB table + `GET /api/v1/activity`; replace `MOCK_ACTIVITY`)
- Brand voice training v1 → seed for `/api/v1/brands` (text voice prefs: tone, CTA style, emoji, length)
- Team workspaces (Clerk orgs ↔ Supabase; routes #86–90 subset)
- Admin dashboard (internal: users, jobs, failures)
- Stripe Customer Portal (`POST /api/v1/billing/portal`)
- Credit top-up Checkout (`POST /api/v1/billing/credits`)
- `GET/PATCH /api/v1/users/me` + sync Zustand credits from DB
- Fix AI rate-limit matcher to cover `POST /api/v1/projects` + regenerate
- Add `content_items.updated_at` migration
- Plan-upgrade Resend email
- Align pricing numbers (docs ↔ UI ↔ Stripe)

**Out of scope:** Visual PNG generation, social OAuth publish

**Exit**
- [ ] All DEVELOPER Phase 3 boxes checked or split with owners
- [ ] Credits badge matches DB after load
- [ ] Top-up + portal work in test mode

**APIs:** E3 set in API-DIRECTORY §3.2

---

## P0 — Platform prerequisites ⬜

**Job:** Unblock insights/brand/visuals with metadata + schema.

**In scope**
- YouTube Data API v3 for duration, channel id, branding hints
- Migrations: `project_insights`, `brand_profiles`, `visual_assets` (see DATA-MODEL.md)
- Explicit `openai` dependency if not declared
- Document env vars in `.env.example`

**Exit**
- [ ] Duration populated for YouTube projects when API key set
- [ ] New tables typed in `lib/supabase/types.ts`

**APIs:** YouTube Data API; schema only

---

## P1 — Insight foundation ⬜

**Job:** Replace insights stub with real extraction.

**In scope**
- Insight extraction in pipeline step 3 (topics, frameworks, quotes, stats, scores)
- Persist `project_insights`
- Feed insights into generation prompts
- `GET /api/v1/projects/[id]/insights`
- One retry on empty/low-quality extraction

**Out of scope:** Visuals, new formats

**Exit**
- [ ] Completed projects have non-empty insights
- [ ] Job step `insights` reflects real work
- [ ] Spot-check quality rubric vs transcript-only baseline

**Depends on:** P0  
**APIs:** insights GET; Claude/OpenAI already live

---

## P2 — Curated content kit ⬜

**Job:** Depth-over-volume package (not full vision dump).

**Kit v1** (CONTENT-PACKAGE.md):
- 1 LinkedIn long-form + 1 LinkedIn short/engagement
- 1 X thread (6–8 tweets)
- 3 hooks
- 1 email (subject + body)
- 1 carousel outline (slides + caption)
- 1 summary

**In scope**
- Platform-specific prompt agents
- Strategic notes + 2 hook alternatives
- `PATCH` content, `POST` alternatives, `DELETE` project
- Export archive includes full kit
- Show all types in review UI (carousel already on enterprise branch)

**Out of scope:** Reels/Shorts/Stories/YouTube community; 4× LinkedIn + 17 tweets

**Exit**
- [ ] Kit schema stable; export complete
- [ ] Architecture rules enforced in prompts

**Depends on:** P1

---

## P3 — Brand + visuals (MVP) ⬜

**Job:** Brand-consistent PNGs without a designer.

**In scope**
- Brand profiles CRUD + extract (channel/site heuristics)
- Satori + Resvg templates (~8–12): LinkedIn 1200×627, thread cards, carousel 1080×1080, email header
- Supabase Storage + signed download / batch ZIP
- Re-render on brand change without regenerating copy
- Google Fonts subset or self-hosted fonts for Satori

**Out of scope:** Puppeteer, Stability/DALL·E, Imgix

**Exit**
- [ ] ≥80% of visual-expecting pieces have PNG URLs
- [ ] Download works from project detail

**Depends on:** P2 + E3 brand voice seed  
**APIs:** `/api/v1/brands/*`, `/api/v1/visuals/*`

---

## P4 — Review studio + contextual regenerate ⬜

**Job:** Make review the product.

**In scope**
- Layout: editor | visual | platform chrome
- Accept / edit / regenerate piece
- Contextual regenerate (span + instruction → patch)
- Tone/length/formality controls
- Platform previews (LinkedIn, X, IG, email)
- YouTube IFrame preview (replace thumbnail stub)

**Out of scope:** Multi-approver workflows

**Exit**
- [ ] Full kit shippable from review UI alone
- [ ] Contextual regenerate preserves unedited spans in tests

**Depends on:** P2–P3

---

## P5 — Guest value demo ⬜

**Job:** Prove value &lt;90s with hard abuse caps.

**In scope**
- Landing URL → processing theater → watermarked preview
- `POST /api/v1/preview/process` + claim on signup
- Turnstile/hCaptcha + IP rate limits + cost ceiling
- Onboarding questions already partially on enterprise branch — align with primary platform / frequency / connect YouTube

**Exit**
- [ ] One guest preview without account
- [ ] Claim attaches project to user
- [ ] Cost within ops budget

**Depends on:** P2–P4 (preview must look real)

---

## P6 — Calendar (light) ⬜

**In scope:** Suggested times, week grid, drag reschedule, ICS export, optional outgoing webhook “post this payload”  
**Out of scope:** Native OAuth publish, enterprise approval chains

**APIs:** `/api/v1/calendar/*`

---

## P7 — Learning loop ⬜

**In scope:** Manual/CSV performance entry; per-creator winners; feed `brand.content_patterns`  
**Out of scope:** Live LinkedIn/X/IG analytics APIs

**APIs:** analytics performance POST; insights GET

---

## P8 — Integrations + package expansion ⬜

**In scope (ordered):**
1. Outgoing webhooks
2. LinkedIn OAuth publish
3. X publish
4. Instagram (Business) publish
5. Expanded package (extra LinkedIn, Reels/Shorts *scripts*, Stories, YT community)
6. Advanced visual editor / custom JSX templates
7. Live performance APIs where OAuth exists

**Still defer:** Midjourney default path, Buffer/Hootsuite-first, Pinecone until RAG need is proven

---

## Dependency graph

```
E0 merge UI ──► E1–E2 UI finish
       │
       └──► E3 harden ──► P0 schema/YouTube
                              │
                         P1 insights ──► P2 kit ──► P3 visuals ──► P4 review
                                                                    │
                                                              P5 guest preview
                                                                    │
                                                              P6 calendar
                                                                    │
                                                              P7 learning
                                                                    │
                                                              P8 integrations
```

---

## Mapping to DEVELOPER.md phases

| DEVELOPER | This roadmap |
|-----------|--------------|
| Phase 1–2 ✅ | Baseline in CURRENT-STATE |
| Phase 3 Opus ✅ | Done |
| Phase 3 Sentry / activity / brand / teams / admin | **E3** |
| (unlisted) design system | **E0–E2** |
| (vision) insights → visuals → studio | **P1–P4** |

---

## What not to build yet

- Parallel `/api/v1/content/*` namespace (document as future alias)
- WebSocket realtime (polling is enough)
- Drizzle + Supabase dual ORM
- Whisper/Assembly/Pinecone/Stability as defaults
- Full 241-item inventory as a sprint backlog — use API-DIRECTORY status tags
