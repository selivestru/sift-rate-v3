import { CalendarCheckIcon, ListIcon, StarIcon, type LucideIcon } from 'lucide-react'

import type { FileRoutesByTo } from '~/app/routeTree.gen'

export interface LibrarySection {
  to: keyof FileRoutesByTo
  label: string
  description: string
  icon: LucideIcon
  color: string
  index: string
}

export const librarySections: LibrarySection[] = [
  {
    to: '/library/ratings',
    label: 'Ratings',
    description: 'Everything you have scored and reviewed',
    icon: StarIcon,
    color: '#F59E0B',
    index: '01',
  },
  {
    to: '/library/lists',
    label: 'Lists',
    description: 'Ordered rankings you build over time',
    icon: ListIcon,
    color: '#3B82F6',
    index: '02',
  },
  {
    to: '/library/planned',
    label: 'Planned',
    description: 'What you mean to watch, play, or read next',
    icon: CalendarCheckIcon,
    color: '#10B981',
    index: '03',
  },
]
