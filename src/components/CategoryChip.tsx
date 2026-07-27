import type { CSSProperties } from 'react'
import { getCategoryAccentVars } from '../styles/tokens'
import { CategoryIcon } from './CategoryIcon'

export function CategoryChip({
  label,
  color,
  categoryId,
  className,
}: {
  label: string
  color: string
  categoryId?: string
  className?: string
}) {
  const vars = getCategoryAccentVars(color) as CSSProperties
  return (
    <span
      style={vars}
      className={
        'inline-flex items-center gap-1.5 rounded-full bg-[var(--category-accent)] px-3 py-1 font-display text-xs uppercase tracking-wide text-[var(--category-accent-text)] ' +
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
