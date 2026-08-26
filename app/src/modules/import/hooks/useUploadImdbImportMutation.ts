import { useMutation, useQueryClient } from '@tanstack/react-query'

import { QUERIES_KEYS } from '~/common/constants/queries-keys'

import { importApi } from '../api/import.api'

export const useUploadImdbImportMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['upload-imdb-import'],
    mutationFn: importApi.uploadImdbImport,
    onSuccess: (job) => {
      queryClient.setQueryData(QUERIES_KEYS.imdbImport(job.id), job)
      queryClient.setQueryData(QUERIES_KEYS.imdbImportActive, job)

      queryClient.invalidateQueries({ queryKey: QUERIES_KEYS.imdbImportHistory })
    },
  })
}
