// Per-game visual personality, following the theming of
// sergiosjs.github.io/iron-oracle (the companion oracle app by the same
// author): each book gets its own display font for titles, its own body
// font for content text, and a layered background (two soft radial glows
// over an opaque linear-gradient base) that differs between light and dark
// mode. The background/body-font wiring lives in tailwind.config.ts's
// addBase, driven purely by the `data-current-game` DOM attribute
// (RootLayout) — the same reliable-and-global mechanism `.dark` itself
// uses, rather than a React-state-computed inline style. useTheme() is a
// per-call-site hook (independent state per component), so an inline style
// computed from *one* component's `effective` value goes stale the moment
// a *different* component (e.g. Settings) changes the theme — confirmed
// the hard way. The `data-current-game` attribute is set as a plain DOM
// side effect, the same pattern theme itself already uses successfully.
import type { Game } from '../data/schema'
import type { ThemeMode } from './tokens'

/** Display font for game-scoped titles (move names, category names). */
export function getGameFontClass(game: Game): string {
  return game === 'ironsworn' ? 'font-ironsworn' : 'font-starforged'
}

// Same families as tailwind.config.ts's fontFamily.ironsworn/starforged,
// as raw CSS for the addBase rules that style the "Pocket Moves" wordmark
// (.app-brand) per current game — iron-oracle styles its app title in the
// game's title face the same way.
export function getGameDisplayFontFamily(game: Game): string {
  return game === 'ironsworn' ? 'Metamorphous, cursive' : 'Orbitron, sans-serif'
}

// Body font for game-scoped content text, applied to <body> by
// tailwind.config.ts so every descendant inherits it (elements with their
// own font-* utility — titles, chips — keep theirs). Matches iron-oracle's
// --font-body per book: Georgia serif for Ironsworn, Exo 2 for Starforged.
export function getGameBodyFontFamily(game: Game): string {
  return game === 'ironsworn' ? 'Georgia, serif' : '"Exo 2", sans-serif'
}

// Backgrounds taken verbatim from iron-oracle's per-game, per-mode app
// container (its .theme-light/.theme-dark × .theme-ironsworn/.theme-
// starforged rules): radial glow at 20%/50% + radial glow at 80%/80% over
// a 135° linear-gradient base. The base layer is opaque, so it fully
// replaces the neutral --color-bg on game-scoped screens.
const GAME_BACKGROUNDS: Record<Game, Record<ThemeMode, string>> = {
  ironsworn: {
    light:
      'radial-gradient(circle at 20% 50%, rgba(201,169,97,0.08) 0%, transparent 50%), ' +
      'radial-gradient(circle at 80% 80%, rgba(139,115,85,0.05) 0%, transparent 50%), ' +
      'linear-gradient(135deg, #f5f0e8, #e8e0d4, #f5f0e8)',
    dark:
      'radial-gradient(circle at 20% 50%, rgba(120,80,40,0.03) 0%, transparent 50%), ' +
      'radial-gradient(circle at 80% 80%, rgba(60,100,140,0.03) 0%, transparent 50%), ' +
      'linear-gradient(135deg, #0a0806, #1a1815, #0a0806)',
  },
  starforged: {
    light:
      'radial-gradient(circle at 20% 50%, rgba(139,163,212,0.1) 0%, transparent 50%), ' +
      'radial-gradient(circle at 80% 80%, rgba(100,120,200,0.08) 0%, transparent 50%), ' +
      'linear-gradient(135deg, #e8eaf6, #d1d9f0, #e8eaf6)',
    dark:
      'radial-gradient(circle at 20% 50%, rgba(80,100,180,0.05) 0%, transparent 50%), ' +
      'radial-gradient(circle at 80% 80%, rgba(120,60,160,0.05) 0%, transparent 50%), ' +
      'linear-gradient(135deg, #0a0a12, #151520, #0a0a12)',
  },
}

export function getGameBackgroundCss(game: Game, mode: ThemeMode): string {
  return GAME_BACKGROUNDS[game][mode]
}

// Horizontal scanline texture overlaid on the whole app — iron-oracle's
// .app-container::before: 2px transparent + 2px black lines at 0deg,
// stronger in dark mode (3% black) than light (1%). Applied app-wide (not
// just game-scoped screens) as a fixed body::before in tailwind.config.ts.
export function getScanlineCss(mode: ThemeMode): string {
  const alpha = mode === 'dark' ? '0.03' : '0.01'
  return `repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,${alpha}) 2px, rgba(0,0,0,${alpha}) 4px)`
}
