import type { SpotifyImage } from '../services/spotify-client.service'
import type { MusicAlbumRailItem, MusicContributor, MusicTrackRailItem } from './music.types'

export interface AlbumSearchResult {
  albums?: {
    items?: SpotifyAlbumRaw[]
    total?: number
  }
}

export interface SpotifyAlbumRaw {
  id: string
  name: string
  album_type: 'album' | 'single' | 'compilation'
  total_tracks: number
  label: string | null
  release_date: string
  popularity: number
  images?: SpotifyImage[]
  artists?: Array<{ id: string; name: string }>
  tracks?: {
    items?: SpotifyAlbumTrackRaw[]
    total?: number
    limit?: number
    next?: string | null
  }
}

export interface SpotifyAlbumTrackRaw {
  id: string
  name: string
  duration_ms: number
  explicit: boolean
  track_number: number | null
}

export interface AlbumSearchItem {
  id: string
  title: string
  artist: string
  coverUrl: string | null
  nbTracks: number | null
}

export interface AlbumTrack {
  id: string
  title: string
  duration: number
  explicit: boolean
  trackPosition: number | null
}

export interface AlbumDetail {
  id: string
  title: string
  artistName: string
  coverUrl: string | null
  genres: string[]
  label: string
  releaseDate: string
  explicit: boolean
  trackCount: number
  contributors: MusicContributor[]
  tracks: AlbumTrack[]
  topTracks: MusicTrackRailItem[]
  artistAlbums: MusicAlbumRailItem[]
}
