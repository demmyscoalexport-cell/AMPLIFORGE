# Figma Design Agent — Ampliforge Prompt Pack

> **For Cursor Desktop:** This file is the source of truth for all Figma Design Agent prompts. When the user asks for the “next prompt,” “Figma prompt,” or design setup, read this file and give them the next uncompleted prompt to paste into Figma.

**Workflow:** User designs in Figma (Untitled UI + Design Agent). Cursor writes prompts + implements approved frames in code.

**Figma file:** `AMPLIFORGE DESIGN` (duplicate of Untitled UI PRO — never edit the master kit)

**Pages (expected)**
- `00 · Cover`
- `01 · Foundations (Ampliforge)`
- `02 · Components (mapped)`
- `03 · App / Flows`
- `04 · Marketing`
- `05 · Visual Templates`
- `06 · Engineering Handoff`
- `99 · Archive`

**How to use in Figma**
1. Open the duplicated Ampliforge file (not Untitled master).
2. Use **File** rail to see Pages (not Agents-only view).
3. Paste **one prompt at a time** into the Design Agent.
4. Approve, then ask Cursor for “Next”.

**Prompt order**
S0 Setup → Q Enterprise QA → 1 Review Studio → 2 Processing → 3 Onboarding → 4 Landing hero → 5 Brand → 6 Empty/Failed → 7 Pricing → 8 Visual Templates → 9 Landing below-fold → 10 Billing → 11 Handoff → 12 File QA

---

## S0 — File setup (Untitled → Ampliforge)

```text
You are setting up the Ampliforge product design file inside this Untitled UI kit. Do not redesign the whole product yet. First inspect what Untitled UI already gives us, then set up a clean Ampliforge working structure on top of it.

CONTEXT
Ampliforge is an enterprise YouTube → multi-platform content repurposing SaaS (LinkedIn, X threads, email, hooks, summary, Instagram carousel, captions + brand visuals). Dark-mode-first. Visual bar: Linear + Vercel + Fluent 2. Component kit: Untitled UI. Philosophy: AI multiplies creativity; humans review/approve. Avoid generic AI purple themes, emoji clutter, card-heavy heroes, and dashboard collage layouts.

YOUR JOB RIGHT NOW (SETUP ONLY)
1) Scan this Untitled UI file: identify the best Application UI foundations we should reuse (colors, type, buttons, inputs, tabs, sidebar, nav, modals, empty states, badges, avatars). Prefer existing Untitled components — do not invent a parallel kit.

2) Create a new page structure with these pages:
   - 00 · Cover
   - 01 · Foundations (Ampliforge)
   - 02 · Components (mapped)
   - 03 · App / Flows
   - 04 · Marketing
   - 05 · Visual Templates (generated social assets)
   - 06 · Engineering Handoff
   - 99 · Archive

3) On “01 · Foundations (Ampliforge)”, create a token/style board that MAPS Untitled styles to Ampliforge:
   Dark surfaces: bg #0A0A0A · secondary #111111 · surface #181818 · elevated #202020
   Text: primary #FAFAFA · secondary #CACACA · muted #8E8E8E
   Border: white 8% / 4%
   Brand: blue #0D66D0 (primary) · purple #9256D9 (sparingly) · crimson #E34850 (danger/rare) · gold #D4AF37 (Pro only)
   Radius: 6 / 12 / 20 / 28

4) On “02 · Components (mapped)”, place Untitled instances: Button primary/secondary/ghost/destructive, Input, Textarea, Tabs, Sidebar nav item, Badge, Modal, Empty state, Progress. Restyle to Ampliforge — do not rebuild from scratch.

5) On “00 · Cover”: Ampliforge · Design System + Product · Untitled UI · Dark-first · checklist of priority screens.

6) On “03 · App / Flows”, create empty 1440w placeholder frames:
   Review Studio / Desktop · Processing / Desktop · Onboarding / Step 1–3 · Projects / Empty · Projects / Failed
   Titles + one-line job only — do not fully design yet.

7) Ignore unrelated layers (e.g. pawra-*). Leave them; put Ampliforge work on the new pages.

CONSTRAINTS: Dark-first only; no emoji; no purple wash; Untitled as base; clean Dev Mode names.

When finished, summarize pages created and components mapped.
```

---

## Q — Enterprise quality pass (run after early screens exist)

