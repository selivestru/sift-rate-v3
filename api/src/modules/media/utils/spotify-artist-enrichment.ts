import type { SpotifyImage } from '../services/spotify-client.service'
import { pickSpotifyImage } from '../services/spotify-client.service'
import type { MusicAlbumRailItem, MusicTrackRailItem } from '../types/music.types'
import type { TrackSearchResult as SpotifySearchResponse } from '../types/track.types'

const TOP_LIMIT = 10
const ALBUMS_LIMIT = 10

interface SpotifyPagedItems<T> {
  items?: T[]
}

interface SpotifyArtistAlbumRaw {
  id: string
  name: string
  images?: SpotifyImage[]
  release_date?: string
}

export const fetchArtistEnrichment = async (
  spotify: { get<T>(path: string): Promise<T> },
  artist: { id?: string | null; name?: string | null },
  options?: { excludeTrackId?: string; excludeAlbumId?: string },
): Promise<{ topTracks: MusicTrackRailItem[]; artistAlbums: MusicAlbumRailItem[] }> => {
  const [topTracks, artistAlbums] = await Promise.all([
    fetchArtistTopTracks(spotify, artist.name, options?.excludeTrackId),
    fetchArtistAlbums(spotify, artist.id, options?.excludeAlbumId),
  ])

  return { topTracks, artistAlbums }
}

const fetchArtistTopTracks = async (
  spotify: { get<T>(path: string): Promise<T> },
  artistName: string | null | undefined,
  excludeTrackId?: string,
): Promise<MusicTrackRailItem[]> => {
  if (!artistName?.trim()) return []

  try {
    const response = await spotify.get<SpotifySearchResponse>(
      `/search?type=track&q=${encodeURIComponent(`artist:"${artistName}"`)}&limit=${TOP_LIMIT}`,
    )

    const items: MusicTrackRailItem[] = []
    const seen = new Set<string>()
    if (excludeTrackId) seen.add(excludeTrackId)

    for (const track of response.tracks?.items ?? []) {
      const id = track.id
      if (seen.has(id)) continue
      seen.add(id)
      items.push({
        id,
        title: track.name,
        artistName: track.artists?.[0]?.name ?? '',
        coverUrl: pickSpotifyImage(track.album?.images),
        duration: Math.round(track.duration_ms / 1000),
      })
      if (items.length >= TOP_LIMIT) break
    }

    return items
  } catch {
    return []
  }
}

const fetchArtistAlbums = async (
  spotify: { get<T>(path: string): Promise<T> },
  artistId: string | null | undefined,
  excludeAlbumId?: string,
): Promise<MusicAlbumRailItem[]> => {
  if (!artistId) return []

  try {
    const response = await spotify.get<SpotifyPagedItems<SpotifyArtistAlbumRaw>>(
      `/artists/${artistId}/albums?limit=${ALBUMS_LIMIT}`,
    )

    const items: MusicAlbumRailItem[] = []
    const seen = new Set<string>()
    if (excludeAlbumId) seen.add(excludeAlbumId)

    for (const album of response.items ?? []) {
      const id = album.id
      if (seen.has(id)) continue
      seen.add(id)
      items.push({
        id,
        title: album.name,
        coverUrl: pickSpotifyImage(album.images),
        releaseDate: album.release_date ?? '',
      })
      if (items.length >= ALBUMS_LIMIT) break
    }

    return items
  } catch {
    return []
  }
}
