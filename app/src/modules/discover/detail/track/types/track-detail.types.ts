import type { MusicAlbumRailItem, MusicContributor, MusicTrackRailItem } from '../../shared'

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
