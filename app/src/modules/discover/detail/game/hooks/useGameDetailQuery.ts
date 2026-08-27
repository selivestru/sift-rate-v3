import { useSuspenseQuery } from '@tanstack/react-query'

import { gameDetailApi } from '../api/game-detail.api'

export const useGameDetailQuery = (externalId: string) => {
  return useSuspenseQuery({
    queryKey: ['discover', 'detail', 'game', externalId],
    queryFn: () => gameDetailApi.getGame(externalId),
  })
}
