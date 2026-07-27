import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import type { Game, Move } from '../data/schema'
import { getCategoryAccentVars } from '../styles/tokens'
import { FavoriteButton } from './FavoriteButton'
import { toPlainText } from './richTextUtils'

// Move-list row: title + one-line trigger snippet + category color as a left
// accent bar (SPEC §7), plus a favorite star (SPEC §7's "star from list or
// detail view"). The title link uses the "stretched link" pattern
// (after:absolute after:inset-0) to make the whole row clickable, with the
// star as a sibling rather than nested inside the link — a button nested
// inside an anchor is invalid HTML and pollutes the link's accessible name
// with the star's own label ("Add to favorites"), which is exactly what
// broke this row's a11y-tree lookup during testing.
export function MoveCard({
  move,
  categoryColor,
  game,
  active = false,
  onSelect,
}: {
  move: Move
  categoryColor: string
  game: Game
  // Highlights this row in a master-detail list (md+) when its detail is
  // the one currently shown in the adjacent pane.
  active?: boolean
  // When provided, clicking selects in-place instead of navigating (Search's
  // md+ master-detail pane — a result's game isn't always the URL's :game).
  onSelect?: (move: Move) => void
}) {
  const vars = getCategoryAccentVars(categoryColor) as CSSProperties
  return (
    <div
      style={vars}
      className={
        'relative flex items-center gap-2 rounded-lg border-l-4 border-[var(--category-accent)] bg-surface p-3 shadow-sm transition-all hover:shadow-md ' +
        (active ? 'md:ring-2 md:ring-accent' : '')
      }
    >
      <div className="flex flex-1 flex-col gap-1">
        <Link
          to={`/${game}/browse/${move.categoryId}/${move.id}`}
          aria-current={active ? 'true' : undefined}
          onClick={
            onSelect
              ? (event) => {
                  event.preventDefault()
                  onSelect(move)
                }
              : undefined
          }
          className="font-display text-base uppercase tracking-wide after:absolute after:inset-0"
        >
          {move.title}
        </Link>
        <span className="line-clamp-1 text-sm text-ink-muted">
          {toPlainText(move.trigger, game)}
        </span>
      </div>
      <FavoriteButton game={game} moveId={move.id} className="relative z-10" />
    </div>
  )
}
