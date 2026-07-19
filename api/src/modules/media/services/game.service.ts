import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import { SearchMediaQueryDto } from '../dto/search-media.query'
import {
  GameImageSize,
  GameSearchCountRaw,
  GameSearchItem,
  GameSearchRaw,
  TwitchTokenResponse,
} from '../types/game.types'
import { MediaSearchResponse } from '../types/media.types'
import ky from 'ky'
import { EnvConfig } from '~/app/config/env.config'
import { RedisService } from '~/infrastructure/redis/redis.service'

@Injectable()
export class GameService {
  private readonly IGDB_API_URL = 'https://api.igdb.com/v4'
  private readonly TWITCH_TOKEN_URL = 'https://id.twitch.tv/oauth2/token'
  private readonly REDIS_TOKEN_KEY = 'igdb:access_token'
  private readonly TOKEN_EXPIRY_BUFFER_MS = 60_000

  constructor(
    private readonly configService: ConfigService<EnvConfig>,
    private readonly redisService: RedisService,
  ) {}

  async search({ q, page }: SearchMediaQueryDto): Promise<MediaSearchResponse<GameSearchItem>> {
    const offset = (+page - 1) * 10 // TODO: fix pagination

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

    return {
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
  }

  getById(id: string) {
    return id
  }

  private async getAccessToken() {
    const cached = await this.redisService.get(this.REDIS_TOKEN_KEY)

    if (cached) {
      return cached
    }

    const url = new URL(this.TWITCH_TOKEN_URL)
    url.searchParams.set('client_id', this.configService.getOrThrow<string>('IGDB_CLIENT_ID'))
    url.searchParams.set(
      'client_secret',
      this.configService.getOrThrow<string>('IGDB_CLIENT_SECRET'),
    )
    url.searchParams.set('grant_type', 'client_credentials')

    const response = await ky.post(url.toString()).json<TwitchTokenResponse>()

    const ttlMs = response.expires_in * 1000 - this.TOKEN_EXPIRY_BUFFER_MS

    await this.redisService.set(this.REDIS_TOKEN_KEY, response.access_token, 'PX', ttlMs)

    return response.access_token
  }

  private async igdbRequest<T>(endpoint: string, body: string): Promise<T> {
    const accessToken = await this.getAccessToken()

    return ky
      .post(`${this.IGDB_API_URL}/${endpoint}`, {
        headers: {
          'Client-ID': this.configService.getOrThrow<string>('IGDB_CLIENT_ID'),
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

  private mapRating(totalRating?: number): number | null {
    if (totalRating == null || Number.isNaN(totalRating)) {
      return null
    }

    return Math.round(totalRating) / 10
  }
}
