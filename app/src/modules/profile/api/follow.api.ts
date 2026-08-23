import { api } from '~/common/api'

import type {
  FollowRequestsCount,
  FollowRequestsResponse,
  FollowStatusResponse,
} from '../types/follow.types'

export const followApi = {
  follow: (userId: string) => {
    return api.post<FollowStatusResponse>(`/follow/${userId}`).json()
  },
  unfollow: (userId: string) => {
    return api.delete<FollowStatusResponse>(`/follow/${userId}`).json()
  },
  getFollowRequests: (cursor?: string) => {
    const searchParams = new URLSearchParams()

    if (cursor) {
      searchParams.set('cursor', cursor)
    }

    return api.get<FollowRequestsResponse>('/follow/requests', { searchParams }).json()
  },
  getFollowRequestsCount: () => {
    return api.get<FollowRequestsCount>('/follow/requests/count').json()
  },
  acceptFollowRequest: (followerId: string) => {
    return api.post(`/follow/requests/${followerId}/accept`)
  },
  rejectFollowRequest: (followerId: string) => {
    return api.delete(`/follow/requests/${followerId}`)
  },
}
