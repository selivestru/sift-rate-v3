import { useQuery } from '@tanstack/react-query'

import type { MediaType } from '~/common/constants/media-type'

import { discoverDetailApi } from '../api/discover-detail.api'

export const useKinopoiskId = ({
  mediaType,
  externalId,
  enabled,
}: {
  mediaType: MediaType
  externalId: string
  enabled: boolean
}) => {
  const query = useQuery({
    queryKey: ['kinopoisk', mediaType, externalId],
    queryFn: () => discoverDetailApi.getKinopoiskId(mediaType, externalId),
    enabled,
    staleTime: Infinity,
  })

  return {
    kinopoiskId: query.data?.kinopoiskId ?? null,
    isLoading: enabled && query.isPending,
  }
}
