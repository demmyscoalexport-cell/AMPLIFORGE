# AmpliForge — Design System & UI Build · Progress Note

_Last updated: 2026-07-13_
_Working branch: `cursor/design-tokens-phase0-7d44` · PR: [#2](https://github.com/demmyscoalexport-cell/AMPLIFORGE/pull/2)_

This note captures the full scope of the design-system / UI polish initiative, what has been built so far, and what remains.

---

## 1. Goal

Turn AmpliForge's existing UI into an **enterprise-grade design system** and polish the product across all screens, so it matches or exceeds the category leaders.

- **Feature-scope benchmark:** Castmagic (closest functional analog — URL → multi-format content).
- **Scale / UX-polish benchmark:** Opus Clip (onboarding funnel, processing "wow-moment").
- **Approachability benchmark:** Descript.
- **Visual bar:** Linear + Vercel + Microsoft Fluent 2 (dark-first, restrained gradient accents, layered elevation, acrylic/depth, motion that communicates state).

Target: a **~24-screen** enterprise product (see inventory in §5).

---

## 2. Architecture decisions

- **3-tier design tokens** in **DTCG JSON** (`/tokens/`): `primitive` → `semantic` → `component`. This is the source of truth.
- **Tailwind CSS v4** via `@theme inline` + CSS variables in `app/globals.css`. **No raw hex in components.**
- **Dark-mode-first**, with a light-mode fallback token set.
- **Non-breaking migration:** existing CSS variable names are kept as aliases so the app never visually regresses while we adopt the new tiers.
- Radix UI + shadcn patterns + `cn()` retained; Framer Motion for state-communicating motion.
- **Guardrails:** no changes to `lib/pipeline/*`, the DB schema, or auth.

---

## 3. What has been built (DONE)

### Phase 0 — Token architecture + primitives ✅
- `tokens/primitive.json` — color ramps 50–950 (blue/purple/crimson/gold/neutral), spacing, radius, typography, shadow/elevation, z-index, motion (duration/easing), blur scales.
- `tokens/semantic.json` — surface/text/border/brand/status/interactive tokens for **dark (default)** + **light**.
- `tokens/component.json` — button/card/input/tab/badge/progress/sidebar/modal tokens.
- `lib/design/tokens.ts` — typed token accessors + Framer Motion transition presets.
- `app/globals.css` — extended non-breaking with the ramps, semantic/component vars, and Tailwind v4 `@theme` mappings (existing vars kept as aliases).
- Component refactor onto tokens: `components/ui/button.tsx`, `badge.tsx` (added `processing` variant), `input.tsx`, `card.tsx`, `tabs.tsx`. Removed hardcoded `rgba()`, `text-white`, `text-zinc-900`, legacy `--brand-*`/`--bg-primary` refs.
- `app/design/page.tsx` — **living style guide** at `/design` (public): color ramps, semantic swatches, typography scale, radius/elevation, and every component state.

### Phase 1 — Onboarding ✅
- `app/onboarding/page.tsx` + `components/onboarding/onboarding-flow.tsx` — 3-step, dark-first, token-driven first-run flow (Welcome → How it works + the 7 formats → paste URL / sample) with Framer Motion and a live handoff into the dashboard processing pipeline.
- `app/(auth)/sign-up/[[...sign-up]]/page.tsx` — new users now redirect to `/onboarding`.

### Phase 2 — Output review (partial) ✅ (core piece done)
- `components/project/output-tabs.tsx` — **added the missing Carousel tab** (the 7th format was previously never displayed) with a slide-based preview (horizontal gradient slide cards, `n / N` indicators). Token-aligned the LinkedIn/email/empty previews.
- `app/(dashboard)/projects/[id]/page.tsx` — token-aligned the transcript panel surface.

---

## 4. What remains (TODO)

### Phase 2 — remaining
- Redesign the **live processing view** (staged progress "wow-moment", à la Opus Clip) — currently functional but not yet redesigned onto the new system.
- **Projects list** empty / loading / error states.

### Component library — remaining refactors
These `components/ui/*` have **not** yet been audited/migrated onto the new semantic tokens: `accordion`, `avatar`, `checkbox`, `dialog`, `dropdown-menu`, `label`, `select`, `separator`, `skeleton`, `switch`, `toast`, `tooltip`, `progress` (progress is already token-compliant).

### Phase 3 — export/publish + billing + marketing
- `/billing/success` and `/billing/cancelled` screens.
- Remaining marketing sub-pages that already have data layers but no pages: `/pricing`, `/blog`, `/blog/[slug]`, `/careers`, `/about`, `/changelog`.

### Tooling / governance (not started)
- Wire **Style Dictionary** so `/tokens/*.json` builds the CSS + TS automatically (today JSON↔CSS are hand-synced).
- ESLint/stylelint rule to ban raw hex in `components/**`.
- Automated **WCAG AA contrast** checks on semantic pairs; optional Storybook.
- **Figma sync** (Phase 4): token library + Code Connect.

---

## 5. 24-screen inventory & status

| # | Group | Screen | Route | Status |
|---|---|---|---|---|
| 1 | Marketing | Landing | `/` | Exists (not yet redesigned) |
| 2 | Marketing | Pricing | `/pricing` | TODO (page) |
| 3 | Marketing | Blog index | `/blog` | TODO (page) |
| 4 | Marketing | Blog post | `/blog/[slug]` | TODO (page) |
| 5 | Marketing | Careers | `/careers` | TODO (page) |
| 6 | Marketing | About / team | `/about` | TODO (page) |
| 7 | Marketing | Changelog | `/changelog` | TODO (page) |
| 8 | Auth | Sign in | `/sign-in` | Exists |
| 9 | Auth | Sign up | `/sign-up` | Exists (wired → onboarding) |
| 10 | Auth | Forgot password | `/forgot-password` | Exists |
| 11 | Onboarding | First-run onboarding | `/onboarding` | ✅ Built (new) |
| 12 | App | Dashboard | `/dashboard` | Exists |
| 13 | App | Projects list | `/projects` | Exists (states TODO) |
| 14 | App | Project detail (7-format review) | `/projects/[id]` | ✅ Enhanced (Carousel added) |
| 15 | App | Processing / live-status | (state of 14) | Exists (redesign TODO) |
| 16 | App | Empty state (no projects) | (state of 13) | TODO |
| 17 | App | Error / failed processing | (state of 14) | TODO |
| 18 | App | Library | `/library` | Exists |
| 19 | App | Templates | `/templates` | Exists |
| 20 | App | Analytics | `/analytics` | Exists |
| 21 | App | Settings | `/settings` | Exists |
| 22 | App | Upgrade / plans | `/upgrade` | Exists |
| 23 | Billing | Checkout success | `/billing/success` | TODO |
| 24 | Billing | Checkout cancelled | `/billing/cancelled` | TODO |
| — | Internal | Living design system | `/design` | ✅ Built (new, extra deliverable) |

---

## 6. Commits on this branch

- `feat(design-system): add Phase-0 DTCG design tokens (3-tier) + Tailwind v4 mapping`
- `refactor(ui): drive Button variants from design tokens (remove hardcoded hex/rgba)`
- `feat(onboarding): add 3-step first-run onboarding flow + route sign-up to /onboarding`
- `refactor(ui): align card/input/badge/tabs to semantic design tokens`
- `feat(design): add living /design token + component reference page`
- `feat(project): add Carousel output tab with slide preview + token-align output review`

Related: PR **#1** (`cursor/setup-dev-environment-7d44`) set up the cloud dev environment (see `AGENTS.md` → "Cursor Cloud specific instructions").

---

## 7. How to run / verify

Standard commands (see `DEVELOPER.md` / `package.json`): `pnpm dev` (port 3000), `pnpm build`, `pnpm lint`.
Cloud dev caveats (Clerk keyless, local Supabase + grants, Stripe build placeholder): see `AGENTS.md` → **Cursor Cloud specific instructions**.

Every phase so far has been verified with `pnpm build` (exit 0), `pnpm lint` (no new issues), and manual browser testing + demo recordings.

---

## 8. Known follow-ups / nits

- Onboarding "Generate my content" button hides its wand icon during the `Starting…` state (minor icon shift).
- `app/(dashboard)/projects/[id]/page.tsx` has a **pre-existing** unused `ChevronDown` import (lint warning, predates this work).
- Light-mode gold (`--brand-premium`) is intentionally slightly darker than dark-mode for contrast; verify once light mode is exercised.
- Repo has 4 pre-existing lint issues (e.g. `hooks/use-mounted.ts`) unrelated to this initiative.
