# Figma Design Agent — Ampliforge Prompt Pack

You design in Figma with a **Design Agent** + **Untitled UI** (paid).  
I write **long, detailed prompts**. You paste them into the agent one screen (or flow) at a time.

**How to use**
1. Duplicate Untitled UI → Ampliforge working file (never edit the master kit).
2. Paste **PROMPT 0 (System)** once at the start of a session (or pin it as custom instructions).
3. Paste **one screen prompt** (PROMPT 1, 2, …) per generation. Do not combine screens in one run.
4. After each result: restyle onto Untitled components if the agent drew custom chrome; keep Auto Layout; name frames for handoff.
5. Send me: Figma link + frame names when ready to implement.

**Design order (matches build roadmap)**  
0 System → 1 Review studio → 2 Processing wow → 3 Onboarding → 4 Landing hero → 5 Brand settings → 6 Empty/error → 7 Pricing

---

## PROMPT 0 — System / Brand Bible (paste first, every session)

```text
You are a senior product designer building Ampliforge inside Figma using Untitled UI components wherever possible.

PRODUCT
Ampliforge is an enterprise YouTube content-repurposing SaaS. Creators paste a YouTube URL; the product transcribes the video and generates platform-native content (LinkedIn posts, X threads, email, hooks, summary, Instagram carousel, captions) plus brand-consistent visuals. Philosophy: AI multiplies creativity — humans review, personalize, and approve. Not a summarizer toy; not a cluttered social command center.

BENCHMARKS (visual + UX bar)
- Feature analog: Castmagic
- Processing / onboarding “wow”: Opus Clip
- Approachability: Descript
- Visual system: Linear + Vercel + Microsoft Fluent 2
- Component kit: Untitled UI (Application UI for product; Marketing for landing)

VISUAL DIRECTION — LOCKED
- Dark-mode-first. Design dark as the primary source of truth; light mode only as a secondary variant if asked.
- Brand colors (use as semantic tokens, not rainbow decoration):
  - Primary blue: #0D66D0
  - Accent purple: #9256D9 (use sparingly — never purple-on-white AI cliché)
  - Signal crimson: #E34850 (errors / rare accent)
  - Premium gold: #D4AF37 (Pro/upgrade moments only)
- Surfaces (dark): background #0A0A0A, secondary #111111, surface #181818, elevated #202020
- Text: primary #FAFAFA, secondary #CACACA, muted #8E8E8E
- Borders: white at 8% opacity; subtle 4%
- Radius: 6 / 12 / 20 / 28 — prefer 12 for controls, 20 for large panels
- Elevation: soft layered shadows, restrained. No neon glow stacks, no multi-layer candy shadows.
- Typography: expressive but enterprise. Prefer Untitled UI type styles. Display for marketing brand/hero only; UI uses clean sans (Untitled defaults). Avoid Inter-as-personality — Untitled’s type ramp is fine if consistently applied.
- Motion (specify in annotations): fast 120ms, base 200ms, slow 320ms; ease standard. Motion communicates state (processing steps), not decoration.

HARD UI RULES (DO NOT VIOLATE)
1. One composition per first viewport — not a dashboard collage on marketing surfaces.
2. Brand first on marketing: “Ampliforge” is a hero-level signal, not a tiny nav word.
3. Hero budget (landing): brand + one headline + one short supporting sentence + one CTA group + one dominant full-bleed visual plane. No stats strips, schedule widgets, promo chips, or floating badges on hero media.
4. No hero overlays: no stickers, pills, or callout cards floating on the hero image.
5. Cards: default NO cards. Cards only when they contain a real user interaction. Never cards in the hero. If removing border/shadow/radius doesn’t hurt understanding, remove it.
6. One job per section: one purpose, one headline, usually one short supporting line.
7. Reduce clutter: no pill clusters, emoji rows, icon grids as decoration, multi-competing text blocks.
8. Avoid: cream/terracotta “AI brochure” look; broadsheet newspaper layouts; purple-to-indigo gradient themes as the whole identity; rounded-full pill spam; emoji as UI.
9. Product chrome: clean sidebar + top bar like Linear; dense but calm; content review is the hero surface of the app.
10. Always use Auto Layout. Name layers clearly (e.g. Review/Editor, Review/PlatformPreview). Create variants for Default / Hover / Loading / Empty / Error / Processing where relevant.
11. Prefer Untitled UI components (Button, Input, Textarea, Tabs, Sidebar, Modal, Avatar, Badge, Empty state) restyled to Ampliforge colors — do not invent a parallel component language.
12. Annotate spacing with 4/8pt grid. Desktop 1440 and mobile 390 for every primary screen.

OUTPUT FORMAT FOR EACH REQUEST
- Frame set at 1440×900 (desktop) and 390×844 (mobile) unless specified.
- Cover / title frame with screen name and route (e.g. /projects/[id] Review Studio).
- Component instances from Untitled UI where possible.
- A short annotation sticky: “Implementation notes for engineering” listing components used and key tokens.
- Do not generate random lorem dashboards unrelated to Ampliforge.
```

