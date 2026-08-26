export const IMDB_IMPORT_MAX_ROWS = 10_000

export const IMDB_IMPORT_MAX_FILE_BYTES = 5 * 1024 * 1024

export const IMDB_ID_PATTERN = /^tt\d+$/

export const IMDB_MOVIE_TITLE_TYPES = new Set([
  'movie',
  'tvmovie',
  'tvspecial',
  'featurefilm',
  'short',
  'tvshort',
  'video',
])

export const IMDB_TV_TITLE_TYPES = new Set(['tvseries', 'tvminiseries'])

export const IMDB_UNSUPPORTED_TITLE_TYPES = new Set([
  'tvepisode',
  'tvseason',
  'videogame',
  'podcastseries',
  'podcastepisode',
  'musicvideo',
])
