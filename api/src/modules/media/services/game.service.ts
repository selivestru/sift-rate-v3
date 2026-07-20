import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import { SearchMediaQueryDto } from '../dto/search-media.query'
import {
  GameCompany,
  GameCompanyRole,
  GameDetail,
  GameImage,
  GameImageSize,
  GameRelatedItem,
  GameSearchCountRaw,
  GameSearchItem,
  GameSearchRaw,
  GameVideo,
  GameWebsite,
  GameWebsiteKind,
  IgdbAgeRatingRaw,
  IgdbAltNameRaw,
  IgdbGameRaw,
  IgdbImageRaw,
  IgdbInvolvedCompanyRaw,
  IgdbLanguageSupportRaw,
  IgdbNameRaw,
  IgdbRelatedGameRaw,
  IgdbVideoRaw,
  IgdbWebsiteRaw,
  TwitchTokenResponse,
} from '../types/game.types'
import { MediaSearchResponse } from '../types/media.types'
import { buildSearchCacheKey, getSearchCache, setSearchCache } from '../utils/search-cache'
import ky from 'ky'
import { EnvConfig } from '~/app/config/env.config'
import { RedisService } from '~/infrastructure/redis/redis.service'

@Injectable()
export class GameService {
  private readonly IGDB_API_URL = 'https://api.igdb.com/v4'
  private readonly TWITCH_TOKEN_URL = 'https://id.twitch.tv/oauth2/token'
  private readonly REDIS_TOKEN_KEY = 'igdb:access_token'
  private readonly TOKEN_EXPIRY_BUFFER_MS = 60_000
  private readonly GAME_CACHE_TTL_SECONDS = 7 * 24 * 3600
  private readonly IMAGE_LIMIT = 16
  private readonly VIDEO_LIMIT = 6
  private readonly RELATED_LIMIT = 12
  private readonly SIMILAR_LIMIT = 12
  private readonly LANGUAGE_LIMIT = 24

  private readonly WEBSITE_CATEGORY_MAP: Record<number, { label: string; kind: GameWebsiteKind }> =
    {
      1: { label: 'Official Website', kind: 'official' },
      3: { label: 'Wikipedia', kind: 'other' },
      4: { label: 'Facebook', kind: 'other' },
      5: { label: 'Twitter', kind: 'other' },
      6: { label: 'Twitch', kind: 'twitch' },
      8: { label: 'Instagram', kind: 'other' },
      9: { label: 'YouTube', kind: 'youtube' },
      10: { label: 'App Store', kind: 'store' },
      11: { label: 'App Store', kind: 'store' },
      12: { label: 'Google Play', kind: 'store' },
      13: { label: 'Steam', kind: 'steam' },
      14: { label: 'Reddit', kind: 'other' },
      15: { label: 'itch.io', kind: 'itch' },
      16: { label: 'Epic Games', kind: 'epic' },
      17: { label: 'GOG', kind: 'gog' },
      18: { label: 'Discord', kind: 'other' },
    }

  private readonly WEBSITE_PRIORITY: GameWebsiteKind[] = [
    'official',
    'steam',
    'epic',
    'gog',
    'itch',
    'store',
    'youtube',
    'twitch',
    'other',
  ]

