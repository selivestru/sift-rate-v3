import {
  BrainIcon,
  CalendarCheckIcon,
  ClockIcon,
  CompassIcon,
  GiftIcon,
  HomeIcon,
  LibraryIcon,
  ListIcon,
  LoaderPinwheelIcon,
  SparklesIcon,
  StarIcon,
  type LucideIcon,
} from 'lucide-react'

import type { FileRoutesByTo } from '~/app/routeTree.gen'

export interface NavItemConfig {
  to: keyof FileRoutesByTo
  label: string
  icon: LucideIcon
  description: string
  subscriptionRequired?: boolean
  color: string
  children?: NavItemConfig[]
}

export const navItems: NavItemConfig[] = [
  {
    to: '/',
    label: 'Home',
    icon: HomeIcon,
    description: 'Your activity feed',
    color: '#8B5CF6',
  },
  {
    to: '/discover',
    label: 'Discover',
    icon: CompassIcon,
    description: 'Find media to archive',
    color: '#06B6D4',
  },
  {
    to: '/library',
    label: 'Library',
    icon: LibraryIcon,
    description: 'Your media library',
    color: '#8B5CF6',
    children: [
      {
        to: '/library/ratings',
        label: 'Ratings',
        icon: StarIcon,
        description: 'Rating archive',
        color: '#F59E0B',
      },
      {
        to: '/library/lists',
        label: 'Lists',
        icon: ListIcon,
        description: 'Ordered personal rankings',
        color: '#3B82F6',
      },
      {
        to: '/library/planned',
        label: 'Planned',
        icon: CalendarCheckIcon,
        description: 'Watch and play later',
        color: '#10B981',
      },
    ],
  },
  {
    to: '/life',
    label: 'Life',
    icon: SparklesIcon,
    description: 'Your media life story',
    color: '#F43F5E',
    subscriptionRequired: true,
    children: [
      {
        to: '/life/timeline',
        label: 'Timeline',
        icon: ClockIcon,
        description: 'Review timeline',
        color: '#F43F5E',
        subscriptionRequired: true,
      },
      {
        to: '/life/wrapped',
        label: 'Wrapped',
        icon: GiftIcon,
        description: 'Monthly and yearly recaps',
        color: '#A855F7',
        subscriptionRequired: true,
      },
      {
        to: '/life/memories',
        label: 'Memories',
        icon: BrainIcon,
        description: 'Moments worth keeping',
        color: '#06B6D4',
        subscriptionRequired: true,
      },
    ],
  },
  {
    to: '/wheel',
    label: 'Wheel',
    icon: LoaderPinwheelIcon,
    description: 'Decision wheel',
    color: '#EC4899',
  },
]
