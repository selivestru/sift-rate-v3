import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import ky, { HTTPError } from 'ky'
import { EnvConfig } from '~/app/config/env.config'
import { RedisService } from '~/infrastructure/redis/redis.service'

const SPOTIFY_ACCOUNTS_URL = 'https://accounts.spotify.com/api/token'
const SPOTIFY_API_URL = 'https://api.spotify.com/v1'
const REDIS_TOKEN_KEY = 'spotify:access_token'
const TOKEN_EXPIRY_BUFFER_MS = 60_000

export interface SpotifyImage {
  url: string
  width: number | null
  height: number | null
}

interface SpotifyTokenResponse {
  access_token: string
  token_type: string
  expires_in: number
}

@Injectable()
export class SpotifyClientService {
  private cachedToken: { value: string; expiresAtMs: number } | null = null

  constructor(
    private readonly config: ConfigService<EnvConfig, true>,
    private readonly redis: RedisService,
  ) {}

  async get<T>(path: string): Promise<T> {
    const token = await this.getAccessToken()

    try {
      return await ky(`${SPOTIFY_API_URL}${path}`, {
        headers: { Authorization: `Bearer ${token}` },
      }).json<T>()
    } catch (error) {
      if (error instanceof HTTPError) {
        if (error.response.status === 400 || error.response.status === 404) {
          throw new NotFoundException('Resource not found')
        }

        throw new InternalServerErrorException(`Spotify API error: ${error.message}`)
      }

      throw error
    }
  }

  private async getAccessToken(): Promise<string> {
    const now = Date.now()

    if (this.cachedToken && this.cachedToken.expiresAtMs > now) {
      return this.cachedToken.value
    }

    const cached = await this.getCachedToken(now)
    if (cached) return cached

    const token = await this.fetchAccessToken()
    this.cachedToken = token

    const ttlSeconds = Math.max(1, Math.floor((token.expiresAtMs - now) / 1000))
    await this.redis.set(REDIS_TOKEN_KEY, JSON.stringify(token), 'EX', ttlSeconds)

    return token.value
  }

  private async getCachedToken(now: number): Promise<string | null> {
    try {
      const raw = await this.redis.get(REDIS_TOKEN_KEY)
      if (!raw) return null

      const parsed = JSON.parse(raw) as { value: string; expiresAtMs: number }
      if (parsed.expiresAtMs > now) {
        this.cachedToken = parsed
        return parsed.value
      }

      return null
    } catch {
      return null
    }
  }

  private async fetchAccessToken(): Promise<{ value: string; expiresAtMs: number }> {
    const clientId = this.config.get('SPOTIFY_CLIENT_ID', { infer: true })
    const clientSecret = this.config.get('SPOTIFY_CLIENT_SECRET', { infer: true })

    try {
      const response = await ky
        .post(SPOTIFY_ACCOUNTS_URL, {
          headers: {
            Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: 'grant_type=client_credentials',
        })
        .json<SpotifyTokenResponse>()

      return {
        value: response.access_token,
        expiresAtMs: Date.now() + response.expires_in * 1000 - TOKEN_EXPIRY_BUFFER_MS,
      }
    } catch (error) {
      if (error instanceof HTTPError) {
        throw new InternalServerErrorException(`Spotify auth error: ${error.message}`)
      }

      throw error
    }
  }
}

export const pickSpotifyImage = (images: SpotifyImage[] | null | undefined): string | null =>
  images?.[0]?.url ?? null
