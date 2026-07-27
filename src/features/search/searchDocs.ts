import { toPlainText } from '../../components/richTextUtils'
import { getGameContent } from '../../data'
import type { Game, Move } from '../../data/schema'

export interface SearchDoc {
  move: Move
  game: Game
  plainText: string
}

function buildDocs(game: Game): SearchDoc[] {
  return getGameContent(game).moves.map((move) => ({
    move,
    game,
    plainText: [
      toPlainText(move.trigger, game),
      ...(move.rollOptions ?? []).map((option) => toPlainText(option, game)),
      ...(move.bullets ?? []).map((bullet) => toPlainText(bullet, game)),
      ...Object.values(move.outcomes)
        .filter((value): value is string => Boolean(value))
        .map((value) => toPlainText(value, game)),
    ].join(' '),
  }))
}

// Fuse.js searches move titles + trigger + outcome text (SPEC §7). The
// dataset is tiny (~50 moves/game) and static for the session, so each
// game's flattened, plain-text search corpus is built once and cached.
const cache: Partial<Record<Game, SearchDoc[]>> = {}

export function getSearchDocs(game: Game): SearchDoc[] {
  const cached = cache[game]
  if (cached) return cached
  const docs = buildDocs(game)
  cache[game] = docs
  return docs
}
