import type { CSSProperties } from 'react'
import type { Game } from '../data/schema'
import { getGameFontClass } from '../styles/gameTheme'
import { getCategoryAccentVars } from '../styles/tokens'
import { CategoryIcon } from './CategoryIcon'

export function CategoryChip({
  label,
  color,
  categoryId,
  game,
  className,
}: {
  label: string
  color: string
  categoryId?: string
  // When provided, renders the label in that game's own display font
  // instead of the neutral app-chrome one.
  game?: Game
  className?: string
}) {
  const vars = getCategoryAccentVars(color) as CSSProperties
  return (
    <span
      style={vars}
      className={
        'inline-flex items-center gap-1.5 rounded-full bg-[var(--category-accent)] px-3 py-1 text-xs uppercase tracking-wide text-[var(--category-accent-text)] ' +
        (game ? getGameFontClass(game) : 'font-display') +
        ' ' +
        (className ?? '')
      }
    >
      {categoryId && (
        <CategoryIcon categoryId={categoryId} className="h-3.5 w-3.5 shrink-0" />
      )}
      {label}
    </span>
  )
}
