# Visual Generation System Plan

Phase P3. Templates before generative art.

---

## Goals

- Platform-correct dimensions  
- Brand-consistent (colors, fonts, logo, corner/shadow prefs)  
- Content-amplifying, editable, downloadable  
- Edge-friendly: **Satori + Resvg** for ≥90% of assets  

---

## Template catalog v1 (8–12, not 60+)

| Platform | Templates |
|----------|-----------|
| LinkedIn | Stat highlight, Quote card, Framework, Question hook |
| X cards | Stat callout, Quote, Checklist |
| IG carousel | Cover, Numbered value, Data point, CTA, Brand close |
| Email | Header banner, Stat embed |

Expand catalog only after review studio adoption.

---

## Brand extraction (P3 / ties to E3 brand voice)

```ts
interface BrandIdentity {
  colors: { primary: string; secondary: string; accent: string; background: string; text: string; muted: string };
  typography: { headingFont: string; bodyFont: string };
  logo?: { url: string; placement: string };
  style: { aesthetic: string; cornerStyle: string; shadowPreference: string };
  content_patterns: { hookStyle: string; emojiUsage: string; hashtagCount: number; ctaStyle: string };
}
```

v1: manual settings UI + YouTube channel color heuristics.  
v2: website scrape. Soft-fail to Ampliforge defaults.

---

## Pipeline

1. Select template by piece type + insight shape  
2. Apply brand layer  
3. Satori JSX → SVG → Resvg PNG  
4. Upload Supabase Storage  
5. Attach `visual_assets` + content metadata  

Re-render path: brand or template change → regenerate visuals only.

---

## APIs

See API-DIRECTORY P3: `/api/v1/visuals/*`, `/api/v1/brands/*`.

## Explicitly deferred

Puppeteer/Playwright charts, Stability/DALL·E, Imgix/Cloudinary, Midjourney.
