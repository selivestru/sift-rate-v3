import { api } from '~/common/api'

import type { GameDetail } from '../types/game-detail.types'

export const gameDetailApi = {
  getGame: (id: string) => api.get(`media/game/${id}`).json<GameDetail>(),
}
