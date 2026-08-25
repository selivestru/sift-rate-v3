import { api } from '~/common/api'
import type { FeedResponse } from '~/modules/feed'

import type { FollowUserListResponse } from '../types/follow.types'
import type { Profile, UserActivity } from '../types/profile.types'

export const profileApi = {
  getProfile: (username: string) => {
    return api.get<Profile>(`/user/${username}`).json()
  },
  getUserActivity: (username: string) => {
    return api.get<UserActivity[]>(`/user/${username}/activity`).json()
  },
  getUserFeed: (username: string, cursor?: string) => {
    const searchParams = new URLSearchParams()

    if (cursor) {
      searchParams.set('cursor', cursor)
    }

    return api.get<FeedResponse>(`/user/${username}/feed`, { searchParams }).json()
  },
  getFollowers: (username: string, cursor?: string) => {
    const searchParams = new URLSearchParams()

    if (cursor) {
      searchParams.set('cursor', cursor)
    }

    return api.get<FollowUserListResponse>(`/user/${username}/followers`, { searchParams }).json()
  },
  getFollowing: (username: string, cursor?: string) => {
    const searchParams = new URLSearchParams()

    if (cursor) {
      searchParams.set('cursor', cursor)
    }

    return api.get<FollowUserListResponse>(`/user/${username}/following`, { searchParams }).json()
  },
}
