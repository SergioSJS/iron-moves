import Fuse from 'fuse.js'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import { useMediaQuery } from '../../app/useMediaQuery'
import { setStoredGame } from '../../app/useSelectedGame'
import { BottomSheet } from '../../components/BottomSheet'
import { CategoryChip } from '../../components/CategoryChip'
import { GameSwitcher } from '../../components/GameSwitcher'
import { MoveCard } from '../../components/MoveCard'
import { SearchBar } from '../../components/SearchBar'
import { getGameContent } from '../../data'
import { isGame, type Game } from '../../data/schema'
import { resolveCategoryColor } from '../../styles/colorStyle'
import { MoveDetailContent } from '../move-detail/MoveDetailContent'
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
        categoryColor: resolveCategoryColor(
          doc.move.categoryId,
          category?.color ?? '#30393D',
        ),
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
// On mobile, tapping a result navigates full-screen; at md+ it selects the
// result into a detail pane instead (master-detail, SPEC §7's responsive
// rule) — search results aren't tied to a nested route the way Browse's
// are (a result can belong to either game in "both games" mode), so this
// pane uses local selection state rather than the URL.
export function SearchPage() {
  const { t } = useTranslation()
  const { game: gameParam } = useParams<{ game: string }>()
  const navigate = useNavigate()
  const game = isGame(gameParam) ? gameParam : 'starforged'
  const [query, setQuery] = useState('')
  const [bothGames, setBothGames] = useState(false)
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const [selected, setSelected] = useState<SearchDoc | null>(null)
  const [peekMoveId, setPeekMoveId] = useState<string | null>(null)
  const peekMove = peekMoveId
    ? getGameContent(selected?.game ?? game).moves.find((m) => m.id === peekMoveId)
    : undefined

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
    <div className="md:flex md:items-start md:gap-4">
      <div className="p-4 md:w-96 md:shrink-0">
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
          <p className="text-ink-muted">
            {t('search.noResults', { query: trimmedQuery })}
          </p>
        )}

        <div className="space-y-6">
          {groups.map((group) => (
            <section key={`${group.game}:${group.categoryId}`}>
              <div className="mb-2">
                <CategoryChip
                  label={
                    bothGames
                      ? `${group.categoryName} · ${group.game}`
                      : group.categoryName
                  }
                  color={group.categoryColor}
                  categoryId={group.categoryId}
                />
              </div>
              <ul className="space-y-2">
                {group.docs.map((doc) => (
                  <li key={`${doc.game}:${doc.move.id}`}>
                    <MoveCard
                      move={doc.move}
                      categoryColor={group.categoryColor}
                      game={doc.game}
                      active={
                        isDesktop &&
                        selected?.game === doc.game &&
                        selected.move.id === doc.move.id
                      }
                      onSelect={isDesktop ? () => setSelected(doc) : undefined}
                    />
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>

      <div className="hidden md:block md:min-w-0 md:flex-1 md:p-4">
        {selected ? (
          <MoveDetailContent
            move={selected.move}
            game={selected.game}
            onOpenMove={setPeekMoveId}
          />
        ) : (
          <p className="text-ink-muted">{t('search.selectMove')}</p>
        )}
      </div>

      {peekMove && selected && (
        <BottomSheet onClose={() => setPeekMoveId(null)}>
          <MoveDetailContent
            move={peekMove}
            game={selected.game}
            onOpenMove={setPeekMoveId}
          />
        </BottomSheet>
      )}
    </div>
  )
}
