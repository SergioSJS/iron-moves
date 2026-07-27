import { useEffect, useState } from 'react'

// Drives the few places that need to *behave* differently at md+, not just
// look different — e.g. Search: tapping a result selects it in-place in a
// master-detail pane at md+, but navigates full-screen on mobile (SPEC §7).
// Pure layout differences should stay CSS-only (Tailwind `md:` classes); this
// is only for the cases CSS can't express.
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches)

  useEffect(() => {
    const media = window.matchMedia(query)
    const onChange = () => setMatches(media.matches)
    onChange()
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [query])

  return matches
}
