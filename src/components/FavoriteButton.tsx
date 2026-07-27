import { useTranslation } from 'react-i18next'
import type { Game } from '../data/schema'
import { useFavorite } from '../features/favorites/useFavorites'

// Star/unstar — usable from a move-list row (inside a Link, hence
// stopPropagation) or the move-detail view (SPEC §7).
export function FavoriteButton({
  game,
  moveId,
  className,
}: {
  game: Game
  moveId: string
  className?: string
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
        (isFavorite ? 'text-amber-500' : 'text-ink-muted') +
        ' ' +
        (className ?? '')
      }
    >
      {isFavorite ? '★' : '☆'}
    </button>
  )
}
