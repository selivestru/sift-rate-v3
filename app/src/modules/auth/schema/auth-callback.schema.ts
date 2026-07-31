import z from 'zod'

export const authCallbackSearchSchema = z.object({
  status: z.enum(['verified', 'invalid_or_expired']),
})

export const authGoogleCallbackSearchSchema = z.object({
  status: z.enum(['google_auth_failed', 'success', 'email_taken']),
})

export type AuthCallbackSearch = z.infer<typeof authCallbackSearchSchema>
export type AuthGoogleCallbackSearch = z.infer<typeof authGoogleCallbackSearchSchema>
