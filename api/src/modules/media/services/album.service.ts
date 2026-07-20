import { Injectable } from '@nestjs/common'

import { SearchMediaQueryDto } from '../dto/search-media.query'
import {
  AlbumDetail,
  AlbumSearchItem,
  AlbumSearchResult,
  AlbumTrack,
  DeezerAlbumRaw,
  DeezerAlbumTrackRaw,
} from '../types/album.types'
import { MediaSearchResponse } from '../types/media.types'
import { deezerGet, pickDeezerCoverUrl } from '../utils/deezer'
import { fetchArtistEnrichment } from '../utils/deezer-artist-enrichment'
import { buildSearchCacheKey, getSearchCache, setSearchCache } from '../utils/search-cache'
import ky from 'ky'
import { RedisService } from '~/infrastructure/redis/redis.service'

@Injectable()
export class AlbumService {
  private readonly DEEZER_API_URL = 'https://api.deezer.com'
  private readonly ALBUM_CACHE_TTL_SECONDS = 6 * 3600

  constructor(private readonly redisService: RedisService) {}

  async search({ q, page }: SearchMediaQueryDto): Promise<MediaSearchResponse<AlbumSearchItem>> {
    const pageNum = +page
    const cacheKey = buildSearchCacheKey('album', q, pageNum)
    const cached = await getSearchCache<MediaSearchResponse<AlbumSearchItem>>(
      this.redisService,
      cacheKey,
      { invalidateAcrossMusicRelease: true },
    )
    if (cached) return cached

    const url = new URL(this.DEEZER_API_URL + '/search/album')

    url.searchParams.set('q', q)
    url.searchParams.set('index', String((pageNum - 1) * 10)) // TODO: fix pagination
    url.searchParams.set('limit', String(10)) // TODO: fix pagination

    const response = await ky<AlbumSearchResult>(url.toString()).json()

    const totalResults = response.total ?? 0
    const totalPages = Math.max(1, Math.ceil(totalResults / 10)) // TODO: handle pagination

    const result: MediaSearchResponse<AlbumSearchItem> = {
      results: response.data.map((album) => ({
        id: String(album.id),
        title: album.title,
        artist: album.artist?.name ?? 'Unknown Artist',
        coverUrl: album.cover_big ?? null,
        nbTracks: album.nb_tracks ?? null,
      })),
      totalResults,
      totalPages: Math.min(totalPages, 10),
    }

    await setSearchCache(this.redisService, cacheKey, result)
    return result
  }

  async getById(id: string): Promise<AlbumDetail> {
    const cacheKey = `album:${id}`

    try {
      const cached = await this.redisService.get(cacheKey)
      if (cached) {
        return JSON.parse(cached) as AlbumDetail
      }
    } catch {
      void 0
    }

    const album = await deezerGet<DeezerAlbumRaw>(`/album/${id}`)
    const artistId = String(album.artist.id)
    const tracks = this.mapTracks(album.tracks?.data)
    const trackCount = album.nb_tracks ?? tracks.length

    const enrichment = await fetchArtistEnrichment(artistId, {
      excludeAlbumId: String(album.id),
    })

    const result: AlbumDetail = {
      id: String(album.id),
      title: album.title,
      artistName: album.artist.name,
      coverUrl: pickDeezerCoverUrl(album, 1000),
      genres: album.genres?.data.map((genre) => genre.name) ?? [],
      label: album.label ?? '',
      releaseDate: album.release_date,
      explicit: album.explicit_lyrics,
      trackCount,
      contributors:
        album.contributors?.map((contributor) => ({
          id: String(contributor.id),
          name: contributor.name,
          pictureUrl: contributor.picture_medium,
          role: contributor.role,
        })) ?? [],
      tracks,
      topTracks: enrichment.topTracks,
      artistAlbums: enrichment.artistAlbums,
    }

    try {
      await this.redisService.set(
        cacheKey,
        JSON.stringify(result),
        'EX',
        this.ALBUM_CACHE_TTL_SECONDS,
      )
    } catch {
      void 0
    }

    return result
  }

  private mapTracks(tracks: DeezerAlbumTrackRaw[] | undefined): AlbumTrack[] {
    return (tracks ?? []).map((track) => ({
      id: String(track.id),
      title: track.title,
      duration: track.duration,
      explicit: Boolean(track.explicit_lyrics),
      trackPosition: track.track_position ?? null,
    }))
  }
}
