import { useState, type CSSProperties } from 'react'
import { useTranslation } from 'react-i18next'
import { BottomSheet } from '../../components/BottomSheet'
import type { Game } from '../../data/schema'
import { getOutcomeAccentVars, outcomeAccents } from '../../styles/tokens'
import { getOutcome, rollActionDice, type ActionRollResult } from './actionRoll'
import {
  getStoredDiceColor,
  getStoredDiceNumberColor,
  resolveDiceColor,
  resolveDiceNumberColor,
} from './diceColor'
import { getStoredDiceMode, type DiceMode } from './diceMode'
import { Dice2D } from './Dice2D'
import { DiceBox3D } from './DiceBox3D'

const BONUS_MIN = -10
const BONUS_MAX = 10

type Phase = 'config' | 'rolling' | 'result'

function formatBonus(bonus: number): string {
  return bonus >= 0 ? `+${bonus}` : `${bonus}`
}

// Orchestrates the dice feature (see plan/AGENTS): bonus dialog → animated
// roll (3D physics or 2D, per Settings) → result card. NOT a route — it's an
// overlay on whatever page is open, because the 3D mode's whole point is
// dice tumbling over the current screen. Stays mounted for the app's
// lifetime (RootLayout) so DiceBox3D's engine singleton survives between
// rolls; `open` just drives the phase machine.
export function RollFlow({
  open,
  game,
  onClose,
}: {
  open: boolean
  /** Current game — tints the dice (getGameDiceColor). */
  game: Game
  onClose: () => void
}) {
  const { t } = useTranslation()
  const [phase, setPhase] = useState<Phase>('config')
  const [bonus, setBonus] = useState(1)
  const [mode, setMode] = useState<DiceMode>(getStoredDiceMode)
  const [diceColor, setDiceColor] = useState(() =>
    resolveDiceColor(getStoredDiceColor(), game),
  )
  const [diceNumberColor, setDiceNumberColor] = useState(() =>
    resolveDiceNumberColor(getStoredDiceNumberColor(), diceColor),
  )
  const [result, setResult] = useState<ActionRollResult | null>(null)
  const [rollId, setRollId] = useState(0)
  const [usedFallback, setUsedFallback] = useState(false)

  // Reset to a fresh dialog every time the feature is opened; closing hides
  // the 3D canvas (rollId 0) and drops the previous result. Adjusted during
  // render (React's "adjust state when props change" pattern) rather than
  // in an effect — lint rule react-hooks/set-state-in-effect.
  const [prevOpen, setPrevOpen] = useState(open)
  if (open !== prevOpen) {
    setPrevOpen(open)
    if (open) {
      setMode(getStoredDiceMode())
      const dieColor = resolveDiceColor(getStoredDiceColor(), game)
      setDiceColor(dieColor)
      setDiceNumberColor(resolveDiceNumberColor(getStoredDiceNumberColor(), dieColor))
      setBonus(1)
      setResult(null)
      setUsedFallback(false)
      setPhase('config')
    } else {
      setRollId(0)
      setResult(null)
    }
  }

  const startRoll = () => {
    if (mode === '3d') {
      // DiceBox3D produces the physical values; result arrives in onComplete.
      setPhase('rolling')
      setRollId((id) => id + 1)
    } else {
      setResult(rollActionDice(bonus))
      setPhase('rolling')
    }
  }

  const handle3DComplete = (actionDie: number, challengeDice: [number, number]) => {
    const actionTotal = actionDie + bonus
    setResult({
      bonus,
      actionDie,
      challengeDice,
      actionTotal,
      outcome: getOutcome(actionTotal, challengeDice),
    })
    setPhase('result')
  }

  // 3D engine failed (no WebGL, asset fetch broke, parse surprise) — fall
  // back to the 2D roll for this attempt without changing the stored mode.
  const handle3DError = () => {
    setUsedFallback(true)
    setResult(rollActionDice(bonus))
    setMode('2d')
  }

  const outcomeVars = result
    ? (getOutcomeAccentVars(outcomeAccents[result.outcome]) as CSSProperties)
    : undefined

  return (
    <>
      {open && phase === 'config' && (
        <BottomSheet onClose={onClose} maxWidthClassName="md:max-w-sm">
          <h2 className="mb-4 text-center font-display text-xl uppercase tracking-wide">
            {t('roll.title')}
          </h2>
          <p className="mb-2 text-center font-display text-sm uppercase tracking-wide text-ink-muted">
            {t('roll.bonus')}
          </p>
          <div className="mb-6 flex items-center justify-center gap-4">
            <button
              type="button"
              aria-label="−"
              disabled={bonus <= BONUS_MIN}
              onClick={() => setBonus((value) => Math.max(BONUS_MIN, value - 1))}
              className="h-12 w-12 rounded-full border border-border bg-surface text-2xl font-bold disabled:opacity-40"
            >
              −
            </button>
            <span className="w-16 text-center font-display text-3xl font-bold">
              {formatBonus(bonus)}
            </span>
            <button
              type="button"
              aria-label="+"
              disabled={bonus >= BONUS_MAX}
              onClick={() => setBonus((value) => Math.min(BONUS_MAX, value + 1))}
              className="h-12 w-12 rounded-full border border-border bg-surface text-2xl font-bold disabled:opacity-40"
            >
              +
            </button>
          </div>
          <button
            type="button"
            onClick={startRoll}
            className="w-full rounded-lg bg-accent px-6 py-3 font-display text-lg uppercase tracking-wide text-white"
          >
            {t('roll.roll')}
          </button>
        </BottomSheet>
      )}

      {/* 3D mode renders its own transparent full-screen overlay; it stays
          mounted (engine singleton) and only acts when rollId increments. */}
      <DiceBox3D
        rollId={rollId}
        diceColor={diceColor}
        onComplete={handle3DComplete}
        onError={handle3DError}
      />

      {open && phase === 'rolling' && mode === '2d' && result && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60">
          <Dice2D
            result={result}
            color={diceColor}
            numberColor={diceNumberColor}
            onDone={() => setPhase('result')}
          />
        </div>
      )}

      {open && phase === 'result' && result && (
        <div className="fixed inset-x-0 bottom-0 z-50 flex justify-center p-4 pb-20 md:inset-0 md:items-center md:pb-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-label={t('roll.title')}
            className="w-full max-w-sm rounded-xl border border-border bg-bg p-4 shadow-lg"
          >
            <div className="mb-3 text-center">
              <span
                style={outcomeVars}
                className="inline-block rounded bg-[var(--outcome-accent)] px-3 py-1 font-display text-sm uppercase tracking-wide text-[var(--outcome-accent-text)]"
              >
                {t(`roll.outcome.${result.outcome}`)}
              </span>
            </div>
            <dl className="mb-4 space-y-1 text-center text-sm">
              <div>
                <dt className="inline text-ink-muted">{t('roll.actionDie')}: </dt>
                <dd className="inline font-semibold">
                  {result.actionDie} {formatBonus(result.bonus)} = {result.actionTotal}
                </dd>
              </div>
              <div>
                <dt className="inline text-ink-muted">{t('roll.challengeDice')}: </dt>
                <dd className="inline font-semibold">
                  {result.challengeDice[0]}, {result.challengeDice[1]}
                </dd>
              </div>
            </dl>
            {usedFallback && (
              <p className="mb-3 text-center text-xs text-ink-muted">
                {t('roll.fallback3d')}
              </p>
            )}
            <button
              type="button"
              onClick={onClose}
              className="w-full rounded-lg border border-border bg-surface px-4 py-2 font-display text-sm uppercase tracking-wide"
            >
              {t('roll.close')}
            </button>
          </div>
        </div>
      )}
    </>
  )
}
