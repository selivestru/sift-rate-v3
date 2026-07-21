import {
  BrainIcon,
  CalendarCheckIcon,
  ClockIcon,
  CompassIcon,
  GiftIcon,
  HomeIcon,
  LibraryIcon,
  ListIcon,
  SparklesIcon,
  StarIcon,
  type LucideIcon,
} from 'lucide-react'

import type { FileRoutesByTo } from '~/app/routeTree.gen'

import { mediaTypeMeta, mediaTypeToSlug, type MediaTypeSlug } from './media-type'

export interface NavItemConfig {
  to: keyof FileRoutesByTo
  label: string
  icon: LucideIcon
  description: string
  authRequired?: boolean
  subscriptionRequired?: boolean

  params?: { mediaType: MediaTypeSlug }
  children?: NavItemConfig[]
}

export const navItems: NavItemConfig[] = [
  {
    to: '/',
    label: 'Home',
    icon: HomeIcon,
    description: 'Your activity feed',
  },
  {
    to: '/discover',
    label: 'Discover',
    icon: CompassIcon,
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
    icon: LibraryIcon,
    description: 'Your media library',

    authRequired: true,
    children: [
      {
        to: '/library/reviews',
        label: 'Reviews',
        icon: StarIcon,
        description: 'Rating archive',

        authRequired: true,
      },
      {
        to: '/library/lists',
        label: 'Lists',
        icon: ListIcon,
        description: 'Ordered personal rankings',

        authRequired: true,
      },
      {
        to: '/library/planned',
        label: 'Planned',
        icon: CalendarCheckIcon,
        description: 'Watch and play later',

        authRequired: true,
      },
    ],
  },
  {
    to: '/life',
    label: 'Life',
    icon: SparklesIcon,
    description: 'Your media life story',

    authRequired: true,
    subscriptionRequired: true,
    children: [
      {
        to: '/life/timeline',
        label: 'Timeline',
        icon: ClockIcon,
        description: 'Review timeline',

        authRequired: true,
        subscriptionRequired: true,
      },
      {
        to: '/life/wrapped',
        label: 'Wrapped',
        icon: GiftIcon,
        description: 'Monthly and yearly recaps',

        authRequired: true,
        subscriptionRequired: true,
      },
      {
        to: '/life/memories',
        label: 'Memories',
        icon: BrainIcon,
        description: 'Moments worth keeping',

        authRequired: true,
        subscriptionRequired: true,
      },
    ],
  },
]
