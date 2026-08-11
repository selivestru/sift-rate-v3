import { api } from '~/common/api'

import type { TvShowDetail } from '../types/tv-show-detail.types'

export const tvShowDetailApi = {
  getTvShow: (id: string) => api.get<TvShowDetail>(`media/tv_show/${id}`).json(),
}
