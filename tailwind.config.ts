import type { Config } from 'tailwindcss'
import plugin from 'tailwindcss/plugin'
import {
  getGameBackgroundCss,
  getGameBodyFontFamily,
  getGameDisplayFontFamily,
  getScanlineCss,
} from './src/styles/gameTheme'
import {
  appAccent,
  cssVar,
  darkTheme,
  lightTheme,
  themeSurfaceToCssVars,
} from './src/styles/tokens'

// Colors/fonts come from src/styles/tokens.ts (SPEC §5) — never hand-add a
// hex here. Semantic colors (bg/surface/border/ink/ink-muted) resolve to CSS
// variables injected below, so `dark:` variants aren't needed per-component;
// per-move category accents are separate CSS vars set inline by components
// (see tokens.ts's getCategoryAccentVars) since they vary per move.
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: `var(${cssVar.bg})`,
        surface: `var(${cssVar.surface})`,
        border: `var(${cssVar.border})`,
        ink: `var(${cssVar.text})`,
        'ink-muted': `var(${cssVar.textMuted})`,
        paper: '#FFFFFF',
        accent: `var(${cssVar.accent})`,
      },
      fontFamily: {
        // Neutral app chrome (brand, tab bar, Settings/Favorites — anything
        // not scoped to one game). Game-scoped screens use `ironsworn`/
        // `starforged` instead, picked per SPEC-evolving user direction to
        // give each book its own personality rather than one shared face.
        display: ['Oswald', 'sans-serif'],
        body: [
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'Roboto',
          'sans-serif',
        ],
        ironsworn: ['Metamorphous', 'cursive'],
        starforged: ['Orbitron', 'sans-serif'],
      },
    },
  },
  plugins: [
    plugin(({ addBase }) => {
      // Per-game background + fonts (see gameTheme.ts) — driven purely by
      // the `data-current-game` DOM attribute (RootLayout), the same
      // reliable-and-global mechanism `.dark` itself uses, rather than a
      // React-state-computed inline style. `.dark` and `data-current-game`
      // both live on <html>, so the dark variants use the compound selector
      // `.dark[data-current-game=...]` — a plain descendant selector
      // (`.dark [data-current-game=...]`) can never match, since an element
      // isn't its own descendant.
      //
      // The background goes on <body> so every chrome piece shares it
      // (mobile brand header, main content), and the tab bar (.app-tabbar)
      // gets its own copy instead of being made transparent — on mobile
      // it's a fixed bottom bar that must stay opaque over scrolling
      // content. `background-attachment: fixed` on both keeps the two
      // copies pixel-aligned (both resolve against the viewport), so the
      // bar reads as a seamless continuation of the page background.
      const perGame: Record<string, Record<string, string>> = {}
      for (const game of ['ironsworn', 'starforged'] as const) {
        perGame[`[data-current-game="${game}"] body`] = {
          backgroundImage: getGameBackgroundCss(game, 'light'),
          backgroundAttachment: 'fixed',
          fontFamily: getGameBodyFontFamily(game),
        }
        perGame[`.dark[data-current-game="${game}"] body`] = {
          backgroundImage: getGameBackgroundCss(game, 'dark'),
        }
        perGame[`[data-current-game="${game}"] .app-tabbar`] = {
          backgroundImage: getGameBackgroundCss(game, 'light'),
          backgroundAttachment: 'fixed',
        }
        perGame[`.dark[data-current-game="${game}"] .app-tabbar`] = {
          backgroundImage: getGameBackgroundCss(game, 'dark'),
        }
        // "Pocket Moves" wordmark takes the game's display face, the way
        // iron-oracle styles its own app title.
        perGame[`[data-current-game="${game}"] .app-brand`] = {
          fontFamily: getGameDisplayFontFamily(game),
        }
      }
      addBase({
        ':root': { ...themeSurfaceToCssVars(lightTheme), [cssVar.accent]: appAccent },
        '.dark': themeSurfaceToCssVars(darkTheme),
        ...perGame,
        // Horizontal scanline texture over the whole app (iron-oracle's
        // .app-container::before) — app-wide, not game-scoped. Fixed +
        // pointer-events:none so it floats above everything without
        // intercepting taps; the high z-index puts it over positioned
        // chrome too (z-10 tab bar, modals), which is exactly the CRT
        // texture effect the original has.
        'body::before': {
          content: '""',
          position: 'fixed',
          inset: '0',
          backgroundImage: getScanlineCss('light'),
          pointerEvents: 'none',
          zIndex: '9999',
        },
        '.dark body::before': {
          backgroundImage: getScanlineCss('dark'),
        },
      })
    }),
  ],
} satisfies Config
