import type { Config } from 'tailwindcss'
import plugin from 'tailwindcss/plugin'
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
        display: ['Oswald', 'sans-serif'],
        body: [
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'Roboto',
          'sans-serif',
        ],
      },
    },
  },
  plugins: [
    plugin(({ addBase }) => {
      addBase({
        ':root': { ...themeSurfaceToCssVars(lightTheme), [cssVar.accent]: appAccent },
        '.dark': themeSurfaceToCssVars(darkTheme),
      })
    }),
  ],
} satisfies Config
