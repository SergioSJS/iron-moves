// @3d-dice/dice-box ships no TypeScript types (checked v1.1.4) — declare the
// minimal surface we use, reverse-engineered from dist/dice-box.es.js:
// - v1.1+ constructor takes a single config object (2-arg form is deprecated)
// - roll() accepts string | string[] and resolves with per-die results
// - getRollResults()/onRollComplete groups dice per notation entry
declare module '@3d-dice/dice-box' {
  export interface DiceBoxDieResult {
    value: number
    sides: string | number
    groupId?: number
    rollId?: number
    notation?: string
  }

  export interface DiceBoxRollGroup {
    value: number
    qty: number
    sides: string
    rolls: DiceBoxDieResult[]
  }

  export interface DiceBoxConfig {
    container: string
    assetPath?: string
    theme?: string
    themeColor?: string
    scale?: number
    offscreen?: boolean
    enableShadows?: boolean
    onRollComplete?: (results: DiceBoxRollGroup[]) => void
    onDieComplete?: (die: DiceBoxDieResult) => void
  }

  export default class DiceBox {
    constructor(config: DiceBoxConfig)
    init(): Promise<DiceBox>
    roll(
      notation: string | string[],
      options?: { theme?: string; themeColor?: string; newStartPoint?: boolean },
    ): Promise<DiceBoxDieResult[]>
    clear(): DiceBox
    hide(): DiceBox
    show(): DiceBox
  }
}
