import { MoveCard } from '../../components/MoveCard'
import { getGameContent } from '../../data'
import type { Game } from '../../data/schema'
import { useFavoriteList } from './useFavorites'

const GAME_LABELS: Record<Game, string> = {
  starforged: 'Starforged',
  ironsworn: 'Ironsworn',
}

// Starred moves, one tap away without browsing (SPEC §7) — grouped by game
// since favorites can span both books and several move ids collide between
// them (face-danger, pay-the-price, …).
export function FavoritesPage() {
  const favorites = useFavoriteList()

  if (favorites.length === 0) {
    return (
      <div className="p-4">
        <h2 className="mb-2 font-display text-2xl uppercase tracking-wide">Favorites</h2>
        <p className="text-ink-muted">
          No favorites yet — tap the ☆ on any move, from a list or its detail view, to pin
          it here.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-4">
      <h2 className="font-display text-2xl uppercase tracking-wide">Favorites</h2>
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
                const category = getGameContent(game).categories.find(
                  (c) => c.id === move.categoryId,
                )
                return (
                  <li key={move.id}>
                    <MoveCard
                      move={move}
                      categoryColor={category?.color ?? '#30393D'}
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
