import { createHashRouter, Navigate } from 'react-router-dom'
import { CategoryPage } from '../features/browse/CategoryPage'
import { BrowsePage } from '../features/browse/BrowsePage'
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
            children: [
              { index: true, element: <BrowsePage /> },
              {
                path: ':categoryId',
                children: [
                  { index: true, element: <CategoryPage /> },
                  { path: ':moveId', element: <MoveDetailPage /> },
                ],
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
