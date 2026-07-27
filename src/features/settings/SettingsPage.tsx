import { useState } from 'react'
import { getStoredGame, setStoredGame } from '../../app/useSelectedGame'
import type { Game } from '../../data/schema'
import { useTheme, type ThemeSetting } from '../../styles/useTheme'

const THEME_OPTIONS: ThemeSetting[] = ['system', 'light', 'dark']
const GAME_OPTIONS: { id: Game; label: string }[] = [
  { id: 'starforged', label: 'Starforged' },
  { id: 'ironsworn', label: 'Ironsworn' },
]

// Theme (Ticket 3) and default game (Ticket 4's useSelectedGame — same
// storage key the tab bar already reads) are real. Language lands in
// Ticket 9's i18n scaffold.
export function SettingsPage() {
  const { setting, effective, setSetting } = useTheme()
  const [defaultGame, setDefaultGame] = useState<Game>(getStoredGame)

  return (
    <div className="p-4">
      <h2 className="mb-4 font-display text-2xl uppercase tracking-wide">Settings</h2>

      <section className="mb-6">
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

      <section className="mb-6">
        <h3 className="mb-2 font-display text-sm uppercase tracking-wide text-ink-muted">
          Default game on launch
        </h3>
        <div className="inline-flex gap-1 rounded-full border border-border bg-surface p-1">
          {GAME_OPTIONS.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              onClick={() => {
                setStoredGame(id)
                setDefaultGame(id)
              }}
              className={
                'rounded-full px-3 py-1 text-sm ' +
                (defaultGame === id ? 'bg-bg text-ink' : 'text-ink-muted')
              }
            >
              {label}
            </button>
          ))}
        </div>
      </section>

      <p className="text-ink-muted">Language settings land in Ticket 9.</p>
    </div>
  )
}
