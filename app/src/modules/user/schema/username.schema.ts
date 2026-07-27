import z from 'zod'

const USERNAME_REGEX = /^[a-zA-Z0-9_]+$/

export const usernameSchema = z
  .string()
  .trim()
  .min(4, 'Username must be at least 4 characters')
  .max(25, 'Username must be at most 25 characters')
  .regex(USERNAME_REGEX, 'Username can only contain letters, numbers, and underscores')

export const changeUsernameSchema = z.object({
  username: usernameSchema,
})

export type ChangeUsernameInput = z.infer<typeof changeUsernameSchema>