  private readonly GAME_FIELDS = [
    'name',
    'summary',
    'storyline',
    'first_release_date',
    'total_rating',
    'total_rating_count',
    'alternative_names.name',
    'cover.image_id',
    'artworks.image_id',
    'artworks.width',
    'artworks.height',
    'screenshots.image_id',
    'screenshots.width',
    'screenshots.height',
    'videos.video_id',
    'videos.name',
    'genres.name',
    'themes.name',
    'game_modes.name',
    'player_perspectives.name',
    'platforms.name',
    'platforms.abbreviation',
    'game_engines.name',
    'involved_companies.developer',
    'involved_companies.publisher',
    'involved_companies.supporting',
    'involved_companies.porting',
    'involved_companies.company.id',
    'involved_companies.company.name',
    'involved_companies.company.logo.image_id',
    'age_ratings.rating_category.rating',
    'age_ratings.organization.name',
    'websites.url',
    'websites.category',
    'language_supports.language.name',
    'franchises.name',
    'collections.name',
    'parent_game.id',
    'parent_game.name',
    'parent_game.cover.image_id',
    'parent_game.first_release_date',
    'parent_game.total_rating',
    'dlcs.id',
    'dlcs.name',
    'dlcs.cover.image_id',
    'dlcs.first_release_date',
    'dlcs.total_rating',
    'expansions.id',
    'expansions.name',
    'expansions.cover.image_id',
    'expansions.first_release_date',
    'expansions.total_rating',
    'standalone_expansions.id',
    'standalone_expansions.name',
    'standalone_expansions.cover.image_id',
    'standalone_expansions.first_release_date',
    'standalone_expansions.total_rating',
    'remakes.id',
    'remakes.name',
    'remakes.cover.image_id',
    'remakes.first_release_date',
    'remakes.total_rating',
    'remasters.id',
    'remasters.name',
    'remasters.cover.image_id',
    'remasters.first_release_date',
    'remasters.total_rating',
    'ports.id',
    'ports.name',
    'ports.cover.image_id',
    'ports.first_release_date',
    'ports.total_rating',
    'similar_games.id',
    'similar_games.name',
    'similar_games.cover.image_id',
    'similar_games.first_release_date',
    'similar_games.total_rating',
  ].join(',')

  constructor(
    private readonly config: ConfigService<EnvConfig, true>,
    private readonly redis: RedisService,
  ) {}

  async search({ q, page }: SearchMediaQueryDto): Promise<MediaSearchResponse<GameSearchItem>> {
    const pageNum = +page
    const cacheKey = buildSearchCacheKey('game', q, pageNum)
    const cached = await getSearchCache<MediaSearchResponse<GameSearchItem>>(this.redis, cacheKey)
    if (cached) return cached

    const offset = (pageNum - 1) * 10 // TODO: fix pagination

    const searchClause = `search "${q}"; where version_parent = null;`

    const [games, countResult] = await Promise.all([
      this.igdbRequest<GameSearchRaw[]>(
        'games',
        `${searchClause} fields name,first_release_date,cover.image_id,total_rating,genres.name,platforms.abbreviation; limit ${10}; offset ${offset};`,
      ),
      this.igdbRequest<GameSearchCountRaw | GameSearchCountRaw[]>('games/count', searchClause),
    ])

    const totalResults = Array.isArray(countResult)
      ? (countResult[0]?.count ?? 0)
      : countResult.count
    const totalPages = Math.max(1, Math.ceil(totalResults / 10))

    const result: MediaSearchResponse<GameSearchItem> = {
      results: games.map((game) => ({
        id: String(game.id),
        title: game.name,
        year: this.yearFromUnix(game.first_release_date),
        coverUrl: this.buildCoverUrl(game.cover?.image_id),
        rating: this.mapRating(game.total_rating),
        genres: (game.genres ?? [])
          .map((genre) => genre.name)
          .filter((name): name is string => Boolean(name)),
        platforms: (game.platforms ?? [])
          .map((platform) => platform.abbreviation)
          .filter((abbr): abbr is string => Boolean(abbr)),
      })),
      totalResults,
      totalPages: Math.min(totalPages, 10),
    }

    await setSearchCache(this.redis, cacheKey, result)
    return result
  }

