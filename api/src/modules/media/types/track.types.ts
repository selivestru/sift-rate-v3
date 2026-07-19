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
