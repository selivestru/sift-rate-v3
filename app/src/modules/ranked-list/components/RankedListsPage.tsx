import { Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'

import { useGetMyRankedLists } from '../hooks/useGetMyRankedLists'
import { RankedListCard } from './RankedListCard'
import { RankedListsHero } from './RankedListsHero'
import { RankingListEmpty } from './RankingListEmpty'
import { RankingListError } from './RankingListError'
import { RankingListSkeleton } from './RankingListSkeleton'

export const RankedListsPage = () => {
  return (
    <div className="flex flex-col gap-4 p-4 sm:gap-5 sm:p-6">
      <RankedListsBoundary>
        <Suspense fallback={<RankedListsHero total={null} />}>
          <RankedListsHeroContent />
        </Suspense>
        <Suspense fallback={<RankingListSkeleton />}>
          <RankedListsContent />
        </Suspense>
      </RankedListsBoundary>
    </div>
  )
}

const RankedListsBoundary = ({ children }: React.PropsWithChildren) => {
  return <ErrorBoundary fallback={<RankingListError />}>{children}</ErrorBoundary>
}

const RankedListsHeroContent = () => {
  const { data } = useGetMyRankedLists()

  return <RankedListsHero total={data.data.length} />
}

const RankedListsContent = () => {
  const { data } = useGetMyRankedLists()

  if (data.data.length === 0) {
    return <RankingListEmpty />
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {data.data.map((item) => (
        <RankedListCard key={item.id} item={item} />
      ))}
    </div>
  )
}
