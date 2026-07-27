import type { ComponentType, SVGProps } from 'react'
import { useTranslation } from 'react-i18next'
import { NavLink } from 'react-router-dom'
import type { Game } from '../data/schema'
import { BrandMark } from './BrandMark'
import { BrowseIcon, FavoritesIcon, SearchIcon, SettingsIcon } from './icons'

interface TabItem {
  key: string
  label: string
  to: string
  Icon: ComponentType<SVGProps<SVGSVGElement>>
}

function getTabItems(game: Game, t: (key: string) => string): TabItem[] {
  return [
    { key: 'browse', label: t('nav.browse'), to: `/${game}/browse`, Icon: BrowseIcon },
    { key: 'search', label: t('nav.search'), to: `/${game}/search`, Icon: SearchIcon },
    {
      key: 'favorites',
      label: t('nav.favorites'),
      to: '/favorites',
      Icon: FavoritesIcon,
    },
    { key: 'settings', label: t('nav.settings'), to: '/settings', Icon: SettingsIcon },
  ]
}

const linkClass = ({ isActive }: { isActive: boolean }) =>
  'flex flex-1 flex-col items-center justify-center gap-1 py-2 text-xs font-medium md:flex-none md:flex-row md:justify-start md:gap-3 md:rounded-md md:px-3 md:py-2 md:text-sm md:hover:bg-surface ' +
  (isActive ? 'text-ink md:bg-surface' : 'text-ink-muted')

// Bottom tab bar on mobile (thumb zone), left sidebar at md+ (SPEC §7). Same
// 4 destinations either way — Browse/Search carry the currently selected
// game in their URL so switching game elsewhere doesn't lose your place.
// The brand mark + wordmark live here (sidebar-only) rather than in a
// separate full-width header, since at md+ that would just be a second,
// redundant title bar above already-visible nav chrome.
export function TabBar({ game }: { game: Game }) {
  const { t } = useTranslation()
  const items = getTabItems(game, t)
  return (
    <nav
      aria-label={t('nav.primaryLabel')}
      className="app-tabbar fixed inset-x-0 bottom-0 z-10 flex border-t border-border bg-surface md:sticky md:top-0 md:h-screen md:w-56 md:flex-col md:gap-1 md:self-start md:overflow-y-auto md:border-r md:border-t-0 md:p-3"
    >
      <div className="hidden items-center gap-2 px-2 pb-4 pt-1 md:flex">
        <BrandMark size={28} />
        <span className="app-brand font-display text-base uppercase tracking-wide">
          Pocket Moves
        </span>
      </div>
      {items.map((item) => (
        <NavLink key={item.key} to={item.to} className={linkClass}>
          <item.Icon className="h-5 w-5" />
          {item.label}
        </NavLink>
      ))}
    </nav>
  )
}
