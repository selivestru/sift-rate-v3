export const POSTER_INGEST_QUEUE = 'poster-ingest' as const

export const POSTER_INGEST_JOB = 'ingest' as const

export interface PosterIngestJobData {
  mediaId: string
  sourcePosterUrl: string
}
