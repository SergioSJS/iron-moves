import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import { useMediaQuery } from '../../app/useMediaQuery'
import { BottomSheet } from '../../components/BottomSheet'
import { getGameContent } from '../../data'
import { isGame } from '../../data/schema'
import { MoveDetailContent } from './MoveDetailContent'

// At md+, a 3rd side-by-side pane (next to the sidebar + category grid +
// move list) read too cramped to be the "main thing" of the app — so the
// move detail instead floats as a centered modal over the still-visible
// category/move list (CategoryLayout), closing back to the category rather
// than full-screen inline. On mobile it's the traditional full-screen page,
// with a real "back" (browser history) rather than a link hardcoded to this
// move's category — arriving from Favorites should return to Favorites, not
// jump into Browse.
export function MoveDetailPage() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const { game: gameParam, moveId } = useParams<{ game: string; moveId: string }>()
  const game = isGame(gameParam) ? gameParam : 'starforged'
  const { moves } = getGameContent(game, i18n.language)
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

  const content = (
    <>
      <MoveDetailContent move={move} game={game} onOpenMove={setPeekMoveId} />
      {peekMove && (
        <BottomSheet onClose={() => setPeekMoveId(null)} zIndexClassName="z-30">
          <MoveDetailContent move={peekMove} game={game} onOpenMove={setPeekMoveId} />
        </BottomSheet>
      )}
    </>
  )

  if (isDesktop) {
    return (
      <BottomSheet
        onClose={() => navigate(`/${game}/browse/${categoryId}`)}
        maxWidthClassName="md:max-w-3xl"
      >
        {content}
      </BottomSheet>
    )
  }

  // Opaque bg on the mobile full-screen detail: the body background carries
  // the game gradients + scanline texture (gameTheme.ts), which is meant for
  // chrome/gaps — a reading view shouldn't have lines showing through its
  // text and transparent table rows. min-h mirrors #main-content's mobile
  // min-height so the clean surface covers the viewport even for short
  // moves (h-full/min-h-full wouldn't resolve — no ancestor has a definite
  // height).
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-bg p-4">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="mb-4 inline-block text-sm text-ink-muted"
      >
        ← {t('nav.back')}
      </button>
      {content}
    </div>
  )
}
