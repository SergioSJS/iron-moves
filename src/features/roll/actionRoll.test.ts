import { getOutcome, rollActionDice, rollDie } from './actionRoll'

describe('getOutcome', () => {
  it('strong hit when total beats both challenge dice', () => {
    expect(getOutcome(8, [3, 7])).toBe('strongHit')
  })
  it('weak hit when total beats exactly one', () => {
    expect(getOutcome(5, [3, 7])).toBe('weakHit')
  })
  it('miss when total beats none', () => {
    expect(getOutcome(2, [3, 7])).toBe('miss')
  })
  it('a tie does not beat a challenge die', () => {
    expect(getOutcome(7, [7, 7])).toBe('miss')
    expect(getOutcome(7, [3, 7])).toBe('weakHit')
  })
})

describe('rollDie', () => {
  it('stays within 1..sides', () => {
    for (let i = 0; i < 200; i++) {
      expect(rollDie(6)).toBeGreaterThanOrEqual(1)
      expect(rollDie(6)).toBeLessThanOrEqual(6)
      expect(rollDie(10)).toBeGreaterThanOrEqual(1)
      expect(rollDie(10)).toBeLessThanOrEqual(10)
    }
  })
})

describe('rollActionDice', () => {
  it('applies the bonus to the action total', () => {
    const alwaysMax = () => 0.999999 // rolls the top face every time
    const result = rollActionDice(2, alwaysMax)
    expect(result.actionDie).toBe(6)
    expect(result.challengeDice).toEqual([10, 10])
    expect(result.actionTotal).toBe(8)
    expect(result.outcome).toBe('miss') // 8 beats neither 10
  })
})
