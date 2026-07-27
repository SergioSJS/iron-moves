import { useEffect, useState } from 'react'
import { rollDie, type ActionRollResult } from './actionRoll'

const CYCLE_MS = 70
// Staggered settle: action die first, then the two challenge dice.
const SETTLE_MS = [900, 1300, 1700]

// F2 — lightweight 2D roll: three dice shapes with slot-machine cycling
// numbers that settle one by one on the pre-drawn results. No WebGL, works
// everywhere; also the automatic fallback when the 3D engine fails to load.
export function Dice2D({
  result,
  color,
  numberColor,
  onDone,
}: {
  result: ActionRollResult
  /** Die tint (diceColor.resolveDiceColor) for the chip border/glow. */
  color: string
  /** Number/label color (diceColor.resolveDiceNumberColor). */
  numberColor: string
  onDone: () => void
}) {
  const targets = [result.actionDie, result.challengeDice[0], result.challengeDice[1]]
  const [values, setValues] = useState(targets.map(() => 1))

  useEffect(() => {
    const startedAt = Date.now()
    const interval = setInterval(() => {
      const elapsed = Date.now() - startedAt
      setValues(
        targets.map((target, i) =>
          elapsed >= SETTLE_MS[i] ? target : rollDie(i === 0 ? 6 : 10),
        ),
      )
    }, CYCLE_MS)
    const doneTimer = setTimeout(onDone, SETTLE_MS[SETTLE_MS.length - 1] + 600)
    return () => {
      clearInterval(interval)
      clearTimeout(doneTimer)
    }
    // targets/onDone are stable for a given roll — run once per mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="flex items-center gap-4">
      {/* Action die — d6 square. Solid die-color body so the number color
          (auto = WCAG pick against the die color) always reads. */}
      <div
        data-testid="dice-2d-action"
        style={{ backgroundColor: `${color}E6`, color: numberColor }}
        className="flex h-20 w-20 items-center justify-center rounded-2xl border-2 border-white/30 text-4xl font-bold shadow-lg"
      >
        {values[0]}
      </div>
      {/* Challenge dice — d10 diamonds */}
      {[1, 2].map((i) => (
        <div
          key={i}
          data-testid={`dice-2d-challenge-${i - 1}`}
          style={{ backgroundColor: `${color}E6` }}
          className="flex h-20 w-20 rotate-45 items-center justify-center rounded-lg border-2 border-white/30 shadow-lg"
        >
          <span className="-rotate-45 text-4xl font-bold" style={{ color: numberColor }}>
            {values[i]}
          </span>
        </div>
      ))}
    </div>
  )
}
