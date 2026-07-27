import type { CSSProperties } from 'react'
import { FavoriteButton } from '../../components/FavoriteButton'
import { MoveTable } from '../../components/MoveTable'
import { OutcomeBlock } from '../../components/OutcomeBlock'
import { RichText } from '../../components/RichText'
import { getGameContent } from '../../data'
import type { Game, Move } from '../../data/schema'
import { getCategoryAccentVars } from '../../styles/tokens'

const OUTCOME_ORDER = ['hit', 'strongHit', 'weakHit', 'miss'] as const

// Shared by the full move-detail page and the cross-ref bottom sheet (SPEC
// §7) so both render identically instead of drifting into two components.
export function MoveDetailContent({
  move,
  game,
  onOpenMove,
}: {
  move: Move
  game: Game
  onOpenMove?: (moveId: string) => void
}) {
  const category = getGameContent(game).categories.find((c) => c.id === move.categoryId)
  const headerVars = category
    ? (getCategoryAccentVars(category.color) as CSSProperties)
    : undefined

  return (
    <div className="space-y-4">
      <header
        style={headerVars}
        className="-mx-4 -mt-4 flex items-start justify-between gap-3 bg-[var(--category-accent)] px-4 py-3 text-[var(--category-accent-text)] md:mx-0 md:mt-0 md:rounded-lg"
      >
        <div>
          {category && (
            <p className="text-xs uppercase tracking-wide opacity-80">{category.name}</p>
          )}
          <h2 className="font-display text-2xl uppercase tracking-wide">{move.title}</h2>
          {move.tag && (
            <span className="mt-1 inline-block rounded-full bg-[var(--color-bg)] px-2 py-0.5 text-xs font-semibold text-ink">
              {move.tag}
            </span>
          )}
        </div>
        <FavoriteButton
          game={game}
          moveId={move.id}
          unfavoritedClassName="text-[var(--category-accent-text)]"
          className="shrink-0"
        />
      </header>

      <RichText text={move.trigger} game={game} onOpenMove={onOpenMove} />

      {move.rollOptions && (
        <RichText
          text={move.rollOptions.map((option) => `- ${option}`).join('\n')}
          game={game}
          onOpenMove={onOpenMove}
        />
      )}

      {move.bullets && (
        <RichText
          text={move.bullets.map((bullet) => `- ${bullet}`).join('\n')}
          game={game}
          onOpenMove={onOpenMove}
        />
      )}

      {OUTCOME_ORDER.filter((key) => move.outcomes[key]).map((key) => (
        <OutcomeBlock
          key={key}
          outcomeKey={key}
          text={move.outcomes[key] ?? ''}
          game={game}
          onOpenMove={onOpenMove}
        />
      ))}

      {move.tables?.map((table, i) => (
        <MoveTable key={i} table={table} game={game} onOpenMove={onOpenMove} />
      ))}

      {move.sidebars?.map((sidebar, i) => (
        <aside key={i} className="rounded-lg border border-border bg-surface p-3">
          {sidebar.title && (
            <p className="mb-1 font-display text-sm uppercase tracking-wide text-ink-muted">
              {sidebar.title}
            </p>
          )}
          <RichText
            text={sidebar.body}
            game={game}
            onOpenMove={onOpenMove}
            className="text-sm"
          />
        </aside>
      ))}
    </div>
  )
}
