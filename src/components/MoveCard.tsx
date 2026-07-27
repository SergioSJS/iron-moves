import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import type { Game, Move } from '../data/schema'
import { getCategoryAccentVars } from '../styles/tokens'
import { toPlainText } from './richTextUtils'

// Move-list row: title + one-line trigger snippet + category color as a left
// accent bar (SPEC §7).
export function MoveCard({
  move,
  categoryColor,
  game,
}: {
  move: Move
  categoryColor: string
  game: Game
}) {
  const vars = getCategoryAccentVars(categoryColor) as CSSProperties
  return (
    <Link
      to={`/${game}/browse/${move.categoryId}/${move.id}`}
      style={vars}
      className="flex flex-col gap-1 rounded-lg border-l-4 border-[var(--category-accent)] bg-surface p-3"
    >
      <span className="font-display text-base uppercase tracking-wide">{move.title}</span>
      <span className="line-clamp-1 text-sm text-ink-muted">
        {toPlainText(move.trigger, game)}
      </span>
    </Link>
  )
}
