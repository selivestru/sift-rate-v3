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

export interface BookRelatedItem {
  id: string
  title: string
  coverUrl: string | null
  year: string
  rating: number | null
}

export interface BookDetail {
  id: string
  title: string
  subtitle: string
  authors: string[]
  publisher: string
  publishedDate: string
  year: string
  description: string
  pageCount: number | null
  categories: string[]
  mainCategory: string
  language: string
  printType: string
  isbn10: string
  isbn13: string
  googleRating: number | null
  googleRatingsCount: number
  coverUrl: string | null
  previewUrl: string | null
  infoUrl: string | null
  buyUrl: string | null
  isEbook: boolean
  moreByAuthor: BookRelatedItem[]
  primaryAuthor: string
}

export interface GoogleIndustryIdentifier {
  type?: string
  identifier?: string
}

export interface GoogleVolumeInfo {
  title?: string
  subtitle?: string
  authors?: string[]
  publisher?: string
  publishedDate?: string
  description?: string
  industryIdentifiers?: GoogleIndustryIdentifier[]
  pageCount?: number
  printType?: string
  mainCategory?: string
  categories?: string[]
  averageRating?: number
  ratingsCount?: number
  imageLinks?: GoogleImageLinks
  language?: string
  previewLink?: string
  infoLink?: string
  canonicalVolumeLink?: string
}

export interface GoogleSaleInfo {
  isEbook?: boolean
  buyLink?: string
}

export interface GoogleVolume {
  id?: string
  volumeInfo?: GoogleVolumeInfo
  saleInfo?: GoogleSaleInfo
  accessInfo?: {
    webReaderLink?: string
  }
}

export interface GoogleBooksListResponse {
  items?: GoogleVolume[]
}
