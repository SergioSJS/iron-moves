// Persists which game (Ironsworn/Starforged) the user last had selected, so
// the tab bar can link to the right /:game/browse or /:game/search URL even
// from a game-agnostic screen (Favorites, Settings). This is also SPEC §7's
// "default game on launch" Settings field — ticket 7's Settings screen reads
// and writes the same storage key rather than inventing a second one.
import { isGame, type Game } from '../data/schema'

const STORAGE_KEY = 'pocket-moves:game'
const DEFAULT_GAME: Game = 'starforged'

export function getStoredGame(): Game {
  const stored = localStorage.getItem(STORAGE_KEY)
  return isGame(stored) ? stored : DEFAULT_GAME
}

export function setStoredGame(game: Game): void {
  localStorage.setItem(STORAGE_KEY, game)
}
