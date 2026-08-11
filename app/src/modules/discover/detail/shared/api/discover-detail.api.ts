import { api } from '~/common/api'
import type { MediaType } from '~/common/constants/media-type'
import type { MediaRef } from '~/common/types/media-ref.types'

import type { MediaReviewResponse, MediaStateResponse } from '../types/media-state.types'

export const discoverDetailApi = {
  getMediaState: (mediaType: MediaType, externalId: string) => {
    return api
      .get<MediaStateResponse>(`/media/${mediaType.toLowerCase()}/${externalId}/state`)
      .json()
  },
  getMediaReviews: ({ mediaType, externalId }: MediaRef, cursor?: string) => {
    const searchParams = new URLSearchParams()

    if (cursor) {
      searchParams.set('cursor', cursor)
    }

    return api
      .get<MediaReviewResponse>(`/media/${mediaType.toLowerCase()}/${externalId}/reviews`, {
        searchParams,
      })
      .json()
  },
}
