import Fuse from 'fuse.js'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import { setStoredGame } from '../../app/useSelectedGame'
import { CategoryChip } from '../../components/CategoryChip'
import { GameSwitcher } from '../../components/GameSwitcher'
import { MoveCard } from '../../components/MoveCard'
import { SearchBar } from '../../components/SearchBar'
import { getGameContent } from '../../data'
import { isGame, type Game } from '../../data/schema'
import { getSearchDocs, type SearchDoc } from './searchDocs'

interface ResultGroup {
  game: Game
  categoryId: string
  categoryName: string
  categoryColor: string
  docs: SearchDoc[]
}

function groupByCategory(docs: SearchDoc[]): ResultGroup[] {
  const groups = new Map<string, ResultGroup>()
  for (const doc of docs) {
    const key = `${doc.game}:${doc.move.categoryId}`
    let group = groups.get(key)
    if (!group) {
      const category = getGameContent(doc.game).categories.find(
        (c) => c.id === doc.move.categoryId,
      )
      group = {
        game: doc.game,
        categoryId: doc.move.categoryId,
        categoryName: category?.name ?? doc.move.categoryId,
        categoryColor: category?.color ?? '#30393D',
        docs: [],
      }
      groups.set(key, group)
    }
    group.docs.push(doc)
  }
  return [...groups.values()]
}

// Instant fuzzy search across move titles + trigger + outcome text (SPEC
// §7), scoped to the selected game by default with a toggle to search both.
export function SearchPage() {
  const { t } = useTranslation()
  const { game: gameParam } = useParams<{ game: string }>()
  const navigate = useNavigate()
  const game = isGame(gameParam) ? gameParam : 'starforged'
  const [query, setQuery] = useState('')
  const [bothGames, setBothGames] = useState(false)

  const docs = useMemo(
    () =>
      bothGames
        ? [...getSearchDocs('starforged'), ...getSearchDocs('ironsworn')]
        : getSearchDocs(game),
    [bothGames, game],
  )

  const fuse = useMemo(
    () =>
      new Fuse(docs, {
        keys: [
          { name: 'move.title', weight: 0.7 },
          { name: 'plainText', weight: 0.3 },
        ],
        threshold: 0.35,
        ignoreLocation: true,
      }),
    [docs],
  )

  const trimmedQuery = query.trim()
  const results = useMemo(
    () => (trimmedQuery ? fuse.search(trimmedQuery).map((result) => result.item) : []),
    [fuse, trimmedQuery],
  )
  const groups = useMemo(() => groupByCategory(results), [results])

  return (
    <div className="p-4">
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <GameSwitcher
          game={game}
          onChange={(next) => {
            setStoredGame(next)
            navigate(`/${next}/search`)
          }}
        />
        <label className="flex items-center gap-2 text-sm text-ink-muted">
          <input
            type="checkbox"
            checked={bothGames}
            onChange={(event) => setBothGames(event.target.checked)}
          />
          {t('search.bothGames')}
        </label>
      </div>

      <div className="mb-4">
        <SearchBar
          value={query}
          onChange={setQuery}
          placeholder={t('search.placeholder')}
        />
      </div>

      {trimmedQuery && results.length === 0 && (
        <p className="text-ink-muted">{t('search.noResults', { query: trimmedQuery })}</p>
      )}

      <div className="space-y-6">
        {groups.map((group) => (
          <section key={`${group.game}:${group.categoryId}`}>
            <div className="mb-2">
              <CategoryChip
                label={
                  bothGames ? `${group.categoryName} · ${group.game}` : group.categoryName
                }
                color={group.categoryColor}
              />
            </div>
            <ul className="space-y-2">
              {group.docs.map((doc) => (
                <li key={doc.move.id}>
                  <MoveCard
                    move={doc.move}
                    categoryColor={group.categoryColor}
                    game={doc.game}
                  />
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  )
}
