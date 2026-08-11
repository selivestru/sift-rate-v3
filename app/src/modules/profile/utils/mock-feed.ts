import { MEDIA_TYPES } from '~/common/constants/media-type'

import type { FeedItem } from '../types/profile.types'

const author = {
  username: 'johndoe',
  displayName: 'John Doe',
  avatarUrl: null,
}

export const mockFeed: FeedItem[] = [
  {
    id: 'feed_1',
    kind: 'review',
    author,
    createdAt: '2026-08-04T18:42:00Z',
    likeCount: 24,
    commentCount: 3,
    isLiked: false,
    rating: 10,
    content:
      'A rare sequel that understands why the original worked. Huge, strange, and completely confident in its own world.',
    media: {
      id: 'media_1',
      externalId: '693134',
      mediaType: MEDIA_TYPES.MOVIE,
      title: 'Dune: Part Two',
      posterUrl: 'https://image.tmdb.org/t/p/w342/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg',
    },
  },
  {
    id: 'feed_2',
    kind: 'post',
    author,
    createdAt: '2026-08-02T12:20:00Z',
    likeCount: 11,
    commentCount: 2,
    isLiked: true,
    content:
      'Spent the whole afternoon going through old favorites. It is fun seeing how different the list feels when you look at it as a timeline instead of a ranking.',
  },
  {
    id: 'feed_3',
    kind: 'review',
    author,
    createdAt: '2026-07-29T09:15:00Z',
    likeCount: 8,
    commentCount: 1,
    isLiked: false,
    rating: 9,
    content:
      'The kind of show that makes a short season feel like a complete novel. Quiet, tense, and beautifully acted.',
    media: {
      id: 'media_2',
      externalId: '100088',
      mediaType: MEDIA_TYPES.TV_SHOW,
      title: 'The Last of Us',
      posterUrl: 'https://image.tmdb.org/t/p/w342/uKvVjHNqB5VmOrdxqAt2F7J78ED.jpg',
    },
  },
  {
    id: 'feed_4',
    kind: 'post',
    author,
    createdAt: '2026-07-21T20:05:00Z',
    likeCount: 36,
    commentCount: 7,
    isLiked: false,
    content: 'What is one book you wish you could read again for the first time?',
    media: {
      id: 'media_3',
      externalId: '123456',
      mediaType: MEDIA_TYPES.BOOK,
      title: 'The Name of the Wind',
      posterUrl: null,
    },
  },
  {
    id: 'feed_5',
    kind: 'review',
    author,
    createdAt: '2026-07-16T16:30:00Z',
    likeCount: 15,
    commentCount: 4,
    isLiked: false,
    rating: 8,
    content:
      'Still one of the most precise sci-fi films ever made. The sound design does half the emotional work.',
    media: {
      id: 'media_4',
      externalId: '157336',
      mediaType: MEDIA_TYPES.MOVIE,
      title: 'Interstellar',
      posterUrl: 'https://image.tmdb.org/t/p/w342/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
    },
  },
  {
    id: 'feed_6',
    kind: 'post',
    author,
    createdAt: '2026-07-08T11:10:00Z',
    likeCount: 5,
    commentCount: 0,
    isLiked: false,
    content:
      'Finally making room for more games in the archive. The backlog is officially part of the plan now.',
  },
]