---

## PROMPT 1 — Review Studio (highest priority product screen)

```text
Using the Ampliforge system rules already established, design the PRIMARY product screen: Content Review Studio.

ROUTE: /projects/[id]
JOB: Creator reviews AI-generated content for one YouTube video — edit copy, see platform preview, see accompanying visual, accept or regenerate. This is the most important screen in the product. It must feel like a focused studio, NOT a settings dashboard and NOT a card grid of everything at once.

CONTEXT DATA (use realistic sample content)
- Video title: “10K Landing Pages Analysis — What Actually Converts”
- Channel: GrowthLab
- Duration: 18:42
- Generated kit: LinkedIn long post, LinkedIn short, X thread (8 tweets), 3 hooks, Email, Carousel (10 slides), Summary, Caption
- Brand colors applied to visuals: blue #0D66D0 on dark elevated surfaces

LAYOUT — DESKTOP 1440
Three-region composition inside the existing Ampliforge app shell (left sidebar collapsed or compact + slim top bar with project title + credits + Export):

1) LEFT RAIL (240–280px) — Piece navigator
   - List of content pieces with type icon, short label, status chip (Ready / Edited / Accepted)
   - Selected item clearly indicated with brand-blue accent bar (not a heavy card)
   - Sticky footer actions: Accept all remaining · Export kit
   - No emoji. Use Untitled icons / Lucide-like stroke icons.

2) CENTER — Editor (flexible width, hero of the screen)
   - Piece type + title
   - Large editable text area (Untitled textarea / prose block) with comfortable line length
   - Inline toolbar: Tone · Length · Formality · Regenerate piece · Contextual regenerate (“Improve selection”)
   - Strategic notes as a quiet secondary block under the editor (not a bright callout card): 1–2 sentences why this angle was chosen
   - Character/tweet count where relevant (thread)

3) RIGHT — Preview column (360–400px)
   - Tabs: Platform preview | Visual
   - Platform preview: faithful chrome mock for the SELECTED type only
     - LinkedIn: feed post preview
     - X: thread stack preview
     - Instagram: carousel slide stage with dots
     - Email: simple client header + body
   - Visual tab: generated image mock (stat highlight / quote card template), buttons: Alternative design · Download PNG
   - No floating badges on the preview media.

STATES TO DELIVER (separate frames)
A) Default — LinkedIn long selected, preview LinkedIn, visual shown
B) Thread selected — center shows tweet list editor; right shows thread preview
C) Carousel selected — center slide list; right IG carousel preview
D) Contextual regenerate — selection highlighted + small instruction popover (“Make this more conversational”)
E) Loading regenerate — skeleton/progress in center only
F) Empty visual — placeholder with Generate visual CTA
G) Mobile 390 — stacked: piece selector as horizontal chips; editor full width; preview in bottom sheet pattern

VISUAL RULES
- Dark-first Ampliforge tokens
- Untitled UI components for buttons, tabs, inputs, badges
- Minimal dividers; avoid nested cards inside cards
- Processing is NOT on this screen (separate screen)
- Feels Linear/Vercel calm; Castmagic-useful; Opus-Clip quality on the preview side

ANNOTATIONS
List Untitled components used. Note route and state names for engineering handoff.
```

---

## PROMPT 2 — Live processing “wow-moment”

