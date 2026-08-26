import { z } from 'zod'

import { getLocalizedContent } from '~/common/i18n'

export const CONTENT_MAX_LENGTH = 1000

export const contentSchema = z
  .string()
  .trim()
  .max(CONTENT_MAX_LENGTH, {
    error: () =>
      String(getLocalizedContent('content-schema').max({ count: String(CONTENT_MAX_LENGTH) })),
  })

export const contentRequiredSchema = contentSchema.min(1, {
  error: () => getLocalizedContent('content-schema').required,
})
