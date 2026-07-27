import type { Game } from '../data/schema'

const GAMES: { id: Game; label: string }[] = [
  { id: 'starforged', label: 'Starforged' },
  { id: 'ironsworn', label: 'Ironsworn' },
]

// Persistent segmented control at the top of Browse/Search (SPEC §7) — game
// switching is a frequent, layout-preserving action, not a 5th tab.
export function GameSwitcher({
  game,
  onChange,
}: {
  game: Game
  onChange: (game: Game) => void
}) {
  return (
    <div
      role="tablist"
      aria-label="Game"
      className="inline-flex rounded-full border border-border bg-surface p-1"
    >
      {GAMES.map(({ id, label }) => (
        <button
          key={id}
          type="button"
          role="tab"
          aria-selected={id === game}
          onClick={() => onChange(id)}
          className={
            'rounded-full px-4 py-1.5 font-display text-sm uppercase tracking-wide transition-colors ' +
            (id === game ? 'bg-bg text-ink' : 'text-ink-muted')
          }
        >
          {label}
        </button>
      ))}
    </div>
  )
}
