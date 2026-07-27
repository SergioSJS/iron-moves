import type { CSSProperties } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { setStoredGame } from '../../app/useSelectedGame'
import { GameSwitcher } from '../../components/GameSwitcher'
import { getGameContent } from '../../data'
import { isGame } from '../../data/schema'
import { getCategoryAccentVars } from '../../styles/tokens'

// Category list → tap → move list → tap → move detail (SPEC §7).
export function BrowsePage() {
  const { i18n } = useTranslation()
  const { game: gameParam } = useParams<{ game: string }>()
  const navigate = useNavigate()
  const game = isGame(gameParam) ? gameParam : 'starforged'
  const { categories } = getGameContent(game, i18n.language)

  return (
    <div className="p-4">
      <div className="mb-4">
        <GameSwitcher
          game={game}
          onChange={(next) => {
            setStoredGame(next)
            navigate(`/${next}/browse`)
          }}
        />
      </div>
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {categories.map((category) => {
          const vars = getCategoryAccentVars(category.color) as CSSProperties
          return (
            <li key={category.id}>
              <Link
                to={`/${game}/browse/${category.id}`}
                style={vars}
                className="flex h-20 items-center justify-center rounded-lg bg-[var(--category-accent)] px-3 text-center font-display text-sm uppercase tracking-wide text-[var(--category-accent-text)]"
              >
                {category.name}
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
