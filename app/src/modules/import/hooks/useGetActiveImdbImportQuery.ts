import { useQuery } from '@tanstack/react-query'

import { QUERIES_KEYS } from '~/common/constants/queries-keys'

import { importApi } from '../api/import.api'

export const useGetActiveImdbImportQuery = () => {
  return useQuery({
    queryKey: QUERIES_KEYS.imdbImportActive,
    queryFn: importApi.getActiveImdbImport,
  })
}
