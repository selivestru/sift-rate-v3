import { useMutation, useQueryClient } from '@tanstack/react-query'

import { QUERIES_KEYS } from '~/common/constants/queries-keys'

import { importApi } from '../api/import.api'

export const useRetryImdbImportMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['retry-imdb-import'],
    mutationFn: importApi.retryImdbImport,
    onSuccess: (job) =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: QUERIES_KEYS.imdbImport(job.id) }),
        queryClient.invalidateQueries({ queryKey: QUERIES_KEYS.imdbImportActive }),
        queryClient.invalidateQueries({ queryKey: QUERIES_KEYS.imdbImportHistory }),
        queryClient.invalidateQueries({ queryKey: QUERIES_KEYS.imdbImportRows(job.id) }),
      ]),
  })
}
