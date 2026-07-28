import ironswornEn from './en/ironsworn.generated.json'
import starforgedEn from './en/starforged.generated.json'
import ironswornPtBR from './pt-BR/ironsworn.generated.json'
import starforgedPtBR from './pt-BR/starforged.generated.json'
import type { Game, GameContent, Move } from './schema'

const enContent: Record<Game, GameContent> = {
  ironsworn: ironswornEn as GameContent,
  starforged: starforgedEn as GameContent,
}

// pt-BR is a MACHINE TRANSLATION placeholder (scripts/translate-content.mjs) —
// committed so builds work offline. The official translation replaces the two
// src/data/pt-BR/*.generated.json files wholesale; no component changes needed.
const ptBRContent: Record<Game, GameContent> = {
  ironsworn: ironswornPtBR as GameContent,
  starforged: starforgedPtBR as GameContent,
}

// Locale-namespaced per SPEC §6, so a translation drops in as data only — no
// component changes. The per-move fallback below covers any move missing from
// a locale file.
const contentByLocale: Partial<Record<string, Record<Game, GameContent>>> = {
  en: enContent,
  'pt-BR': ptBRContent,
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
