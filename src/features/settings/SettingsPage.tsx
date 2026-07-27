import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { getStoredGame, setStoredGame } from '../../app/useSelectedGame'
import { CategoryChip } from '../../components/CategoryChip'
import type { Game } from '../../data/schema'
import {
  DICE_COLOR_PRESETS,
  DICE_HUE_LIGHTNESS,
  DICE_HUE_SATURATION,
  DICE_NUMBER_PRESETS,
  getStoredDiceColor,
  getStoredDiceNumberColor,
  resolveDiceColor,
  setStoredDiceColor,
  setStoredDiceNumberColor,
  type DiceColorSetting,
  type DiceNumberColorSetting,
} from '../roll/diceColor'
import { getStoredDiceMode, setStoredDiceMode, type DiceMode } from '../roll/diceMode'
import {
  getStoredColorStyle,
  resolveCategoryColor,
  setStoredColorStyle,
  type ColorStyle,
} from '../../styles/colorStyle'
import { hexFromHsl, hslFromHex } from '../../styles/tokens'
import {
  getStoredLocale,
  setStoredLocale,
  SUPPORTED_LOCALES,
  type Locale,
} from '../../i18n'
import { useTheme, type ThemeSetting } from '../../styles/useTheme'

const THEME_OPTIONS: ThemeSetting[] = ['system', 'light', 'dark']

// Game titles are proper nouns — not translated.
const GAME_OPTIONS: { id: Game; label: string }[] = [
  { id: 'starforged', label: 'Starforged' },
  { id: 'ironsworn', label: 'Ironsworn' },
]

const LOCALE_LABELS: Record<Locale, string> = {
  en: 'English',
  'pt-BR': 'Português',
}

const COLOR_STYLE_OPTIONS: ColorStyle[] = ['original', 'vibrant']

const DICE_MODE_OPTIONS: DiceMode[] = ['3d', '2d']

// Round color swatch used by the dice color pickers. `background` accepts
// any CSS background (hex or gradient — the 'game'/'auto' entries are
// two-tone swatches).
function ColorSwatch({
  background,
  label,
  selected,
  onClick,
}: {
  background: string
  label: string
  selected: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={selected}
      title={label}
      onClick={onClick}
      style={{ background }}
      className={
        'h-8 w-8 rounded-full border border-border ' +
        (selected ? 'ring-2 ring-accent ring-offset-2 ring-offset-bg' : '')
      }
    />
  )
}

// A few sample categories to preview the color-style toggle without having
// to leave Settings to see the effect.
const PREVIEW_CATEGORIES = [
  { id: 'session-moves', name: 'Session', original: '#3F8C8A' },
  { id: 'quest-moves', name: 'Quest', original: '#805A90' },
  { id: 'combat-moves', name: 'Combat', original: '#818992' },
  { id: 'suffer-moves', name: 'Suffer', original: '#883529' },
]

