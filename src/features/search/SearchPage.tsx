import { useNavigate, useParams } from 'react-router-dom'
import { setStoredGame } from '../../app/useSelectedGame'
import { GameSwitcher } from '../../components/GameSwitcher'
import { isGame } from '../../data/schema'

// Stub — Fuse.js fuzzy search lands in Ticket 6. The game switcher is real
// since SPEC §7 places it at the top of both Browse and Search.
export function SearchPage() {
  const { game: gameParam } = useParams<{ game: string }>()
  const navigate = useNavigate()
  const game = isGame(gameParam) ? gameParam : 'starforged'

  return (
    <div className="p-4">
      <div className="mb-4">
        <GameSwitcher
          game={game}
          onChange={(next) => {
            setStoredGame(next)
            navigate(`/${next}/search`)
          }}
        />
      </div>
      <p className="text-ink-muted">Fuzzy search lands in Ticket 6.</p>
    </div>
  )
}
