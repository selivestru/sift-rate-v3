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
