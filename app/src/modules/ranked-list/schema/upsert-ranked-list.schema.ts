import { z } from 'zod'

export const upsertRankedListSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Title is required')
    .max(128, 'Title must be at most 128 characters'),
})

export type UpsertRankedListFormValues = z.infer<typeof upsertRankedListSchema>
