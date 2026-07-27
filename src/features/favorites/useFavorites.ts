import { useCallback, useState } from 'react'
import { getGameContent } from '../../data'
import { isGame, type Game, type Move } from '../../data/schema'

// Favorites persist as `${game}:${moveId}` keys in one localStorage array
// (SPEC §7) — game-prefixed since Ironsworn and Starforged share plenty of
// move ids (face-danger, pay-the-price, secure-an-advantage, …) that are
// different moves in each book.
const STORAGE_KEY = 'pocket-moves:favorites'

function toKey(game: Game, moveId: string): string {
  return `${game}:${moveId}`
}

function readFavoriteKeys(): Set<string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const parsed: unknown = raw ? JSON.parse(raw) : []
    return new Set(
      Array.isArray(parsed)
        ? parsed.filter((value): value is string => typeof value === 'string')
        : [],
    )
  } catch {
    return new Set()
  }
}

function writeFavoriteKeys(keys: Set<string>): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...keys]))
}

/** Star/unstar a single move — usable from a list row or the detail view (SPEC §7). */
export function useFavorite(
  game: Game,
  moveId: string,
): { isFavorite: boolean; toggle: () => void } {
  const key = toKey(game, moveId)
  const [isFavorite, setIsFavorite] = useState(() => readFavoriteKeys().has(key))

  const toggle = useCallback(() => {
    const keys = readFavoriteKeys()
    if (keys.has(key)) {
      keys.delete(key)
    } else {
      keys.add(key)
    }
    writeFavoriteKeys(keys)
    setIsFavorite(keys.has(key))
  }, [key])

  return { isFavorite, toggle }
}

export interface FavoriteEntry {
  game: Game
  move: Move
}

/** Resolves every stored favorite key back to its Move, for the Favorites tab. */
export function useFavoriteList(): FavoriteEntry[] {
  const [keys] = useState(() => readFavoriteKeys())
  const entries: FavoriteEntry[] = []
  for (const key of keys) {
    const separatorIndex = key.indexOf(':')
    const game = key.slice(0, separatorIndex)
    const moveId = key.slice(separatorIndex + 1)
    if (!isGame(game)) continue
    const move = getGameContent(game).moves.find((m) => m.id === moveId)
    if (move) entries.push({ game, move })
  }
  return entries
}
