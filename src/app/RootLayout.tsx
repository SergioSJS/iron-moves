import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Outlet, useParams } from 'react-router-dom'
import { BrandMark } from '../components/BrandMark'
import { TabBar } from '../components/TabBar'
import { isGame } from '../data/schema'
import { RollFlow } from '../features/roll/RollFlow'
import { getStoredGame, setStoredGame } from './useSelectedGame'

// App shell: tab bar (bottom on mobile, left sidebar at md+ — see TabBar),
// wrapping every route via <Outlet/>. SPEC §7. The brand header only shows
// on mobile — at md+ the sidebar already carries the brand mark, so a
// second full-width title bar above it would just be redundant chrome.
export function RootLayout() {
  const { t } = useTranslation()
  const { game: gameParam } = useParams<{ game?: string }>()
  const game = isGame(gameParam) ? gameParam : getStoredGame()
  // Dice rolling is an overlay on the current screen, not a route (see
  // RollFlow) — the open state lives here so the tab bar's dice button can
  // trigger it from any page.
  const [rollOpen, setRollOpen] = useState(false)

  // Remembers the last game visited via a direct link too, not just explicit
  // GameSwitcher clicks, so Favorites/Settings → Browse always lands back on
  // it. Also drives the per-game background + fonts (gameTheme.ts,
  // tailwind.config.ts) via a DOM attribute — deliberately not React state,
  // since that stays correct regardless of which component's hook instance
  // is what actually changed the game/theme. Only game-scoped screens
  // (Browse/Search) get the attribute; Favorites/Settings span both games,
  // so tinting them toward whichever game happens to be "current" would be
  // arbitrary — the attribute is removed there instead.
  useEffect(() => {
    if (isGame(gameParam)) {
      setStoredGame(gameParam)
      document.documentElement.dataset.currentGame = gameParam
    } else {
      delete document.documentElement.dataset.currentGame
    }
  }, [gameParam])

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-2 focus:top-2 focus:z-50 focus:rounded focus:bg-bg focus:px-3 focus:py-2 focus:text-ink"
      >
        {t('nav.skipToContent')}
      </a>
      <TabBar game={game} onOpenRoll={() => setRollOpen(true)} />
      <RollFlow open={rollOpen} game={game} onClose={() => setRollOpen(false)} />
      <div className="flex-1 pb-16 md:pb-0">
        <header className="flex items-center gap-2 border-b border-border p-4 md:hidden">
          <BrandMark size={24} />
          <h1 className="app-brand font-display text-xl uppercase tracking-wide">
            Pocket Moves
          </h1>
        </header>
        <main id="main-content" className="min-h-[calc(100vh-4rem)] md:min-h-screen">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
