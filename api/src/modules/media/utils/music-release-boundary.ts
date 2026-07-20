export const MUSIC_RELEASE_TIMEZONE = 'UTC'

const WEEKDAY_TO_INDEX: Record<string, number> = {
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
}

type ZonedParts = {
  weekday: string
  year: number
  month: number
  day: number
  hour: number
  minute: number
  second: number
}

const getZonedParts = (date: Date, timeZone: string): ZonedParts => {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    weekday: 'short',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date)

  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? ''

  return {
    weekday: get('weekday'),
    year: Number(get('year')),
    month: Number(get('month')),
    day: Number(get('day')),
    hour: Number(get('hour')),
    minute: Number(get('minute')),
    second: Number(get('second')),
  }
}

const zonedLocalToUtcMs = (
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
  second: number,
  timeZone: string,
): number => {
  let utcMs = Date.UTC(year, month - 1, day, hour, minute, second)

  for (let i = 0; i < 3; i += 1) {
    const parts = getZonedParts(new Date(utcMs), timeZone)
    const asUtc = Date.UTC(
      parts.year,
      parts.month - 1,
      parts.day,
      parts.hour,
      parts.minute,
      parts.second,
    )
    const target = Date.UTC(year, month - 1, day, hour, minute, second)
    utcMs += target - asUtc
  }

  return utcMs
}

const shiftCalendarDays = (year: number, month: number, day: number, deltaDays: number) => {
  const shifted = new Date(Date.UTC(year, month - 1, day + deltaDays))
  return {
    year: shifted.getUTCFullYear(),
    month: shifted.getUTCMonth() + 1,
    day: shifted.getUTCDate(),
  }
}

export const getLastMusicReleaseBoundaryMs = (
  nowMs: number = Date.now(),
  timeZone: string = MUSIC_RELEASE_TIMEZONE,
): number => {
  const parts = getZonedParts(new Date(nowMs), timeZone)
  const weekdayIndex = WEEKDAY_TO_INDEX[parts.weekday] ?? 0
  const daysSinceFriday = (weekdayIndex - 5 + 7) % 7
  const boundaryDate = shiftCalendarDays(parts.year, parts.month, parts.day, -daysSinceFriday)

  return zonedLocalToUtcMs(
    boundaryDate.year,
    boundaryDate.month,
    boundaryDate.day,
    0,
    0,
    0,
    timeZone,
  )
}

export const isStaleAcrossMusicRelease = (
  cachedAtMs: number,
  nowMs: number = Date.now(),
  timeZone: string = MUSIC_RELEASE_TIMEZONE,
): boolean => {
  const boundaryMs = getLastMusicReleaseBoundaryMs(nowMs, timeZone)
  return cachedAtMs < boundaryMs && nowMs >= boundaryMs
}
