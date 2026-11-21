import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import ky, { HTTPError } from 'ky'
import { EnvConfig } from '~/app/config/env.config'
import { RedisService } from '~/infrastructure/redis/redis.service'

const SPOTIFY_ACCOUNTS_URL = 'https://accounts.spotify.com/api/token'
const SPOTIFY_API_URL = 'https://api.spotify.com/v1'
const REDIS_TOKEN_KEY = 'spotify:access_token'
const TOKEN_EXPIRY_BUFFER_MS = 60_000

const GET_MAX_ATTEMPTS = 3
const RATE_LIMIT_MAX_WAIT_MS = 5_000
const RETRY_DELAY_MS = 500

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

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const readRetryAfterMs = (response?: Response): number => {
  const seconds = Number(response?.headers.get('retry-after'))
  if (!Number.isFinite(seconds) || seconds < 0) return RETRY_DELAY_MS

  return Math.min(seconds * 1000, RATE_LIMIT_MAX_WAIT_MS)
}

@Injectable()
export class SpotifyClientService {
  private cachedToken: { value: string; expiresAtMs: number } | null = null

  constructor(
    private readonly config: ConfigService<EnvConfig, true>,
    private readonly redis: RedisService,
  ) {}

  async get<T>(path: string): Promise<T> {
    let lastError: unknown
    let tokenRefreshed = false

    for (let attempt = 1; attempt <= GET_MAX_ATTEMPTS; attempt += 1) {
      const token = await this.getAccessToken()

      try {
        return await ky(`${SPOTIFY_API_URL}${path}`, {
          headers: { Authorization: `Bearer ${token}` },
          retry: { limit: 0 },
        }).json<T>()
      } catch (error) {
        lastError = error

        if (error instanceof HTTPError) {
          const status = error.response.status

          if (status === 400 || status === 404) {
            throw new NotFoundException('Resource not found')
          }

          if (status === 401 && !tokenRefreshed) {
            tokenRefreshed = true
            await this.invalidateToken()
            continue
          }

          if (status === 429) {
            await delay(readRetryAfterMs(error.response))
            continue
          }
        }

        if (attempt < GET_MAX_ATTEMPTS) {
          await delay(RETRY_DELAY_MS)
        }
      }
    }

    if (lastError instanceof HTTPError) {
      throw new InternalServerErrorException(`Spotify API error: ${lastError.message}`)
    }

    throw new ServiceUnavailableException('Spotify API is temporarily unavailable')
  }

  private async invalidateToken(): Promise<void> {
    this.cachedToken = null

    try {
      await this.redis.del(REDIS_TOKEN_KEY)
    } catch {
      // ignore
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

    try {
      await this.redis.set(REDIS_TOKEN_KEY, JSON.stringify(token), 'EX', ttlSeconds)
    } catch {
      // ignore
    }

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

    let lastError: unknown

    for (let attempt = 0; attempt < 2; attempt += 1) {
      try {
        const response = await ky
          .post(SPOTIFY_ACCOUNTS_URL, {
            headers: {
              Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: 'grant_type=client_credentials',
            retry: { limit: 0 },
          })
          .json<SpotifyTokenResponse>()

        return {
          value: response.access_token,
          expiresAtMs: Date.now() + response.expires_in * 1000 - TOKEN_EXPIRY_BUFFER_MS,
        }
      } catch (error) {
        lastError = error

        if (error instanceof HTTPError && error.response.status < 500) {
          break
        }

        if (attempt === 0) {
          await delay(RETRY_DELAY_MS)
        }
      }
    }

    if (lastError instanceof HTTPError) {
      throw new InternalServerErrorException(`Spotify auth error: ${lastError.message}`)
    }

    throw new ServiceUnavailableException('Spotify API is temporarily unavailable')
  }
}

export const pickSpotifyImage = (images: SpotifyImage[] | null | undefined): string | null =>
  images?.[0]?.url ?? null
