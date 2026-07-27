export const ACCENT_STORAGE_KEY = 'accent'

export const ACCENT_COLORS = [
  'red',
  'orange',
  'yellow',
  'green',
  'teal',
  'cyan',
  'blue',
  'indigo',
  'purple',
  'pink',
] as const

export type AccentColor = (typeof ACCENT_COLORS)[number]

export const DEFAULT_ACCENT: AccentColor = 'purple'

export const ACCENT_LABELS: Record<AccentColor, string> = {
  red: 'Red',
  orange: 'Orange',
  yellow: 'Yellow',
  green: 'Green',
  teal: 'Teal',
  cyan: 'Cyan',
  blue: 'Blue',
  indigo: 'Indigo',
  purple: 'Purple',
  pink: 'Pink',
}

export const ACCENT_PREVIEW: Record<AccentColor, string> = {
  red: 'oklch(0.63 0.20 25)',
  orange: 'oklch(0.69 0.18 48)',
  yellow: 'oklch(0.75 0.17 90)',
  green: 'oklch(0.66 0.16 150)',
  teal: 'oklch(0.67 0.13 195)',
  cyan: 'oklch(0.70 0.13 230)',
  blue: 'oklch(0.62 0.21 259)',
  indigo: 'oklch(0.60 0.19 278)',
  purple: 'oklch(0.61 0.22 305)',
  pink: 'oklch(0.65 0.19 350)',
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
