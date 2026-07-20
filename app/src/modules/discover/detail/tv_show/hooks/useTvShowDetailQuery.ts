import { useQuery } from '@tanstack/react-query'

import { tvShowDetailApi } from '../api/tv-show-detail.api'

export const useTvShowDetailQuery = (externalId: string) => {
  return useQuery({
    queryKey: ['discover', 'detail', 'tv_show', externalId],
    queryFn: () => tvShowDetailApi.getTvShow(externalId),
    enabled: externalId.length > 0,
  })
}
