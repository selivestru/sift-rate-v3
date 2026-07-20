import { api } from '~/common/api'

import type { MovieDetail } from '../types/movie-detail.types'

export const movieDetailApi = {
  getMovie: (id: string) => api.get(`media/movie/${id}`).json<MovieDetail>(),
}
