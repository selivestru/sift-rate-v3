import { plannedNavItem } from '~/common/constants/navigation'
import { getQueryState } from '~/common/utils/getQueryState'

import { useGetPlannedList } from '../hook/useGetPlannedList'
import { PlannedHero } from './PlannedHero'
import { PlannedList } from './PlannedList'
import { PlannedListEmpty } from './PlannedListEmpty'
import { PlannedListError } from './PlannedListError'
import { PlannedListSkeleton } from './PlannedListSkeleton'

const plannedColor = plannedNavItem.color

export const PlannedListPage = () => {
  const { data, isLoading, isError } = useGetPlannedList()

  const state = getQueryState({
    data,
    isLoading,
    isError,
    isEmpty: (response) => response.data.length === 0,
  })
  const total =
    state === 'loading'
      ? null
      : state === 'success' && data
        ? (data.totalResults ?? data.data.length)
        : state === 'empty'
          ? 0
          : null

  return (
    <div className="relative flex flex-col gap-6 p-4 sm:gap-8 sm:p-6">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-56 opacity-90"
        aria-hidden
        style={{
          background: `radial-gradient(ellipse 90% 80% at 18% 0%, color-mix(in oklab, ${plannedColor} 28%, transparent), transparent 70%), radial-gradient(ellipse 70% 55% at 92% 8%, color-mix(in oklab, ${plannedColor} 14%, transparent), transparent 65%)`,
        }}
      />

      <PlannedHero total={total} />

      <div className="z-px relative">
        {state === 'loading' && <PlannedListSkeleton />}
        {state === 'empty' && <PlannedListEmpty />}
        {state === 'error' && <PlannedListError />}
        {state === 'success' && data?.data && <PlannedList data={data.data} />}
      </div>
    </div>
  )
}
