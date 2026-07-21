import { GlobeIcon, LockIcon, UsersIcon } from 'lucide-react'

import { REVIEW_VISIBILITY } from '../types/review.types'

export const reviewVisibilityConfig = {
  [REVIEW_VISIBILITY.PUBLIC]: {
    value: REVIEW_VISIBILITY.PUBLIC,
    label: 'Public',
    icon: GlobeIcon,
    color: 'var(--color-primary)',
  },
  [REVIEW_VISIBILITY.PRIVATE]: {
    value: REVIEW_VISIBILITY.PRIVATE,
    label: 'Private',
    icon: LockIcon,
    color: 'var(--color-warning)',
  },
  [REVIEW_VISIBILITY.FRIENDS]: {
    value: REVIEW_VISIBILITY.FRIENDS,
    label: 'Friends',
    icon: UsersIcon,
    color: 'var(--color-success)',
  },
} as const

export const REVIEW_VISIBILITY_OPTIONS = [
  { ...reviewVisibilityConfig[REVIEW_VISIBILITY.PUBLIC] },
  { ...reviewVisibilityConfig[REVIEW_VISIBILITY.FRIENDS] },
  { ...reviewVisibilityConfig[REVIEW_VISIBILITY.PRIVATE] },
] as const
