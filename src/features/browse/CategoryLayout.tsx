import { useTranslation } from 'react-i18next'
import { Link, Outlet, useParams } from 'react-router-dom'
import { CategoryChip } from '../../components/CategoryChip'
import { MoveCard } from '../../components/MoveCard'
import { getGameContent } from '../../data'
import { isGame } from '../../data/schema'
import { resolveCategoryColor } from '../../styles/colorStyle'

// Move list → tap → move detail. On mobile the detail replaces this list
// full-screen (via the nested route's <Outlet/>, rendered inline). At md+,
// a 3rd side-by-side pane for the detail turned out too narrow to read
// comfortably once the sidebar + category grid + move list were already
// taking up space — so at md+, MoveDetailPage instead renders itself as a
// centered modal on top of this list (see its own isDesktop check), which
// is why this layout doesn't split into two panes the way BrowseLayout does.
export function CategoryLayout() {
  const { t, i18n } = useTranslation()
  const {
    game: gameParam,
    categoryId,
    moveId,
  } = useParams<{ game: string; categoryId: string; moveId?: string }>()
  const game = isGame(gameParam) ? gameParam : 'starforged'
  const { categories, moves } = getGameContent(game, i18n.language)
  const category = categories.find((c) => c.id === categoryId)
  const categoryMoves = moves.filter((m) => m.categoryId === categoryId)
  const hasSelection = Boolean(moveId)
  const categoryColor = resolveCategoryColor(
    categoryId ?? '',
    category?.color ?? '#30393D',
  )

  return (
    <>
      <div className={(hasSelection ? 'hidden md:block' : '') + ' p-4 md:max-w-2xl'}>
        <Link
          to={`/${game}/browse`}
          className="mb-3 inline-block text-sm text-ink-muted md:hidden"
        >
          ← {t('browse.categories')}
        </Link>
        <div className="mb-3">
          <CategoryChip
            label={category?.name ?? categoryId ?? ''}
            color={categoryColor}
            categoryId={categoryId}
            className="text-base"
          />
        </div>
        <ul className="space-y-2">
          {categoryMoves.map((move) => (
            <li key={move.id}>
              <MoveCard
                move={move}
                categoryColor={categoryColor}
                game={game}
                active={move.id === moveId}
              />
            </li>
          ))}
        </ul>
      </div>
      <Outlet />
    </>
  )
}
