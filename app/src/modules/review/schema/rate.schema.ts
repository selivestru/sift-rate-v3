import { getIntlayer } from 'intlayer'
import { z } from 'zod'

import { getCurrentLocale } from '~/common/i18n'
import { contentSchema } from '~/common/schema/content.schema'

import { DATE_KEY_PATTERN, isBeforeMinKey, isFutureKey } from '../utils/review-date'

export const rateFormSchema = z.object({
  rating: z
    .number()
    .int()
    .min(1, { error: () => getIntlayer('rate-schema', getCurrentLocale()).rating })
    .max(10),
  content: contentSchema.optional(),
  createdAt: z
    .string()
    .regex(DATE_KEY_PATTERN, {
      error: () => getIntlayer('rate-schema', getCurrentLocale()).dateInvalid,
    })
    .refine((key) => !isFutureKey(key), {
      error: () => getIntlayer('rate-schema', getCurrentLocale()).dateFuture,
    })
    .refine((key) => !isBeforeMinKey(key), {
      error: () => getIntlayer('rate-schema', getCurrentLocale()).dateTooOld,
    })
    .optional(),
})

export type RateFormValues = z.infer<typeof rateFormSchema>
