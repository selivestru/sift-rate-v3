import { MEDIA_TYPES } from '~/common/constants/media-type'

import type { Review } from '../types/review.types'

export interface ReviewGroup<T extends Review> {
  item: T
  showReview: T | null
  seasonReviews: T[]
}

export const groupReviewsByMedia = <T extends Review>(items: T[]): ReviewGroup<T>[] => {
  const groups = new Map<string, ReviewGroup<T>>()

  for (const item of items) {
    const isTvShow = item.media.mediaType === MEDIA_TYPES.TV_SHOW
    const key = isTvShow ? item.media.id : item.id

    const group = groups.get(key)

    if (!group) {
      groups.set(key, {
        item,
        showReview: item.seasonNumber == null ? item : null,
        seasonReviews: item.seasonNumber != null ? [item] : [],
      })
      continue
    }

    if (item.seasonNumber == null) {
      group.showReview = item
    } else {
      group.seasonReviews.push(item)
    }
  }

  const result = [...groups.values()]

  for (const group of result) {
    group.seasonReviews.sort((a, b) => (a.seasonNumber ?? 0) - (b.seasonNumber ?? 0))

    if (group.showReview) {
      group.item = group.showReview
    }
  }

  return result
}
