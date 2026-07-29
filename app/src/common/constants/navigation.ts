import { CalendarCheck, Compass, Cup, Home, Library, Star, type IconComponent } from 'reicon-react'

import type { FileRoutesByTo } from '~/app/routeTree.gen'

import { mediaTypeMeta, mediaTypeToSlug, type MediaTypeSlug } from './media-type'

export interface NavItemConfig {
  to: keyof FileRoutesByTo
  label: string
  icon: IconComponent
  description: string
  color?: string
  motif?: string
  authRequired?: boolean
  subscriptionRequired?: boolean
  params?: { mediaType: MediaTypeSlug }
  children?: NavItemConfig[]
}

export const navItems: NavItemConfig[] = [
  {
    to: '/',
    label: 'Home',
    icon: Home,
    description: 'Your activity feed',
  },
  {
    to: '/discover',
    label: 'Discover',
    icon: Compass,
    description: 'Find media to archive',
    children: [
      {
        to: '/discover/movie',
        params: { mediaType: mediaTypeToSlug.MOVIE },
        label: mediaTypeMeta.MOVIE.label,
        icon: mediaTypeMeta.MOVIE.icon,
        description: 'Films to watch and archive',
      },
      {
        to: '/discover/tv_show',
        params: { mediaType: mediaTypeToSlug.TV_SHOW },
        label: mediaTypeMeta.TV_SHOW.label,
        icon: mediaTypeMeta.TV_SHOW.icon,
        description: 'Series and seasons',
      },
      {
        to: '/discover/track',
        params: { mediaType: mediaTypeToSlug.TRACK },
        label: mediaTypeMeta.TRACK.label,
        icon: mediaTypeMeta.TRACK.icon,
        description: 'Single moments',
      },
      {
        to: '/discover/album',
        params: { mediaType: mediaTypeToSlug.ALBUM },
        label: mediaTypeMeta.ALBUM.label,
        icon: mediaTypeMeta.ALBUM.icon,
        description: 'Full listens',
      },
      {
        to: '/discover/game',
        params: { mediaType: mediaTypeToSlug.GAME },
        label: mediaTypeMeta.GAME.label,
        icon: mediaTypeMeta.GAME.icon,
        description: 'Playthroughs ahead',
      },
      {
        to: '/discover/book',
        params: { mediaType: mediaTypeToSlug.BOOK },
        label: mediaTypeMeta.BOOK.label,
        icon: mediaTypeMeta.BOOK.icon,
        description: 'Pages and shelves',
      },
    ],
  },
  {
    to: '/library',
    label: 'Library',
    icon: Library,
    description: 'Your media library',
    authRequired: true,
    children: [
      {
        to: '/library/reviews',
        label: 'Reviews',
        icon: Star,
        description: 'Everything you have scored and reviewed',
        color: '#F59E0B',
        authRequired: true,
      },
      {
        to: '/library/ranked-list',
        label: 'Ranked Lists',
        icon: Cup,
        description: 'Ordered rankings you build over time',
        color: '#3B82F6',
        authRequired: true,
      },
      {
        to: '/library/planned',
        label: 'Planned',
        icon: CalendarCheck,
        description: 'What you mean to watch, play, or read next',
        color: '#10B981',
        authRequired: true,
      },
    ],
  },
]

export const getNavItem = (to: keyof FileRoutesByTo): NavItemConfig | undefined => {
  for (const item of navItems) {
    if (item.to === to) return item
    if (item.children) {
      for (const child of item.children) {
        if (child.to === to) return child
      }
    }
  }
}

export const requireNavItem = (to: keyof FileRoutesByTo): NavItemConfig => {
  const item = getNavItem(to)
  if (!item) {
    throw new Error(`Nav item not found for route: ${to}`)
  }
  return item
}

export const discoverNav = requireNavItem('/discover')
export const libraryNav = requireNavItem('/library')
export const discoverChildren = discoverNav.children ?? []
export const libraryChildren = libraryNav.children ?? []

export const reviewsNavItem = requireNavItem('/library/reviews')
export const rankedListNavItem = requireNavItem('/library/ranked-list')
export const plannedNavItem = requireNavItem('/library/planned')
