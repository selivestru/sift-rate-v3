import type { MediaImage, MediaVideo } from '../../shared'

export type GameImage = MediaImage
export type GameVideo = MediaVideo

export interface GameRelatedItem {
  id: string
  title: string
  year: string
  coverUrl: string | null
  rating: number
}

export interface GamePlatform {
  name: string
  abbreviation: string
}

export type GameCompanyRole = 'developer' | 'publisher' | 'supporting' | 'porting'

export interface GameCompany {
  id: string
  name: string
  logoUrl: string | null
  roles: GameCompanyRole[]
}

export type GameWebsiteKind =
  | 'official'
  | 'steam'
  | 'epic'
  | 'gog'
  | 'itch'
  | 'youtube'
  | 'twitch'
  | 'store'
  | 'other'

export interface GameWebsite {
  label: string
  url: string
  kind: GameWebsiteKind
}

export interface GameDetail {
  id: string
  title: string
  alternativeName: string
  summary: string
  storyline: string
  releaseDate: string
  year: string
  igdbRating: number
  igdbRatingCount: number
  coverUrl: string | null
  heroImageUrl: string | null
  genres: string[]
  themes: string[]
  gameModes: string[]
  playerPerspectives: string[]
  platforms: GamePlatform[]
  engines: string[]
  ageRatings: string[]
  languages: string[]
  developers: string[]
  publishers: string[]
  companies: GameCompany[]
  websites: GameWebsite[]
  screenshots: GameImage[]
  artworks: GameImage[]
  videos: GameVideo[]
  parentGame: GameRelatedItem | null
  dlcs: GameRelatedItem[]
  expansions: GameRelatedItem[]
  standaloneExpansions: GameRelatedItem[]
  remakes: GameRelatedItem[]
  remasters: GameRelatedItem[]
  ports: GameRelatedItem[]
  collections: string[]
  franchises: string[]
  similar: GameRelatedItem[]
}
