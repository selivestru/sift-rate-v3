import { useEffect, useRef, useState } from 'react'
import { z } from 'zod'

import { getStorageItem, setStorageItem } from '../utils/storage'
import {
  ACCENT_COLORS,
  ACCENT_STORAGE_KEY,
  applyAccentAttribute,
  DEFAULT_ACCENT,
  type AccentColor,
} from './accent'
import {
  applyThemeClass,
  getSystemTheme,
  resolveTheme,
  THEME_MODES,
  THEME_STORAGE_KEY,
  ThemeContext,
  type ResolvedTheme,
  type ThemeMode,
} from './theme'

export const ThemeProvider = ({ children }: React.PropsWithChildren) => {
  const [theme, setThemeState] = useState<ThemeMode>(
    getStorageItem(THEME_STORAGE_KEY, z.enum(THEME_MODES), 'system'),
  )
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>(() => resolveTheme(theme))
  const [accent, setAccentState] = useState<AccentColor>(
    getStorageItem(ACCENT_STORAGE_KEY, z.enum(ACCENT_COLORS), DEFAULT_ACCENT),
  )

  const isFirstRender = useRef(true)

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }

    const resolved = resolveTheme(theme)
    setResolvedTheme(resolved)
    applyThemeClass(resolved)
    setStorageItem(THEME_STORAGE_KEY, theme)

    if (theme === 'system') {
      const media = window.matchMedia('(prefers-color-scheme: dark)')
      const handler = () => {
        const next = getSystemTheme()
        setResolvedTheme(next)
        applyThemeClass(next)
      }
      media.addEventListener('change', handler)
      return () => media.removeEventListener('change', handler)
    }
  }, [theme])

  const updateToggleTheme = () => {
    setThemeState((prev) => {
      if (prev === 'system') return 'light'
      if (prev === 'light') return 'dark'
      return 'system'
    })
  }

  const toggleTheme = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!document.startViewTransition) {
      updateToggleTheme()
      return
    }

    const rect = event.currentTarget.getBoundingClientRect()
    const x = rect.left + rect.width / 2
    const y = rect.top + rect.height / 2

    const maxRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y),
    )
    const root = document.documentElement
    root.style.setProperty('--vt-x', `${x}px`)
    root.style.setProperty('--vt-y', `${y}px`)
    root.style.setProperty('--vt-r', `${maxRadius}px`)

    document.startViewTransition(() => {
      updateToggleTheme()
    })
  }

  const setTheme = (next: ThemeMode) => {
    const resolved = resolveTheme(next)

    if (!document.startViewTransition || resolved === resolvedTheme) {
      setThemeState(next)
      return
    }

    document.startViewTransition(() => {
      setThemeState(next)
    })
  }

  const setAccent = (next: AccentColor) => {
    if (next === accent) return

    setAccentState(next)
    applyAccentAttribute(next)
    setStorageItem(ACCENT_STORAGE_KEY, next)
  }

  const value = {
    theme,
    resolvedTheme,
    setTheme,
    toggleTheme,
    accent,
    setAccent,
  }

  return <ThemeContext value={value}>{children}</ThemeContext>
}
