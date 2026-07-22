import { Globe, Lock, Users } from 'reicon-react'

import { REVIEW_VISIBILITY } from '../types/review.types'

export const reviewVisibilityConfig = {
  [REVIEW_VISIBILITY.PUBLIC]: {
    value: REVIEW_VISIBILITY.PUBLIC,
    label: 'Public',
    icon: Globe,
    color: 'var(--color-primary)',
  },
  [REVIEW_VISIBILITY.PRIVATE]: {
    value: REVIEW_VISIBILITY.PRIVATE,
    label: 'Private',
    icon: Lock,
    color: 'var(--color-warning)',
  },
  [REVIEW_VISIBILITY.FRIENDS]: {
    value: REVIEW_VISIBILITY.FRIENDS,
    label: 'Friends',
    icon: Users,
    color: 'var(--color-success)',
  },
} as const

export const REVIEW_VISIBILITY_OPTIONS = [
  { ...reviewVisibilityConfig[REVIEW_VISIBILITY.PUBLIC] },
  { ...reviewVisibilityConfig[REVIEW_VISIBILITY.FRIENDS] },
  { ...reviewVisibilityConfig[REVIEW_VISIBILITY.PRIVATE] },
] as const
