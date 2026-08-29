import type { AppLocale } from '~/common/i18n'

export const formatActivityDate = (date: string, locale: AppLocale) => {
  return new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'short',
    timeZone: 'UTC',
    year: 'numeric',
  }).format(new Date(`${date}T00:00:00Z`))
}
