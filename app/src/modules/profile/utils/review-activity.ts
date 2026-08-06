import type { Activity } from 'react-activity-calendar'

import type { ReviewActivityByYear, ReviewActivityDay } from '../types/profile.types'

const DAY_IN_MILLISECONDS = 86_400_000

const formatDate = (date: Date) => date.toISOString().slice(0, 10)

const getActivityLevel = (count: number, maxCount: number) => {
  if (count === 0 || maxCount === 0) return 0

  return Math.min(4, Math.ceil((count / maxCount) * 4))
}

export const getReviewActivityYears = (activity: ReviewActivityByYear) => {
  return Object.keys(activity)
    .map(Number)
    .sort((firstYear, secondYear) => secondYear - firstYear)
}

export const getReviewActivityData = (year: number, entries: ReviewActivityDay[]): Activity[] => {
  const countsByDate = new Map<string, number>()

  for (const entry of entries) {
    countsByDate.set(entry.date, (countsByDate.get(entry.date) ?? 0) + entry.count)
  }

  const maxCount = Math.max(...countsByDate.values(), 0)
  const data: Activity[] = []
  const startDate = new Date(Date.UTC(year, 0, 1))
  const endDate = new Date(Date.UTC(year + 1, 0, 1))

  for (
    let date = startDate;
    date < endDate;
    date = new Date(date.getTime() + DAY_IN_MILLISECONDS)
  ) {
    const dateString = formatDate(date)
    const count = countsByDate.get(dateString) ?? 0

    data.push({
      date: dateString,
      count,
      level: getActivityLevel(count, maxCount),
    })
  }

  return data
}
