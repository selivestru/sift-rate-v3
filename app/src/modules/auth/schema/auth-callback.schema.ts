import { z } from 'zod'

export const authGoogleCallbackSearchSchema = z.object({
  status: z.enum(['google_auth_failed', 'success', 'email_taken']),
})

export type AuthGoogleCallbackSearch = z.infer<typeof authGoogleCallbackSearchSchema>
