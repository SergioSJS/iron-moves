import { useParams } from 'react-router-dom'
import { getGameContent } from '../../data'
import { isGame } from '../../data/schema'

// Stub — the move-list-within-category UI (title + trigger snippet, colored
// left accent) lands in Ticket 5. This just proves the route/params work.
export function CategoryPage() {
  const { game: gameParam, categoryId } = useParams<{
    game: string
    categoryId: string
  }>()
  const game = isGame(gameParam) ? gameParam : 'starforged'
  const { categories, moves } = getGameContent(game)
  const category = categories.find((c) => c.id === categoryId)
  const moveCount = moves.filter((m) => m.categoryId === categoryId).length

  return (
    <div className="p-4">
      <h2 className="mb-2 font-display text-2xl uppercase tracking-wide">
        {category?.name ?? categoryId}
      </h2>
      <p className="text-ink-muted">
        {moveCount} move{moveCount === 1 ? '' : 's'} — move list UI lands in Ticket 5.
      </p>
    </div>
  )
}
