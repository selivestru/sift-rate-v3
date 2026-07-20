export interface MusicContributor {
  id: string
  name: string
  pictureUrl: string | null
  role: string
}

export interface MusicTrackRailItem {
  id: string
  title: string
  artistName: string
  coverUrl: string | null
  duration: number
}

export interface MusicAlbumRailItem {
  id: string
  title: string
  coverUrl: string | null
  releaseDate: string
}
