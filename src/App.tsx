import type { CSSProperties } from 'react'
import {
  getCategoryAccentVars,
  ironswornTokens,
  starforgedCategoryColors,
} from './styles/tokens'
import { useTheme, type ThemeSetting } from './styles/useTheme'

const THEME_OPTIONS: ThemeSetting[] = ['system', 'light', 'dark']

function CategoryChip({ label, color }: { label: string; color: string }) {
  const vars = getCategoryAccentVars(color) as CSSProperties
  return (
    <span
      style={vars}
      className="rounded-full bg-[var(--category-accent)] px-3 py-1 font-display text-sm uppercase tracking-wide text-[var(--category-accent-text)]"
    >
      {label}
    </span>
  )
}

// Ticket 3 smoke test for design tokens + theming (SPEC §5). Replaced by the
// real navigation shell in Ticket 4 — this just proves the token/CSS-var/
// dark-mode pipeline works end to end before anything else is built on it.
function App() {
  const { setting, effective, setSetting } = useTheme()

  return (
    <main className="min-h-screen bg-bg p-6 text-ink">
      <header className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-3xl uppercase tracking-wide">Pocket Moves</h1>
        <div className="flex gap-1 rounded-full border border-border bg-surface p-1">
          {THEME_OPTIONS.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setSetting(option)}
              className={
                'rounded-full px-3 py-1 text-sm capitalize ' +
                (setting === option ? 'bg-bg text-ink' : 'text-ink-muted')
              }
            >
              {option}
            </button>
          ))}
        </div>
      </header>

      <p className="mb-6 text-ink-muted">
        Design tokens smoke test — effective theme:{' '}
        <strong className="text-ink">{effective}</strong>
      </p>

      <section className="mb-6 rounded-lg border border-border bg-surface p-4">
        <h2 className="mb-3 font-display text-lg uppercase tracking-wide text-ink-muted">
          Starforged categories
        </h2>
        <div className="flex flex-wrap gap-2">
          {Object.entries(starforgedCategoryColors).map(([id, color]) => (
            <CategoryChip key={id} label={id} color={color} />
          ))}
        </div>
      </section>

      <section className="rounded-lg border border-border bg-surface p-4">
        <h2 className="mb-3 font-display text-lg uppercase tracking-wide text-ink-muted">
          Ironsworn (two-tone, no per-category color)
        </h2>
        <CategoryChip label="Adventure Moves" color={ironswornTokens.barDark} />
      </section>
    </main>
  )
}

export default App
