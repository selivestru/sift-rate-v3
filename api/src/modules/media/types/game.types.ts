export interface GameSearchCountRaw {
  count: number
}

export type GameImageSize =
  | 'cover_big_2x'
  | 'cover_big'
  | 'screenshot_med'
  | 'screenshot_med_2x'
  | 'screenshot_huge'
  | '1080p'
  | 'thumb'
  | 'logo_med'

export interface GameSearchRaw {
  id: number
  name: string
  first_release_date: number
  cover?: { image_id?: string }
  total_rating: number
  genres?: Array<{ name?: string }>
  platforms?: Array<{ abbreviation?: string }>
}

export interface GameSearchItem {
  id: string
  title: string
  year: string
  coverUrl: string | null
  rating: number | null
  genres: string[]
  platforms: string[]
}

export interface TwitchTokenResponse {
  access_token: string
  expires_in: number
  token_type: string
}

export interface GameImage {
  url: string
  thumbUrl: string
  width: number
  height: number
}

export interface GameVideo {
  id: string
  key: string
  name: string
}

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
  'official' | 'steam' | 'epic' | 'gog' | 'itch' | 'youtube' | 'twitch' | 'store' | 'other'

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

export interface IgdbImageRaw {
  image_id?: string
  width?: number
  height?: number
}

export interface IgdbVideoRaw {
  id?: number
  video_id?: string
  name?: string
}

export interface IgdbNameRaw {
  name?: string
}

export interface IgdbAltNameRaw {
  name?: string
}

export interface IgdbPlatformRaw {
  name?: string
  abbreviation?: string
  slug?: string
}

export interface IgdbCompanyLogoRaw {
  image_id?: string
}

export interface IgdbCompanyRaw {
  id?: number
  name?: string
  logo?: IgdbCompanyLogoRaw
}

export interface IgdbInvolvedCompanyRaw {
  developer?: boolean
  publisher?: boolean
  supporting?: boolean
  porting?: boolean
  company?: IgdbCompanyRaw
}

export interface IgdbAgeRatingRaw {
  rating_category?: { rating?: string }
  organization?: { name?: string }
}

export interface IgdbWebsiteRaw {
  url?: string
  category?: number
  type?: number
}

export interface IgdbLanguageSupportRaw {
  language?: { name?: string }
}

export interface IgdbRelatedGameRaw {
  id?: number
  name?: string
  cover?: { image_id?: string }
  first_release_date?: number
  total_rating?: number
}

export interface IgdbGameRaw {
  id: number
  name: string
  summary?: string
  storyline?: string
  first_release_date?: number
  total_rating?: number
  total_rating_count?: number
  alternative_names?: IgdbAltNameRaw[]
  cover?: IgdbImageRaw
  artworks?: IgdbImageRaw[]
  screenshots?: IgdbImageRaw[]
  videos?: IgdbVideoRaw[]
  genres?: IgdbNameRaw[]
  themes?: IgdbNameRaw[]
  game_modes?: IgdbNameRaw[]
  player_perspectives?: IgdbNameRaw[]
  platforms?: IgdbPlatformRaw[]
  game_engines?: IgdbNameRaw[]
  involved_companies?: IgdbInvolvedCompanyRaw[]
  age_ratings?: IgdbAgeRatingRaw[]
  websites?: IgdbWebsiteRaw[]
  language_supports?: IgdbLanguageSupportRaw[]
  franchises?: IgdbNameRaw[]
  collections?: IgdbNameRaw[]
  parent_game?: IgdbRelatedGameRaw
  dlcs?: IgdbRelatedGameRaw[]
  expansions?: IgdbRelatedGameRaw[]
  standalone_expansions?: IgdbRelatedGameRaw[]
  remakes?: IgdbRelatedGameRaw[]
  remasters?: IgdbRelatedGameRaw[]
  ports?: IgdbRelatedGameRaw[]
  similar_games?: IgdbRelatedGameRaw[]
}
