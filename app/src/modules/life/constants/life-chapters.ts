import { Clock, Gift, SdCard, type IconComponent } from 'reicon-react'

import type { FileRoutesByTo } from '~/app/routeTree.gen'

export type LifeChapterKind = 'timeline' | 'wrapped' | 'memories'

export interface LifeChapter {
  to: keyof FileRoutesByTo
  kind: LifeChapterKind
  label: string
  description: string
  motif: string
  icon: IconComponent
}

export const lifeChapters: LifeChapter[] = [
  {
    to: '/life/timeline',
    kind: 'timeline',
    label: 'Timeline',
    description: 'Walk through reviews as they happened in your life',
    motif: 'Along the years',
    icon: Clock,
  },
  {
    to: '/life/wrapped',
    kind: 'wrapped',
    label: 'Wrapped',
    description: 'Monthly and yearly recaps of what shaped you',
    motif: 'This season',
    icon: Gift,
  },
  {
    to: '/life/memories',
    kind: 'memories',
    label: 'Memories',
    description: 'Moments you chose to keep close',
    motif: 'Pinned moments',
    icon: SdCard,
  },
]
