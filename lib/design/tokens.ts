/**
 * AmpliForge design tokens — typed accessors.
 *
 * These mirror the DTCG source of truth in `/tokens/*.json` and resolve to the
 * CSS variables declared in `app/globals.css`. Prefer the CSS variables in JSX
 * (e.g. `className="bg-[var(--surface-elevated)]"`); use these helpers when a
 * token value is needed in TS/JS (charts, Framer Motion, canvas, etc.).
 *
 * Source of truth: /tokens/primitive.json → semantic.json → component.json.
 * Regenerate CSS from those files (Style Dictionary) — do not hand-edit both.
 */

/** Reference the CSS custom property for a token (recommended in JSX). */
export const cssVar = (name: string) => `var(--${name})`;

export const primitive = {
  color: {
    blue: {
      50: "#eaf2fc", 100: "#d0e1f8", 200: "#a6c7f0", 300: "#74a6e6",
      400: "#3d82db", 500: "#1b72d6", 600: "#0d66d0", 700: "#0b54ac",
      800: "#0c468b", 900: "#0e3b72", 950: "#0a2647",
    },
    purple: {
      50: "#f4eefc", 100: "#e7daf8", 200: "#d0b8f1", 300: "#b98fe9",
      400: "#a570e1", 500: "#9256d9", 600: "#7e3fc9", 700: "#6832a6",
      800: "#522982", 900: "#402066", 950: "#2a1444",
    },
    crimson: {
      50: "#fdeced", 100: "#fbd5d7", 200: "#f7abb0", 300: "#f17e85",
      400: "#ea5b63", 500: "#e34850", 600: "#c7343c", 700: "#a32930",
      800: "#822227", 900: "#6b1e22", 950: "#400f12",
    },
    gold: {
      50: "#fbf6e7", 100: "#f6ebc4", 200: "#edd78b", 300: "#e4c558",
      400: "#dcb944", 500: "#d4af37", 600: "#b8942a", 700: "#937323",
      800: "#6f5820", 900: "#5a481e", 950: "#33280f",
    },
    neutral: {
      0: "#ffffff", 50: "#fafafa", 100: "#f4f4f5", 200: "#e4e4e7",
      300: "#d4d4d8", 400: "#a1a1aa", 500: "#71717a", 600: "#52525b",
      700: "#3f3f46", 800: "#27272a", 850: "#202020", 900: "#181818",
      925: "#111111", 950: "#0a0a0a",
    },
  },
  gradient: {
    hero: "linear-gradient(135deg, #0d66d0, #9256d9)",
    gold: "linear-gradient(135deg, #d4af37, #ffd700)",
    accent: "linear-gradient(135deg, #e34850, #ff6b6b)",
  },
  radius: { xs: 4, sm: 6, md: 12, lg: 20, xl: 28, full: 9999 },
  zIndex: {
    base: 0, raised: 10, sticky: 1100, overlay: 1200,
    modal: 1300, popover: 1400, toast: 1500,
  },
  motion: {
    duration: { instant: 0, fast: 0.12, base: 0.2, slow: 0.32, slower: 0.5 },
    easing: {
      standard: [0.2, 0, 0, 1],
      emphasized: [0.3, 0, 0, 1],
      decelerate: [0, 0, 0, 1],
      accelerate: [0.3, 0, 1, 1],
    },
  },
} as const;

/** Framer Motion transition presets built from motion tokens. */
export const transitions = {
  fast: { duration: primitive.motion.duration.fast, ease: primitive.motion.easing.standard },
  base: { duration: primitive.motion.duration.base, ease: primitive.motion.easing.standard },
  emphasized: { duration: primitive.motion.duration.slow, ease: primitive.motion.easing.emphasized },
} as const;

export type ColorRamp = keyof typeof primitive.color;
