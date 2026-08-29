import { getIntlayer } from 'intlayer'

import type { AppLocale } from '~/common/i18n'

export const formatRelativeDate = (iso: string, locale: AppLocale) => {
  const date = new Date(iso)
  const diffMs = Date.now() - date.getTime()
  const dayMs = 86_400_000
  const days = Math.floor(diffMs / dayMs)
  const content = getIntlayer('formatters', locale)

  if (days <= 0) {
    return content.today
  }
  if (days === 1) {
    return content.yesterday
  }
  if (days < 30) {
    return String(content.daysAgo({ count: String(days) }))
  }

  return date.toLocaleDateString(locale, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}
