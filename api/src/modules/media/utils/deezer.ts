import { InternalServerErrorException, NotFoundException } from '@nestjs/common'

import { DeezerCoverFields } from '../types/music.types'
import ky, { HTTPError } from 'ky'

const DEEZER_API_URL = 'https://api.deezer.com'
const SIZE_TOKEN = /(\d{2,4})x(\d{2,4})/

type DeezerErrorBody = {
  error: {
    type: string
    message: string
    code: number
  }
}

const isDeezerErrorBody = (value: unknown): value is DeezerErrorBody => {
  if (!value || typeof value !== 'object' || !('error' in value)) {
    return false
  }

  const { error } = value
  if (!error || typeof error !== 'object') {
    return false
  }

  return (
    'code' in error &&
    'message' in error &&
    typeof error.code === 'number' &&
    typeof error.message === 'string'
  )
}

export const upgradeDeezerCoverUrl = (
  url: string | null | undefined,
  size: number,
): string | null => {
  if (!url?.trim()) return null
  if (!SIZE_TOKEN.test(url)) return url
  return url.replace(SIZE_TOKEN, `${size}x${size}`)
}

export const pickDeezerCoverUrl = (
  fields: DeezerCoverFields | null | undefined,
  preferredSize = 1000,
): string | null => {
  if (!fields) return null

  const preferred =
    fields.cover_xl ?? fields.cover_big ?? fields.cover_medium ?? fields.cover_small ?? fields.cover

  if (!preferred) return null

  return upgradeDeezerCoverUrl(preferred, preferredSize) ?? preferred
}

export const deezerGet = async <T>(path: string): Promise<T> => {
  try {
    const data: unknown = await ky(`${DEEZER_API_URL}${path}`).json()

    if (isDeezerErrorBody(data)) {
      if (data.error.code === 800) {
        throw new NotFoundException('Resource not found')
      }

      throw new InternalServerErrorException(`Deezer API error: ${data.error.message}`)
    }

    return data as T
  } catch (error) {
    if (error instanceof NotFoundException || error instanceof InternalServerErrorException) {
      throw error
    }

    if (error instanceof HTTPError) {
      if (error.response.status === 404) {
        throw new NotFoundException('Resource not found')
      }

      throw new InternalServerErrorException(`Deezer API error: ${error.message}`)
    }

    throw error
  }
}