```text
We are building Ampliforge as an enterprise-grade platform that must feel trustworthy for serious creators, marketing teams, and agencies for years — not a flashy AI demo.

Audit and upgrade ALL existing Ampliforge frames on pages 00–04 to this bar. Keep layouts and IA — raise craft.

ENTERPRISE QUALITY BAR
- Calm authority (Linear / Vercel / Fluent 2). Confidence without hype.
- Consistency: one spacing scale, one type ramp, one elevation system, accent rule (blue primary; purple rare; gold Pro/success only).
- Accessibility: contrast AA+, focus states, hit targets ≥40px.
- Density with clarity: remove decorative noise and redundant cards.
- Trust cues: precise microcopy, no emoji, no “magic AI” language, no fake social proof in product UI.
- States: Default / Hover / Focus / Loading / Empty / Error on critical flows.
- Naming: production-ready for Dev Mode.
- Untitled UI for app chrome; Ampliforge tokens everywhere.
- Review Studio must feel like a daily professional tool.
- Processing must feel operationally solid.

Do NOT add new features or below-the-fold marketing.
Summarize changes, then stop for approval.
```

---

## 1 — Review Studio

```text
Setup is approved. Design Review Studio now.

PAGE: 03 · App / Flows
FRAME: Review Studio / Desktop + Review Studio / Mobile 390w
ROUTE: /projects/[id]
JOB: Primary product screen. Edit copy, platform preview + visual, accept/regenerate. Focused studio, not a dashboard.

USE Untitled UI + Ampliforge dark tokens. Brand blue #0D66D0. Auto Layout. No emoji.

SAMPLE: Video “10K Landing Pages Analysis — What Actually Converts” · GrowthLab · 18:42
Pieces: LinkedIn long/short, X thread, Hooks, Email, Carousel, Summary, Caption

DESKTOP 1440 — 3 regions in app shell
1) LEFT ~260px — piece navigator + status chips; footer Accept remaining · Export kit; selected = blue accent bar
2) CENTER — editor hero: title, large textarea, Tone/Length/Formality/Regenerate/Improve selection, quiet strategic notes
3) RIGHT ~380px — tabs Platform preview | Visual; previews for LinkedIn/X/IG/Email; Visual: mock asset + Alternative · Download PNG

STATES: LinkedIn default · Thread · Carousel · Contextual regenerate popover · Regenerating loading · Mobile chips + bottom-sheet preview

CONSTRAINTS: No purple wash, no stickers, no stats widgets. When done, zoom to Review Studio / Desktop and summarize.
```

---

## 2 — Processing wow-moment

```text
Review Studio approved. Design Processing wow-moment on 03 · App / Flows.

FRAMES: Processing / Desktop + Mobile 390
JOB: Opus Clip–grade waiting UX. One job — progress. Not a dashboard.

STEPS (exact):
1 Extracting video metadata…
2 Transcribing audio…
3 Identifying key insights and frameworks…
4 Generating platform-optimized content…
5 Creating professional visuals…
6 Packaging your content suite…

DESKTOP: full-bleed dark #0A0A0A + subtle mesh; centered wordmark, thumbnail+title, step list, ETA, quiet “Browse library while this runs”. No emoji/confetti/stickers.

STATES: Mid-run (step 3) · Near end · Success “Open review studio” · Failed (Retry/Edit URL/Support) · Mobile

When done, zoom to mid-run and summarize.
```

---

## 3 — Onboarding

```text
Processing approved. Design Onboarding on 03 · App / Flows.

FRAMES: Step 1, 2, 3 Desktop + Mobile each. ROUTE /onboarding

STEP 1 Welcome — Ampliforge brand signal, one headline, Continue + Skip to dashboard
STEP 2 How it works — 7 formats (LinkedIn, X thread, Email, Hook, Summary, Carousel, Caption) quiet list, not card spam
STEP 3 First video — large URL input, Generate my content, Try sample; loading + invalid URL states

Minimal chrome (logo top bar only). Dark-first. No billing/survey walls. Summarize at Step 1 Desktop.
```

---

## 4 — Landing hero only

```text
Onboarding approved. Design Landing hero ONLY on 04 · Marketing.

FRAMES: Landing / Hero Desktop 1440 + Mobile 390. ROUTE /

HERO BUDGET ONLY: Ampliforge brand as hero signal · one headline · one supporting sentence · URL input CTA + Sign in · one full-bleed atmosphere (not inset cards/stickers). Minimal nav OK.

FORBIDDEN: stats, logo clouds, testimonials, feature rows, badges on media, purple wash, emoji.

Headline spirit: “One video. A week of platform-native content.”
Stop at the fold. Summarize Hero Desktop.
```

