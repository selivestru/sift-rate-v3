import type { MusicAlbumRailItem, MusicContributor, MusicTrackRailItem } from '../../shared'

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
  spotifyUrl: string | null
}
