import { getQueryState } from '~/common/utils/getQueryState'

import { useGetPlannedList } from '../hook/useGetPlannedList'
import { PlannedHero } from './PlannedHero'
import { PlannedList } from './PlannedList'
import { PlannedListEmpty } from './PlannedListEmpty'
import { PlannedListError } from './PlannedListError'
import { PlannedListSkeleton } from './PlannedListSkeleton'

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
      <PlannedHero total={total} />

      <div className="relative">
        {state === 'loading' && <PlannedListSkeleton />}
        {state === 'empty' && <PlannedListEmpty />}
        {state === 'error' && <PlannedListError />}
        {state === 'success' && data?.data && <PlannedList data={data.data} />}
      </div>
    </div>
  )
}
