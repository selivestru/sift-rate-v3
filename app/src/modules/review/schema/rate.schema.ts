import { getIntlayer } from 'intlayer'
import { z } from 'zod'

import { getCurrentLocale } from '~/common/i18n'
import { contentSchema } from '~/common/schema/content.schema'

export const rateFormSchema = z.object({
  rating: z
    .number()
    .int()
    .min(1, { error: () => getIntlayer('rate-schema', getCurrentLocale()).rating })
    .max(10),
  content: contentSchema.optional(),
})

export type RateFormValues = z.infer<typeof rateFormSchema>
