import { api } from '~/common/api'

import type { TrackDetail } from '../types/track-detail.types'

export const trackDetailApi = {
  getTrack: (id: string) => api.get<TrackDetail>(`media/track/${id}`).json(),
}
