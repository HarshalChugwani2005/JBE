import { useCallback, useEffect, useState } from 'react'
import { ThemeContext } from './ThemeContext.js'

const THEME_STORAGE_KEY = 'jbe_theme_mode_v1'

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(() => {
    if (typeof window === 'undefined') return 'light'
    try {
      return localStorage.getItem(THEME_STORAGE_KEY) || 'light'
    } catch {
      return 'light'
    }
  })

  const [systemDark, setSystemDark] = useState(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia?.('(prefers-color-scheme: dark)')?.matches || false
  })

  // Listen to system preference changes
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = (e) => setSystemDark(e.matches)

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  const isDark = theme === 'dark' || (theme === 'system' && systemDark)

  // Apply dark class to <html> root
  useEffect(() => {
    if (typeof document === 'undefined') return
    const root = document.documentElement

    if (isDark) {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }, [isDark])

  const setTheme = useCallback((newTheme) => {
    setThemeState(newTheme)
    try {
      localStorage.setItem(THEME_STORAGE_KEY, newTheme)
    } catch (err) {
      console.error('Failed to save theme:', err)
    }
  }, [])

  const toggleTheme = useCallback(() => {
    setTheme(isDark ? 'light' : 'dark')
  }, [isDark, setTheme])

  return (
    <ThemeContext.Provider
      value={{
        theme,
        isDark,
        setTheme,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}
