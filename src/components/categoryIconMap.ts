// Keyed by the keyword in each category's id (e.g. "session-moves" →
// "session"). Both books reuse a lot of the same category names (adventure,
// quest, fate, combat, suffer), so one shared map covers most of
// Starforged's 11 + Ironsworn's 12 categories. Non-component data only in
// this file (react-refresh) — see CategoryIcon.tsx for the render side.
import type { ComponentType, SVGProps } from 'react'
import {
  AdventureIcon,
  CombatIcon,
  ConnectionIcon,
  DelveIcon,
  ExplorationIcon,
  FailureIcon,
  FateIcon,
  JourneyIcon,
  LegacyIcon,
  QuestIcon,
  RarityIcon,
  RecoverIcon,
  RelationshipIcon,
  SceneChallengeIcon,
  SessionIcon,
  SufferIcon,
  ThreatIcon,
  ThresholdIcon,
} from './categoryIcons'

export const CATEGORY_ICONS: Record<string, ComponentType<SVGProps<SVGSVGElement>>> = {
  session: SessionIcon,
  adventure: AdventureIcon,
  quest: QuestIcon,
  connection: ConnectionIcon,
  exploration: ExplorationIcon,
  combat: CombatIcon,
  suffer: SufferIcon,
  recover: RecoverIcon,
  threshold: ThresholdIcon,
  legacy: LegacyIcon,
  fate: FateIcon,
  journey: JourneyIcon,
  'scene-challenge': SceneChallengeIcon,
  relationship: RelationshipIcon,
  delve: DelveIcon,
  failure: FailureIcon,
  threat: ThreatIcon,
  rarity: RarityIcon,
}

/** category.id looks like "scene-challenge-moves" — strip the trailing "-moves" to get the CATEGORY_ICONS key. */
export function getCategoryIconKey(categoryId: string): string {
  return categoryId.replace(/-moves$/, '')
}
