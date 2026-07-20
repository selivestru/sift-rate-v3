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
