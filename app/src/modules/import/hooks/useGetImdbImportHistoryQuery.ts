import { useInfiniteQuery } from '@tanstack/react-query'

import { QUERIES_KEYS } from '~/common/constants/queries-keys'

import { importApi } from '../api/import.api'

export const useGetImdbImportHistoryQuery = () => {
  return useInfiniteQuery({
    queryKey: QUERIES_KEYS.imdbImportHistory,
    initialPageParam: undefined as string | undefined,
    queryFn: ({ pageParam }) => importApi.getImdbImportHistory(pageParam),
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  })
}
