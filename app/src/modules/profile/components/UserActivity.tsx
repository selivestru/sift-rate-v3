import { Suspense, useState } from 'react'
import { ActivityCalendar } from 'react-activity-calendar'
import { ErrorBoundary } from 'react-error-boundary'

import 'react-activity-calendar/tooltips.css'

import { useTheme } from '~/common/theme/useTheme'
import { ErrorState } from '~/common/ui/ErrorState'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/common/ui/Select'
import { cn } from '~/common/utils/cn'

import { calendarTheme, MONTH_LABELS, WEEKDAY_LABELS } from '../constants/profile-constans'
import { useGetUserActivityQuery } from '../hooks/useGetUserActivityQuery'
import { formatActivityDate } from '../utils/formatActivityDate'
import { getUserActivityData, getUserActivityYears } from '../utils/user-activity'
import { UserActivitySkeleton } from './UserActivitySkeleton'

interface UserActivityProps {
  username: string
}

export const UserActivity = ({ username }: UserActivityProps) => {
  return (
    <ErrorBoundary
      fallback={
        <ErrorState
          title="Unable to load activity"
          description="We couldn't load this user's activity. Please try again later."
          className="border-b-border border-b"
        />
      }
    >
      <Suspense fallback={<UserActivitySkeleton />}>
        <UserActivityContent username={username} />
      </Suspense>
    </ErrorBoundary>
  )
}

const UserActivityContent = ({ username }: UserActivityProps) => {
  const { resolvedTheme } = useTheme()

  const { data: activity } = useGetUserActivityQuery(username)

  const years = getUserActivityYears(activity)

  const [selectedYear, setSelectedYear] = useState(years[0])

  const calendarData = getUserActivityData(selectedYear, activity)

  const isEmpty = calendarData.length === 0

  return (
    <section>
      <div className="border-b-border flex items-center justify-between gap-3 border-b p-4">
        <h2 className="text-lg font-semibold tracking-tight">User Activity</h2>

        <Select
          disabled={years.length === 1}
          value={selectedYear}
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

      <div className="relative">
        <ActivityCalendar
          data-empty={isEmpty}
          loading={isEmpty}
          showColorLegend={!isEmpty}
          showMonthLabels={!isEmpty}
          data={calendarData}
          className={cn(
            'p-4 [&>div]:pb-2!',
            isEmpty && '[&>div]:overflow-hidden! [&>footer]:hidden!',
          )}
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
          showWeekdayLabels={isEmpty ? [] : ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']}
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

        {isEmpty && (
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <p className="text-sm font-medium">No activity yet</p>
          </div>
        )}
      </div>
    </section>
  )
}
