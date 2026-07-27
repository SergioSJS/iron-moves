import { Fragment, type ReactNode } from 'react'
import { getGameContent } from '../data'
import type { Game } from '../data/schema'

// Tiny renderer for the narrow markdown grammar build-content.mjs produces:
// **bold**, *italic* (rare survivors — most single-asterisk spans already
// became cross-ref tokens), "- " bullet lines, "\n\n" paragraph breaks, and
// {move:slug} cross-ref tokens. Deliberately not a full markdown lib — see
// SPEC §4.

const INLINE_TOKEN = /(\*\*[^*]+\*\*|\*[^*]+\*|\{move:[a-z0-9-]+\})/g

function renderInline(
  text: string,
  game: Game,
  onOpenMove?: (id: string) => void,
): ReactNode[] {
  return text
    .split(INLINE_TOKEN)
    .filter((part) => part !== '')
    .map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i}>{part.slice(2, -2)}</strong>
      }
      if (part.startsWith('{move:') && part.endsWith('}')) {
        const id = part.slice('{move:'.length, -1)
        const title =
          getGameContent(game).moves.find((move) => move.id === id)?.title ?? id
        return (
          <button
            key={i}
            type="button"
            onClick={() => onOpenMove?.(id)}
            className="rounded bg-border px-1 font-semibold text-ink underline decoration-dotted underline-offset-2"
          >
            {title}
          </button>
        )
      }
      if (part.startsWith('*') && part.endsWith('*')) {
        return <em key={i}>{part.slice(1, -1)}</em>
      }
      return <Fragment key={i}>{part}</Fragment>
    })
}

interface Block {
  type: 'p' | 'ul'
  lines: string[]
}

function toBlocks(text: string): Block[] {
  const blocks: Block[] = []
  for (const chunk of text.split(/\n\n+/)) {
    let current: Block | null = null
    for (const rawLine of chunk.split('\n')) {
      const line = rawLine.trim()
      if (!line) continue
      const isBullet = line.startsWith('- ')
      const type: Block['type'] = isBullet ? 'ul' : 'p'
      const content = isBullet ? line.slice(2) : line
      if (current && current.type === type) {
        current.lines.push(content)
      } else {
        current = { type, lines: [content] }
        blocks.push(current)
      }
    }
  }
  return blocks
}

export function RichText({
  text,
  game,
  onOpenMove,
  className,
}: {
  text: string
  game: Game
  onOpenMove?: (moveId: string) => void
  className?: string
}) {
  if (!text) return null
  return (
    <div className={'space-y-2 ' + (className ?? '')}>
      {toBlocks(text).map((block, i) =>
        block.type === 'ul' ? (
          <ul key={i} className="list-disc space-y-1 pl-5">
            {block.lines.map((line, j) => (
              <li key={j}>{renderInline(line, game, onOpenMove)}</li>
            ))}
          </ul>
        ) : (
          <p key={i}>
            {block.lines.map((line, j) => (
              <Fragment key={j}>
                {j > 0 && <br />}
                {renderInline(line, game, onOpenMove)}
              </Fragment>
            ))}
          </p>
        ),
      )}
    </div>
  )
}