// Theme (Ticket 3), default game (Ticket 4's useSelectedGame — same storage
// key the tab bar already reads), language (Ticket 9), and category color
// style are all real.
export function SettingsPage() {
  const { t } = useTranslation()
  const { setting, effective, setSetting } = useTheme()
  const [defaultGame, setDefaultGame] = useState<Game>(getStoredGame)
  const [locale, setLocale] = useState<Locale>(getStoredLocale)
  const [colorStyle, setColorStyle] = useState<ColorStyle>(getStoredColorStyle)
  const [diceMode, setDiceMode] = useState<DiceMode>(getStoredDiceMode)
  const [diceColor, setDiceColor] = useState<DiceColorSetting>(getStoredDiceColor)
  const [diceNumberColor, setDiceNumberColor] = useState<DiceNumberColorSetting>(
    getStoredDiceNumberColor,
  )

  return (
    <div className="p-4">
      <h2 className="mb-4 font-display text-2xl uppercase tracking-wide">
        {t('settings.heading')}
      </h2>

      <section className="mb-6">
        <h3 className="mb-2 font-display text-sm uppercase tracking-wide text-ink-muted">
          {t('settings.theme')}
        </h3>
        <div className="inline-flex gap-1 rounded-full border border-border bg-surface p-1">
          {THEME_OPTIONS.map((option) => (
            <button
              key={option}
              type="button"
              aria-pressed={setting === option}
              onClick={() => setSetting(option)}
              className={
                'rounded-full px-3 py-1 text-sm ' +
                (setting === option ? 'bg-bg text-ink' : 'text-ink-muted')
              }
            >
              {t(`settings.themeOption.${option}`)}
            </button>
          ))}
        </div>
        <p className="mt-2 text-sm text-ink-muted">
          {t('settings.themeEffective', {
            theme: t(`settings.themeOption.${effective}`),
          })}
        </p>
      </section>

      <section className="mb-6">
        <h3 className="mb-2 font-display text-sm uppercase tracking-wide text-ink-muted">
          {t('settings.categoryColors')}
        </h3>
        <div className="inline-flex gap-1 rounded-full border border-border bg-surface p-1">
          {COLOR_STYLE_OPTIONS.map((option) => (
            <button
              key={option}
              type="button"
              aria-pressed={colorStyle === option}
              onClick={() => {
                setStoredColorStyle(option)
                setColorStyle(option)
              }}
              className={
                'rounded-full px-3 py-1 text-sm ' +
                (colorStyle === option ? 'bg-bg text-ink' : 'text-ink-muted')
              }
            >
              {t(`settings.categoryColorOption.${option}`)}
            </button>
          ))}
        </div>
        <p className="mb-2 mt-2 text-sm text-ink-muted">
          {t(`settings.categoryColorOption.${colorStyle}Description`)}
        </p>
        <div className="flex flex-wrap gap-2">
          {PREVIEW_CATEGORIES.map((category) => (
            <CategoryChip
              key={category.id}
              label={category.name}
              categoryId={category.id}
              color={resolveCategoryColor(category.id, category.original)}
            />
          ))}
        </div>
      </section>

      <section className="mb-6">
        <h3 className="mb-2 font-display text-sm uppercase tracking-wide text-ink-muted">
          {t('settings.dice')}
        </h3>
        <div className="inline-flex gap-1 rounded-full border border-border bg-surface p-1">
          {DICE_MODE_OPTIONS.map((option) => (
            <button
              key={option}
              type="button"
              aria-pressed={diceMode === option}
              onClick={() => {
                setStoredDiceMode(option)
                setDiceMode(option)
              }}
              className={
                'rounded-full px-3 py-1 text-sm ' +
                (diceMode === option ? 'bg-bg text-ink' : 'text-ink-muted')
              }
            >
              {t(`settings.diceOption.${option}`)}
            </button>
          ))}
        </div>
        <p className="mt-2 text-sm text-ink-muted">
          {t(`settings.diceOption.${diceMode}Description`)}
        </p>

        <h4 className="mb-2 mt-4 text-sm font-semibold">{t('settings.diceColor')}</h4>
        <div className="flex flex-wrap items-center gap-2">
          <ColorSwatch
            background="linear-gradient(135deg, #c9a961 50%, #8ba3d4 50%)"
            label={t('settings.diceColorGame')}
            selected={diceColor === 'game'}
            onClick={() => {
              setStoredDiceColor('game')
              setDiceColor('game')
            }}
          />
          {DICE_COLOR_PRESETS.map((hex) => (
            <ColorSwatch
              key={hex}
              background={hex}
              label={hex}
              selected={diceColor === hex}
              onClick={() => {
                setStoredDiceColor(hex)
                setDiceColor(hex)
              }}
            />
          ))}
        </div>
        <p className="mt-2 text-sm text-ink-muted">{t('settings.diceColorDescription')}</p>

        <h4 className="mb-2 mt-4 text-sm font-semibold">{t('settings.diceColorHue')}</h4>
        <input
          type="range"
          min={0}
          max={360}
          step={1}
          aria-label={t('settings.diceColorHue')}
          value={Math.round(
            hslFromHex(resolveDiceColor(diceColor, defaultGame))[0],
          )}
          onChange={(event) => {
            // The slider stores a concrete hex (dice-box's themeColor only
            // parses hex); moving it implicitly deselects preset/'game'.
            const hex = hexFromHsl(
              Number(event.target.value),
              DICE_HUE_SATURATION,
              DICE_HUE_LIGHTNESS,
            )
            setStoredDiceColor(hex)
            setDiceColor(hex)
          }}
          className="dice-hue-slider w-full max-w-xs"
          style={{
            background: `linear-gradient(to right, ${[0, 60, 120, 180, 240, 300, 360]
              .map((h) => hexFromHsl(h, DICE_HUE_SATURATION, DICE_HUE_LIGHTNESS))
              .join(', ')})`,
          }}
        />

        <h4 className="mb-2 mt-4 text-sm font-semibold">{t('settings.diceNumberColor')}</h4>
        <div className="flex flex-wrap items-center gap-2">
          <ColorSwatch
            background="linear-gradient(135deg, #FFFFFF 50%, #1D1D1B 50%)"
            label={t('settings.diceNumberAuto')}
            selected={diceNumberColor === 'auto'}
            onClick={() => {
              setStoredDiceNumberColor('auto')
              setDiceNumberColor('auto')
            }}
          />
          {DICE_NUMBER_PRESETS.map((hex) => (
            <ColorSwatch
              key={hex}
              background={hex}
              label={hex}
              selected={diceNumberColor === hex}
              onClick={() => {
                setStoredDiceNumberColor(hex)
                setDiceNumberColor(hex)
              }}
            />
          ))}
        </div>
        <p className="mt-2 text-sm text-ink-muted">
          {t('settings.diceNumberColorDescription')}
        </p>
      </section>

      <section className="mb-6">
        <h3 className="mb-2 font-display text-sm uppercase tracking-wide text-ink-muted">
          {t('settings.defaultGame')}
        </h3>
        <div className="inline-flex gap-1 rounded-full border border-border bg-surface p-1">
          {GAME_OPTIONS.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              aria-pressed={defaultGame === id}
              onClick={() => {
                setStoredGame(id)
                setDefaultGame(id)
              }}
              className={
                'rounded-full px-3 py-1 text-sm ' +
                (defaultGame === id ? 'bg-bg text-ink' : 'text-ink-muted')
              }
            >
              {label}
            </button>
          ))}
        </div>
      </section>

      <section>
        <h3 className="mb-2 font-display text-sm uppercase tracking-wide text-ink-muted">
          {t('settings.language')}
        </h3>
        <div className="inline-flex gap-1 rounded-full border border-border bg-surface p-1">
          {SUPPORTED_LOCALES.map((id) => (
            <button
              key={id}
              type="button"
              aria-pressed={locale === id}
              onClick={() => {
                setStoredLocale(id)
                setLocale(id)
              }}
              className={
                'rounded-full px-3 py-1 text-sm ' +
                (locale === id ? 'bg-bg text-ink' : 'text-ink-muted')
              }
            >
              {LOCALE_LABELS[id]}
            </button>
          ))}
        </div>
      </section>
    </div>
  )
}
