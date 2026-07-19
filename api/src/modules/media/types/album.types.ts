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
