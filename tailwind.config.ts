import type { Config } from 'tailwindcss'
import plugin from 'tailwindcss/plugin'
import { getGameBackgroundImageCss } from './src/styles/gameTheme'
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
      addBase({
        ':root': { ...themeSurfaceToCssVars(lightTheme), [cssVar.accent]: appAccent },
        '.dark': themeSurfaceToCssVars(darkTheme),
        // Per-game atmospheric background glow (see gameTheme.ts) — driven
        // purely by the `data-current-game` DOM attribute (RootLayout), the
        // same reliable-and-global mechanism `.dark` itself uses, rather
        // than a React-state-computed inline style.
        '#main-content': { backgroundColor: `var(${cssVar.bg})` },
        '[data-current-game="ironsworn"] #main-content': {
          backgroundImage: getGameBackgroundImageCss('ironsworn'),
          backgroundAttachment: 'fixed',
        },
        '[data-current-game="starforged"] #main-content': {
          backgroundImage: getGameBackgroundImageCss('starforged'),
          backgroundAttachment: 'fixed',
        },
      })
    }),
  ],
} satisfies Config
