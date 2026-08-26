import { getLocalizedContent } from '~/common/i18n'

export const formatRuntime = (minutes: number | null | undefined) => {
  if (minutes == null || minutes <= 0) return null

  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  const content = getLocalizedContent('formatters')

  if (hours === 0) return String(content.minutes({ count: String(mins) }))
  if (mins === 0) return String(content.hours({ count: String(hours) }))
  return String(content.hoursMinutes({ hours: String(hours), minutes: String(mins) }))
}
