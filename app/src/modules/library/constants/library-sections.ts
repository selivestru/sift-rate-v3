import { CalendarCheck, List, Star, type IconComponent } from 'reicon-react'

import type { FileRoutesByTo } from '~/app/routeTree.gen'

export interface LibrarySection {
  to: keyof FileRoutesByTo
  label: string
  description: string
  icon: IconComponent
  color: string
  index: string
}

export const reviewsSection: LibrarySection = {
  to: '/library/reviews',
  label: 'Reviews',
  description: 'Everything you have scored and reviewed',
  icon: Star,
  color: '#F59E0B',
  index: '01',
}

export const listsSection: LibrarySection = {
  to: '/library/lists',
  label: 'Lists',
  description: 'Ordered rankings you build over time',
  icon: List,
  color: '#3B82F6',
  index: '02',
}

export const plannedSection: LibrarySection = {
  to: '/library/planned',
  label: 'Planned',
  description: 'What you mean to watch, play, or read next',
  icon: CalendarCheck,
  color: '#10B981',
  index: '03',
}

export const librarySections: LibrarySection[] = [reviewsSection, listsSection, plannedSection]
