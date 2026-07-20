import type {
  DeezerContributorRaw,
  DeezerCoverFields,
  MusicAlbumRailItem,
  MusicContributor,
  MusicTrackRailItem,
} from './music.types'

export interface TrackSearchResult {
  data: TrackSearchRaw[]
  total?: number
}

export interface TrackSearchRaw {
  id: number
  title: string
  duration: number
  rank?: number | null
  artist?: { name?: string }
  album?: { title?: string; cover_medium?: string | null }
}

export interface TrackSearchItem {
  id: string
  title: string
  artist: string
  albumTitle: string
  coverUrl: string | null
  duration: number
  rank: number | null
}

export interface TrackDetail {
  id: string
  title: string
  artistName: string
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

export interface DeezerTrackRaw {
  id: number
  title: string
  duration: number
  release_date: string
  explicit_lyrics: boolean
  contributors: DeezerContributorRaw[]
  artist: { id: number; name: string }
  album: {
    id: number
    title: string
  } & DeezerCoverFields
}
