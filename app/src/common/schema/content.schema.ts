import { z } from 'zod'

export const CONTENT_MAX_LENGTH = 1000

export const contentSchema = z
  .string()
  .trim()
  .max(CONTENT_MAX_LENGTH, `Content must be at most ${CONTENT_MAX_LENGTH} characters`)

export const contentRequiredSchema = contentSchema.min(1, 'Content is required')
