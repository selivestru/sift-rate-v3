import { useQueryErrorResetBoundary } from '@tanstack/react-query'
import { Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'

import { useGetPlannedList } from '../hook/useGetPlannedList'
import { PlannedHero } from './PlannedHero'
import { PlannedList } from './PlannedList'
import { PlannedListEmpty } from './PlannedListEmpty'
import { PlannedListError } from './PlannedListError'
import { PlannedListSkeleton } from './PlannedListSkeleton'

export const PlannedListPage = () => {
  return (
    <div className="relative flex flex-col gap-6 p-4 sm:gap-8 sm:p-6">
      <PlannedListBoundary>
        <Suspense fallback={<PlannedHero total={null} />}>
          <PlannedHeroContent />
        </Suspense>
        <Suspense fallback={<PlannedListSkeleton />}>
          <PlannedListContent />
        </Suspense>
      </PlannedListBoundary>
    </div>
  )
}

const PlannedListBoundary = ({ children }: React.PropsWithChildren) => {
  const { reset } = useQueryErrorResetBoundary()

  return (
    <ErrorBoundary onReset={reset} fallback={<PlannedListError onRetry={reset} />}>
      {children}
    </ErrorBoundary>
  )
}

const PlannedHeroContent = () => {
  const { data } = useGetPlannedList()

  return <PlannedHero total={data.totalResults ?? data.data.length} />
}

const PlannedListContent = () => {
  const { data } = useGetPlannedList()

  if (data.data.length === 0) {
    return <PlannedListEmpty />
  }

  return <PlannedList data={data.data} />
}
