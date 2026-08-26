import { z } from 'zod'

import { getLocalizedContent } from '~/common/i18n'

export const displayNameSchema = z
  .string({ error: () => getLocalizedContent('display-name-schema').required })
  .trim()
  .min(2, { error: () => getLocalizedContent('display-name-schema').min })
  .max(50, { error: () => getLocalizedContent('display-name-schema').max })

export const changeDisplayNameSchema = z.object({
  displayName: displayNameSchema,
})

export type ChangeDisplayNameInput = z.infer<typeof changeDisplayNameSchema>
