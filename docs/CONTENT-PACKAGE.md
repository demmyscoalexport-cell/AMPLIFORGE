# Content Package Specification (Kit v1 → v2)

Curated outputs per processed video. Aligns with VISION “depth over volume” and ROADMAP P2 / P8.

---

## Kit v1 (ship in P2)

| Slot | Type key | Spec |
|------|----------|------|
| LinkedIn long | `linkedin` (variant `long_form`) | 1,200–1,800 chars; hook-first 140 chars; 3–5 hashtags; strategic notes |
| LinkedIn short | `linkedin` (variant `engagement`) | 300–800 chars; optional poll options in metadata |
| Thread | `thread` | 6–8 tweets; tweet 1 hook no media; escalating value; CTA + question |
| Hooks | `hook` | 3 variants (question / stat / contrarian) |
| Email | `email` | Subject + preheader + body; single CTA |
| Carousel | `carousel` | 8–10 slide copy blocks + caption + first-comment field |
| Summary | `summary` | Key takeaways / frameworks list |
| Caption | `caption` | 1 social caption (IG/TikTok-ready) |

**Storage today:** one `content_items` row per type.  
**P2 evolution:** either multiple rows per type (`variant` column) or JSON `metadata.variants[]` — prefer explicit rows for regenerate targeting.

### Platform architecture rules (encode in prompts)

**LinkedIn**
- Contrarian insight, document-carousel outline, personal story, or engagement question
- Line breaks every 1–2 sentences; no external links in body
- Close with save/engage prompt

**X / thread**
- T1 hook → T2 immediate value → escalate → summary → CTA
- Media cards planned at tweets 2/4/6 (visuals bind in P3)

**Instagram carousel**
- Cover → problem → value slides → takeaway → CTA → brand close
- Caption supports; slides lead

**Email**
- Curiosity subject; intimate tone; one deep insight; P.S. optional

---

## Kit v2 (P8 expansion)

Add only after v1 review quality is strong:

- Extra LinkedIn document-carousel + insight variants
- Standalone X posts + poll
- Reels/Shorts **scripts** (not rendered video)
- Stories copy + interactive prompts
- YouTube community poll / teaser / BTS
- Email nurture stubs (optional)

Do **not** target “17 tweets + 4 LinkedIn + sequences” as the default kit.

---

## Per-piece metadata (P2+)

```ts
type ContentPieceMeta = {
  variant?: string;
  strategicNotes?: string;
  hashtags?: string[];
  bestPostingTimeHint?: string; // static rules until P6
  alternatives?: { id: string; label: string; body: string }[];
  visualAssetIds?: string[];
  platformPreview?: "linkedin" | "x" | "instagram" | "email";
};
```

---

## Export

- Existing: JSON / txt via `GET .../export`
- P2: include insights + variants + strategic notes
- P3: ZIP with PNGs + copy markdown
