import { createHashRouter, Navigate } from 'react-router-dom'
import { BrowseLayout } from '../features/browse/BrowseLayout'
import { CategoryLayout } from '../features/browse/CategoryLayout'
import { FavoritesPage } from '../features/favorites/FavoritesPage'
import { MoveDetailPage } from '../features/move-detail/MoveDetailPage'
import { SearchPage } from '../features/search/SearchPage'
import { SettingsPage } from '../features/settings/SettingsPage'
import { GameRoute } from './GameRoute'
import { RootLayout } from './RootLayout'
import { getStoredGame } from './useSelectedGame'

// Hash routing (per SPEC §2's "createHashRouter or BrowserRouter" choice) —
// works on GitHub Pages with zero extra config, no 404.html rewrite trick
// needed for deep links on a static host.
//
// Browse nests as layout > layout > leaf (BrowseLayout > CategoryLayout >
// MoveDetailPage) rather than mutually-exclusive leaf routes: at md+ each
// layout keeps its own list visible in a left pane while rendering the next
// level via <Outlet/> in a right pane (master-detail, SPEC §7) — on mobile
// the same route tree collapses to one full-screen pane at a time.
export const router = createHashRouter([
  {
    element: <RootLayout />,
    children: [
      { index: true, element: <Navigate to={`/${getStoredGame()}/browse`} replace /> },
      {
        path: ':game',
        element: <GameRoute />,
        children: [
          {
            path: 'browse',
            element: <BrowseLayout />,
            children: [
              {
                path: ':categoryId',
                element: <CategoryLayout />,
                children: [{ path: ':moveId', element: <MoveDetailPage /> }],
              },
            ],
          },
          { path: 'search', element: <SearchPage /> },
        ],
      },
      { path: 'favorites', element: <FavoritesPage /> },
      { path: 'settings', element: <SettingsPage /> },
    ],
  },
])
