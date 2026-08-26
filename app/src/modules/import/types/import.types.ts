export type ImportJobStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED'

export type ImportRowStatus =
  | 'PENDING'
  | 'CREATED'
  | 'SKIPPED_EXISTING'
  | 'SKIPPED_TYPE'
  | 'NOT_FOUND'
  | 'INVALID'
  | 'ERROR'

export interface ImportJobResponse {
  id: string
  status: ImportJobStatus
  total: number
  processed: number
  created: number
  skippedExisting: number
  skippedType: number
  notFound: number
  invalid: number
  errorCount: number
  errorMessage: string | null
  createdAt: string
  updatedAt: string
  finishedAt: string | null
}

export type ImportJobSummary = ImportJobResponse

export interface ImportJobRow {
  id: string
  position: number
  imdbId: string
  rating: number | null
  ratedAt: string | null
  title: string
  titleType: string
  status: ImportRowStatus
  error: string | null
}

export interface ImportHistoryResponse {
  data: ImportJobSummary[]
  nextCursor: string | null
}

export interface ImportJobRowsResponse {
  data: ImportJobRow[]
  nextCursor: string | null
}
