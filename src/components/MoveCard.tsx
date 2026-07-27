import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import type { Game, Move } from '../data/schema'
import { getCategoryAccentVars } from '../styles/tokens'
import { FavoriteButton } from './FavoriteButton'
import { toPlainText } from './richTextUtils'

// Move-list row: title + one-line trigger snippet + category color as a left
// accent bar (SPEC §7), plus a favorite star (SPEC §7's "star from list or
// detail view").
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
      className="flex items-center gap-2 rounded-lg border-l-4 border-[var(--category-accent)] bg-surface p-3"
    >
      <div className="flex flex-1 flex-col gap-1">
        <span className="font-display text-base uppercase tracking-wide">
          {move.title}
        </span>
        <span className="line-clamp-1 text-sm text-ink-muted">
          {toPlainText(move.trigger, game)}
        </span>
      </div>
      <FavoriteButton game={game} moveId={move.id} />
    </Link>
  )
}
