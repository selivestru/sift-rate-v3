export interface BookSearchResult {
  totalItems?: number
  items?: BookSearchRaw[]
}

export interface GoogleImageLinks {
  extraLarge?: string
  large?: string
  medium?: string
  small?: string
  thumbnail?: string
  smallThumbnail?: string
}

export interface BookSearchRaw {
  id?: string
  volumeInfo?: {
    title?: string
    authors?: string[]
    publishedDate?: string
    pageCount?: number
    categories?: string[]
    averageRating?: number
    imageLinks?: GoogleImageLinks
  }
}

export interface BookSearchItem {
  id: string
  title: string
  authors: string[]
  coverUrl: string | null
  year: string
  pageCount: number | null
  categories: string[]
  rating: number | null
}
