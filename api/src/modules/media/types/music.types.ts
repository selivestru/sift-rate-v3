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

export interface DeezerCoverFields {
  cover_xl?: string | null
  cover_big?: string | null
  cover_medium?: string | null
  cover_small?: string | null
  cover?: string | null
}

export interface DeezerContributorRaw {
  id: number
  name: string
  picture_medium: string | null
  role: string
}

export interface DeezerTopTrackRaw {
  id: number
  title: string
  duration: number
  artist?: { name?: string }
  album?: DeezerCoverFields
}

export interface DeezerArtistAlbumRaw {
  id: number
  title: string
  cover?: string | null
  cover_small?: string | null
  cover_medium?: string | null
  cover_big?: string | null
  cover_xl?: string | null
  release_date?: string
  record_type?: string
}

export interface DeezerListResponse<T> {
  data?: T[]
}
