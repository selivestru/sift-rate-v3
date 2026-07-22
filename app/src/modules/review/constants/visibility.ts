import { Globe, Lock, Users } from 'reicon-react'

import { VISIBILITY } from '../types/review.types'

export const reviewVisibilityConfig = {
  [VISIBILITY.PRIVATE]: {
    value: VISIBILITY.PRIVATE,
    label: 'Private',
    icon: Lock,
    color: 'var(--color-warning)',
  },
  [VISIBILITY.PUBLIC]: {
    value: VISIBILITY.PUBLIC,
    label: 'Public',
    icon: Globe,
    color: 'var(--color-primary)',
  },
  [VISIBILITY.FRIENDS]: {
    value: VISIBILITY.FRIENDS,
    label: 'Friends',
    icon: Users,
    color: 'var(--color-success)',
  },
} as const

export const VISIBILITY_OPTIONS = [
  { ...reviewVisibilityConfig[VISIBILITY.PRIVATE] },
  { ...reviewVisibilityConfig[VISIBILITY.FRIENDS] },
  { ...reviewVisibilityConfig[VISIBILITY.PUBLIC] },
] as const
