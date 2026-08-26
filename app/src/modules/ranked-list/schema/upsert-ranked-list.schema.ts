import { z } from 'zod'

import { getLocalizedContent } from '~/common/i18n'

export const upsertRankedListSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, { error: () => getLocalizedContent('upsert-ranked-list-schema').required })
    .max(128, { error: () => getLocalizedContent('upsert-ranked-list-schema').max }),
})

export type UpsertRankedListFormValues = z.infer<typeof upsertRankedListSchema>
