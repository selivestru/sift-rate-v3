import { z } from 'zod'

import { getLocalizedContent } from '~/common/i18n'

const USERNAME_REGEX = /^[a-z0-9_]+$/

export const usernameSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(4, { error: () => getLocalizedContent('username-schema').min })
  .max(25, { error: () => getLocalizedContent('username-schema').max })
  .regex(USERNAME_REGEX, { error: () => getLocalizedContent('username-schema').pattern })

export const changeUsernameSchema = z.object({
  username: usernameSchema,
})

export type ChangeUsernameInput = z.infer<typeof changeUsernameSchema>
