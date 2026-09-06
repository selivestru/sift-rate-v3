export const REVIEW_MIN_YEAR = 2000

export const REVIEW_MIN_DATE_KEY = '2000-01-01'

export const DATE_KEY_PATTERN = /^\d{4}-\d{2}-\d{2}$/

const pad2 = (value: number) => String(value).padStart(2, '0')

export const toDateKey = (date: Date | string) => {
  const parsed = typeof date === 'string' ? new Date(date) : date
  return `${parsed.getFullYear()}-${pad2(parsed.getMonth() + 1)}-${pad2(parsed.getDate())}`
}

export const todayKey = () => toDateKey(new Date())

export const dateKeyToISOStartOfDayUTC = (key: string) => `${key}T00:00:00.000Z`

export const parseDateKey = (key: string) => {
  const [year, month, day] = key.split('-').map(Number)
  return { year, month, day }
}

export const dateKeyToLocalDate = (key: string) => {
  const { year, month, day } = parseDateKey(key)
  return new Date(year, month - 1, day)
}

export const isFutureKey = (key: string) => key > todayKey()

export const isBeforeMinKey = (key: string) => key < REVIEW_MIN_DATE_KEY

export const reviewMonthKeys = [
  'jan',
  'feb',
  'mar',
  'apr',
  'may',
  'jun',
  'jul',
  'aug',
  'sep',
  'oct',
  'nov',
  'dec',
] as const

export const formatReviewDateLabel = (
  year: number | undefined,
  month: number | undefined,
  monthNames: readonly string[],
  anyDate: string,
) => {
  if (year == null) return anyDate
  if (month == null) return String(year)
  return `${monthNames[month - 1]} ${year}`
}
