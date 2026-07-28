import { describe, expect, it } from 'vitest'
import enIronsworn from './en/ironsworn.generated.json'
import enStarforged from './en/starforged.generated.json'
import ptBRIronsworn from './pt-BR/ironsworn.generated.json'
import ptBRStarforged from './pt-BR/starforged.generated.json'
import type { GameContent, Move } from './schema'

// Guards the pt-BR machine translation (scripts/translate-content.mjs) against
// structural drift from the English source. The text itself is meant to be
// replaced wholesale by an official translation later, but ids, cross-ref
// tokens and field structure must match 1:1 or getGameContent's per-move
// fallback and cross-ref linking would silently break.

const MOVE_TOKEN = /\{move:[a-z0-9-]+\}/g

function moveTokens(move: Move): string[] {
  return (JSON.stringify(move).match(MOVE_TOKEN) ?? []).sort()
}

const pairs: Array<[string, GameContent, GameContent]> = [
  ['ironsworn', enIronsworn as GameContent, ptBRIronsworn as GameContent],
  ['starforged', enStarforged as GameContent, ptBRStarforged as GameContent],
]

describe.each(pairs)('pt-BR content (%s)', (game, en, ptBR) => {
  it('has the same categories, in order', () => {
    expect(ptBR.categories.map((c) => c.id)).toEqual(en.categories.map((c) => c.id))
  })

  it('has the same moves, in order', () => {
    expect(ptBR.moves.map((m) => m.id)).toEqual(en.moves.map((m) => m.id))
  })

  it('preserves every {move:id} cross-ref token', () => {
    for (const [i, enMove] of en.moves.entries()) {
      expect(moveTokens(ptBR.moves[i]), `${game}:${enMove.id}`).toEqual(
        moveTokens(enMove),
      )
    }
  })

  it('keeps the same field structure per move', () => {
    for (const [i, enMove] of en.moves.entries()) {
      const ptMove = ptBR.moves[i]
      expect(Object.keys(ptMove.outcomes).sort(), `${game}:${enMove.id}`).toEqual(
        Object.keys(enMove.outcomes).sort(),
      )
      expect(ptMove.rollOptions?.length, `${game}:${enMove.id}`).toBe(
        enMove.rollOptions?.length,
      )
      expect(ptMove.bullets?.length, `${game}:${enMove.id}`).toBe(
        enMove.bullets?.length,
      )
      expect(ptMove.tables?.length, `${game}:${enMove.id}`).toBe(enMove.tables?.length)
      expect(ptMove.sidebars?.length, `${game}:${enMove.id}`).toBe(
        enMove.sidebars?.length,
      )
      expect(ptMove.crossRefs, `${game}:${enMove.id}`).toEqual(enMove.crossRefs)
    }
  })
})
