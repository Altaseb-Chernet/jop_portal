import { useEffect, useMemo, useState } from 'react'
import { applyTheme, getInitialTheme, setStoredTheme, type Theme } from '../lib/theme'

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === 'undefined') return 'light'
    return getInitialTheme()
  })

  useEffect(() => {
    applyTheme(theme)
    setStoredTheme(theme)
  }, [theme])

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = () => {
      const stored = localStorage.getItem('jp_theme')
      if (stored !== 'light' && stored !== 'dark') setTheme(mq.matches ? 'dark' : 'light')
    }

    if (mq.addEventListener) mq.addEventListener('change', onChange)
    else mq.addListener(onChange)

    return () => {
      if (mq.removeEventListener) mq.removeEventListener('change', onChange)
      else mq.removeListener(onChange)
    }
  }, [])

  const isDark = theme === 'dark'

  const api = useMemo(
    () => ({
      theme,
      isDark,
      setTheme,
      toggle: () => setTheme((t) => (t === 'dark' ? 'light' : 'dark')),
    }),
    [theme, isDark],
  )

  return api
}
