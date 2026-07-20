import { useQuery } from '@tanstack/react-query'

import { trackDetailApi } from '../api/track-detail.api'

export const useTrackDetailQuery = (externalId: string) => {
  return useQuery({
    queryKey: ['discover', 'detail', 'track', externalId],
    queryFn: () => trackDetailApi.getTrack(externalId),
    enabled: externalId.length > 0,
  })
}
