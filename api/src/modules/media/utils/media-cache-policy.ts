import { getNextMusicReleaseBoundaryMs } from './music-release-boundary'

export const SEARCH_CACHE_TTL_SECONDS = 24 * 3600

export const DETAIL_CACHE_TTL_SECONDS = {
  stable: 14 * 24 * 3600,
  standard: 7 * 24 * 3600,
  fresh: 24 * 3600,
  hot: 6 * 3600,
} as const

const DAY_MS = 86_400_000

const FRESH_AGE_DAYS_MAX = 30
const STANDARD_AGE_DAYS_MAX = 365

const HOT_MOVIE_STATUSES = new Set(['Rumored', 'Planned', 'In Production', 'Post Production'])
const ACTIVE_TV_STATUSES = new Set(['Pilot', 'In Production', 'Returning Series'])

export type SearchCacheKind = 'movie' | 'tv' | 'game' | 'book' | 'track' | 'album'

export type DetailCacheKind = SearchCacheKind

const normalizeSearchQuery = (query: string) => query.trim().toLowerCase().replace(/\s+/g, ' ')

export const buildSearchCacheKey = (
  kind: SearchCacheKind,
  query: string,
  page: number,
  language?: string,
) => `search:${kind}:${normalizeSearchQuery(query)}:p${page}${language ? `:${language}` : ''}`

const DETAIL_CACHE_VERSION = 2

export const buildDetailCacheKey = (kind: DetailCacheKind, id: string, language?: string) =>
  `${kind}:v${DETAIL_CACHE_VERSION}:${id}${language ? `:${language}` : ''}`

export const parsePartialDateToMs = (value?: string | null): number | null => {
  if (!value?.trim()) return null

  const match = /^(\d{4})(?:-(\d{2}))?(?:-(\d{2}))?$/.exec(value.trim())
  if (!match) return null

  const year = Number(match[1])
  const month = Number(match[2] ?? '01')
  const day = Number(match[3] ?? '01')

  if (month < 1 || month > 12 || day < 1 || day > 31) return null

  const ms = Date.UTC(year, month - 1, day)
  return Number.isFinite(ms) ? ms : null
}

export interface DetailTtlOptions {
  kind: DetailCacheKind
  releaseDate?: string | null
  status?: string | null
  inProduction?: boolean
  nowMs?: number
}

export const resolveDetailTtlSeconds = ({
  kind,
  releaseDate,
  status,
  inProduction,
  nowMs = Date.now(),
}: DetailTtlOptions): number => {
  if (kind === 'movie' && HOT_MOVIE_STATUSES.has(status ?? '')) {
    return DETAIL_CACHE_TTL_SECONDS.hot
  }

  if (kind === 'tv' && (inProduction || ACTIVE_TV_STATUSES.has(status ?? ''))) {
    return DETAIL_CACHE_TTL_SECONDS.hot
  }

  const releaseMs = parsePartialDateToMs(releaseDate)

  if (releaseMs == null) {
    return kind === 'book' ? DETAIL_CACHE_TTL_SECONDS.stable : DETAIL_CACHE_TTL_SECONDS.standard
  }

  const ageDays = (nowMs - releaseMs) / DAY_MS

  if (ageDays < 0) return DETAIL_CACHE_TTL_SECONDS.hot
  if (ageDays < FRESH_AGE_DAYS_MAX) return DETAIL_CACHE_TTL_SECONDS.fresh
  if (ageDays < STANDARD_AGE_DAYS_MAX) return DETAIL_CACHE_TTL_SECONDS.standard

  return DETAIL_CACHE_TTL_SECONDS.stable
}

export const secondsUntilNextMusicReleaseBoundary = (nowMs: number = Date.now()): number =>
  Math.max(1, Math.ceil((getNextMusicReleaseBoundaryMs(nowMs) - nowMs) / 1000))

export const resolveMusicDetailTtlSeconds = (
  releaseDate?: string | null,
  nowMs: number = Date.now(),
): number => {
  const releaseMs = parsePartialDateToMs(releaseDate)
  const ageDays = releaseMs == null ? null : (nowMs - releaseMs) / DAY_MS

  if (ageDays == null || ageDays <= FRESH_AGE_DAYS_MAX) {
    return Math.min(DETAIL_CACHE_TTL_SECONDS.hot, secondsUntilNextMusicReleaseBoundary(nowMs))
  }

  return DETAIL_CACHE_TTL_SECONDS.standard
}