```text
Design Ampliforge’s live processing experience — the emotional peak after pasting a YouTube URL.

ROUTE: overlay/state on /dashboard or full /projects/[id] while status=processing
JOB: Make waiting feel intentional, educational, and premium (Opus Clip–grade), while reflecting real pipeline steps.

PIPELINE STEPS (exact labels — use these)
1. Extracting video metadata…
2. Transcribing audio…
3. Identifying key insights and frameworks…
4. Generating platform-optimized content…
5. Creating professional visuals… (may show as “Queued” if visuals not ready in product yet)
6. Packaging your content suite…

DESKTOP COMPOSITION
- Full-bleed dark atmosphere: subtle mesh gradient using brand blue/purple at very low opacity on #0A0A0A — not a purple rainbow.
- Centered composition (one job): 
  - Small Ampliforge wordmark
  - Video thumbnail + title + duration for the source URL
  - Vertical or horizontal step list with clear current step, completed check, upcoming muted
  - Elapsed time + ETA (“About 1 min 40 sec remaining”)
  - Secondary quiet action: “You can browse the library while this runs” (text button, not a competing CTA)
- Optional: faint preview silhouettes of upcoming outputs morphing in the background at ≤10% opacity — no floating stickers, no emoji confetti, no “AI sparkle” overload. One restrained motion note: step check animates in 200ms.

STATES
A) Mid-run — step 3 active
B) Almost done — step 5–6
C) Success micro-moment — “14 pieces ready in 1:47” with single primary CTA “Open review studio”
D) Failure — calm error, retry + support, no blamey copy
E) Mobile 390 — same hierarchy, steps stacked, thumbnail smaller

RULES
- No dashboard widgets on this screen
- No pricing, no stats, no testimonials
- Untitled progress / checklist components restyled
- Gold accent only on the success checkmark if needed; otherwise brand blue

ANNOTATIONS for motion durations and which step maps to engineering processing_jobs.step values: fetch, transcribe, insights, generate, visualize, finalize.
```

---

## PROMPT 3 — First-run onboarding (3 steps)

```text
Design Ampliforge first-run onboarding for new accounts after Clerk sign-up.

ROUTE: /onboarding
JOB: Orient the creator in under 90 seconds and start their first video — without feeling like a survey wall.

STEPS (exactly 3)
1) Welcome — “Ampliforge turns one video into a week of platform-native content.” Brand-level Ampliforge name. One supporting sentence. Primary CTA Continue. Secondary “Skip to dashboard”.
2) How it works — show the 7 formats as a clean list or quiet grid WITHOUT card spam: LinkedIn, X thread, Email, Hook, Summary, Carousel, Caption. One line each. Continue.
3) Your first video — large URL input: “Paste any YouTube URL”. Helper text. Primary “Generate my content”. Ghost “Try a sample video”.

VISUAL
- Dark-first, full viewport, minimal chrome (no app sidebar yet — or ultra-minimal top bar with logo only)
- Untitled inputs/buttons
- Step indicator 1/2/3 — understated dots or numbers, not rainbow progress
- Avoid illustration clutter; if imagery, one abstract product atmosphere (mesh), not stock handshake photos

VARIANTS
- Desktop 1440 + Mobile 390 for all 3 steps
- Step 3 validating URL (loading on button)
- Step 3 error (invalid URL)

Do not add: team invites, credit cards, long preference questionnaires, emoji celebrations.
```

---

## PROMPT 4 — Marketing landing hero + first fold only

```text
Design ONLY the first viewport of Ampliforge’s marketing landing page (/).

JOB: Brand-first conversion into “Paste YouTube URL” value demo.

HERO BUDGET (STRICT — include ONLY these)
1. Ampliforge brand/name as hero-level signal (not just nav text)
2. One headline
3. One short supporting sentence
4. One CTA group: primary = URL input + “See what Ampliforge creates” (or split: input + Generate); secondary text link Sign in
5. One dominant full-bleed visual plane / atmosphere behind or as the entire background (product mood: dark studio, subtle blue mesh). NOT an inset rounded screenshot card. NOT a side-panel mockup collage. NOT a floating UI sticker pack.

ALSO ALLOWED IN FIRST VIEWPORT
- Minimal top nav: Logo · Pricing · Sign in · Get started (text, quiet)

FORBIDDEN IN FIRST VIEWPORT
- Stats counters, “this week” callouts, testimonial quotes, feature icon rows, pricing tables, schedule widgets, logo clouds, badges on the hero media, multiple headlines, cards.

HEADLINE DIRECTION (pick one clear line; do not stack)
Something in the spirit of: “One video. A week of platform-native content.” — enterprise confident, not hypey AI slang.

BELOW THE FOLD — DO NOT DESIGN IN THIS PROMPT
Stop at the first viewport. Engineering will request later sections separately.

Deliver desktop 1440 and mobile 390. Untitled marketing patterns OK if they obey the hero rules above.
```

---

## PROMPT 5 — Brand settings

