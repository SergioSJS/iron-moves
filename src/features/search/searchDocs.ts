import { toPlainText } from '../../components/richTextUtils'
import { getGameContent } from '../../data'
import type { Game, Move } from '../../data/schema'

export interface SearchDoc {
  move: Move
  game: Game
  plainText: string
}

function buildDocs(game: Game, locale?: string): SearchDoc[] {
  return getGameContent(game, locale).moves.map((move) => ({
    move,
    game,
    plainText: [
      toPlainText(move.trigger, game, locale),
      ...(move.rollOptions ?? []).map((option) => toPlainText(option, game, locale)),
      ...(move.bullets ?? []).map((bullet) => toPlainText(bullet, game, locale)),
      ...Object.values(move.outcomes)
        .filter((value): value is string => Boolean(value))
        .map((value) => toPlainText(value, game, locale)),
    ].join(' '),
  }))
}

// Fuse.js searches move titles + trigger + outcome text (SPEC §7). The
// dataset is tiny (~50 moves/game) and static for the session, so each
// game+locale's flattened, plain-text search corpus is built once and cached.
const cache: Partial<Record<string, SearchDoc[]>> = {}

export function getSearchDocs(game: Game, locale?: string): SearchDoc[] {
  const key = `${game}:${locale ?? 'en'}`
  const cached = cache[key]
  if (cached) return cached
  const docs = buildDocs(game, locale)
  cache[key] = docs
  return docs
}
