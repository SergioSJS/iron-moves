import type { CSSProperties } from 'react'
import { getCategoryAccentVars } from '../styles/tokens'

export function CategoryChip({
  label,
  color,
  className,
}: {
  label: string
  color: string
  className?: string
}) {
  const vars = getCategoryAccentVars(color) as CSSProperties
  return (
    <span
      style={vars}
      className={
        'inline-flex items-center rounded-full bg-[var(--category-accent)] px-3 py-1 font-display text-xs uppercase tracking-wide text-[var(--category-accent-text)] ' +
        (className ?? '')
      }
    >
      {label}
    </span>
  )
}
