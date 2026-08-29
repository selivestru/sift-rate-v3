import type { AppLocale } from '~/common/i18n'

export const formatDate = (date: string, locale: AppLocale) => {
  const dateObj = new Date(date)
  return new Intl.DateTimeFormat(locale, {
    timeZone: 'UTC',
  }).format(dateObj)
}
