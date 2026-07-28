import type { CSSProperties } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, Outlet, useNavigate, useParams } from 'react-router-dom'
import { setStoredGame } from '../../app/useSelectedGame'
import { CategoryIcon } from '../../components/CategoryIcon'
import { GameSwitcher } from '../../components/GameSwitcher'
import { getGameContent } from '../../data'
import { isGame } from '../../data/schema'
import { resolveCategoryColor } from '../../styles/colorStyle'
import { getGameFontClass } from '../../styles/gameTheme'
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
        className={(hasSelection ? 'hidden md:block' : '') + ' p-4 md:w-80 md:shrink-0'}
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
        {/* pt-BR category buttons carry only the qualifier ("Sessão", "Combate")
            and get a shared "Movimentos de" label here; en keeps full names on
            the buttons, so its label is an empty string and nothing renders. */}
        {t('browse.categoryGroupLabel') && (
          <h2 className="mb-2 font-display text-sm uppercase tracking-wide text-ink-muted">
            {t('browse.categoryGroupLabel')}
          </h2>
        )}
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-1">
          {categories.map((category) => {
            const vars = getCategoryAccentVars(
              resolveCategoryColor(category.id, category.color),
            ) as CSSProperties
            return (
              <li key={category.id}>
                <Link
                  to={`/${game}/browse/${category.id}`}
                  style={vars}
                  aria-current={category.id === categoryId ? 'true' : undefined}
                  className={
                    'flex min-h-20 flex-col items-center justify-center gap-1 rounded-lg bg-[var(--category-accent)] px-3 py-2 text-center text-sm uppercase tracking-wide text-[var(--category-accent-text)] shadow-[0_0_16px_-6px_var(--category-accent)] transition-all hover:shadow-[0_0_20px_-4px_var(--category-accent)] md:h-12 md:min-h-0 md:flex-row md:justify-start md:gap-3 md:px-4 md:py-0 md:text-left ' +
                    getGameFontClass(game) +
                    ' ' +
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
