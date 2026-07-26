// Single source of truth for color (SPEC.md §5). Feeds both tailwind.config.ts
// (via the addBase plugin that injects the CSS variables below) and any
// component that needs a category color at runtime (which can't be a static
// Tailwind class, since it varies per move — see getCategoryAccentVars).
//
// Category colors are taken verbatim from the extraction legends in
// content/*.md — never invent or hand-pick a hex here. Ironsworn has no
// per-category color (two-tone design only), Starforged has 11.

export type ThemeMode = 'light' | 'dark'

export const ironswornTokens = {
  ink: '#2E271E',
  paper: '#FFFFFF',
  barDark: '#30393D',
  stripeLight: '#E2E6E9',
  stripeMid: '#B5BDC4',
}

export const starforgedTokens = {
  ink: '#1D1D1B',
  paper: '#FFFFFF',
  accentRed: '#CA181A',
  stripeLight: '#DDE2E8',
  stripeMid: '#B7C3CF',
}

export const starforgedCategoryColors: Record<string, string> = {
  session: '#3F8C8A',
  adventure: '#206087',
  quest: '#805A90',
  connection: '#4A5791',
  exploration: '#427FAA',
  combat: '#818992',
  suffer: '#883529',
  recover: '#488B44',
  threshold: '#1D1D1B',
  legacy: '#4F5A69',
  fate: '#8F477B',
}

// --- Color math -------------------------------------------------------
// WCAG 2.1 relative luminance / contrast ratio, plus HSL lightness
// adjustment. Used to (a) pick a per-category AA-safe text color instead of
// assuming light-on-dark or dark-on-light, and (b) derive the app shell's
// light/dark surface ramp from the tokens above instead of hand-picking a
// second, unrelated gray scale.

function hexToRgb(hex: string): [number, number, number] {
  const n = Number.parseInt(hex.replace('#', ''), 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

function rgbToHex([r, g, b]: [number, number, number]): string {
  return (
    '#' +
    [r, g, b]
      .map((v) =>
        Math.round(Math.min(255, Math.max(0, v)))
          .toString(16)
          .padStart(2, '0'),
      )
      .join('')
      .toUpperCase()
  )
}

function rgbToHsl([r, g, b]: [number, number, number]): [number, number, number] {
  r /= 255
  g /= 255
  b /= 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0
  let s = 0
  const l = (max + min) / 2
  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0)
        break
      case g:
        h = (b - r) / d + 2
        break
      default:
        h = (r - g) / d + 4
    }
    h /= 6
  }
  return [h * 360, s * 100, l * 100]
}

function hslToRgb([h, s, l]: [number, number, number]): [number, number, number] {
  h /= 360
  s /= 100
  l /= 100
  if (s === 0) return [l * 255, l * 255, l * 255]
  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1
    if (t > 1) t -= 1
    if (t < 1 / 6) return p + (q - p) * 6 * t
    if (t < 1 / 2) return q
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
    return p
  }
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s
  const p = 2 * l - q
  return [
    hue2rgb(p, q, h + 1 / 3) * 255,
    hue2rgb(p, q, h) * 255,
    hue2rgb(p, q, h - 1 / 3) * 255,
  ]
}

function setLightness(hex: string, targetLightness: number): string {
  const [h, s] = rgbToHsl(hexToRgb(hex))
  return rgbToHex(hslToRgb([h, s, targetLightness]))
}

