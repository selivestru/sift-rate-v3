import z from 'zod'

import { VISIBILITY } from '~/modules/review'

export const upsertRankedListSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Title is required')
    .max(128, 'Title must be at most 128 characters'),
  visibility: z.enum(VISIBILITY),
})

export type UpsertRankedListFormValues = z.infer<typeof upsertRankedListSchema>
