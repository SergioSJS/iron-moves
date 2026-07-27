import { useId } from 'react'

// The same four-point star design as the app/PWA icon (scripts/generate-icons.mjs)
// — both books' own bullet glyph (✴) on Ironsworn's dark accent, gradient
// through Starforged category colors — recreated as inline SVG so the
// sidebar brand mark stays crisp at any size without fetching a raster asset.
export function BrandMark({ size = 28 }: { size?: number }) {
  const gradientId = useId()
  return (
    <svg width={size} height={size} viewBox="0 0 512 512" aria-hidden="true">
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3F8C8A" />
          <stop offset="25%" stopColor="#206087" />
          <stop offset="50%" stopColor="#805A90" />
          <stop offset="75%" stopColor="#8F477B" />
          <stop offset="100%" stopColor="#883529" />
        </linearGradient>
      </defs>
      <rect width="512" height="512" rx="96" fill="#30393D" />
      <path
        d="M256 60 L296 216 L452 256 L296 296 L256 452 L216 296 L60 256 L216 216 Z"
        fill={`url(#${gradientId})`}
      />
    </svg>
  )
}
