import { IMDB_ID_PATTERN, IMDB_IMPORT_MAX_ROWS } from '../constants/imdb-import'
import { ImdbImportRowInput } from '../types/import.types'
import { parseCsv } from './parse-csv'
import { ImportRowStatus } from '~/generated/prisma/enums'

const REQUIRED_HEADERS = ['const', 'your rating', 'date rated', 'title', 'title type'] as const

const normalizeHeader = (value: string): string => value.trim().toLowerCase()

const parseRating = (value: string): number | null => {
  const rating = Number(value.trim())
  if (!Number.isInteger(rating) || rating < 1 || rating > 10) {
    return null
  }
  return rating
}

const parseRatedAt = (value: string): Date | null => {
  const trimmed = value.trim()
  if (!trimmed) return null

  const match = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})$/)
  if (!match) return null

  const date = new Date(`${match[1]}-${match[2]}-${match[3]}T00:00:00.000Z`)
  if (Number.isNaN(date.getTime())) return null

  const today = new Date()
  const utcToday = Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate())
  if (date.getTime() > utcToday) {
    return new Date(utcToday)
  }

  return date
}

export const parseImdbCsv = (input: string): ImdbImportRowInput[] => {
  const table = parseCsv(input)
  const header = table[0]

  if (!header) {
    throw new Error('CSV is empty')
  }

  const headerIndex = new Map(header.map((cell, index) => [normalizeHeader(cell), index]))
  const missing = REQUIRED_HEADERS.filter((name) => !headerIndex.has(name))

  if (missing.length > 0) {
    throw new Error(`CSV is missing required columns: ${missing.join(', ')}`)
  }

  const body = table.slice(1)

  if (body.length === 0) {
    throw new Error('CSV has no rating rows')
  }

  if (body.length > IMDB_IMPORT_MAX_ROWS) {
    throw new Error(`CSV exceeds the limit of ${IMDB_IMPORT_MAX_ROWS} rows`)
  }

  const read = (row: string[], name: (typeof REQUIRED_HEADERS)[number]): string => {
    return (row[headerIndex.get(name)!] ?? '').trim()
  }

  return body.map((row) => {
    const imdbId = read(row, 'const')
    const title = read(row, 'title')
    const titleType = read(row, 'title type')
    const rating = parseRating(read(row, 'your rating'))
    const ratedAt = parseRatedAt(read(row, 'date rated'))

    if (!IMDB_ID_PATTERN.test(imdbId)) {
      return {
        imdbId: imdbId || 'unknown',
        rating,
        ratedAt,
        title,
        titleType,
        status: ImportRowStatus.INVALID,
        error: 'Invalid IMDb id',
      }
    }

    if (rating == null) {
      return {
        imdbId,
        rating,
        ratedAt,
        title,
        titleType,
        status: ImportRowStatus.INVALID,
        error: 'Invalid rating',
      }
    }

    if (!title) {
      return {
        imdbId,
        rating,
        ratedAt,
        title,
        titleType,
        status: ImportRowStatus.INVALID,
        error: 'Missing title',
      }
    }

    return {
      imdbId,
      rating,
      ratedAt,
      title,
      titleType,
      status: ImportRowStatus.PENDING,
      error: null,
    }
  })
}
