import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { getStoredGame, setStoredGame } from '../../app/useSelectedGame'
import { CategoryChip } from '../../components/CategoryChip'
import type { Game } from '../../data/schema'
import {
  getStoredColorStyle,
  resolveCategoryColor,
  setStoredColorStyle,
  type ColorStyle,
} from '../../styles/colorStyle'
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
