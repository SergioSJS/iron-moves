// Shared by content pipeline (scripts/build-content.mjs) and UI. Per SPEC.md §4 —
// every content consumer and UI component must use these types, never reshape the
// generated JSON locally.

export type Game = 'ironsworn' | 'starforged'

export function isGame(value: string | null | undefined): value is Game {
  return value === 'ironsworn' || value === 'starforged'
}

export interface Category {
  id: string // slug, e.g. "adventure-moves"
  game: Game
  name: string // "Adventure Moves"
  color: string // hex, from the extraction legend
}

export interface Table {
  headers: string[]
  rows: string[][]
}

export interface Sidebar {
  title?: string
  body: string // markdown-ish rich text, may contain move cross-refs
}

export interface Move {
  id: string // slug, e.g. "face-danger"
  game: Game
  categoryId: string
  title: string
  tag?: string // "Progress Move", "Scene Challenge Mode", etc.
  trigger: string // rich text incl. **bold** trigger clause
  rollOptions?: string[] // the "If you act… Roll +x" bullet list, when present
  bullets?: string[] // generic bullet list not tied to strong/weak/miss
  outcomes: {
    hit?: string
    strongHit?: string
    weakHit?: string
    miss?: string
  }
  tables?: Table[]
  sidebars?: Sidebar[]
  crossRefs: string[] // move ids this move's text references, for linking
  sourcePage?: number
}

// Not in SPEC.md's schema snippet, but needed as the top-level shape of each
// generated JSON file (one per game/locale) so the pipeline output is typed.
export interface GameContent {
  game: Game
  categories: Category[]
  moves: Move[]
}
