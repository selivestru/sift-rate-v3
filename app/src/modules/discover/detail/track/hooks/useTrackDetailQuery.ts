import { useSuspenseQuery } from '@tanstack/react-query'

import { trackDetailApi } from '../api/track-detail.api'

export const useTrackDetailQuery = (externalId: string) => {
  return useSuspenseQuery({
    queryKey: ['discover', 'detail', 'track', externalId],
    queryFn: () => trackDetailApi.getTrack(externalId),
  })
}
