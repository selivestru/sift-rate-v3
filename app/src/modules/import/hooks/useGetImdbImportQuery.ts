import { useQuery } from '@tanstack/react-query'

import { QUERIES_KEYS } from '~/common/constants/queries-keys'

import { importApi } from '../api/import.api'

const POLL_INTERVAL_MS = 5000

export const useGetImdbImportQuery = (id: string | null) => {
  return useQuery({
    queryKey: QUERIES_KEYS.imdbImport(id ?? ''),
    queryFn: () => importApi.getImdbImport(id as string),
    enabled: id !== null,
    refetchInterval: (query) => {
      const status = query.state.data?.status
      return status === 'PENDING' || status === 'PROCESSING' ? POLL_INTERVAL_MS : false
    },
  })
}
