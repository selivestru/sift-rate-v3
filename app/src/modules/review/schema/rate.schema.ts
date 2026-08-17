import z from 'zod'

import { contentSchema } from '~/common/schema/content.schema'

export const rateFormSchema = z.object({
  rating: z.number().int().min(1, 'Choose a score from 1 to 10').max(10),
  content: contentSchema.optional(),
})

export type RateFormValues = z.infer<typeof rateFormSchema>