---

## 5 — Brand settings

```text
Design Settings / Brand (Desktop + Mobile) + states: Default · Unsaved · Saving · Extracting · Extract failed.

ROUTE /settings/brand — brand as system of record for visuals + voice.

Sections: Identity (name, logo, extract from YouTube) · Colors with AA warnings · Typography · Visual style (constrained) · Voice patterns (tone, emoji none/minimal, CTA, hook style) · Governance (default brand, org default disabled tooltip for Agency) · Save/Cancel + last saved.

Live preview sticky. Dashboard shell. Precise copy: “Save brand kit” not hype. Summarize Brand Desktop.
```

---

## 6 — Projects empty + failed

```text
Design Projects / Empty and Projects / Failed (Desktop + Mobile) on 03 · App / Flows.

EMPTY /projects: “No projects yet”, URL-first CTA, secondary Load demo projects. No mascots.

FAILED /projects/[id]: keep title; “Processing couldn’t finish”; specific error; Retry · Edit URL · Contact support; quiet Job ID/timestamp. No blamey copy.

Match Review Studio chrome. Summarize Empty Desktop.
```

---

## 7 — Pricing

```text
Design /pricing on 04 · Marketing (Desktop + Mobile).

Starter / Pro (Recommended) / Agency. Clear who-for lines, 5–7 features, precise CTAs (Start free / Upgrade / Contact sales). Optional monthly/annual toggle. FAQ 4–6. No fake logos/stats, no timers, no emoji tiers. Enterprise calm. Summarize Pricing Desktop.
```

---

## 8 — Visual Templates library

```text
Build page 05 · Visual Templates as Figma components (outputs, not app chrome).

LinkedIn 1200×627: Stat, Quote, Framework, Question hook
X cards: Stat, Quote, Checklist (one consistent ratio)
IG 1080×1080: Cover, Numbered, Data, Process, Summary, CTA/Brand close + example sequence
Email 600×200: banner variants
Properties: text, colors, logo on/off, dark/light bg
Spec frame for engineering. Sample GrowthLab copy. Publication-ready, no AI watermark. Summarize cover/spec.
```

---

## 9 — Landing below-the-fold

```text
Complete landing BELOW THE FOLD on 04 · Marketing. Do not restyle hero.

Sections in order: How it works (3 steps) · What you get (curated kit) · Review studio moment (one real product visual) · Brand system · For teams · Final CTA. Optional short FAQ. No invented testimonials/stats. Dark-first enterprise craft. Summarize structure.
```

---

## 10 — Billing success + cancelled

```text
Design /billing/success and /billing/cancelled (Desktop + Mobile).

Success: plan active, quiet details, Go to dashboard · Manage billing · receipt note.
Cancelled: neutral, no plan change, Return to plans · Dashboard. No guilt/dark patterns/confetti.
Summarize Success Desktop.
```

---

## 11 — Engineering handoff pack

```text
Create page 06 · Engineering Handoff with:
Cover · Screen inventory (frame, route, desktop/mobile, ready) · Tokens map · Components map · Review Studio specs · Visual Templates specs · Build order · Do-not-build-yet list.

Build order: Tokens/shell → Review Studio → Processing → Onboarding → Empty/Failed → Brand → Landing/Pricing → Billing → Visual rendering pipeline.
Summarize Handoff Cover.
```

---

## 12 — File QA (final)

```text
File QA across AMPLIFORGE DESIGN. No new screens.
Verify page order, desktop+mobile, naming, tokens, Untitled usage, AA/states, no emoji/purple wash/fake proof, handoff accuracy, junk in Archive.
Add sticky on Cover: READY FOR ENGINEERING — share file link.
Reply FILE READY with checklist.
```

---

## Cursor Desktop instructions

When user says **“Next”** during Figma work: give the next prompt in order from this file (full `text` block, copy-paste ready).

When user shares a **Figma link** + **“Start implementation”**: use `docs/ROADMAP.md` + this handoff order; implement in Next.js with CSS variables / `components/ui`.

Related docs: `docs/README.md`, `docs/ROADMAP.md`, `docs/ENTERPRISE-UI.md`, `docs/VISION.md`.
