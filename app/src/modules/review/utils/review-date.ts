export const REVIEW_MIN_YEAR = 2000

export const reviewMonthNames = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]

export const formatReviewDateLabel = (year?: number, month?: number) => {
  if (year == null) return 'Any date'
  if (month == null) return String(year)
  return `${reviewMonthNames[month - 1]} ${year}`
}
