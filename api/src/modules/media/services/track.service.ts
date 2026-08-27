import { Injectable } from '@nestjs/common'

import { SearchMediaQueryDto } from '../dto/search-media.query'
import { MediaSearchResponse } from '../types/media.types'
import type {
  SpotifyTrackRaw,
  TrackDetail,
  TrackSearchItem,
  TrackSearchResult,
} from '../types/track.types'
import {
  buildDetailCacheKey,
  buildSearchCacheKey,
  resolveMusicDetailTtlSeconds,
  SEARCH_CACHE_TTL_SECONDS,
} from '../utils/media-cache-policy'
import { fetchArtistEnrichment } from '../utils/spotify-artist-enrichment'
import { fetchArtistPictures } from '../utils/spotify-artist-pictures'
import { MediaCacheService } from './media-cache.service'
import { pickSpotifyImage, SpotifyClientService } from './spotify-client.service'

const SEARCH_PAGE_SIZE = 10
const SEARCH_MAX_PAGES = 10

@Injectable()
export class TrackService {
  constructor(
    private readonly spotify: SpotifyClientService,
    private readonly cache: MediaCacheService,
  ) {}

  async search({ q, page }: SearchMediaQueryDto): Promise<MediaSearchResponse<TrackSearchItem>> {
    const pageNum = +page
    const cacheKey = buildSearchCacheKey('track', q, pageNum)
    const cached = await this.cache.get<MediaSearchResponse<TrackSearchItem>>(cacheKey, {
      invalidateAcrossMusicRelease: true,
    })
    if (cached) return cached

    const response = await this.spotify.get<TrackSearchResult>(
      `/search?type=track&q=${encodeURIComponent(q)}&limit=${SEARCH_PAGE_SIZE}&offset=${
        (pageNum - 1) * SEARCH_PAGE_SIZE
      }`,
    )

    const totalResults = response.tracks?.total ?? 0
    const totalPages = Math.max(1, Math.ceil(totalResults / SEARCH_PAGE_SIZE))

    const result: MediaSearchResponse<TrackSearchItem> = {
      results: (response.tracks?.items ?? []).map((track) => ({
        id: track.id,
        title: track.name,
        artist: track.artists?.[0]?.name ?? 'Unknown Artist',
        albumTitle: track.album?.name ?? 'Unknown Album',
        coverUrl: pickSpotifyImage(track.album?.images),
        duration: Math.round(track.duration_ms / 1000),
      })),
      totalResults,
      totalPages: Math.min(totalPages, SEARCH_MAX_PAGES),
    }

    await this.cache.set(cacheKey, result, SEARCH_CACHE_TTL_SECONDS)
    return result
  }

  async getById(id: string): Promise<TrackDetail> {
    const cacheKey = buildDetailCacheKey('track', id)

    const cached = await this.cache.get<TrackDetail>(cacheKey, {
      invalidateAcrossMusicRelease: true,
    })
    if (cached) return cached

    const track = await this.spotify.get<SpotifyTrackRaw>(`/tracks/${id}`)
    const primaryArtist = track.artists?.[0]
    const albumId = track.album?.id ?? ''

    const [enrichment, pictures] = await Promise.all([
      fetchArtistEnrichment(
        this.spotify,
        { id: primaryArtist?.id, name: primaryArtist?.name },
        {
          excludeTrackId: track.id,
          excludeAlbumId: albumId,
        },
      ),
      fetchArtistPictures(
        this.spotify,
        this.cache,
        (track.artists ?? []).map((artist) => artist.id),
      ),
    ])

    const contributors = (track.artists ?? []).map((artist) => ({
      id: artist.id,
      name: artist.name,
      pictureUrl: pictures.get(artist.id) ?? null,
      role: 'Artist',
    }))

    const result: TrackDetail = {
      id: track.id,
      title: track.name,
      artistName: primaryArtist?.name ?? 'Unknown Artist',
      spotifyUrl: track.external_urls?.spotify ?? null,
      album: track.album ? { id: track.album.id, title: track.album.name } : null,
      coverUrl: pickSpotifyImage(track.album?.images),
      releaseDate: track.album?.release_date ?? '',
      duration: Math.round(track.duration_ms / 1000),
      explicit: track.explicit,
      contributors,
      topTracks: enrichment.topTracks,
      artistAlbums: enrichment.artistAlbums,
    }

    await this.cache.set(cacheKey, result, resolveMusicDetailTtlSeconds(result.releaseDate))

    return result
  }
}
