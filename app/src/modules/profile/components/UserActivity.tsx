import { Suspense, useState } from 'react'
import { ActivityCalendar } from 'react-activity-calendar'
import { ErrorBoundary } from 'react-error-boundary'
import { useIntlayer } from 'react-intlayer'

import 'react-activity-calendar/tooltips.css'

import { ErrorState } from '~/common/ui/ErrorState'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/common/ui/Select'
import { cn } from '~/common/utils/cn'

import { calendarTheme, useProfileCalendarLabels } from '../constants/profile-constans'
import { useGetUserActivityQuery } from '../hooks/useGetUserActivityQuery'
import { formatActivityDate } from '../utils/formatActivityDate'
import { getUserActivityData } from '../utils/user-activity'
import { UserActivitySkeleton } from './UserActivitySkeleton'

interface UserActivityProps {
  username: string
  activityYears: number[]
}

export const UserActivity = ({ username, activityYears }: UserActivityProps) => {
  const content = useIntlayer('user-activity')

  return (
    <ErrorBoundary
      fallback={
        <ErrorState
          title={content.unableToLoadActivity.value}
          description={content.activityLoadDescription.value}
          className="border-b-border border-b"
        />
      }
    >
      <Suspense fallback={<UserActivitySkeleton />}>
        <UserActivityContent
          username={username}
          activityYears={activityYears.length > 0 ? activityYears : [new Date().getFullYear()]}
        />
      </Suspense>
    </ErrorBoundary>
  )
}

const UserActivityContent = ({ username, activityYears }: UserActivityProps) => {
  const content = useIntlayer('user-activity')
  const { MONTH_LABELS, WEEKDAY_LABELS } = useProfileCalendarLabels()

  const [selectedYear, setSelectedYear] = useState(activityYears[0])

  const { data: activity } = useGetUserActivityQuery(username, selectedYear)

  const calendarData = getUserActivityData(selectedYear, activity)

  const isEmpty = calendarData.length === 0

  return (
    <section>
      <div className="border-b-border flex items-center justify-between gap-3 border-b p-4">
        <h2 className="text-lg font-semibold tracking-tight">{content.title.value}</h2>

        <Select
          disabled={activityYears.length === 1}
          value={selectedYear}
          onValueChange={(next) => {
            if (typeof next === 'number') setSelectedYear(next)
          }}
          items={activityYears.map((year) => ({ value: year, label: String(year) }))}
        >
          <SelectTrigger
            variant="outline"
            size="sm"
            className="w-auto min-w-22"
            aria-label={content.selectYear.value}
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent alignItemWithTrigger={false} align="end">
            {activityYears.map((year) => (
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
          colorScheme="dark"
          fontSize={12}
          labels={{
            legend: { less: content.less.value, more: content.more.value },
            months: MONTH_LABELS,
            totalCount: String(content.totalCount({ count: '{{count}}', year: '{{year}}' })),
            weekdays: WEEKDAY_LABELS,
          }}
          showWeekdayLabels={isEmpty ? [] : ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']}
          theme={calendarTheme}
          tooltips={{
            activity: {
              text: (item) =>
                String(
                  (item.count === 1
                    ? content.activityTooltipSingular
                    : content.activityTooltipPlural)({
                    count: String(item.count),
                    date: formatActivityDate(item.date),
                  }),
                ),
              withArrow: true,
              hoverRestMs: 50,
            },
          }}
          weekStart={1}
        />

        {isEmpty && (
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <p className="text-sm font-medium">{content.noActivityYet.value}</p>
          </div>
        )}
      </div>
    </section>
  )
}
