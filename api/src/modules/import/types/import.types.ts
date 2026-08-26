import { ImportJobStatus, ImportRowStatus } from '~/generated/prisma/enums'

export interface ImdbImportRowInput {
  imdbId: string
  rating: number | null
  ratedAt: Date | null
  title: string
  titleType: string
  status: ImportRowStatus
  error: string | null
}

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
  createdAt: Date
  updatedAt: Date
  finishedAt: Date | null
}

export type ImportJobSummary = ImportJobResponse

export interface ImportHistoryResponse {
  data: ImportJobSummary[]
  nextCursor: string | null
}

export interface ImportJobRowResponse {
  id: string
  position: number
  imdbId: string
  rating: number | null
  ratedAt: Date | null
  title: string
  titleType: string
  status: ImportRowStatus
  error: string | null
}

export interface ImportRowsResponse {
  data: ImportJobRowResponse[]
  nextCursor: string | null
}
