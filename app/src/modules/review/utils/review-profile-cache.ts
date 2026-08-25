import type { QueryClient } from '@tanstack/react-query'

import type { MediaType } from '~/common/constants/media-type'
import { QUERIES_KEYS } from '~/common/constants/queries-keys'
import type { Profile, UserActivity } from '~/modules/profile'

const clampCount = (value: number) => Math.max(0, value)

export const bumpUserActivity = (
  prev: UserActivity[] | undefined,
  isoDate: string,
  delta: number,
): UserActivity[] | undefined => {
  if (!prev) return prev

  const day = isoDate.slice(0, 10)
  const hasEntry = prev.some((entry) => entry.date === day)

  if (!hasEntry) {
    return delta > 0 ? [...prev, { date: day, count: delta }] : prev
  }

  return prev
    .map((entry) =>
      entry.date === day ? { ...entry, count: clampCount(entry.count + delta) } : entry,
    )
    .filter((entry) => entry.count !== 0)
}

export const applyProfileReviewCreated = (
  profile: Profile,
  input: { mediaType: MediaType; rating: number },
): Profile => ({
  ...profile,
  ratingDistribution: {
    ...profile.ratingDistribution,
    [input.rating]: clampCount((profile.ratingDistribution[input.rating] ?? 0) + 1),
  },
  reviewStats: {
    ...profile.reviewStats,
    total: clampCount(profile.reviewStats.total + 1),
    byMediaType: {
      ...profile.reviewStats.byMediaType,
      [input.mediaType]: clampCount((profile.reviewStats.byMediaType[input.mediaType] ?? 0) + 1),
    },
  },
})

export const applyProfileReviewDeleted = (
  profile: Profile,
  input: { mediaType: MediaType; rating: number },
): Profile => ({
  ...profile,
  ratingDistribution: {
    ...profile.ratingDistribution,
    [input.rating]: clampCount((profile.ratingDistribution[input.rating] ?? 0) - 1),
  },
  reviewStats: {
    ...profile.reviewStats,
    total: clampCount(profile.reviewStats.total - 1),
    byMediaType: {
      ...profile.reviewStats.byMediaType,
      [input.mediaType]: clampCount((profile.reviewStats.byMediaType[input.mediaType] ?? 0) - 1),
    },
  },
})

export const applyProfileRatingChanged = (
  profile: Profile,
  input: { fromRating: number; toRating: number },
): Profile => {
  if (input.fromRating === input.toRating) {
    return profile
  }

  return {
    ...profile,
    ratingDistribution: {
      ...profile.ratingDistribution,
      [input.fromRating]: clampCount((profile.ratingDistribution[input.fromRating] ?? 0) - 1),
      [input.toRating]: clampCount((profile.ratingDistribution[input.toRating] ?? 0) + 1),
    },
  }
}

export const patchUserActivity = (
  client: QueryClient,
  username: string,
  recipe: (activity: UserActivity[]) => UserActivity[] | undefined,
) => {
  client.setQueryData<UserActivity[]>(QUERIES_KEYS.userActivity(username), (prev) => {
    if (!prev) return prev

    return recipe(prev)
  })
}

export const patchProfileReviewStats = (
  client: QueryClient,
  username: string,
  recipe: (profile: Profile) => Profile,
) => {
  client.setQueryData<Profile>(QUERIES_KEYS.profile(username), (prev) => {
    if (!prev) return prev

    return recipe(prev)
  })
}
