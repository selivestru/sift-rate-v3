import { z } from 'zod'

import { usernameSchema } from '~/modules/user'

export const completeProfileSchema = z.object({
  username: usernameSchema,
})

export type CompleteProfileInput = z.infer<typeof completeProfileSchema>
