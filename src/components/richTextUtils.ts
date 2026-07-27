import { getGameContent } from '../data'
import type { Game } from '../data/schema'

// Plain-text preview (strips bold/italic markup, resolves {move:id} tokens to
// a title) — used for the one-line trigger snippet in move-list rows. Split
// out of RichText.tsx so that file only exports the component (Fast Refresh).
export function toPlainText(text: string, game: Game): string {
  return text
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(
      /\{move:([a-z0-9-]+)\}/g,
      (_, id: string) =>
        getGameContent(game).moves.find((move) => move.id === id)?.title ?? id,
    )
    .replace(/\s+/g, ' ')
    .trim()
}
