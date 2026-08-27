import type { SpotifyImage } from '../services/spotify-client.service'
import type { MusicAlbumRailItem, MusicContributor, MusicTrackRailItem } from './music.types'

export interface TrackSearchResult {
  tracks?: {
    items?: SpotifyTrackRaw[]
    total?: number
  }
}

export interface SpotifyArtistRef {
  id: string
  name: string
}

export interface SpotifyExternalUrls {
  spotify?: string
}

export interface SpotifyTrackRaw {
  id: string
  name: string
  duration_ms: number
  explicit: boolean
  popularity: number
  preview_url: string | null
  external_urls?: SpotifyExternalUrls
  artists?: SpotifyArtistRef[]
  album?: {
    id: string
    name: string
    images?: SpotifyImage[]
    release_date?: string
  }
}

export interface TrackSearchItem {
  id: string
  title: string
  artist: string
  albumTitle: string
  coverUrl: string | null
  duration: number
}

export interface TrackDetail {
  id: string
  title: string
  artistName: string
  spotifyUrl: string | null
  album: {
    id: string
    title: string
  } | null
  coverUrl: string | null
  releaseDate: string
  duration: number
  explicit: boolean
  contributors: MusicContributor[]
  topTracks: MusicTrackRailItem[]
  artistAlbums: MusicAlbumRailItem[]
}
