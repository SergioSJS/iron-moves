import { useTranslation } from 'react-i18next'
import type { Game } from '../data/schema'
import { useFavorite } from '../features/favorites/useFavorites'

// Star/unstar — usable from a move-list row (inside a Link, hence
// stopPropagation) or the move-detail view (SPEC §7).
export function FavoriteButton({
  game,
  moveId,
  className,
  unfavoritedClassName = 'text-ink-muted',
}: {
  game: Game
  moveId: string
  className?: string
  // The ☆ state sits on the neutral surface by default (text-ink-muted),
  // but MoveDetailContent places this button directly on the category's
  // colored header — override with that header's own accent-text color so
  // the outline star stays legible against whatever hue the move belongs to.
  unfavoritedClassName?: string
}) {
  const { t } = useTranslation()
  const { isFavorite, toggle } = useFavorite(game, moveId)
  return (
    <button
      type="button"
      aria-label={isFavorite ? t('favoriteButton.remove') : t('favoriteButton.add')}
      aria-pressed={isFavorite}
      onClick={(event) => {
        event.preventDefault()
        event.stopPropagation()
        toggle()
      }}
      className={
        'text-2xl leading-none ' +
        (isFavorite ? 'text-amber-500' : unfavoritedClassName) +
        ' ' +
        (className ?? '')
      }
    >
      {isFavorite ? '★' : '☆'}
    </button>
  )
}
