import { api } from '~/common/api'

import type { CreatePostInput } from '../schema/create-post.schema'
import type { LikePostResponse, Post, PostListResponse } from '../types/post.types'

export const postApi = {
  createPost: async (body: CreatePostInput) => {
    return api.post<Post>('/posts', { json: body }).json()
  },
  getPostById: async (id: string) => {
    return api.get<Post>(`/posts/${id}`).json()
  },
  getPostReplies: async (postId: string, cursor?: string) => {
    return api
      .get<PostListResponse>(`/posts/${postId}/replies`, {
        searchParams: cursor ? { cursor } : undefined,
      })
      .json()
  },
  createReply: async (postId: string, body: CreatePostInput) => {
    return api.post<Post>(`/posts/${postId}/replies`, { json: body }).json()
  },
  likePost: async (id: string) => {
    return api.post<LikePostResponse>(`/posts/${id}/like`).json()
  },
  unlikePost: async (id: string) => {
    return api.delete<LikePostResponse>(`/posts/${id}/like`).json()
  },
}
