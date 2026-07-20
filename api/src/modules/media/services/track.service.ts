import { Injectable } from '@nestjs/common'

import { SearchMediaQueryDto } from '../dto/search-media.query'
import { MediaSearchResponse } from '../types/media.types'
import {
  DeezerTrackRaw,
  TrackDetail,
  TrackSearchItem,
  TrackSearchResult,
} from '../types/track.types'
import { deezerGet, pickDeezerCoverUrl } from '../utils/deezer'
import { fetchArtistEnrichment } from '../utils/deezer-artist-enrichment'
import { buildSearchCacheKey, getSearchCache, setSearchCache } from '../utils/search-cache'
import ky from 'ky'
import { RedisService } from '~/infrastructure/redis/redis.service'

@Injectable()
export class TrackService {
  private readonly DEEZER_API_URL = 'https://api.deezer.com'
  private readonly TRACK_CACHE_TTL_SECONDS = 6 * 3600

  constructor(private readonly redisService: RedisService) {}

  async search({ q, page }: SearchMediaQueryDto): Promise<MediaSearchResponse<TrackSearchItem>> {
    const pageNum = +page
    const cacheKey = buildSearchCacheKey('track', q, pageNum)
    const cached = await getSearchCache<MediaSearchResponse<TrackSearchItem>>(
      this.redisService,
      cacheKey,
      { invalidateAcrossMusicRelease: true },
    )
    if (cached) return cached

    const url = new URL(this.DEEZER_API_URL + '/search/track')

    url.searchParams.set('q', q)
    url.searchParams.set('index', String((pageNum - 1) * 10)) // TODO: fix pagination
    url.searchParams.set('limit', String(10)) // TODO: fix pagination

    const response = await ky<TrackSearchResult>(url.toString()).json()

    const totalResults = response.total ?? 0
    const totalPages = Math.max(1, Math.ceil(totalResults / 10)) // TODO: fix pagination

    const result: MediaSearchResponse<TrackSearchItem> = {
      results: response.data.map((track) => ({
        id: String(track.id),
        title: track.title,
        artist: track.artist?.name ?? 'Unknown Artist',
        albumTitle: track.album?.title ?? 'Unknown Album',
        coverUrl: track.album?.cover_medium ?? null,
        duration: track.duration,
        rank: track.rank ?? null,
      })),
      totalResults,
      totalPages: Math.min(totalPages, 10),
    }

    await setSearchCache(this.redisService, cacheKey, result)
    return result
  }

  async getById(id: string): Promise<TrackDetail> {
    const cacheKey = `track:${id}`

    try {
      const cached = await this.redisService.get(cacheKey)
      if (cached) {
        return JSON.parse(cached) as TrackDetail
      }
    } catch {
      void 0
    }

    const track = await deezerGet<DeezerTrackRaw>(`/track/${id}`)
    const artistId = String(track.artist.id)
    const albumId = String(track.album.id)

    const enrichment = await fetchArtistEnrichment(artistId, {
      excludeTrackId: String(track.id),
      excludeAlbumId: albumId,
    })

    const result: TrackDetail = {
      id: String(track.id),
      title: track.title,
      artistName: track.artist.name,
      album: {
        id: albumId,
        title: track.album.title,
      },
      coverUrl: pickDeezerCoverUrl(track.album, 1000),
      releaseDate: track.release_date || '',
      duration: track.duration,
      explicit: track.explicit_lyrics,
      contributors: track.contributors.map((contributor) => ({
        id: String(contributor.id),
        name: contributor.name,
        pictureUrl: contributor.picture_medium,
        role: contributor.role,
      })),
      topTracks: enrichment.topTracks,
      artistAlbums: enrichment.artistAlbums,
    }

    try {
      await this.redisService.set(
        cacheKey,
        JSON.stringify(result),
        'EX',
        this.TRACK_CACHE_TTL_SECONDS,
      )
    } catch {
      void 0
    }

    return result
  }
}
