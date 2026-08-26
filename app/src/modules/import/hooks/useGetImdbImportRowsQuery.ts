import { useInfiniteQuery } from '@tanstack/react-query'

import { QUERIES_KEYS } from '~/common/constants/queries-keys'

import { importApi } from '../api/import.api'
import type { ImportRowStatus } from '../types/import.types'

export const useGetImdbImportRowsQuery = (jobId: string | null, status?: ImportRowStatus) => {
  return useInfiniteQuery({
    queryKey: QUERIES_KEYS.imdbImportRows(jobId ?? '', status ?? 'all'),
    initialPageParam: undefined as string | undefined,
    queryFn: ({ pageParam }) =>
      importApi.getImdbImportRows(jobId as string, { cursor: pageParam, status }),
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    enabled: jobId !== null,
  })
}
