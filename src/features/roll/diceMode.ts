// Dice rendering mode setting (3D physics overlay vs lightweight 2D
// animation), persisted like the theme/colorStyle settings. Default is 3D —
// that's the VTT-style showpiece — with 2D as the light/fallback option.
export type DiceMode = '3d' | '2d'

const STORAGE_KEY = 'pocket-moves:dice-mode'

export function getStoredDiceMode(): DiceMode {
  return localStorage.getItem(STORAGE_KEY) === '2d' ? '2d' : '3d'
}

export function setStoredDiceMode(mode: DiceMode): void {
  localStorage.setItem(STORAGE_KEY, mode)
}
