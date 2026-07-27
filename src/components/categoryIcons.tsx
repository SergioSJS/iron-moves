// Small thematic icons per category concept. Same IconBase style as
// components/icons.tsx. Pure components only in this file (react-refresh) —
// the id→component lookup lives in categoryIconMap.ts.
import type { SVGProps } from 'react'

function IconBase(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    />
  )
}

export const SessionIcon = (p: SVGProps<SVGSVGElement>) => (
  <IconBase {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3.5 2" />
  </IconBase>
)

export const AdventureIcon = (p: SVGProps<SVGSVGElement>) => (
  <IconBase {...p}>
    <path d="M3 18 9 8l4 6 3-5 5 9z" />
  </IconBase>
)

export const QuestIcon = (p: SVGProps<SVGSVGElement>) => (
  <IconBase {...p}>
    <path d="M6 21V3" />
    <path d="M6 4h12l-4 4 4 4H6" />
  </IconBase>
)

export const ConnectionIcon = (p: SVGProps<SVGSVGElement>) => (
  <IconBase {...p}>
    <circle cx="9" cy="12" r="6" />
    <circle cx="15" cy="12" r="6" />
  </IconBase>
)

export const ExplorationIcon = (p: SVGProps<SVGSVGElement>) => (
  <IconBase {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M15 9l-4 2-2 4 4-2z" fill="currentColor" stroke="none" />
  </IconBase>
)

export const CombatIcon = (p: SVGProps<SVGSVGElement>) => (
  <IconBase {...p}>
    <path d="M5 19 17 7" />
    <path d="M14 4l6 6" />
    <path d="M3 21l4-4" />
  </IconBase>
)

export const SufferIcon = (p: SVGProps<SVGSVGElement>) => (
  <IconBase {...p}>
    <path d="M12 3 9 10l5 2-6 9" />
  </IconBase>
)

export const RecoverIcon = (p: SVGProps<SVGSVGElement>) => (
  <IconBase {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 8v8M8 12h8" />
  </IconBase>
)

export const ThresholdIcon = (p: SVGProps<SVGSVGElement>) => (
  <IconBase {...p}>
    <path d="M6 21V9a6 6 0 0 1 12 0v12" />
  </IconBase>
)

export const LegacyIcon = (p: SVGProps<SVGSVGElement>) => (
  <IconBase {...p}>
    <path d="M6 3h12L12 12 18 21H6l6-9z" />
  </IconBase>
)

export const FateIcon = (p: SVGProps<SVGSVGElement>) => (
  <IconBase {...p}>
    <rect x="4" y="4" width="16" height="16" rx="3" />
    <circle cx="9" cy="9" r="1" fill="currentColor" stroke="none" />
    <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
    <circle cx="15" cy="15" r="1" fill="currentColor" stroke="none" />
  </IconBase>
)

export const JourneyIcon = (p: SVGProps<SVGSVGElement>) => (
  <IconBase {...p}>
    <path d="M8 21c0-6 8-6 8-12 0-3-2-5-4-6" />
  </IconBase>
)

export const SceneChallengeIcon = (p: SVGProps<SVGSVGElement>) => (
  <IconBase {...p}>
    <rect x="2" y="10" width="4" height="6" />
    <rect x="7.3" y="10" width="4" height="6" />
    <rect x="12.7" y="10" width="4" height="6" />
    <rect x="18" y="10" width="4" height="6" />
  </IconBase>
)

export const RelationshipIcon = (p: SVGProps<SVGSVGElement>) => (
  <IconBase {...p}>
    <path d="M12 20C5 14 3 10 5 7c2-2 5-1 7 2 2-3 5-4 7-2 2 3 0 7-7 13z" />
  </IconBase>
)

export const DelveIcon = (p: SVGProps<SVGSVGElement>) => (
  <IconBase {...p}>
    <path d="M6 8l6 6 6-6" />
    <path d="M6 14l6 6 6-6" />
  </IconBase>
)

export const FailureIcon = (p: SVGProps<SVGSVGElement>) => (
  <IconBase {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M9 9l6 6M15 9l-6 6" />
  </IconBase>
)

export const ThreatIcon = (p: SVGProps<SVGSVGElement>) => (
  <IconBase {...p}>
    <path d="M12 3 22 20H2z" />
    <path d="M12 10v4" />
    <circle cx="12" cy="17" r="0.6" fill="currentColor" stroke="none" />
  </IconBase>
)

export const RarityIcon = (p: SVGProps<SVGSVGElement>) => (
  <IconBase {...p}>
    <path d="M4 9h16L12 21z" />
    <path d="M4 9 8 3h8l4 6" />
  </IconBase>
)
