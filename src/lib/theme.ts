export type Theme = 'light' | 'dark'

const THEME_KEY = 'jp_theme'

export function applyTheme(theme: Theme) {
  const root = document.documentElement
  if (theme === 'dark') root.classList.add('dark')
  else root.classList.remove('dark')
}

export function getStoredTheme(): Theme | null {
  const raw = localStorage.getItem(THEME_KEY)
  if (raw === 'light' || raw === 'dark') return raw
  return null
}

export function setStoredTheme(theme: Theme) {
  localStorage.setItem(THEME_KEY, theme)
}

export function getSystemTheme(): Theme {
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function getInitialTheme(): Theme {
  return getStoredTheme() ?? getSystemTheme()
}
