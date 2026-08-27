import { getIntlayer } from 'intlayer'
import { z } from 'zod'

import { getCurrentLocale } from '~/common/i18n'

export const upsertRankedListSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, { error: () => getIntlayer('upsert-ranked-list-schema', getCurrentLocale()).required })
    .max(128, { error: () => getIntlayer('upsert-ranked-list-schema', getCurrentLocale()).max }),
})

export type UpsertRankedListFormValues = z.infer<typeof upsertRankedListSchema>
