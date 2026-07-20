import { useQuery } from '@tanstack/react-query'

import { gameDetailApi } from '../api/game-detail.api'

export const useGameDetailQuery = (externalId: string) => {
  return useQuery({
    queryKey: ['discover', 'detail', 'game', externalId],
    queryFn: () => gameDetailApi.getGame(externalId),
    enabled: externalId.length > 0,
  })
}
