export const ACCENT_STORAGE_KEY = 'accent'

export const ACCENT_COLORS = [
  'blue',
  'indigo',
  'violet',
  'emerald',
  'teal',
  'cyan',
  'orange',
  'rose',
  'pink',
  'amber',
] as const

export type AccentColor = (typeof ACCENT_COLORS)[number]

export const DEFAULT_ACCENT: AccentColor = 'violet'

export const ACCENT_LABELS: Record<AccentColor, string> = {
  blue: 'Blue',
  indigo: 'Indigo',
  violet: 'Violet',
  emerald: 'Emerald',
  teal: 'Teal',
  cyan: 'Cyan',
  orange: 'Orange',
  rose: 'Rose',
  pink: 'Pink',
  amber: 'Amber',
}

export const ACCENT_PREVIEW: Record<AccentColor, string> = {
  blue: 'oklch(0.62 0.21 259)',
  indigo: 'oklch(0.60 0.19 278)',
  violet: 'oklch(0.61 0.22 305)',
  emerald: 'oklch(0.66 0.16 160)',
  teal: 'oklch(0.67 0.13 195)',
  cyan: 'oklch(0.70 0.13 230)',
  orange: 'oklch(0.69 0.18 48)',
  rose: 'oklch(0.63 0.20 18)',
  pink: 'oklch(0.65 0.19 350)',
  amber: 'oklch(0.75 0.17 82)',
}

export const isAccentColor = (value: unknown): value is AccentColor => {
  return typeof value === 'string' && (ACCENT_COLORS as readonly string[]).includes(value)
}

export const parseAccent = (value: unknown): AccentColor => {
  return isAccentColor(value) ? value : DEFAULT_ACCENT
}

export const applyAccentAttribute = (accent: AccentColor) => {
  document.documentElement.dataset.accent = accent
}
