import { useEffect } from 'react'
import { Outlet, useParams } from 'react-router-dom'
import { TabBar } from '../components/TabBar'
import { isGame } from '../data/schema'
import { getStoredGame, setStoredGame } from './useSelectedGame'

// App shell: tab bar (bottom on mobile, left sidebar at md+ — see TabBar) plus
// a lightweight header, wrapping every route via <Outlet/>. SPEC §7.
export function RootLayout() {
  const { game: gameParam } = useParams<{ game?: string }>()
  const game = isGame(gameParam) ? gameParam : getStoredGame()

  // Remembers the last game visited via a direct link too, not just explicit
  // GameSwitcher clicks, so Favorites/Settings → Browse always lands back on it.
  useEffect(() => {
    if (isGame(gameParam)) setStoredGame(gameParam)
  }, [gameParam])

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <TabBar game={game} />
      <div className="flex-1 pb-16 md:pb-0">
        <header className="border-b border-border p-4">
          <h1 className="font-display text-xl uppercase tracking-wide">Pocket Moves</h1>
        </header>
        <Outlet />
      </div>
    </div>
  )
}
