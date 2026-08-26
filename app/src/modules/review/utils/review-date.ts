export const REVIEW_MIN_YEAR = 2000

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
