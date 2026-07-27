import { useTranslation } from 'react-i18next'
import { Link, useParams } from 'react-router-dom'
import { CategoryChip } from '../../components/CategoryChip'
import { MoveCard } from '../../components/MoveCard'
import { getGameContent } from '../../data'
import { isGame } from '../../data/schema'

export function CategoryPage() {
  const { t, i18n } = useTranslation()
  const { game: gameParam, categoryId } = useParams<{
    game: string
    categoryId: string
  }>()
  const game = isGame(gameParam) ? gameParam : 'starforged'
  const { categories, moves } = getGameContent(game, i18n.language)
  const category = categories.find((c) => c.id === categoryId)
  const categoryMoves = moves.filter((m) => m.categoryId === categoryId)

  return (
    <div className="p-4">
      <Link to={`/${game}/browse`} className="mb-3 inline-block text-sm text-ink-muted">
        ← {t('browse.categories')}
      </Link>
      <div className="mb-3">
        <CategoryChip
          label={category?.name ?? categoryId ?? ''}
          color={category?.color ?? '#30393D'}
          className="text-base"
        />
      </div>
      <ul className="space-y-2">
        {categoryMoves.map((move) => (
          <li key={move.id}>
            <MoveCard
              move={move}
              categoryColor={category?.color ?? '#30393D'}
              game={game}
            />
          </li>
        ))}
      </ul>
    </div>
  )
}
