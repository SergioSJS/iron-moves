// Per-game visual personality (display font + atmospheric background glow)
// — user-directed evolution of SPEC §5's original "one shared display font"
// call, after exploring github.com/sergiosjs/iron-oracle's per-game theming
// (distinct font + layered gradient background per book). The glow tints
// layer on top of our own already WCAG-validated light/dark surface
// (tokens.ts) via CSS variables, not a separate invented palette or a
// React-state-driven inline style — background-color already tracks the
// theme correctly through the existing `.dark` class + CSS var cascade
// (see tailwind.config.ts's addBase), and the game glow needs the same
// "reliably global, not tied to one component's hook instance" mechanism:
// useTheme() is a per-call-site hook (independent state per component), so
// an inline style computed from *one* component's `effective` value goes
// stale the moment a *different* component (e.g. Settings) changes the
// theme — confirmed the hard way. The `data-current-game` attribute below
// is set as a plain DOM side effect (RootLayout), the same pattern theme
// itself already uses successfully.
import type { Game } from '../data/schema'

export function getGameFontClass(game: Game): string {
  return game === 'ironsworn' ? 'font-ironsworn' : 'font-starforged'
}

const GAME_GLOW: Record<Game, { a: string; b: string }> = {
  // Warm brown + cool blue-gray glow — Ironsworn's ink/barDark family.
  ironsworn: { a: 'rgba(120,90,40,0.12)', b: 'rgba(70,90,110,0.08)' },
  // Blue + purple glow — drawn from Starforged's own adventure/quest hues.
  starforged: { a: 'rgba(32,96,135,0.14)', b: 'rgba(128,90,144,0.1)' },
}

export function getGameBackgroundImageCss(game: Game): string {
  const glow = GAME_GLOW[game]
  return `radial-gradient(circle at 15% 0%, ${glow.a} 0%, transparent 55%), radial-gradient(circle at 90% 25%, ${glow.b} 0%, transparent 50%)`
}
