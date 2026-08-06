import { useState } from 'react'
import { ActivityCalendar } from 'react-activity-calendar'

import 'react-activity-calendar/tooltips.css'

import { useTheme } from '~/common/theme/useTheme'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/common/ui/Select'

import type { ReviewActivityByYear } from '../types/profile.types'
import { getReviewActivityData, getReviewActivityYears } from '../utils/review-activity'

const MONTH_LABELS = [
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

const WEEKDAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const formatActivityDate = (date: string) => {
  return new Intl.DateTimeFormat('en-US', {
    day: 'numeric',
    month: 'short',
    timeZone: 'UTC',
    year: 'numeric',
  }).format(new Date(`${date}T00:00:00Z`))
}

const calendarTheme = {
  light: [
    'var(--muted)',
    'color-mix(in oklab, var(--primary) 24%, var(--muted))',
    'color-mix(in oklab, var(--primary) 46%, var(--muted))',
    'color-mix(in oklab, var(--primary) 70%, var(--muted))',
    'var(--primary)',
  ],
  dark: [
    'var(--muted)',
    'color-mix(in oklab, var(--primary) 28%, var(--muted))',
    'color-mix(in oklab, var(--primary) 50%, var(--muted))',
    'color-mix(in oklab, var(--primary) 74%, var(--muted))',
    'var(--primary)',
  ],
}

interface ReviewActivityProps {
  activity: ReviewActivityByYear
}

export const ReviewActivity = ({ activity }: ReviewActivityProps) => {
  const { resolvedTheme } = useTheme()
  const years = getReviewActivityYears(activity)
  const [selectedYear, setSelectedYear] = useState(years[0] ?? new Date().getFullYear())
  const activeYear = years.includes(selectedYear) ? selectedYear : (years[0] ?? selectedYear)
  const entries = activity[activeYear] ?? []
  const calendarData = getReviewActivityData(activeYear, entries)

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold tracking-tight">Review activity</h2>

        <Select
          value={activeYear}
          onValueChange={(next) => {
            if (typeof next === 'number') setSelectedYear(next)
          }}
          items={years.map((year) => ({ value: year, label: String(year) }))}
        >
          <SelectTrigger
            variant="outline"
            size="sm"
            className="w-auto min-w-22"
            aria-label="Select year"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent alignItemWithTrigger={false} align="end">
            {years.map((year) => (
              <SelectItem key={year} value={year}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <ActivityCalendar
        showColorLegend
        showMonthLabels
        data={calendarData}
        blockMargin={3}
        blockRadius={3}
        blockSize={16}
        colorScheme={resolvedTheme}
        fontSize={12}
        labels={{
          legend: { less: 'Less', more: 'More' },
          months: MONTH_LABELS,
          totalCount: '{{count}} reviews in {{year}}',
          weekdays: WEEKDAY_LABELS,
        }}
        showWeekdayLabels={['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']}
        theme={calendarTheme}
        tooltips={{
          activity: {
            text: (item) =>
              `${item.count} ${item.count === 1 ? 'review' : 'reviews'} on ${formatActivityDate(item.date)}`,
            withArrow: true,
            hoverRestMs: 50,
          },
        }}
        weekStart={1}
      />
    </section>
  )
}
