import { api } from '~/common/api'

import type { AlbumDetail } from '../types/album-detail.types'

export const albumDetailApi = {
  getAlbum: (id: string) => api.get(`media/album/${id}`).json<AlbumDetail>(),
}
