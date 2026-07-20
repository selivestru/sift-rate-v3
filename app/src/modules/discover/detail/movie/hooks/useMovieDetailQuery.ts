import { useQuery } from '@tanstack/react-query'

import { movieDetailApi } from '../api/movie-detail.api'

export const useMovieDetailQuery = (externalId: string) => {
  return useQuery({
    queryKey: ['discover', 'detail', 'movie', externalId],
    queryFn: () => movieDetailApi.getMovie(externalId),
    enabled: externalId.length > 0,
  })
}
