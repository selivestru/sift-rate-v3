import { useQuery } from '@tanstack/react-query'

import { useAppLocale } from '~/common/i18n'

import { movieDetailApi } from '../api/movie-detail.api'

export const useMovieDetailQuery = (externalId: string) => {
  const { locale } = useAppLocale()

  return useQuery({
    queryKey: ['discover', 'detail', 'movie', locale, externalId],
    queryFn: () => movieDetailApi.getMovie(externalId),
    enabled: externalId.length > 0,
  })
}
