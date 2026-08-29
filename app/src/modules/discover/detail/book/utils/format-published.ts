import type { AppLocale } from '~/common/i18n'
import { formatDate } from '~/common/utils/formatDate'

const formatMonthYear = (year: number, monthIndex: number, locale: AppLocale) => {
  const date = new Date(Date.UTC(year, monthIndex, 1))
  return new Intl.DateTimeFormat(locale, {
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date)
}

export const formatPublished = (publishedDate: string, year = '', locale: AppLocale) => {
  if (!publishedDate) return year || null

  if (/^\d{4}-\d{2}-\d{2}$/.test(publishedDate)) {
    return formatDate(publishedDate, locale)
  }

  if (/^\d{4}-\d{2}$/.test(publishedDate)) {
    const [y, m] = publishedDate.split('-')
    return formatMonthYear(Number(y), Number(m) - 1, locale)
  }

  if (/^\d{4}$/.test(publishedDate)) {
    return publishedDate
  }

  return year || publishedDate
}
