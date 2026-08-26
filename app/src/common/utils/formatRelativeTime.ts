import { getCurrentLocale } from '~/common/i18n'

const relativeTimeFormatters = new Map<string, Intl.RelativeTimeFormat>()

const getRelativeTimeFormatter = (locale: string) => {
  const cached = relativeTimeFormatters.get(locale)
  if (cached) return cached

  const formatter = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' })
  relativeTimeFormatters.set(locale, formatter)
  return formatter
}

export const formatRelativeTime = (isoDate: string) => {
  const date = new Date(isoDate)
  const diffSeconds = Math.round((date.getTime() - Date.now()) / 1000)
  const abs = Math.abs(diffSeconds)

  const rtf = getRelativeTimeFormatter(getCurrentLocale())

  if (abs < 60) {
    return rtf.format(Math.round(diffSeconds), 'second')
  }

  if (abs < 3600) {
    return rtf.format(Math.round(diffSeconds / 60), 'minute')
  }

  if (abs < 86_400) {
    return rtf.format(Math.round(diffSeconds / 3600), 'hour')
  }

  if (abs < 86_400 * 30) {
    return rtf.format(Math.round(diffSeconds / 86_400), 'day')
  }

  if (abs < 86_400 * 365) {
    return rtf.format(Math.round(diffSeconds / (86_400 * 30)), 'month')
  }

  return rtf.format(Math.round(diffSeconds / (86_400 * 365)), 'year')
}
