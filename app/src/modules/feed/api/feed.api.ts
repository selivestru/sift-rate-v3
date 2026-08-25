import { api } from '~/common/api'

import type { FeedResponse } from '../types/feed.types'

export const feedApi = {
  getFeed: (cursor?: string) => {
    const searchParams = new URLSearchParams()

    if (cursor) {
      searchParams.set('cursor', cursor)
    }

    return api.get<FeedResponse>('/feed', { searchParams }).json()
  },
}
