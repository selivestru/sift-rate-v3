import { z } from 'zod'

import { getLocalizedContent } from '~/common/i18n'
import { contentSchema } from '~/common/schema/content.schema'

export const rateFormSchema = z.object({
  rating: z
    .number()
    .int()
    .min(1, { error: () => getLocalizedContent('rate-schema').rating })
    .max(10),
  content: contentSchema.optional(),
})

export type RateFormValues = z.infer<typeof rateFormSchema>
