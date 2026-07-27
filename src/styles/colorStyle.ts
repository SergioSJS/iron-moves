// User-opt-in alternate category palette (Settings → "Category colors").
// tokens.ts's starforgedCategoryColors/ironswornTokens.barDark are the
// book-accurate extraction and stay the default — this file is a separate,
// intentionally-invented palette for people who find the book's muted,
// low-contrast-between-hues colors hard to tell apart at a glance. Keyed the
// same way as categoryIconMap.ts (category.id minus "-moves"), covering both
// games' full category vocabulary (18 keywords) rather than only
// Starforged's 11 — Ironsworn categories get their own distinct hues here
// too, instead of staying two-tone, since that's the whole point of this
// toggle existing.
export const vibrantCategoryColors: Record<string, string> = {
  session: '#0D9488',
  adventure: '#2563EB',
  quest: '#9333EA',
  connection: '#DB2777',
  exploration: '#0891B2',
  combat: '#EA580C',
  suffer: '#DC2626',
  recover: '#16A34A',
  threshold: '#18181B',
  legacy: '#4F46E5',
  fate: '#C026D3',
  journey: '#0284C7',
  'scene-challenge': '#D97706',
  relationship: '#E11D48',
  delve: '#7C3AED',
  failure: '#475569',
  threat: '#CA8A04',
  rarity: '#059669',
}

export type ColorStyle = 'original' | 'vibrant'

const STORAGE_KEY = 'pocket-moves:color-style'

function isColorStyle(value: string | null): value is ColorStyle {
  return value === 'original' || value === 'vibrant'
}

export function getStoredColorStyle(): ColorStyle {
  const stored = localStorage.getItem(STORAGE_KEY)
  return isColorStyle(stored) ? stored : 'original'
}

export function setStoredColorStyle(style: ColorStyle): void {
  localStorage.setItem(STORAGE_KEY, style)
}

/**
 * Resolves the color actually rendered for a category, honoring the
 * Settings toggle. 'original' (default) returns the book-accurate hex from
 * the generated content (Category.color) untouched. No hook needed — this
 * is a plain synchronous localStorage read, safe to call directly in any
 * component's render body; it naturally picks up the latest value on
 * whatever next render already happens (a Settings change navigates away,
 * remounting whichever screen you return to).
 */
export function resolveCategoryColor(categoryId: string, originalColor: string): string {
  if (getStoredColorStyle() === 'original') return originalColor
  const keyword = categoryId.replace(/-moves$/, '')
  return vibrantCategoryColors[keyword] ?? originalColor
}
