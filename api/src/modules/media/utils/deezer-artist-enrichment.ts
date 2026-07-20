import {
  DeezerArtistAlbumRaw,
  DeezerListResponse,
  DeezerTopTrackRaw,
  MusicAlbumRailItem,
  MusicTrackRailItem,
} from '../types/music.types'
import { deezerGet, pickDeezerCoverUrl } from './deezer'

const TOP_LIMIT = 12
const ALBUMS_LIMIT = 12

export const fetchArtistTopTracks = async (
  artistId: string,
  excludeTrackId?: string,
): Promise<MusicTrackRailItem[]> => {
  try {
    const response = await deezerGet<DeezerListResponse<DeezerTopTrackRaw>>(
      `/artist/${artistId}/top?limit=${TOP_LIMIT}`,
    )

    const items: MusicTrackRailItem[] = []
    const seen = new Set<string>()
    if (excludeTrackId) seen.add(excludeTrackId)

    for (const track of response.data ?? []) {
      const id = String(track.id)
      if (seen.has(id)) continue
      seen.add(id)
      items.push({
        id,
        title: track.title,
        artistName: track.artist?.name ?? '',
        coverUrl: pickDeezerCoverUrl(track.album, 500),
        duration: track.duration,
      })
      if (items.length >= TOP_LIMIT) break
    }

    return items
  } catch {
    return []
  }
}

export const fetchArtistAlbums = async (
  artistId: string,
  excludeAlbumId?: string,
): Promise<MusicAlbumRailItem[]> => {
  try {
    const response = await deezerGet<DeezerListResponse<DeezerArtistAlbumRaw>>(
      `/artist/${artistId}/albums?limit=${ALBUMS_LIMIT}`,
    )

    const items: MusicAlbumRailItem[] = []
    const seen = new Set<string>()
    if (excludeAlbumId) seen.add(excludeAlbumId)

    for (const album of response.data ?? []) {
      const id = String(album.id)
      if (seen.has(id)) continue
      seen.add(id)
      items.push({
        id,
        title: album.title,
        coverUrl: pickDeezerCoverUrl(album, 500),
        releaseDate: album.release_date ?? '',
      })
      if (items.length >= ALBUMS_LIMIT) break
    }

    return items
  } catch {
    return []
  }
}

export const fetchArtistEnrichment = async (
  artistId: string | null | undefined,
  options?: { excludeTrackId?: string; excludeAlbumId?: string },
) => {
  if (!artistId) {
    return {
      topTracks: [] as MusicTrackRailItem[],
      artistAlbums: [] as MusicAlbumRailItem[],
    }
  }

  const [topTracks, artistAlbums] = await Promise.all([
    fetchArtistTopTracks(artistId, options?.excludeTrackId),
    fetchArtistAlbums(artistId, options?.excludeAlbumId),
  ])

  return { topTracks, artistAlbums }
}
