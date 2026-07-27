import type { CSSProperties } from 'react'
import type { Game } from '../data/schema'
import { getGameFontClass } from '../styles/gameTheme'
import { getOutcomeAccentVars, outcomeAccents } from '../styles/tokens'
import { RichText } from './RichText'

const LABELS: Record<keyof typeof outcomeAccents, string> = {
  hit: 'Hit',
  strongHit: 'Strong Hit',
  weakHit: 'Weak Hit',
  miss: 'Miss',
}

// "Strong Hit / Weak Hit / Miss as visually separated blocks... think
// stat-block cards: a colored label + the text" — SPEC §7. The card itself
// stays on a neutral surface; only the small label chip carries the accent.
export function OutcomeBlock({
  outcomeKey,
  text,
  game,
  onOpenMove,
}: {
  outcomeKey: keyof typeof outcomeAccents
  text: string
  game: Game
  onOpenMove?: (moveId: string) => void
}) {
  const vars = getOutcomeAccentVars(outcomeAccents[outcomeKey]) as CSSProperties
  return (
    <div className="rounded-lg border border-border bg-surface p-3">
      <span
        style={vars}
        className={
          getGameFontClass(game) +
          ' mb-2 inline-block rounded bg-[var(--outcome-accent)] px-2 py-0.5 text-xs uppercase tracking-wide text-[var(--outcome-accent-text)]'
        }
      >
        {LABELS[outcomeKey]}
      </span>
      <RichText text={text} game={game} onOpenMove={onOpenMove} />
    </div>
  )
}
