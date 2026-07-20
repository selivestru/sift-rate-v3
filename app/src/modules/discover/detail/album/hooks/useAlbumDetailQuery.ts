import { useQuery } from '@tanstack/react-query'

import { albumDetailApi } from '../api/album-detail.api'

export const useAlbumDetailQuery = (externalId: string) => {
  return useQuery({
    queryKey: ['discover', 'detail', 'album', externalId],
    queryFn: () => albumDetailApi.getAlbum(externalId),
    enabled: externalId.length > 0,
  })
}
