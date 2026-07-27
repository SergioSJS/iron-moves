import { useTranslation } from 'react-i18next'
import { NavLink } from 'react-router-dom'
import type { Game } from '../data/schema'

interface TabItem {
  key: string
  label: string
  to: string
}

function getTabItems(game: Game, t: (key: string) => string): TabItem[] {
  return [
    { key: 'browse', label: t('nav.browse'), to: `/${game}/browse` },
    { key: 'search', label: t('nav.search'), to: `/${game}/search` },
    { key: 'favorites', label: t('nav.favorites'), to: '/favorites' },
    { key: 'settings', label: t('nav.settings'), to: '/settings' },
  ]
}

const linkClass = ({ isActive }: { isActive: boolean }) =>
  'flex flex-1 flex-col items-center justify-center gap-1 py-2 text-xs font-medium md:flex-row md:justify-start md:gap-3 md:rounded-md md:px-3 md:py-2 md:text-sm ' +
  (isActive ? 'text-ink md:bg-surface' : 'text-ink-muted')

// Bottom tab bar on mobile (thumb zone), left sidebar at md+ (SPEC §7). Same
// 4 destinations either way — Browse/Search carry the currently selected
// game in their URL so switching game elsewhere doesn't lose your place.
export function TabBar({ game }: { game: Game }) {
  const { t } = useTranslation()
  const items = getTabItems(game, t)
  return (
    <nav
      aria-label={t('nav.primaryLabel')}
      className="fixed inset-x-0 bottom-0 z-10 flex border-t border-border bg-surface md:static md:h-full md:w-56 md:flex-col md:gap-1 md:border-r md:border-t-0 md:p-3"
    >
      {items.map((item) => (
        <NavLink key={item.key} to={item.to} className={linkClass}>
          {item.label}
        </NavLink>
      ))}
    </nav>
  )
}
