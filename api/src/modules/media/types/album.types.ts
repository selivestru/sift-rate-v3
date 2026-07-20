import type {
  DeezerContributorRaw,
  MusicAlbumRailItem,
  MusicContributor,
  MusicTrackRailItem,
} from './music.types'

export interface AlbumSearchResult {
  data: AlbumSearchRaw[]
  total?: number
}

export interface AlbumSearchRaw {
  id: number
  title: string
  cover_big: string | null
  nb_tracks?: number | null
  artist?: { name?: string }
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

export interface DeezerAlbumTrackRaw {
  id: number
  title: string
  duration: number
  explicit_lyrics?: boolean
  track_position?: number
}

export interface DeezerAlbumRaw {
  id: number
  title: string
  cover?: string | null
  cover_small?: string | null
  cover_medium?: string | null
  cover_big?: string | null
  cover_xl?: string | null
  label?: string
  release_date: string
  explicit_lyrics: boolean
  nb_tracks?: number
  genres?: {
    data: Array<{ name: string }>
  }
  contributors?: DeezerContributorRaw[]
  artist: {
    id: number
    name: string
  }
  tracks?: {
    data: DeezerAlbumTrackRaw[]
  }
}
