import { useEffect, useState, type CSSProperties } from 'react'
import { rollDie, type ActionRollResult } from './actionRoll'

const CYCLE_MS = 70
// Staggered settle: action die first, then the two challenge dice.
const SETTLE_MS = [900, 1300, 1700]

// Mixes a #rrggbb hex with white (amount > 0) or black (amount < 0) —
// |amount| is the 0..1 mix ratio. Used to derive the die face's gradient
// stops from the single configured die color.
function shade(hex: string, amount: number): string {
  const n = Number.parseInt(hex.slice(1), 16)
  const target = amount < 0 ? 0 : 255
  const p = Math.abs(amount)
  const mix = (channel: number) => Math.round(channel + (target - channel) * p)
  return `rgb(${mix((n >> 16) & 255)}, ${mix((n >> 8) & 255)}, ${mix(n & 255)})`
}

// Shared face styling: a 145° gradient over the die color plus inset
// highlight/shadow gives the chunky, glossy-plastic look real dice have —
// the previous flat alpha fill read as a plain colored tile.
function faceStyle(color: string, numberColor: string): CSSProperties {
  return {
    background: `linear-gradient(145deg, ${shade(color, 0.45)} 0%, ${color} 45%, ${shade(color, -0.4)} 100%)`,
    color: numberColor,
    textShadow: '0 1px 2px rgba(0, 0, 0, 0.45)',
  }
}

const INSET_SHADOW =
  'inset 0 2px 3px rgba(255, 255, 255, 0.4), inset 0 -4px 7px rgba(0, 0, 0, 0.35), 0 6px 14px rgba(0, 0, 0, 0.45)'

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
  /** Die tint (diceColor.resolveDiceColor) for the die body gradient. */
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
    <div className="flex items-center gap-5">
      {/* Action die — d6 rounded square. */}
      <div
        data-testid="dice-2d-action"
        style={{ ...faceStyle(color, numberColor), boxShadow: INSET_SHADOW }}
        className="flex h-20 w-20 items-center justify-center rounded-2xl text-4xl font-bold"
      >
        {values[0]}
      </div>
      {/* Challenge dice — d10 kite faces. A real d10 is a pentagonal
          trapezohedron: each face is a kite with a ~63° tip at the pole, two
          90° side vertices and a ~117° blunt bottom — i.e. slightly taller
          than wide (ratio ≈ 1.12:1) with the widest point ~72% down, NOT a
          square rotated 45° nor a 5-vertex pentagon. clip-path swallows
          box-shadow, so the drop shadow comes from a filter, which follows
          the clipped shape. The number is nudged toward the tip, matching
          where real d10s print it. */}
      {[1, 2].map((i) => (
        <div
          key={i}
          data-testid={`dice-2d-challenge-${i - 1}`}
          style={{
            ...faceStyle(color, numberColor),
            clipPath: 'polygon(50% 0%, 100% 72%, 50% 100%, 0% 72%)',
            filter: 'drop-shadow(0 6px 10px rgba(0, 0, 0, 0.45))',
          }}
          className="flex h-20 w-[4.5rem] items-center justify-center text-4xl font-bold"
        >
          <span className="-translate-y-1">{values[i]}</span>
        </div>
      ))}
    </div>
  )
}
