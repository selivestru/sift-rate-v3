import { Injectable } from '@nestjs/common'

import { SearchMediaQueryDto } from '../dto/search-media.query'
import {
  AlbumDetail,
  AlbumSearchItem,
  AlbumSearchResult,
  AlbumTrack,
  SpotifyAlbumRaw,
  SpotifyAlbumTrackRaw,
} from '../types/album.types'
import { MediaSearchResponse } from '../types/media.types'
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
const ALBUM_TRACKS_PAGE_SIZE = 50
const ALBUM_TRACKS_MAX_PAGES = 5

@Injectable()
export class AlbumService {
  constructor(
    private readonly spotify: SpotifyClientService,
    private readonly cache: MediaCacheService,
  ) {}

  async search({ q, page }: SearchMediaQueryDto): Promise<MediaSearchResponse<AlbumSearchItem>> {
    const pageNum = +page
    const cacheKey = buildSearchCacheKey('album', q, pageNum)
    const cached = await this.cache.get<MediaSearchResponse<AlbumSearchItem>>(cacheKey, {
      invalidateAcrossMusicRelease: true,
    })
    if (cached) return cached

    const response = await this.spotify.get<AlbumSearchResult>(
      `/search?type=album&q=${encodeURIComponent(q)}&limit=${SEARCH_PAGE_SIZE}&offset=${
        (pageNum - 1) * SEARCH_PAGE_SIZE
      }`,
    )

    const totalResults = response.albums?.total ?? 0
    const totalPages = Math.max(1, Math.ceil(totalResults / SEARCH_PAGE_SIZE))

    const result: MediaSearchResponse<AlbumSearchItem> = {
      results: (response.albums?.items ?? []).map((album) => ({
        id: album.id,
        title: album.name,
        artist: album.artists?.[0]?.name ?? 'Unknown Artist',
        coverUrl: pickSpotifyImage(album.images),
        nbTracks: album.total_tracks ?? null,
      })),
      totalResults,
      totalPages: Math.min(totalPages, SEARCH_MAX_PAGES),
    }

    await this.cache.set(cacheKey, result, SEARCH_CACHE_TTL_SECONDS)
    return result
  }

  async getById(id: string): Promise<AlbumDetail> {
    const cacheKey = buildDetailCacheKey('album', id)

    const cached = await this.cache.get<AlbumDetail>(cacheKey, {
      invalidateAcrossMusicRelease: true,
    })
    if (cached) return cached

    const album = await this.spotify.get<SpotifyAlbumRaw>(`/albums/${id}`)
    const artistId = album.artists?.[0]?.id
    const tracks = await this.fetchAllTracks(id, album.tracks?.items)
    const trackCount = album.total_tracks ?? tracks.length

    const [enrichment, pictures] = await Promise.all([
      fetchArtistEnrichment(
        this.spotify,
        { id: artistId, name: album.artists?.[0]?.name },
        {
          excludeAlbumId: album.id,
        },
      ),
      fetchArtistPictures(
        this.spotify,
        this.cache,
        (album.artists ?? []).map((artist) => artist.id),
      ),
    ])

    const contributors = (album.artists ?? []).map((artist) => ({
      id: artist.id,
      name: artist.name,
      pictureUrl: pictures.get(artist.id) ?? null,
      role: 'Artist',
    }))

    const result: AlbumDetail = {
      id: album.id,
      title: album.name,
      artistName: album.artists?.[0]?.name ?? 'Unknown Artist',
      coverUrl: pickSpotifyImage(album.images),
      genres: [],
      label: album.label ?? '',
      releaseDate: album.release_date ?? '',
      explicit: false,
      trackCount,
      contributors,
      tracks,
      topTracks: enrichment.topTracks,
      artistAlbums: enrichment.artistAlbums,
    }

    await this.cache.set(cacheKey, result, resolveMusicDetailTtlSeconds(result.releaseDate))

    return result
  }

  private async fetchAllTracks(
    albumId: string,
    firstPageItems: SpotifyAlbumTrackRaw[] | undefined,
  ): Promise<AlbumTrack[]> {
    const rawTracks: SpotifyAlbumTrackRaw[] = [...(firstPageItems ?? [])]

    for (let page = 1; page < ALBUM_TRACKS_MAX_PAGES; page += 1) {
      try {
        const response = await this.spotify.get<{
          items?: SpotifyAlbumTrackRaw[]
        }>(
          `/albums/${albumId}/tracks?limit=${ALBUM_TRACKS_PAGE_SIZE}&offset=${
            page * ALBUM_TRACKS_PAGE_SIZE
          }`,
        )

        if (!response.items || response.items.length === 0) break
        rawTracks.push(...response.items)
      } catch {
        break
      }
    }

    return rawTracks.map((track) => ({
      id: track.id,
      title: track.name,
      duration: Math.round(track.duration_ms / 1000),
      explicit: Boolean(track.explicit),
      trackPosition: track.track_number ?? null,
    }))
  }
}
