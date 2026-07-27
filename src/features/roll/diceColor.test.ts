import { hexFromHsl, hslFromHex } from '../../styles/tokens'
import {
  resolveDiceColor,
  resolveDiceNumberColor,
  DICE_COLOR_PRESETS,
  DICE_NUMBER_PRESETS,
} from './diceColor'

describe('resolveDiceColor', () => {
  it("'game' follows the per-game accent", () => {
    expect(resolveDiceColor('game', 'ironsworn')).toBe('#c9a961')
    expect(resolveDiceColor('game', 'starforged')).toBe('#8ba3d4')
  })
  it('a preset hex passes through regardless of game', () => {
    expect(resolveDiceColor('#2e8555', 'ironsworn')).toBe('#2e8555')
    expect(resolveDiceColor('#2e8555', 'starforged')).toBe('#2e8555')
  })
})

describe('resolveDiceNumberColor', () => {
  it("'auto' picks white numbers on dark dice", () => {
    expect(resolveDiceNumberColor('auto', '#1D1D1B')).toBe('#FFFFFF')
  })
  it("'auto' picks dark numbers on light dice", () => {
    expect(resolveDiceNumberColor('auto', '#c9a961')).not.toBe('#FFFFFF')
  })
  it('a preset hex passes through', () => {
    expect(resolveDiceNumberColor('#E0BB40', '#1D1D1B')).toBe('#E0BB40')
  })
})

describe('presets', () => {
  it('are valid hex colors', () => {
    for (const hex of [...DICE_COLOR_PRESETS, ...DICE_NUMBER_PRESETS]) {
      expect(hex).toMatch(/^#[0-9A-Fa-f]{6}$/)
    }
  })
})

describe('hexFromHsl / hslFromHex (hue slider helpers)', () => {
  it('converts primary hues to hex', () => {
    expect(hexFromHsl(0, 100, 50)).toBe('#FF0000')
    expect(hexFromHsl(120, 100, 50)).toBe('#00FF00')
    expect(hexFromHsl(240, 100, 50)).toBe('#0000FF')
  })
  it('roundtrips hue through hex', () => {
    for (const hue of [0, 43, 120, 218, 300, 359]) {
      const [h] = hslFromHex(hexFromHsl(hue, 45, 45))
      expect(Math.round(h)).toBe(hue)
    }
  })
})
