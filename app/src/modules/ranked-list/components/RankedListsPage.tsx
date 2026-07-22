import { rankedListNavItem } from '~/common/constants/navigation'
import { getQueryState } from '~/common/utils/getQueryState'

import { useGetMyRankedLists } from '../hooks/useGetMyRankedLists'
import { RankedListCard } from './RankedListCard'
import { RankedListsHero } from './RankedListsHero'
import { RankingListEmpty } from './RankingListEmpty'
import { RankingListError } from './RankingListError'
import { RankingListSkeleton } from './RankingListSkeleton'

const listsColor = rankedListNavItem.color

export const RankedListsPage = () => {
  const { data, isLoading, isError } = useGetMyRankedLists()

  const state = getQueryState({
    data,
    isLoading,
    isError,
    isEmpty: (response) => response.data.length === 0,
  })

  return (
    <div className="flex flex-col gap-4 p-4 sm:gap-5 sm:p-6">
      <RankedListsHero total={data?.data?.length ?? null} />

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
