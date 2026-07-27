import type { Game, Table } from '../data/schema'
import { RichText } from './RichText'

// "Tables rendered as scrollable-if-needed compact tables" — SPEC §7.
export function MoveTable({
  table,
  game,
  onOpenMove,
}: {
  table: Table
  game: Game
  onOpenMove?: (moveId: string) => void
}) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full min-w-full text-left text-sm">
        <thead className="bg-surface">
          <tr>
            {table.headers.map((header, i) => (
              <th
                key={i}
                className="whitespace-nowrap px-3 py-2 font-display text-xs uppercase tracking-wide text-ink-muted"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rows.map((row, i) => (
            <tr key={i} className="border-t border-border">
              {row.map((cell, j) => (
                <td key={j} className="px-3 py-2 align-top">
                  <RichText text={cell} game={game} onOpenMove={onOpenMove} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
