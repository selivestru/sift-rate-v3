import { getIntlayer } from 'intlayer'
import { z } from 'zod'

import { getCurrentLocale } from '~/common/i18n'

export const CONTENT_MAX_LENGTH = 1000

export const contentSchema = z
  .string()
  .trim()
  .max(CONTENT_MAX_LENGTH, {
    error: () =>
      String(
        getIntlayer('content-schema', getCurrentLocale()).max({
          count: String(CONTENT_MAX_LENGTH),
        }),
      ),
  })

export const contentRequiredSchema = contentSchema.min(1, {
  error: () => getIntlayer('content-schema', getCurrentLocale()).required,
})
