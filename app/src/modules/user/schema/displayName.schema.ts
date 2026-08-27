import { getIntlayer } from 'intlayer'
import { z } from 'zod'

import { getCurrentLocale } from '~/common/i18n'

export const displayNameSchema = z
  .string({ error: () => getIntlayer('display-name-schema', getCurrentLocale()).required })
  .trim()
  .min(2, { error: () => getIntlayer('display-name-schema', getCurrentLocale()).min })
  .max(50, { error: () => getIntlayer('display-name-schema', getCurrentLocale()).max })

export const changeDisplayNameSchema = z.object({
  displayName: displayNameSchema,
})

export type ChangeDisplayNameInput = z.infer<typeof changeDisplayNameSchema>
