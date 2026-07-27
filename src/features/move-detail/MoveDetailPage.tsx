import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useParams } from 'react-router-dom'
import { BottomSheet } from '../../components/BottomSheet'
import { getGameContent } from '../../data'
import { isGame } from '../../data/schema'
import { MoveDetailContent } from './MoveDetailContent'

export function MoveDetailPage() {
  const { t, i18n } = useTranslation()
  const { game: gameParam, moveId } = useParams<{ game: string; moveId: string }>()
  const game = isGame(gameParam) ? gameParam : 'starforged'
  const { moves, categories } = getGameContent(game, i18n.language)
  const move = moves.find((m) => m.id === moveId)
  const categoryId = move?.categoryId
  const [peekMoveId, setPeekMoveId] = useState<string | null>(null)
  const peekMove = peekMoveId ? moves.find((m) => m.id === peekMoveId) : undefined

  if (!move) {
    return (
      <div className="p-4">
        <p className="text-ink-muted">{t('moveDetail.notFound')}</p>
      </div>
    )
  }

  return (
    <div className="p-4">
      <Link
        to={`/${game}/browse/${categoryId}`}
        className="mb-3 inline-block text-sm text-ink-muted"
      >
        ← {categories.find((c) => c.id === categoryId)?.name ?? t('browse.categories')}
      </Link>
      <MoveDetailContent move={move} game={game} onOpenMove={setPeekMoveId} />

      {peekMove && (
        <BottomSheet onClose={() => setPeekMoveId(null)}>
          <MoveDetailContent move={peekMove} game={game} onOpenMove={setPeekMoveId} />
        </BottomSheet>
      )}
    </div>
  )
}
