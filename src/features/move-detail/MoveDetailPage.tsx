import { useParams } from 'react-router-dom'
import { getGameContent } from '../../data'
import { isGame } from '../../data/schema'

// Stub — full move-detail rendering (trigger, roll options, outcome blocks,
// tables, sidebars, cross-ref chips) lands in Ticket 5.
export function MoveDetailPage() {
  const { game: gameParam, moveId } = useParams<{ game: string; moveId: string }>()
  const game = isGame(gameParam) ? gameParam : 'starforged'
  const move = getGameContent(game).moves.find((m) => m.id === moveId)

  return (
    <div className="p-4">
      <h2 className="mb-2 font-display text-2xl uppercase tracking-wide">
        {move?.title ?? moveId}
      </h2>
      <p className="text-ink-muted">Full move detail UI lands in Ticket 5.</p>
    </div>
  )
}
