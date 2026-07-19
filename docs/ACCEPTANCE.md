# Phase Acceptance Checklists

Use before marking a roadmap phase done. Tie PRs to these boxes.

---

## E0 — Merge enterprise UI

- [ ] PR merged to `main`
- [ ] `/design`, `/onboarding` respond 200
- [ ] Project detail shows Carousel tab
- [ ] `pnpm build` && `pnpm lint` pass

## E1–E2 — UI finish

- [ ] Processing redesign shipped or explicitly deferred
- [ ] Projects empty/loading/error states
- [ ] Marketing pages linked from footer resolve (or links removed)
- [ ] Billing success/cancel routes exist
- [ ] No new raw hex in touched components

## E3 — Enterprise harden

- [ ] Sentry receives a test error in staging
- [ ] Activity feed reads from DB (no `MOCK_ACTIVITY` on dashboard)
- [ ] Brand voice settings persist and affect next generation prompt
- [ ] Team: invite + role change works for happy path
- [ ] Admin can list users/jobs
- [ ] Billing portal + credit top-up succeed in Stripe test mode
- [ ] Credits badge == DB after dashboard load
- [ ] Rate limit applies to create + regenerate
- [ ] `content_items.updated_at` exists; regenerate updates it
- [ ] Pricing strings consistent across docs/UI/Stripe

## P0 — Prerequisites

- [ ] YouTube duration filled when API key present
- [ ] Migrations applied; types updated

## P1 — Insights

- [ ] Stub removed; insights row written
- [ ] Status step reflects work
- [ ] Generation prompts include insights payload

## P2 — Kit

- [ ] Kit v1 slots generated per CONTENT-PACKAGE
- [ ] PATCH / alternatives / DELETE work
- [ ] Export includes variants + notes

## P3 — Visuals

- [ ] Brands CRUD + default
- [ ] PNGs in Storage for target templates
- [ ] Download + batch ZIP
- [ ] Re-render without copy regen

## P4 — Review studio

- [ ] Studio layout usable end-to-end
- [ ] Contextual regenerate preserves surrounding text
- [ ] Platform previews for LinkedIn/X/IG/email

## P5 — Guest preview

- [ ] Preview without auth
- [ ] Claim after signup
- [ ] Abuse controls enforced; cost within budget

## P6 — Calendar

- [ ] Week grid + reschedule persist
- [ ] ICS export valid

## P7 — Learning

- [ ] Manual performance entry
- [ ] Next gen reflects at least one learned preference

## P8 — Integrations

- [ ] One platform OAuth publish E2E
- [ ] Outgoing webhook delivery + signature
- [ ] Kit v2 extras behind plan flag
