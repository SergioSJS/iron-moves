// Theme (system/light/dark) mechanism for SPEC §5's "respect prefers-color-scheme
// by default; add a manual override in Settings, persisted to localStorage".
// The actual Settings screen lands in a later ticket — this hook is the
// reusable piece it (and this ticket's tokens smoke test) both call into.
import { useCallback, useEffect, useState } from 'react'

export type ThemeSetting = 'system' | 'light' | 'dark'
export type EffectiveTheme = 'light' | 'dark'

const STORAGE_KEY = 'pocket-moves:theme'

function isThemeSetting(value: string | null): value is ThemeSetting {
  return value === 'system' || value === 'light' || value === 'dark'
}

export function getStoredTheme(): ThemeSetting {
  const stored = localStorage.getItem(STORAGE_KEY)
  return isThemeSetting(stored) ? stored : 'system'
}

function getSystemTheme(): EffectiveTheme {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function resolveEffectiveTheme(setting: ThemeSetting): EffectiveTheme {
  return setting === 'system' ? getSystemTheme() : setting
}

/** Sets the `.dark` class on <html>. Safe to call before React mounts, to avoid a flash of the wrong theme. */
export function applyTheme(setting: ThemeSetting): EffectiveTheme {
  const effective = resolveEffectiveTheme(setting)
  document.documentElement.classList.toggle('dark', effective === 'dark')
  return effective
}

/** Reads localStorage and applies the theme immediately. Call once, synchronously, before the app renders. */
export function applyStoredTheme(): void {
  applyTheme(getStoredTheme())
}

// Subscribes to OS-level scheme changes — this is the one part that
// genuinely needs an effect+state (reacting to an external system's events),
// per react-hooks/set-state-in-effect: the setState call lives in the
// matchMedia listener callback, not directly in the effect body.
function useSystemTheme(): EffectiveTheme {
  const [systemTheme, setSystemTheme] = useState<EffectiveTheme>(getSystemTheme)

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = () => setSystemTheme(media.matches ? 'dark' : 'light')
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [])

  return systemTheme
}

export function useTheme(): {
  setting: ThemeSetting
  effective: EffectiveTheme
  setSetting: (setting: ThemeSetting) => void
} {
  const [setting, setSettingState] = useState<ThemeSetting>(getStoredTheme)
  const systemTheme = useSystemTheme()
  const effective: EffectiveTheme = setting === 'system' ? systemTheme : setting

  // Syncing React state to the DOM class list is the sanctioned use of an
  // effect here — no setState involved.
  useEffect(() => {
    document.documentElement.classList.toggle('dark', effective === 'dark')
  }, [effective])

  const setSetting = useCallback((next: ThemeSetting) => {
    localStorage.setItem(STORAGE_KEY, next)
    setSettingState(next)
  }, [])

  return { setting, effective, setSetting }
}