  async getById(id: string): Promise<GameDetail> {
    const gameId = id.trim()
    if (!/^\d+$/.test(gameId)) {
      throw new NotFoundException('Game not found')
    }

    const cacheKey = `game:${gameId}`

    try {
      const cached = await this.redis.get(cacheKey)
      if (cached) {
        return JSON.parse(cached) as GameDetail
      }
    } catch {
      void 0
    }

    let rows: IgdbGameRaw[]

    try {
      rows = await this.igdbRequest<IgdbGameRaw[]>(
        'games',
        `fields ${this.GAME_FIELDS}; where id = ${gameId};`,
      )
    } catch (error) {
      throw new InternalServerErrorException(
        `IGDB API error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      )
    }

    const raw = rows.at(0)
    if (!raw) {
      throw new NotFoundException('Game not found')
    }

    const result = this.mapGameDetail(raw)

    try {
      await this.redis.set(cacheKey, JSON.stringify(result), 'EX', this.GAME_CACHE_TTL_SECONDS)
    } catch {
      void 0
    }

    return result
  }

  private async getAccessToken() {
    const cached = await this.redis.get(this.REDIS_TOKEN_KEY)

    if (cached) {
      return cached
    }

    const url = new URL(this.TWITCH_TOKEN_URL)
    url.searchParams.set('client_id', this.config.get('IGDB_CLIENT_ID', { infer: true }))
    url.searchParams.set('client_secret', this.config.get('IGDB_CLIENT_SECRET', { infer: true }))
    url.searchParams.set('grant_type', 'client_credentials')

    const response = await ky.post(url.toString()).json<TwitchTokenResponse>()

    const ttlMs = response.expires_in * 1000 - this.TOKEN_EXPIRY_BUFFER_MS

    await this.redis.set(this.REDIS_TOKEN_KEY, response.access_token, 'PX', ttlMs)

    return response.access_token
  }

  private async igdbRequest<T>(endpoint: string, body: string): Promise<T> {
    const accessToken = await this.getAccessToken()

    return ky
      .post(`${this.IGDB_API_URL}/${endpoint}`, {
        headers: {
          'Client-ID': this.config.get('IGDB_CLIENT_ID', { infer: true }),
          Authorization: `Bearer ${accessToken}`,
          Accept: 'application/json',
        },
        body,
      })
      .json<T>()
  }

  private buildGameImageUrl(
    imageId: string | undefined,
    size: GameImageSize = 'cover_big_2x',
  ): string | null {
    if (!imageId) {
      return null
    }

    return `https://images.igdb.com/igdb/image/upload/t_${size}/${imageId}.jpg`
  }

  private buildCoverUrl(imageId: string | undefined): string | null {
    return this.buildGameImageUrl(imageId, 'cover_big_2x')
  }

  private yearFromUnix(timestamp?: number) {
    if (!timestamp) {
      return ''
    }

    return String(new Date(timestamp * 1000).getUTCFullYear())
  }

  private isoFromUnix(timestamp?: number) {
    if (!timestamp) {
      return ''
    }

    return new Date(timestamp * 1000).toISOString().slice(0, 10)
  }

  private mapRating(totalRating?: number): number | null {
    if (totalRating == null || Number.isNaN(totalRating)) {
      return null
    }

    return Math.round(totalRating) / 10
  }

  private mapDetailRating(totalRating?: number): number {
    if (totalRating == null || Number.isNaN(totalRating) || totalRating <= 0) {
      return 0
    }

    return Math.round(totalRating) / 10
  }

  private namesOf(items?: IgdbNameRaw[]) {
    return (items ?? [])
      .map((item) => item.name)
      .filter((name): name is string => Boolean(name?.trim()))
  }

  private mapImages(
    images: IgdbImageRaw[] | undefined,
    limit: number,
    fullSize: '1080p' | 'screenshot_huge' = '1080p',
    thumbSize: 'screenshot_med_2x' | 'screenshot_med' = 'screenshot_med_2x',
  ): GameImage[] {
    if (!images?.length) return []

    return images
      .filter((img) => img.image_id)
      .slice(0, limit)
      .map((img) => ({
        url: this.buildGameImageUrl(img.image_id, fullSize)!,
        thumbUrl: this.buildGameImageUrl(img.image_id, thumbSize)!,
        width: img.width ?? 1920,
        height: img.height ?? 1080,
      }))
  }

  private mapVideos(videos: IgdbVideoRaw[] | undefined): GameVideo[] {
    if (!videos?.length) return []

    return videos
      .filter((v) => v.video_id)
      .slice(0, this.VIDEO_LIMIT)
      .map((v, index) => ({
        id: String(v.id ?? v.video_id ?? index),
        key: v.video_id!,
        name: v.name?.trim() || 'Trailer',
      }))
  }

  private mapRelated(
    items: IgdbRelatedGameRaw[] | undefined,
    limit = this.RELATED_LIMIT,
  ): GameRelatedItem[] {
    if (!items?.length) return []

    return items
      .filter((item) => item.id != null && item.name)
      .slice(0, limit)
      .map((item) => ({
        id: String(item.id),
        title: item.name!,
        year: this.yearFromUnix(item.first_release_date),
        coverUrl: this.buildGameImageUrl(item.cover?.image_id, 'cover_big'),
        rating: this.mapDetailRating(item.total_rating),
      }))
  }

  private mapParent(parent: IgdbRelatedGameRaw | undefined): GameRelatedItem | null {
    if (!parent?.id || !parent.name) return null

    return {
      id: String(parent.id),
      title: parent.name,
      year: this.yearFromUnix(parent.first_release_date),
      coverUrl: this.buildGameImageUrl(parent.cover?.image_id, 'cover_big'),
      rating: this.mapDetailRating(parent.total_rating),
    }
  }

  private mapCompanies(involved: IgdbInvolvedCompanyRaw[] | undefined): GameCompany[] {
    if (!involved?.length) return []

    const byId = new Map<string, GameCompany>()

    for (const row of involved) {
      const company = row.company
      if (!company?.id || !company.name) continue

      const companyId = String(company.id)
      const roles: GameCompanyRole[] = []
      if (row.developer) roles.push('developer')
      if (row.publisher) roles.push('publisher')
      if (row.supporting) roles.push('supporting')
      if (row.porting) roles.push('porting')
      if (roles.length === 0) continue

      const existing = byId.get(companyId)
      if (existing) {
        for (const role of roles) {
          if (!existing.roles.includes(role)) existing.roles.push(role)
        }
        continue
      }

      byId.set(companyId, {
        id: companyId,
        name: company.name,
        logoUrl: this.buildGameImageUrl(company.logo?.image_id, 'logo_med'),
        roles,
      })
    }

    const roleOrder: GameCompanyRole[] = ['developer', 'publisher', 'supporting', 'porting']

    return [...byId.values()].sort((a, b) => {
      const aRank = Math.min(...a.roles.map((r) => roleOrder.indexOf(r)))
      const bRank = Math.min(...b.roles.map((r) => roleOrder.indexOf(r)))
      return aRank - bRank || a.name.localeCompare(b.name)
    })
  }

  private mapWebsites(websites: IgdbWebsiteRaw[] | undefined): GameWebsite[] {
    if (!websites?.length) return []

    const seen = new Set<string>()
    const result: GameWebsite[] = []

    for (const site of websites) {
      const url = site.url?.trim()
      if (!url) continue

      let normalized = url
      if (!/^https?:\/\//i.test(normalized)) {
        normalized = `https://${normalized}`
      }

      let parsed: URL
      try {
        parsed = new URL(normalized)
      } catch {
        continue
      }

      if (seen.has(parsed.href)) continue
      seen.add(parsed.href)

      const mapped = site.category != null ? this.WEBSITE_CATEGORY_MAP[site.category] : undefined
      const host = parsed.hostname.replace(/^www\./, '')

      result.push({
        label: mapped?.label ?? host,
        url: parsed.href,
        kind: mapped?.kind ?? 'other',
      })
    }

    return result.sort(
      (a, b) => this.WEBSITE_PRIORITY.indexOf(a.kind) - this.WEBSITE_PRIORITY.indexOf(b.kind),
    )
  }

  private mapAgeRatings(ratings: IgdbAgeRatingRaw[] | undefined): string[] {
    if (!ratings?.length) return []

    const labels: string[] = []
    const seen = new Set<string>()

    for (const rating of ratings) {
      const org = rating.organization?.name?.trim()
      const value = rating.rating_category?.rating?.trim()
      if (!value) continue

      const label = org ? `${org} ${value}` : value
      if (seen.has(label)) continue
      seen.add(label)
      labels.push(label)
    }

    const priority = (label: string) => {
      const lower = label.toLowerCase()
      if (lower.includes('esrb')) return 0
      if (lower.includes('pegi')) return 1
      return 2
    }

    return labels.sort((a, b) => priority(a) - priority(b)).slice(0, 4)
  }

  private mapLanguages(supports: IgdbLanguageSupportRaw[] | undefined): string[] {
    if (!supports?.length) return []

    const seen = new Set<string>()
    const result: string[] = []

    for (const row of supports) {
      const name = row.language?.name?.trim()
      if (!name || seen.has(name)) continue
      seen.add(name)
      result.push(name)
      if (result.length >= this.LANGUAGE_LIMIT) break
    }

    return result
  }

  private pickAlternativeName(title: string, alts?: IgdbAltNameRaw[]) {
    const normalized = title.trim().toLowerCase()

    for (const alt of alts ?? []) {
      const name = alt.name?.trim()
      if (!name) continue
      if (name.toLowerCase() === normalized) continue
      return name
    }

    return ''
  }

  private mapGameDetail(raw: IgdbGameRaw): GameDetail {
    const screenshots = this.mapImages(raw.screenshots, this.IMAGE_LIMIT)
    const artworks = this.mapImages(raw.artworks, this.IMAGE_LIMIT)
    const companies = this.mapCompanies(raw.involved_companies)

    const developers = companies.filter((c) => c.roles.includes('developer')).map((c) => c.name)
    const publishers = companies.filter((c) => c.roles.includes('publisher')).map((c) => c.name)

    const heroImageUrl =
      artworks.at(0)?.url ??
      screenshots.at(0)?.url ??
      this.buildGameImageUrl(raw.cover?.image_id, '1080p')

    return {
      id: String(raw.id),
      title: raw.name,
      alternativeName: this.pickAlternativeName(raw.name, raw.alternative_names),
      summary: raw.summary?.trim() ?? '',
      storyline: raw.storyline?.trim() ?? '',
      releaseDate: this.isoFromUnix(raw.first_release_date),
      year: this.yearFromUnix(raw.first_release_date),
      igdbRating: this.mapDetailRating(raw.total_rating),
      igdbRatingCount: raw.total_rating_count ?? 0,
      coverUrl: this.buildGameImageUrl(raw.cover?.image_id, 'cover_big_2x'),
      heroImageUrl,
      genres: this.namesOf(raw.genres),
      themes: this.namesOf(raw.themes),
      gameModes: this.namesOf(raw.game_modes),
      playerPerspectives: this.namesOf(raw.player_perspectives),
      platforms: (raw.platforms ?? [])
        .filter((p) => p.name)
        .map((p) => ({
          name: p.name!,
          abbreviation: p.abbreviation?.trim() || p.name!,
        })),
      engines: this.namesOf(raw.game_engines),
      ageRatings: this.mapAgeRatings(raw.age_ratings),
      languages: this.mapLanguages(raw.language_supports),
      developers,
      publishers,
      companies,
      websites: this.mapWebsites(raw.websites),
      screenshots,
      artworks,
      videos: this.mapVideos(raw.videos),
      parentGame: this.mapParent(raw.parent_game),
      dlcs: this.mapRelated(raw.dlcs),
      expansions: this.mapRelated(raw.expansions),
      standaloneExpansions: this.mapRelated(raw.standalone_expansions),
      remakes: this.mapRelated(raw.remakes),
      remasters: this.mapRelated(raw.remasters),
      ports: this.mapRelated(raw.ports),
      collections: this.namesOf(raw.collections),
      franchises: this.namesOf(raw.franchises),
      similar: this.mapRelated(raw.similar_games, this.SIMILAR_LIMIT),
    }
  }
}
