import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { getStoredGame, setStoredGame } from '../../app/useSelectedGame'
import type { Game } from '../../data/schema'
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

// Theme (Ticket 3), default game (Ticket 4's useSelectedGame — same storage
// key the tab bar already reads), and language (Ticket 9) are all real.
export function SettingsPage() {
  const { t } = useTranslation()
  const { setting, effective, setSetting } = useTheme()
  const [defaultGame, setDefaultGame] = useState<Game>(getStoredGame)
  const [locale, setLocale] = useState<Locale>(getStoredLocale)

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
