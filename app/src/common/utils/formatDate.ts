import { getCurrentLocale } from '~/common/i18n'

export const formatDate = (date: string) => {
  const dateObj = new Date(date)
  return new Intl.DateTimeFormat(getCurrentLocale(), {
    timeZone: 'UTC',
  }).format(dateObj)
}
