// UI-string i18n (SPEC §6). Move *content* translation is a separate concern
// (see src/data/index.ts's locale-aware getGameContent) — this file only
// covers nav labels, buttons, settings copy, etc. en is fully populated;
// pt-BR/ui.json is genuinely translated (not just English placeholders) since
// this is generic UI chrome, not RPG-specific move terminology.
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './locales/en/ui.json'
import ptBR from './locales/pt-BR/ui.json'

export const SUPPORTED_LOCALES = ['en', 'pt-BR'] as const
export type Locale = (typeof SUPPORTED_LOCALES)[number]

const STORAGE_KEY = 'pocket-moves:locale'

function isLocale(value: string | null): value is Locale {
  return value === 'en' || value === 'pt-BR'
}

// Independent of device locale — SPEC §6 explicitly says not to force pt-BR
// on Brazilian phones by default before the translation actually exists.
export function getStoredLocale(): Locale {
  const stored = localStorage.getItem(STORAGE_KEY)
  return isLocale(stored) ? stored : 'en'
}

export function setStoredLocale(locale: Locale): void {
  localStorage.setItem(STORAGE_KEY, locale)
  void i18n.changeLanguage(locale)
}

void i18n.use(initReactI18next).init({
  resources: {
    en: { ui: en },
    'pt-BR': { ui: ptBR },
  },
  lng: getStoredLocale(),
  fallbackLng: 'en',
  defaultNS: 'ui',
  interpolation: { escapeValue: false },
})

export default i18n
