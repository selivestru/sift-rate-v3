import { createContext } from 'react'

export const THEME_STORAGE_KEY = 'theme'

export const THEME_MODES = ['system', 'light', 'dark'] as const

export type ThemeMode = (typeof THEME_MODES)[number]

export type ResolvedTheme = 'light' | 'dark'

interface ThemeContext {
  theme: ThemeMode
  resolvedTheme: ResolvedTheme
  setTheme: (theme: ThemeMode) => void
  toggleTheme: (event: React.MouseEvent<HTMLButtonElement>) => void
}

export const ThemeContext = createContext<ThemeContext | null>(null)

export const getSystemTheme = (): ResolvedTheme => {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export const resolveTheme = (theme: ThemeMode): ResolvedTheme => {
  return theme === 'system' ? getSystemTheme() : theme
}

export const applyThemeClass = (resolved: ResolvedTheme) => {
  const root = document.documentElement

  if (resolved === 'dark') {
    root.classList.add('dark')
    root.dataset.theme = 'dark'
  } else {
    root.classList.remove('dark')
    root.dataset.theme = 'light'
  }

  root.style.colorScheme = resolved
}
