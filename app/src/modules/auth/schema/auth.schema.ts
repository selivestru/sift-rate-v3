import { z } from 'zod'

import { displayNameSchema, usernameSchema } from '~/modules/user'

export const completeProfileSchema = z.object({
  displayName: displayNameSchema,
  username: usernameSchema,
})

export type CompleteProfileInput = z.infer<typeof completeProfileSchema>
