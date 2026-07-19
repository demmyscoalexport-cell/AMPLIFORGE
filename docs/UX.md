# UX & User Journeys

Token-native, enterprise UI track first. Product journeys for platform phases.

---

## Principles

- One job per screen; review studio is the hero for generated work
- Dark-first design system; motion communicates pipeline state
- Onboarding proves the 7 formats before asking for habits/brand depth
- Guest preview (P5) only after kit + visuals look finished

---

## Journey A — Signed-in create (live today)

1. Dashboard / onboarding → paste URL  
2. `POST /api/v1/projects` → processing card polls status  
3. Redirect `/projects/[id]` → tabs for outputs  
4. Copy / regenerate / export  

**Polish (E2):** processing wow-moment; failed/empty states; IFrame video (P4).

---

## Journey B — First-run onboarding (enterprise branch)

1. Sign-up → `/onboarding`  
2. Welcome → How it works (7 formats) → Paste URL / sample  
3. Handoff into dashboard processing store  

**Later (P5 align):** primary platform, publish frequency, connect YouTube (brand extract).

---

## Journey C — Review studio (P4)

```
┌──────────────┬──────────────────┬─────────────────┐
│ Piece list   │ Editable copy    │ Visual + chrome │
│ + status     │ + contextual     │ Platform preview│
│ Accept/Skip  │   regenerate     │ Alt templates   │
└──────────────┴──────────────────┴─────────────────┘
```

Actions: accept, edit, regenerate piece, regenerate selection, tone controls, download visual.

---

## Journey D — Guest preview (P5)

Landing single input → theater steps → reveal kit (locked download) → signup → claim project.

Abuse: Turnstile, IP limits, max 1–N free jobs, watermark.

---

## Journey E — Calendar (P6)

Week grid of kit pieces at suggested times; drag to move; ICS export.

---

## Screens ownership

| Screen | Owner phase |
|--------|-------------|
| 24-screen inventory | E0–E2 |
| Review studio upgrade | P4 |
| Brand settings | E3/P3 |
| Calendar | P6 |
| Admin | E3 |
| Team settings | E3 |
