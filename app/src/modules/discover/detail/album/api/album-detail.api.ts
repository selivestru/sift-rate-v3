import { api } from '~/common/api'

import type { AlbumDetail } from '../types/album-detail.types'

export const albumDetailApi = {
  getAlbum: (id: string) => api.get<AlbumDetail>(`media/album/${id}`).json(),
}
