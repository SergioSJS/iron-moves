import { useTheme, type ThemeSetting } from '../../styles/useTheme'

const THEME_OPTIONS: ThemeSetting[] = ['system', 'light', 'dark']

// Theme control is real (built in Ticket 3's useTheme hook). Language and
// default-game controls land in Ticket 7.
export function SettingsPage() {
  const { setting, effective, setSetting } = useTheme()

  return (
    <div className="p-4">
      <h2 className="mb-4 font-display text-2xl uppercase tracking-wide">Settings</h2>

      <section>
        <h3 className="mb-2 font-display text-sm uppercase tracking-wide text-ink-muted">
          Theme
        </h3>
        <div className="inline-flex gap-1 rounded-full border border-border bg-surface p-1">
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
        <p className="mt-2 text-sm text-ink-muted">Effective: {effective}</p>
      </section>

      <p className="mt-6 text-ink-muted">
        Language and default-game settings land in Ticket 7.
      </p>
    </div>
  )
}
