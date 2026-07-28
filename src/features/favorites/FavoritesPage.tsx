import { useTranslation } from 'react-i18next'
import { MoveCard } from '../../components/MoveCard'
import { getGameContent } from '../../data'
import type { Game } from '../../data/schema'
import { resolveCategoryColor } from '../../styles/colorStyle'
import { useFavoriteList } from './useFavorites'

// Game titles are proper nouns — not translated.
const GAME_LABELS: Record<Game, string> = {
  starforged: 'Starforged',
  ironsworn: 'Ironsworn',
}

// Starred moves, one tap away without browsing (SPEC §7) — grouped by game
// since favorites can span both books and several move ids collide between
// them (face-danger, pay-the-price, …).
export function FavoritesPage() {
  const { t, i18n } = useTranslation()
  const favorites = useFavoriteList(i18n.language)

  if (favorites.length === 0) {
    return (
      <div className="p-4">
        <h2 className="mb-2 font-display text-2xl uppercase tracking-wide">
          {t('favorites.heading')}
        </h2>
        <p className="text-ink-muted">{t('favorites.empty')}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-4">
      <h2 className="font-display text-2xl uppercase tracking-wide">
        {t('favorites.heading')}
      </h2>
      {(['starforged', 'ironsworn'] as const).map((game) => {
        const entries = favorites.filter((entry) => entry.game === game)
        if (entries.length === 0) return null
        return (
          <section key={game}>
            <h3 className="mb-2 font-display text-sm uppercase tracking-wide text-ink-muted">
              {GAME_LABELS[game]}
            </h3>
            <ul className="space-y-2">
              {entries.map(({ move }) => {
                const category = getGameContent(game, i18n.language).categories.find(
                  (c) => c.id === move.categoryId,
                )
                return (
                  <li key={move.id}>
                    <MoveCard
                      move={move}
                      categoryColor={resolveCategoryColor(
                        move.categoryId,
                        category?.color ?? '#30393D',
                      )}
                      game={game}
                    />
                  </li>
                )
              })}
            </ul>
          </section>
        )
      })}
    </div>
  )
}