function relativeLuminance(hex: string): number {
  const linearize = (c: number) => {
    c /= 255
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  }
  const [r, g, b] = hexToRgb(hex).map(linearize)
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

/** WCAG contrast ratio between two colors, always ≥ 1. */
export function contrastRatio(hexA: string, hexB: string): number {
  const lumA = relativeLuminance(hexA)
  const lumB = relativeLuminance(hexB)
  const [lighter, darker] = lumA > lumB ? [lumA, lumB] : [lumB, lumA]
  return (lighter + 0.05) / (darker + 0.05)
}

/**
 * Picks whichever of the two candidate text colors has the higher contrast
 * against `bgHex` — computed per-color rather than assumed, since several of
 * the extracted category hexes (e.g. Suffer's `#883529`, Threshold's
 * `#1D1D1B`) need a light-text override while others need dark text.
 */
export function getAccentTextColor(
  bgHex: string,
  lightCandidate = '#FFFFFF',
  darkCandidate = sharedInk,
): string {
  const lightContrast = contrastRatio(bgHex, lightCandidate)
  const darkContrast = contrastRatio(bgHex, darkCandidate)
  return lightContrast >= darkContrast ? lightCandidate : darkCandidate
}

// --- Shared neutral + derived light/dark shell ramp --------------------
// The app shell (nav, settings, generic surfaces) isn't scoped to either
// book, so it uses a neutral derived by averaging both books' near-identical
// `ink` values (they share the same `paper`, #FFFFFF, exactly) rather than
// favoring one book's warmth over the other's. Per-game screens still use
// ironswornTokens/starforgedTokens directly for that book's own typography.
function averageHex(hexA: string, hexB: string): string {
  const [rA, gA, bA] = hexToRgb(hexA)
  const [rB, gB, bB] = hexToRgb(hexB)
  return rgbToHex([(rA + rB) / 2, (gA + gB) / 2, (bA + bB) / 2])
}

export const sharedInk = averageHex(ironswornTokens.ink, starforgedTokens.ink)
const paper = '#FFFFFF'

export interface ThemeSurface {
  bg: string
  surface: string
  border: string
  text: string
  textMuted: string
}

// Lightness targets chosen empirically so every text/bg pair clears WCAG AA
// (4.5:1) and borders clear the ~3:1 non-text contrast guideline (1.4.11) —
// see the ratios validated for these exact values before they were set here.
export const lightTheme: ThemeSurface = {
  bg: paper,
  surface: setLightness(sharedInk, 97),
  border: setLightness(sharedInk, 55),
  text: sharedInk,
  textMuted: setLightness(sharedInk, 38),
}

export const darkTheme: ThemeSurface = {
  bg: setLightness(sharedInk, 11),
  surface: setLightness(sharedInk, 18),
  border: setLightness(sharedInk, 40),
  text: setLightness(sharedInk, 95),
  textMuted: setLightness(sharedInk, 68),
}

export function getThemeSurface(mode: ThemeMode): ThemeSurface {
  return mode === 'dark' ? darkTheme : lightTheme
}

// --- CSS variable plumbing ----------------------------------------------
// tailwind.config.ts injects lightTheme/darkTheme under these names via an
// addBase plugin (:root / .dark). Components read the same names as Tailwind
// arbitrary-value colors (e.g. `bg-[var(--color-surface)]`) instead of
// hardcoding a hex, so the two stay in sync without duplication.
export const cssVar = {
  bg: '--color-bg',
  surface: '--color-surface',
  border: '--color-border',
  text: '--color-text',
  textMuted: '--color-text-muted',
  categoryAccent: '--category-accent',
  categoryAccentText: '--category-accent-text',
} as const

export function themeSurfaceToCssVars(theme: ThemeSurface): Record<string, string> {
  return {
    [cssVar.bg]: theme.bg,
    [cssVar.surface]: theme.surface,
    [cssVar.border]: theme.border,
    [cssVar.text]: theme.text,
    [cssVar.textMuted]: theme.textMuted,
  }
}

/**
 * Per-move category accent, applied as inline CSS variables (e.g. on a
 * MoveCard's root element) since the color varies per move and can't be a
 * static Tailwind class. Components then use `bg-[var(--category-accent)]`
 * etc. and `text-[var(--category-accent-text)]` for text placed directly on
 * that accent (chip label, header bar title) per SPEC §5.
 */
export function getCategoryAccentVars(categoryColor: string): Record<string, string> {
  return {
    [cssVar.categoryAccent]: categoryColor,
    [cssVar.categoryAccentText]: getAccentTextColor(categoryColor),
  }
}
