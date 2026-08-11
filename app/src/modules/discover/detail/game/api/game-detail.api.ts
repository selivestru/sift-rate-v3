import { api } from '~/common/api'

import type { GameDetail } from '../types/game-detail.types'

export const gameDetailApi = {
  getGame: (id: string) => api.get<GameDetail>(`media/game/${id}`).json(),
}
