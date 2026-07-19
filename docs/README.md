# Ampliforge Build Documents

Product + engineering blueprint aligned with the **live enterprise build** and the platform vision.

**Baselines**
1. `main` — Phase 1–2 sellable SaaS (pipeline, dashboard, Stripe, export, regenerate)
2. Enterprise UI — `cursor/design-tokens-phase0-7d44` (PR #2): DTCG tokens, onboarding, carousel, `/design`
3. `DEVELOPER.md` Phase 3 — Sentry, activity, brand voice, teams, admin
4. Platform vision — curated kit, visuals, review studio (depth over volume)
5. API inventory — named services with LIVE / PARTIAL / PLANNED / DEFER tags

**Day-to-day coding:** [`../DEVELOPER.md`](../DEVELOPER.md)  
**These docs:** what is built, what to build next, APIs to adopt, acceptance bars.

---

## Read order

| # | Document | Purpose |
|---|----------|---------|
| 1 | [CURRENT-STATE.md](./CURRENT-STATE.md) | Audited inventory (`main` + enterprise branch) |
| 2 | [VISION.md](./VISION.md) | Product definition + binding design constraints |
| 3 | [ROADMAP.md](./ROADMAP.md) | Unified phases E0–E3 → P0–P8 |
| 4 | [API-DIRECTORY.md](./API-DIRECTORY.md) | External APIs, internal routes, npm — status + adoption |
| 5 | [ENTERPRISE-UI.md](./ENTERPRISE-UI.md) | Design system + 24-screen inventory |
| 6 | [CONTENT-PACKAGE.md](./CONTENT-PACKAGE.md) | Kit v1 / v2 output spec |
| 7 | [UX.md](./UX.md) | Journeys (onboarding, review, guest, calendar) |
| 8 | [PIPELINE.md](./PIPELINE.md) | Insights + generation + visualize steps |
| 9 | [VISUALS.md](./VISUALS.md) | Brand + Satori plan |
| 10 | [DATA-MODEL.md](./DATA-MODEL.md) | Schema evolution |
| 11 | [ACCEPTANCE.md](./ACCEPTANCE.md) | Exit criteria per phase |

---

## North-star sequencing

```
E0 Merge enterprise UI
 → E1–E2 Finish screens
 → E3 Phase 3 harden + API debt (Sentry, portal, top-ups, teams, brand voice)
 → P0 YouTube Data + schema
 → P1 Insights → P2 Kit → P3 Visuals → P4 Review studio
 → P5 Guest preview → P6 Calendar → P7 Learning → P8 Integrations
```

Critical-path APIs today: Clerk, Claude, OpenAI fallback, Deepgram, Supabase, Stripe, Upstash, Resend.  
Next critical adds: Sentry, YouTube Data API, Supabase Storage (visuals).  
Everything else is phased or deferred — see [API-DIRECTORY.md](./API-DIRECTORY.md).
