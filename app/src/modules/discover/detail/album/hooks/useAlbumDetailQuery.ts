import { useSuspenseQuery } from '@tanstack/react-query'

import { albumDetailApi } from '../api/album-detail.api'

export const useAlbumDetailQuery = (externalId: string) => {
  return useSuspenseQuery({
    queryKey: ['discover', 'detail', 'album', externalId],
    queryFn: () => albumDetailApi.getAlbum(externalId),
  })
}
