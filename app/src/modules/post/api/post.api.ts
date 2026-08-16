import { api } from '~/common/api'

import type { LikePostResponse } from '../types/post.types'

export const postApi = {
  likePost: async (id: string) => {
    return api.post<LikePostResponse>(`/posts/${id}/like`).json()
  },
  unlikePost: async (id: string) => {
    return api.delete<LikePostResponse>(`/posts/${id}/like`).json()
  },
}
