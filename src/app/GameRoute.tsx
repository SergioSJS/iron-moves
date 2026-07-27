import { Navigate, Outlet, useParams } from 'react-router-dom'
import { isGame } from '../data/schema'

// Guards the :game URL segment used by Browse/Search — an invalid or missing
// game slug (bad link, typo) falls back to Starforged rather than rendering
// a broken page.
export function GameRoute() {
  const { game } = useParams<{ game: string }>()
  if (!isGame(game)) return <Navigate to="/starforged/browse" replace />
  return <Outlet />
}
