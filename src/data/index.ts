import ironswornRaw from './en/ironsworn.generated.json'
import starforgedRaw from './en/starforged.generated.json'
import type { Game, GameContent } from './schema'

const content: Record<Game, GameContent> = {
  ironsworn: ironswornRaw as GameContent,
  starforged: starforgedRaw as GameContent,
}

export function getGameContent(game: Game): GameContent {
  return content[game]
}
