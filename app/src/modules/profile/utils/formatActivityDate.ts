import { getCurrentLocale } from '~/common/i18n'

export const formatActivityDate = (date: string) => {
  return new Intl.DateTimeFormat(getCurrentLocale(), {
    day: 'numeric',
    month: 'short',
    timeZone: 'UTC',
    year: 'numeric',
  }).format(new Date(`${date}T00:00:00Z`))
}
