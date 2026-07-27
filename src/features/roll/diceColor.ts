// Dice color customization (die body + number/label color), persisted like
// the other settings. 'game'/'auto' are the defaults: die follows the
// current game's accent (getGameDiceColor), numbers auto-contrast against
// the die via the same WCAG helper used for category accents (tokens.ts).
import type { Game } from '../../data/schema'
import { getGameDiceColor } from '../../styles/gameTheme'
import { getAccentTextColor, starforgedCategoryColors, starforgedTokens } from '../../styles/tokens'

const DICE_COLOR_KEY = 'pocket-moves:dice-color'
const DICE_NUMBER_COLOR_KEY = 'pocket-moves:dice-number-color'

/** 'game' = follow the current game's accent; otherwise a preset hex. */
export type DiceColorSetting = 'game' | (string & {})
/** 'auto' = WCAG contrast pick against the die; otherwise a preset hex. */
export type DiceNumberColorSetting = 'auto' | (string & {})

// Presets drawn from the books' own palettes (tokens.ts) where possible;
// the green is dice-box's classic VTT default.
export const DICE_COLOR_PRESETS: string[] = [
  '#2e8555', // dice-box default green
  starforgedTokens.accentRed,
  starforgedCategoryColors.quest,
  starforgedCategoryColors.exploration,
  starforgedCategoryColors.suffer,
  starforgedCategoryColors.threshold,
]

export const DICE_NUMBER_PRESETS: string[] = ['#FFFFFF', starforgedTokens.ink, '#E0BB40']

// Fixed S/L for the hue slider (Settings): mid saturation/lightness keeps
// any hue readable as a die body — light enough to show face labels, dark
// enough to not glare on the dark theme.
export const DICE_HUE_SATURATION = 45
export const DICE_HUE_LIGHTNESS = 45

export function getStoredDiceColor(): DiceColorSetting {
  return localStorage.getItem(DICE_COLOR_KEY) ?? 'game'
}

export function setStoredDiceColor(setting: DiceColorSetting): void {
  localStorage.setItem(DICE_COLOR_KEY, setting)
}

export function getStoredDiceNumberColor(): DiceNumberColorSetting {
  return localStorage.getItem(DICE_NUMBER_COLOR_KEY) ?? 'auto'
}

export function setStoredDiceNumberColor(setting: DiceNumberColorSetting): void {
  localStorage.setItem(DICE_NUMBER_COLOR_KEY, setting)
}

export function resolveDiceColor(setting: DiceColorSetting, game: Game): string {
  return setting === 'game' ? getGameDiceColor(game) : setting
}

export function resolveDiceNumberColor(
  setting: DiceNumberColorSetting,
  dieColor: string,
): string {
  return setting === 'auto' ? getAccentTextColor(dieColor) : setting
}
