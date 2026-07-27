import { createHashRouter, Navigate } from 'react-router-dom'
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
//
// Every page route uses React Router's own `lazy` API (not manual
// React.lazy/Suspense) for code splitting — each page's chunk, and whatever
// only it depends on (e.g. Search alone pulling in fuse.js), loads on first
// visit instead of bloating the initial bundle. RootLayout/GameRoute stay
// eager since they're the shell every route renders through.
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
            lazy: async () => {
              const { BrowseLayout } = await import('../features/browse/BrowseLayout')
              return { Component: BrowseLayout }
            },
            children: [
              {
                path: ':categoryId',
                lazy: async () => {
                  const { CategoryLayout } =
                    await import('../features/browse/CategoryLayout')
                  return { Component: CategoryLayout }
                },
                children: [
                  {
                    path: ':moveId',
                    lazy: async () => {
                      const { MoveDetailPage } =
                        await import('../features/move-detail/MoveDetailPage')
                      return { Component: MoveDetailPage }
                    },
                  },
                ],
              },
            ],
          },
          {
            path: 'search',
            lazy: async () => {
              const { SearchPage } = await import('../features/search/SearchPage')
              return { Component: SearchPage }
            },
          },
        ],
      },
      {
        path: 'favorites',
        lazy: async () => {
          const { FavoritesPage } = await import('../features/favorites/FavoritesPage')
          return { Component: FavoritesPage }
        },
      },
      {
        path: 'settings',
        lazy: async () => {
          const { SettingsPage } = await import('../features/settings/SettingsPage')
          return { Component: SettingsPage }
        },
      },
    ],
  },
])
