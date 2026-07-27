import type { CSSProperties } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, Outlet, useNavigate, useParams } from 'react-router-dom'
import { setStoredGame } from '../../app/useSelectedGame'
import { CategoryIcon } from '../../components/CategoryIcon'
import { GameSwitcher } from '../../components/GameSwitcher'
import { getGameContent } from '../../data'
import { isGame } from '../../data/schema'
import { getCategoryAccentVars } from '../../styles/tokens'

// Category list → tap → move list → tap → move detail (SPEC §7). On mobile,
// each step replaces the screen (full-screen navigation, single pane) — the
// category grid and the selected category's content (rendered via the
// nested route's <Outlet/>) are never both visible. At md+ they become a
// two-pane master-detail layout instead (SPEC §7's responsive rule): the
// grid stays put in a left pane while the outlet fills the rest.
export function BrowseLayout() {
  const { t, i18n } = useTranslation()
  const { game: gameParam, categoryId } = useParams<{
    game: string
    categoryId?: string
  }>()
  const navigate = useNavigate()
  const game = isGame(gameParam) ? gameParam : 'starforged'
  const { categories } = getGameContent(game, i18n.language)
  const hasSelection = Boolean(categoryId)

  return (
    <div className="md:flex md:items-start md:gap-4">
      <div
        className={(hasSelection ? 'hidden md:block' : '') + ' p-4 md:w-72 md:shrink-0'}
      >
        <div className="mb-4">
          <GameSwitcher
            game={game}
            onChange={(next) => {
              setStoredGame(next)
              navigate(`/${next}/browse`)
            }}
          />
        </div>
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-1">
          {categories.map((category) => {
            const vars = getCategoryAccentVars(category.color) as CSSProperties
            return (
              <li key={category.id}>
                <Link
                  to={`/${game}/browse/${category.id}`}
                  style={vars}
                  aria-current={category.id === categoryId ? 'true' : undefined}
                  className={
                    'flex h-20 flex-col items-center justify-center gap-1 rounded-lg bg-[var(--category-accent)] px-3 text-center font-display text-sm uppercase tracking-wide text-[var(--category-accent-text)] shadow-sm transition-all hover:shadow-md md:h-12 md:flex-row md:justify-start md:gap-3 md:px-4 md:text-left ' +
                    (category.id === categoryId
                      ? 'md:ring-2 md:ring-accent md:ring-offset-2 md:ring-offset-bg'
                      : '')
                  }
                >
                  <CategoryIcon categoryId={category.id} className="h-5 w-5 shrink-0" />
                  {category.name}
                </Link>
              </li>
            )
          })}
        </ul>
      </div>

      <div className={(hasSelection ? '' : 'hidden md:block') + ' md:min-w-0 md:flex-1'}>
        {hasSelection ? (
          <Outlet />
        ) : (
          <p className="p-4 text-ink-muted">{t('browse.selectCategory')}</p>
        )}
      </div>
    </div>
  )
}
