import { getIntlayer } from 'intlayer'
import { z } from 'zod'

import { getCurrentLocale } from '~/common/i18n'

const USERNAME_REGEX = /^[a-z0-9_]+$/

export const usernameSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(4, { error: () => getIntlayer('username-schema', getCurrentLocale()).min })
  .max(25, { error: () => getIntlayer('username-schema', getCurrentLocale()).max })
  .regex(USERNAME_REGEX, {
    error: () => getIntlayer('username-schema', getCurrentLocale()).pattern,
  })

export const changeUsernameSchema = z.object({
  username: usernameSchema,
})

export type ChangeUsernameInput = z.infer<typeof changeUsernameSchema>
