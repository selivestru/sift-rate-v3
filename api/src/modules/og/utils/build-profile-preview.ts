import type { OgPreview } from '../types/og.types'
import { MediaType } from '~/generated/prisma/enums'
import type { ReviewStats, UserProfile } from '~/modules/user/types/user-profile.types'

const MAX_MEDIA_TYPES = 3

const EMPTY_ARCHIVE_DESCRIPTION = 'Media life archive on SiftRate'

const MEDIA_TYPE_LABELS: Record<MediaType, string> = {
  MOVIE: 'Movies',
  TV_SHOW: 'TV shows',
  GAME: 'Games',
  BOOK: 'Books',
  ALBUM: 'Albums',
  TRACK: 'Tracks',
}

const buildReviewSummary = (reviewStats?: ReviewStats) => {
  const total = reviewStats?.total ?? 0

  if (total === 0) {
    return EMPTY_ARCHIVE_DESCRIPTION
  }

  const byMediaType: Record<string, number> = reviewStats?.byMediaType ?? {}

  const mediaTypes = Object.entries(byMediaType)
    .filter(([type, count]) => count > 0 && type in MEDIA_TYPE_LABELS)
    .sort(([, left], [, right]) => right - left)
    .slice(0, MAX_MEDIA_TYPES)
    .map(([type, count]) => `${MEDIA_TYPE_LABELS[type as MediaType]} ${count}`)

  return [total === 1 ? '1 review' : `${total} reviews`, ...mediaTypes].join(' · ')
}

export const buildProfilePreview = ({ user, reviewStats }: UserProfile): OgPreview => ({
  title: `@${user.username}`,
  description: buildReviewSummary(reviewStats),
  imageUrl: user.avatarUrl,
  type: 'profile',
})
