// Action-roll mechanics shared by Ironsworn and Starforged: 1d6 + bonus
// (action die) vs 2d10 (challenge dice). Strong hit beats BOTH challenge
// dice, weak hit beats ONE, miss beats NONE — strictly greater, a tie does
// not beat. Pure logic lives here (no React) so it's unit-testable and both
// renderers (3D dice-box and 2D animation) share it.

export type RollOutcome = 'strongHit' | 'weakHit' | 'miss'

export interface ActionRollResult {
  bonus: number
  actionDie: number
  challengeDice: [number, number]
  actionTotal: number
  outcome: RollOutcome
}

export function getOutcome(actionTotal: number, challengeDice: number[]): RollOutcome {
  const beaten = challengeDice.filter((die) => actionTotal > die).length
  return beaten === 2 ? 'strongHit' : beaten === 1 ? 'weakHit' : 'miss'
}

// crypto.getRandomValues-backed [0,1) source — same approach dice-box itself
// uses internally, and better distributed than Math.random for a dice app.
function cryptoRandom(): number {
  const buffer = new Uint32Array(1)
  crypto.getRandomValues(buffer)
  return buffer[0] / 2 ** 32
}

export function rollDie(sides: number, rng: () => number = cryptoRandom): number {
  return Math.floor(rng() * sides) + 1
}

export function rollActionDice(
  bonus: number,
  rng: () => number = cryptoRandom,
): ActionRollResult {
  const actionDie = rollDie(6, rng)
  const challengeDice: [number, number] = [rollDie(10, rng), rollDie(10, rng)]
  const actionTotal = actionDie + bonus
  return {
    bonus,
    actionDie,
    challengeDice,
    actionTotal,
    outcome: getOutcome(actionTotal, challengeDice),
  }
}
