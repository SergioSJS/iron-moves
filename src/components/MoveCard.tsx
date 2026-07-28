import type { CSSProperties } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import type { Game, Move } from '../data/schema'
import { getGameFontClass } from '../styles/gameTheme'
import { getCategoryAccentVars } from '../styles/tokens'
import { FavoriteButton } from './FavoriteButton'
import { toPlainText } from './richTextUtils'

// First sentence of the plain-text trigger, keeping the final period. Falls
// back to the whole text when there's no ". " boundary (single-sentence
// triggers, or ones ending in "…" like "If you act…").
function firstSentence(text: string): string {
  const boundary = text.indexOf('. ')
  return boundary === -1 ? text : text.slice(0, boundary + 1)
}

// Move-list row: title + trigger snippet + category color as a left accent
// bar (SPEC §7), plus a favorite star (SPEC §7's "star from list or detail
// view"). The snippet is the trigger's first sentence, wrapped (no line
// clamp): a one-line clamp hid too much in longer locales like pt-BR, but the
// full trigger can run to a whole paragraph (e.g. Aid Your Ally). The title
// link uses the "stretched link" pattern
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
  const { i18n } = useTranslation()
  const vars = getCategoryAccentVars(categoryColor) as CSSProperties
  return (
    <div
      style={vars}
      className={
        'relative flex items-center gap-2 rounded-lg border-l-4 border-[var(--category-accent)] bg-surface p-3 shadow-[0_0_10px_-6px_var(--category-accent)] transition-all hover:shadow-[0_0_14px_-4px_var(--category-accent)] ' +
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
          className={
            getGameFontClass(game) +
            ' text-base uppercase tracking-wide after:absolute after:inset-0'
          }
        >
          {move.title}
        </Link>
        <span className="text-sm text-ink-muted">
          {firstSentence(toPlainText(move.trigger, game, i18n.language))}
        </span>
      </div>
      <FavoriteButton game={game} moveId={move.id} className="relative z-10" />
    </div>
  )
}
