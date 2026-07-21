import { useQuery } from '@tanstack/react-query'

import type { MediaType } from '~/common/constants/media-type'
import { QUERIES_KEYS } from '~/common/constants/queries-keys'
import { useAuthStore } from '~/modules/auth'

import { discoverDetailApi } from '../api/discover-detail.api'

export const useGetMediaState = (data: { mediaType: MediaType; externalId: string }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  return useQuery({
    queryKey: QUERIES_KEYS.MEDIA_STATE(data),
    queryFn: () => discoverDetailApi.getMediaState(data.mediaType, data.externalId),
    enabled: isAuthenticated,
  })
}
