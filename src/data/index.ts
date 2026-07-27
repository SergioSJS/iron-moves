import ironswornEn from './en/ironsworn.generated.json'
import starforgedEn from './en/starforged.generated.json'
import type { Game, GameContent, Move } from './schema'

const enContent: Record<Game, GameContent> = {
  ironsworn: ironswornEn as GameContent,
  starforged: starforgedEn as GameContent,
}

// Locale-namespaced per SPEC §6, so a translation drops in as data only — no
// component changes. pt-BR doesn't exist yet: once
// src/data/pt-BR/{ironsworn,starforged}.generated.json are added (by hand,
// or by re-running build-content.mjs against content/pt-BR/*.md), import
// them here and add a 'pt-BR' entry — the per-move fallback below is
// already wired for it.
const contentByLocale: Partial<Record<string, Record<Game, GameContent>>> = {
  en: enContent,
}

export function getGameContent(game: Game, locale = 'en'): GameContent {
  const localeContent = contentByLocale[locale]?.[game]
  if (!localeContent || locale === 'en') return enContent[game]

  // Fall back to the whole English move if this locale is missing it —
  // never a blank screen, never a mixed-language move (e.g. a translated
  // trigger paired with an English outcome).
  const moves: Move[] = enContent[game].moves.map((enMove) => {
    const localeMove = localeContent.moves.find((move) => move.id === enMove.id)
    return localeMove ?? enMove
  })
  return { ...localeContent, moves }
}
