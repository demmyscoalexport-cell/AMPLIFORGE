# Enterprise UI & Design System Track

Aligns with branch `cursor/design-tokens-phase0-7d44` and `DESIGN_SYSTEM_PROGRESS.md` on that branch. This track is **in flight ahead of `main`** and is the UI foundation for all later platform work.

---

## Goal

Enterprise-grade design system + polished screens across a ~24-screen product.

| Benchmark | Role |
|-----------|------|
| Castmagic | Feature-scope analog (URL → multi-format) |
| Opus Clip | Onboarding + processing “wow-moment” |
| Descript | Approachability |
| Linear / Vercel / Fluent 2 | Visual bar (dark-first, restrained accents, elevation, state motion) |

---

## Architecture (locked)

- **3-tier DTCG tokens:** `/tokens/primitive.json` → `semantic.json` → `component.json`
- **Tailwind v4** `@theme inline` + CSS variables in `app/globals.css`
- **No raw hex in components** — use `var(--…)` / semantic classes
- Dark-mode-first; light fallback in semantic tokens
- Radix + shadcn patterns + `cn()`; Framer Motion for state communication
- Typed accessors: `lib/design/tokens.ts`
- Living guide: `/design`

**Guardrails during UI phases:** do not change `lib/pipeline/*`, DB schema, or auth unless a screen strictly requires it (prefer follow-up migrations in platform phases).

---

## Phase status

| Phase | Status | Notes |
|-------|--------|-------|
| E0 — Token architecture + primitives | ✅ On enterprise branch | Merge to `main` |
| E1 — Onboarding | ✅ On enterprise branch | `/onboarding`; sign-up redirect |
| E2 — Output review core | ✅ Partial on enterprise branch | Carousel tab + token-aligned previews |
| E2b — Processing wow-moment + list states | ⬜ Remaining | Opus Clip–grade progress |
| E2c — Remaining UI primitives | ⬜ Remaining | accordion, dialog, select, etc. |
| E3 — Marketing + billing screens | ⬜ Remaining | See 24-screen inventory |
| E4 — Governance | ⬜ Remaining | Style Dictionary, hex lint, WCAG, Figma |

---

## 24-screen inventory

| # | Screen | Route | Status |
|---|--------|-------|--------|
| 1 | Landing | `/` | Exists — redesign pending |
| 2 | Pricing | `/pricing` | TODO page (fetcher ready) |
| 3 | Blog index | `/blog` | TODO |
| 4 | Blog post | `/blog/[slug]` | TODO |
| 5 | Careers | `/careers` | TODO |
| 6 | About | `/about` | TODO |
| 7 | Changelog | `/changelog` | TODO |
| 8 | Sign in | `/sign-in` | Exists |
| 9 | Sign up | `/sign-up` | Exists → onboarding on enterprise branch |
| 10 | Forgot password | `/forgot-password` | Exists (complete-reset flow incomplete) |
| 11 | Onboarding | `/onboarding` | ✅ Enterprise branch |
| 12 | Dashboard | `/dashboard` | Exists |
| 13 | Projects list | `/projects` | Exists — empty/loading/error TODO |
| 14 | Project detail | `/projects/[id]` | ✅ Enhanced (carousel) on enterprise branch |
| 15 | Processing live | (state of 14 / card) | Redesign TODO |
| 16 | Empty projects | (13) | TODO |
| 17 | Failed processing | (14) | TODO |
| 18 | Library | `/library` | Exists |
| 19 | Templates | `/templates` | Exists |
| 20 | Analytics | `/analytics` | Exists |
| 21 | Settings | `/settings` | Exists (tabs incomplete) |
| 22 | Upgrade | `/upgrade` | Exists |
| 23 | Billing success | `/billing/success` | TODO |
| 24 | Billing cancelled | `/billing/cancelled` | TODO |
| — | Design system | `/design` | ✅ Extra deliverable on enterprise branch |

---

## Merge checklist (into `main`)

- [ ] Land PR #2 (`cursor/design-tokens-phase0-7d44`) or equivalent squash
- [ ] Confirm `pnpm build` + `pnpm lint` green
- [ ] Update `DEVELOPER.md` repo structure for `tokens/`, `lib/design/`, `/onboarding`, `/design`
- [ ] Point AGENTS.md / coding rules at semantic tokens (no hex)
- [ ] Keep `docs/DESIGN_SYSTEM_PROGRESS.md` or fold into this file

---

## Handoff to platform phases

After E0–E2 are on `main`, platform work (insights, kit, visuals, review studio) **must**:

- Use semantic/component tokens only
- Extend project detail / review UI rather than inventing a parallel design language
- Prefer Framer presets from `lib/design/tokens.ts` (`transitions`) + `lib/animations.ts`
