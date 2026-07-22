import z from 'zod'

import { VISIBILITY } from '../types/review.types'

export const MAX_REVIEW_LENGTH = 1000

export const rateFormSchema = z.object({
  rating: z.number().int().min(1, 'Choose a score from 1 to 10').max(10),
  content: z.string().max(MAX_REVIEW_LENGTH).optional(),
  visibility: z.enum(VISIBILITY),
  hasSpoiler: z.boolean(),
})

export type RateFormValues = z.infer<typeof rateFormSchema>
