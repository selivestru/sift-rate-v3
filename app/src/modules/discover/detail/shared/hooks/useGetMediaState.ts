import { useQuery } from '@tanstack/react-query'

import { QUERIES_KEYS } from '~/common/constants/queries-keys'
import type { MediaRef } from '~/common/types/media-ref.types'
import { useAuthStore } from '~/modules/auth'

import { discoverDetailApi } from '../api/discover-detail.api'

export const useGetMediaState = (data: MediaRef) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  return useQuery({
    queryKey: QUERIES_KEYS.mediaState(data),
    queryFn: () => discoverDetailApi.getMediaState(data.mediaType, data.externalId),
    enabled: isAuthenticated,
  })
}
