import { getQueryState } from '~/common/utils/getQueryState'
import { listsSection } from '~/modules/library'

import { useGetMyRankedLists } from '../hooks/useGetMyRankedLists'
import { RankedListCard } from './RankedListCard'
import { RankedListsHeader } from './RankedListsHeader'
import { RankingListEmpty } from './RankingListEmpty'
import { RankingListError } from './RankingListError'
import { RankingListSkeleton } from './RankingListSkeleton'

const listsColor = listsSection.color

export const RankedListsPage = () => {
  const { data, isLoading, isError } = useGetMyRankedLists()

  const state = getQueryState({
    data,
    isLoading,
    isError,
    isEmpty: (response) => response.data.length === 0,
  })

  return (
    <div className="relative flex flex-col gap-6 p-4 sm:gap-8 sm:p-6">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-56 opacity-90"
        aria-hidden
        style={{
          background: `radial-gradient(ellipse 90% 80% at 18% 0%, color-mix(in oklab, ${listsColor} 28%, transparent), transparent 70%), radial-gradient(ellipse 70% 55% at 92% 8%, color-mix(in oklab, ${listsColor} 14%, transparent), transparent 65%)`,
        }}
      />

      <RankedListsHeader total={data?.data?.length ?? null} />

      <div className="z-px relative">
        {state === 'loading' && <RankingListSkeleton />}
        {state === 'error' && <RankingListError />}
        {state === 'empty' && <RankingListEmpty />}
        {state === 'success' && data?.data && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {data.data.map((item) => (
              <RankedListCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
