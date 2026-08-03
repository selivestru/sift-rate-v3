import z from 'zod'

export const displayNameSchema = z
  .string('Display name is required')
  .trim()
  .min(2, 'Display name must be at least 2 characters')
  .max(50, 'Display name must be at most 50 characters')

export const changeDisplayNameSchema = z.object({
  displayName: displayNameSchema,
})

export type ChangeDisplayNameInput = z.infer<typeof changeDisplayNameSchema>
