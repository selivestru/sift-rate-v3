import { getLocalizedContent } from '~/common/i18n'

export const formatTime = ({
  days,
  hours,
  minutes,
  seconds,
}: {
  days: number
  hours: number
  minutes: number
  seconds: number
}) => {
  const content = getLocalizedContent('formatters')
  const paddedMinutes = minutes.toString().padStart(2, '0')
  const paddedSeconds = seconds.toString().padStart(2, '0')

  if (days > 0) {
    return String(
      content.daysHoursMinutes({
        days: String(days),
        hours: String(hours),
        minutes: paddedMinutes,
      }),
    )
  }

  if (hours > 0) {
    return String(content.hoursPaddedMinutes({ hours: String(hours), minutes: paddedMinutes }))
  }

  if (minutes > 0) {
    return String(content.minutesSeconds({ minutes: String(minutes), seconds: paddedSeconds }))
  }

  return String(content.seconds({ count: String(seconds) }))
}
