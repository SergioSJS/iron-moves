import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type DiceBox from '@3d-dice/dice-box'

// F1 — VTT-style 3D roll (Foundry/Roll20 flavor): real physics dice tumbling
// on an invisible floor over whatever page you're reading. Uses
// @3d-dice/dice-box (BabylonJS + Ammo; ships CC0 d6/d10 models — see
// public/assets/). The scene clears to Color4(0,0,0,0) and the ground is a
// ShadowOnlyMaterial, so the overlay is genuinely transparent except for
// dice + soft shadows.
//
// The engine is heavy (~1 MB+ of Babylon), so it's dynamic-imported only on
// the first 3D roll and then kept as a module singleton — re-initializing
// per roll would re-fetch theme assets and rebuild the physics world every
// time. This component therefore stays mounted for the app's lifetime (via
// RollFlow) with a pointer-events-none container; between rolls the canvas
// itself is toggled with dice-box's own hide()/show() (show() re-triggers
// its resize logic — a plain display:none on our container would leave the
// canvas at 0×0 forever).
let boxPromise: Promise<DiceBox> | null = null

async function getBox(): Promise<DiceBox> {
  if (!boxPromise) {
    boxPromise = import('@3d-dice/dice-box').then(({ default: DiceBoxClass }) => {
      const box = new DiceBoxClass({
        container: '#dice-box-3d',
        // Committed under public/assets by dice-box's postinstall; BASE_URL
        // makes it resolve under the GH Pages base path (/iron-moves/) too.
        assetPath: `${import.meta.env.BASE_URL}assets/`,
        scale: 6,
      })
      return box.init()
    })
  }
  return boxPromise
}

// Splits dice-box's flat per-die results into action die + challenge dice by
// the notation group they came from. roll(['1d6','2d10']) resolves one entry
// per die with a `sides` marker ('d6'/'d10' — string in v1.1.4, but tolerate
// the numeric form so a silent library change doesn't break parsing).
function parseResults(dice: import('@3d-dice/dice-box').DiceBoxDieResult[]): {
  actionDie: number
  challengeDice: [number, number]
} | null {
  const isSix = (sides: string | number) => String(sides).replace(/^d/i, '') === '6'
  const isTen = (sides: string | number) => String(sides).replace(/^d/i, '') === '10'
  const action = dice.find((die) => isSix(die.sides))
  const challenge = dice.filter((die) => isTen(die.sides)).slice(0, 2)
  if (!action || challenge.length !== 2) return null
  return { actionDie: action.value, challengeDice: [challenge[0].value, challenge[1].value] }
}

export function DiceBox3D({
  rollId,
  diceColor,
  onComplete,
  onError,
}: {
  /** Increment to trigger a physical roll; 0 = idle/canvas hidden. */
  rollId: number
  /** Per-game die tint (gameTheme.getGameDiceColor) passed as themeColor. */
  diceColor: string
  onComplete: (actionDie: number, challengeDice: [number, number]) => void
  onError: () => void
}) {
  const { t } = useTranslation()
  const [loading, setLoading] = useState(false)
  const boxRef = useRef<DiceBox | null>(null)
  const rollingRef = useRef(0)

  useEffect(() => {
    if (rollId === 0) {
      // RollFlow resets rollId to 0 when the overlay closes — re-arm the
      // guard too, or the next roll increments back to the same id and the
      // effect below early-returns (the "only rolls once" bug).
      rollingRef.current = 0
      boxRef.current?.hide()
      return
    }
    if (rollId === rollingRef.current) return
    rollingRef.current = rollId
    let cancelled = false
    setLoading(true)
    getBox()
      .then(async (box) => {
        boxRef.current = box
        if (cancelled) return
        setLoading(false)
        box.show()
        const dice = await box.roll(['1d6', '2d10'], { themeColor: diceColor })
        if (cancelled) return
        const parsed = parseResults(dice)
        if (parsed) onComplete(parsed.actionDie, parsed.challengeDice)
        else onError()
      })
      .catch(() => {
        if (!cancelled) {
          setLoading(false)
          onError()
        }
      })
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rollId])

  return (
    <div className="pointer-events-none fixed inset-0 z-40" aria-hidden={rollId === 0}>
      <div id="dice-box-3d" className="h-full w-full" />
      {loading && rollId > 0 && (
        <p className="absolute inset-x-0 top-1/3 text-center font-display text-sm uppercase tracking-wide text-ink-muted">
          {t('roll.loading3d')}
        </p>
      )}
    </div>
  )
}