```text
Design Ampliforge Brand Kit settings for creators.

ROUTE: /settings/brand (or Settings tab: Brand)
JOB: Let users set visual identity and voice that flow into generated visuals and copy. Manual controls first; “Extract from YouTube channel” as secondary.

SECTIONS (one column, calm — not a card maze)
1) Brand preview strip — live miniature of a LinkedIn-style visual using current tokens
2) Colors — primary, secondary, accent, background, text (swatches + hex; Untitled color field patterns)
3) Typography — heading font / body font selects (Google font list simplified)
4) Logo upload — dropzone, placement select (top-left, top-right, bottom-center)
5) Voice — tone slider or select (formal ↔ conversational), emoji usage (none/minimal), CTA style, default hook style
6) Actions — Save · Set as default · Extract from YouTube URL (secondary)

SHELL
- Standard Ampliforge dashboard shell (sidebar + top bar)
- Dark-first
- Untitled form controls
- Mobile: single column

STATES: Default · Dirty unsaved · Saving · Extracting brand (progress) · Extract failed

No marketplace templates, no social connect walls on this screen.
```

---

## PROMPT 6 — Projects empty + failed processing

```text
Design two Ampliforge product states with Untitled empty-state patterns.

A) /projects EMPTY
- Sidebar app shell
- Quiet empty composition: short headline “No projects yet”, one sentence, primary CTA “New project” focusing a URL field or opening the AI command affordance
- No illustrations of sad robots; optional minimal geometric mark
- Secondary: “Seed demo projects” text action

B) /projects/[id] FAILED
- Review shell but content replaced by calm failure panel
- Headline “Processing couldn’t finish”
- Human-readable error (e.g. “We couldn’t fetch a transcript for this video”)
- Actions: Retry · Edit URL · Contact support
- Keep project title visible in top bar

Desktop + mobile. Dark-first. No emoji. No blame.
```

---

## PROMPT 7 — Pricing page

```text
Design Ampliforge /pricing using Untitled UI pricing patterns, Ampliforge dark-first brand.

JOB: Clear plan comparison for Starter / Pro / Agency. One job: choose a plan.

RULES
- Not the landing hero — this is a dedicated pricing page with simple header
- Three plans max in a row on desktop; stack on mobile
- Prefer subtle elevation over heavy cards; if cards are required for comparison, keep them quiet and consistent (interaction = selecting a plan)
- Highlight Pro as recommended with brand-blue border — not gold scream unless Pro is “premium” badge in gold text
- FAQ accordion below — short
- CTA: Start free / Upgrade / Contact sales (Agency)

Copy may be placeholder but structure must match SaaS pricing clarity. Include monthly toggle if Untitled has it; keep simple.

Avoid: feature comparison of 40 rows, fake urgency timers, emoji tier names.
```

---

## PROMPT 8 — Visual asset templates (design system for generated images)

```text
Design a Figma component set for Ampliforge GENERATED social visuals (these are outputs, not app chrome).

Create components at exact sizes:
1) LinkedIn landscape 1200×627 — variants: Stat highlight, Quote card, Framework title, Question hook
2) X / thread card 1200×675 (or 1:1 1080) — Stat callout, Quote, Checklist
3) Instagram carousel slide 1080×1080 — Cover, Numbered value, Data point, Summary, CTA, Brand close
4) Email header 600×200 — Brand banner + title

Each variant:
- Uses Ampliforge brand tokens as editable properties (primary color, logo optional, heading text, supporting text)
- Dark and light brand background options
- Safe margins; large type hierarchy; no tiny gray body walls
- Looks like premium creator content, not Canva clutter
- No watermarks saying “AI”

Organize as a Figma component library page “Visual Templates / v1” with property controls documented for engineering (Satori will mirror these).
```

---

## After the agent finishes — your checklist

1. Replace any custom buttons/inputs with **Untitled UI** instances if the agent freestyled them.  
2. Bind colors to your Ampliforge local styles (map to #0D66D0 / surfaces above).  
3. Name frames: `Review/Desktop/LinkedIn`, `Processing/Success`, etc.  
4. Add a sticky **Engineering notes** on each page.  
5. Share the file link + which prompt numbers are approved.  

I will implement approved frames in Next.js against `components/ui/*` and `docs/ENTERPRISE-UI.md` tokens.

---

## Prompt request template (ask me anytime)

When you need a new screen, message me:

`Prompt for Figma Design Agent: [screen name] — [job] — [route] — [must include] — [must avoid]`

I will return another long prompt in the same format as above.
