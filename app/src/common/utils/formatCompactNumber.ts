import { getCurrentLocale } from '~/common/i18n'

const compactFormatters = new Map<string, Intl.NumberFormat>()

const getCompactFormatter = (locale: string) => {
  const cached = compactFormatters.get(locale)
  if (cached) return cached

  const formatter = new Intl.NumberFormat(locale, {
    notation: 'compact',
    maximumFractionDigits: 1,
  })
  compactFormatters.set(locale, formatter)
  return formatter
}

export const formatCompactNumber = (value: number) => {
  return getCompactFormatter(getCurrentLocale()).format(value)
}
