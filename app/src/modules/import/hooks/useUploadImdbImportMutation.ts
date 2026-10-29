import { useMutation, useQueryClient } from '@tanstack/react-query'

import { QUERIES_KEYS } from '~/common/constants/queries-keys'

import { importApi } from '../api/import.api'

export const useUploadImdbImportMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['upload-imdb-import'],
    mutationFn: importApi.uploadImdbImport,
    onSuccess: (job) =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: QUERIES_KEYS.imdbImport(job.id) }),
        queryClient.invalidateQueries({ queryKey: QUERIES_KEYS.imdbImportActive }),
        queryClient.invalidateQueries({ queryKey: QUERIES_KEYS.imdbImportHistory }),
      ]),
  })
}
